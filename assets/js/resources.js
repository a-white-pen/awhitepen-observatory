/**
 * Status page — the RESOURCES dashboard.
 *
 * Spending by month from the status API.
 *
 * The view dates each purchase in B's own timezone and sends it as local_day, so
 * the month and day grouping here is string work rather than clock work. Fixed
 * monthly costs come from status-shared.js — RESOURCES itemises them, TODAY
 * takes a daily share of the same total.
 */
(function () {
  "use strict";

  var panel = document.querySelector('[data-panel="resources"]');

  if (!panel) {
    return;
  }

  var settings = window.awhitepenResources || {};

  // status-shared.js holds everything more than one tab needs.
  var shared = window.awhitepenShared;
  var esc = shared.esc, t_pad = shared.t_pad, t_dur = shared.t_dur, t_num = shared.t_num,
      t_offset = shared.t_offset, t_v = shared.t_v, t_range = shared.t_range,
      t_chip = shared.t_chip, chev = shared.chev, card = shared.card;
  var live = null;
  var requested = false;

  var st = {
    m: 0,
    sm: 0,
    fcat: null,
    open: {},
    inc: { day: true, fixed: false, one: false },
    view: "week",
    ti: null
  };

  /* ---------- formatting ---------- */



  function money(n) {
    return "S$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function r2(n) {
    return Math.round(n * 100) / 100;
  }

  // Day and month, in the viewer's own zone — these Dates are built at local midnight.
  function dm(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function wdl(d) {
    return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  }

  function longDate(iso) {
    if (!iso) {
      return "";
    }
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  /* ---------- shared chrome ---------- */


  function whead(k, l, note) {
    return '<div class="whead"><div><div class="whead__k">' + k + '</div><div class="whead__l">' + l + "</div></div>" +
      (note ? '<div class="whead__note">' + note + "</div>" : "") + "</div>";
  }

  function panelFoot() {
    return shared.panelFoot("All dates in", live && live.city, live && live.tz);
  }

  function f_chev(d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M' + (d < 0 ? "15 5 8 12 15 19" : "9 5 16 12 9 19") + '"/></svg>';
  }

  /* ---------- taxonomy ---------- */

  /* Keys match the `category` the endpoint returns; its view maps every raw value
     onto one of these, so an unknown key can never reach the render. */
  var CAT = {
    meals: { n: "Meals", c: "var(--c-gold)" },
    groceries: { n: "Groceries", c: "var(--c-green)" },
    transport: { n: "Transport", c: "var(--c-teal)" },
    utilities: { n: "Utilities", c: "var(--c-blue)" },
    others: { n: "Others", c: "var(--muted)" },
    travel: { n: "Travel", c: "var(--c-tan)" },
    // Fitness borrows the hue that already codes Exercise elsewhere; One-off
    // shares Travel's, travel being the archetypal one-off.
    fitness: { n: "Fitness", c: "var(--c-orange)" },
    oneoff: { n: "One-off", c: "var(--c-tan)" }
  };

  var ORDER = ["meals", "groceries", "transport", "utilities", "others"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* the ring's layers — at least one stays on */
  var SCOPE = [["day", "Day-to-day"], ["fixed", "+ Fixed"], ["one", "+ One-off / travel, tech, etc"]];

  /* ---------- fixed monthly costs (config, not data) ---------- */

  var FIXED = window.awhitepenShared;
  var FIXED_ORDER = FIXED.order;
  var FIXED_CONFIG = FIXED.config;
  var monthIndex = FIXED.monthIndex;
  var fixedActive = FIXED.active;

  function fixedBadge(item, mk) {
    if (!item.months) {
      return "";
    }
    return "#" + (monthIndex(mk) - monthIndex(item.start) + 1) + " of " + item.months;
  }

  // One entry per fixed group for the month, with its own items grouped by type.
  // `charged` is false for a cost whose due day has not arrived in the current month.
  function resolveFixed(mk, elapsedDay) {
    var out = [];

    FIXED_ORDER.forEach(function (k) {
      var g = FIXED_CONFIG[k];
      var items = g.items.filter(function (it) { return fixedActive(it, mk); });

      if (!items.length) {
        return;
      }

      var groups = [];
      var byType = {};

      items.forEach(function (it) {
        var t = it.type || g.label;
        if (!byType[t]) {
          byType[t] = [];
          groups.push([t, byType[t]]);
        }
        byType[t].push([it.n, it.a, fixedBadge(it, mk)]);
      });

      out.push({
        n: g.label,
        a: r2(items.reduce(function (a, b) { return a + b.a; }, 0)),
        day: g.day,
        c: g.c,
        note: g.note || "",
        foot: g.foot || "",
        groups: g.flat ? null : groups,
        charged: g.day <= elapsedDay
      });
    });

    return out;
  }

  /* ---------- model ---------- */

  // The design's merchant cell reads "FitFish · LINE MAN" — the shop, then the
  // delivery platform when B did not buy direct.
  function shop(e) {
    return e.p ? (e.m || "—") + " · " + e.p : (e.m || "—");
  }

  function key(y, mo) {
    return y + "-" + (mo < 10 ? "0" + mo : mo);
  }

  function addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }

  function weekStart(d) {
    return addDays(d, -((d.getDay() + 6) % 7));
  }

  function parse(payload) {
    var place = payload.location || {};

    var rows = (payload.spend || []).map(function (r) {
      // local_day is already B's own date for the purchase, so it is read as-is
      // rather than derived from an instant in whatever zone the reader is in.
      var p = String(r.local_day || "").split("-");
      var y = +p[0];
      var mo = +p[1];
      var day = +p[2];

      return {
        date: new Date(y, mo - 1, day),
        y: y,
        mo: mo,
        day: day,
        mk: key(y, mo),
        m: r.merchant || "",
        p: r.platform || "",
        s: r.item || "",
        cat: CAT[r.category] ? r.category : "others",
        oneoff: r.bucket === "oneoff",
        a: Number(r.sgd_amount) || 0
      };
    }).filter(function (r) {
      return r.date.getTime() === r.date.getTime() && r.a > 0;
    });

    rows.sort(function (a, b) { return a.date - b.date || 0; });

    var now = new Date();
    var endY = now.getFullYear();
    var endM = now.getMonth() + 1;
    var y = rows.length ? rows[0].y : endY;
    var mo = rows.length ? rows[0].mo : endM;
    var months = [];

    while (y < endY || (y === endY && mo <= endM)) {
      months.push(buildMonth(y, mo, rows, now));
      mo += 1;
      if (mo > 12) { mo = 1; y += 1; }
    }

    return {
      city: place.city,
      tz: place.timezone || "Asia/Singapore",
      months: months,
      recordStart: (payload.window || {}).record_start || null,
      windowStart: (payload.window || {}).window_start || null
    };
  }

  function buildMonth(y, mo, rows, now) {
    var mk = key(y, mo);
    var mine = rows.filter(function (r) { return r.mk === mk; });
    var tx = mine.filter(function (r) { return !r.oneoff; });
    var one = mine.filter(function (r) { return r.oneoff; });
    var current = (y === now.getFullYear() && mo === now.getMonth() + 1);
    var days = new Date(y, mo, 0).getDate();

    var m = {
      y: y, mo: mo, mk: mk, days: days,
      label: MONTHS[mo - 1] + " " + y,
      empty: mine.length === 0,
      partial: current,
      tx: tx,
      one: one
    };

    m.day = r2(tx.reduce(function (a, b) { return a + b.a; }, 0));
    m.oneTot = r2(one.reduce(function (a, b) { return a + b.a; }, 0));
    m.fixed = m.empty ? [] : resolveFixed(mk, current ? now.getDate() : days);
    m.fixedTot = r2(m.fixed.reduce(function (a, b) { return a + (b.charged ? b.a : 0); }, 0));
    m.total = r2(m.day + m.fixedTot + m.oneTot);

    m.cats = ORDER.map(function (k) {
      var rs = tx.filter(function (e) { return e.cat === k; });
      return { k: k, n: CAT[k].n, c: CAT[k].c, v: r2(rs.reduce(function (a, b) { return a + b.a; }, 0)) };
    }).filter(function (c) {
      return c.v > 0;
    }).sort(function (a, b) {
      return b.v - a.v;
    });

    var byDay = {};
    tx.forEach(function (e) {
      (byDay[e.day] = byDay[e.day] || []).push(e);
    });
    m.groups = Object.keys(byDay).map(Number).sort(function (a, b) {
      return b - a;
    }).map(function (d) {
      return { date: new Date(y, mo - 1, d), items: byDay[d] };
    });

    return m;
  }

  /* ---------- ring ---------- */

  function ring(m) {
    var inc = st.inc;
    var parts = [];
    var names = [];

    if (inc.day) {
      parts = parts.concat(m.cats);
      names.push("Day-to-day");
    }

    if (inc.fixed) {
      m.fixed.forEach(function (f) {
        if (f.charged) {
          parts.push({ k: "fx-" + f.n, n: f.n, c: f.c, v: f.a });
        }
      });
      names.push("fixed");
    }

    if (inc.one && m.oneTot) {
      var og = {};
      m.one.forEach(function (o) { og[o.cat] = (og[o.cat] || 0) + o.a; });
      Object.keys(og).forEach(function (k) {
        parts.push({ k: "one-" + k, n: CAT[k].n, c: CAT[k].c, v: r2(og[k]) });
      });
      names.push("one-off");
    }

    var tot = parts.reduce(function (a, b) { return a + b.v; }, 0);

    return {
      parts: parts.sort(function (a, b) { return b.v - a.v; }),
      tot: r2(tot),
      key: (inc.day && inc.fixed && inc.one && m.oneTot) ? "All spend" : (names.join(" + ") || "Nothing selected"),
      note: "across " + parts.length + " categor" + (parts.length === 1 ? "y" : "ies")
    };
  }

  function scopeChips() {
    return '<span class="brng brng--wrap">' + SCOPE.map(function (x) {
      return '<button type="button" data-rscope="' + x[0] + '" aria-pressed="' + (!!st.inc[x[0]]) + '">' + x[1] + "</button>";
    }).join("") + "</span>";
  }

  function donut(m, size, thick) {
    var R0 = ring(m);
    var r = (size - thick) / 2;
    var c = size / 2;
    var C = 2 * Math.PI * r;
    var off = 0;
    var segs = "";

    R0.parts.forEach(function (x) {
      var len = R0.tot ? C * (x.v / R0.tot) : 0;
      var gap = Math.min(3, len * 0.12);
      segs += '<circle class="dseg" data-cat="' + esc(x.k) + '" cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + x.c + '" stroke-width="' + thick + '" ' +
        'stroke-dasharray="' + Math.max(0.6, len - gap).toFixed(2) + " " + (C - len + gap).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) +
        '" data-n="' + esc(x.n) + '" data-v="' + money(x.v) + '" data-p="' + (R0.tot ? (x.v / R0.tot * 100).toFixed(1) : "0.0") + '%"></circle>';
      off += len;
    });

    return '<div class="rdonut" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '">' + segs + "</svg>" +
      '<div class="btip" data-dtip hidden data-key="' + esc(R0.key) + '"></div><div class="rdonut__c"><span class="rdonut__k">' + esc(R0.key) + "</span>" +
      '<span class="rdonut__v">' + money(R0.tot) + '</span><span class="rdonut__n">' + R0.note + "</span></div></div>";
  }

  function cats(m) {
    var R0 = ring(m);
    return '<div class="rcats">' + R0.parts.map(function (x) {
      return '<div class="rcat" data-cat="' + esc(x.k) + '"><span class="rcat__d" style="background:' + x.c + '"></span>' +
        '<span class="rcat__n">' + esc(x.n) + '</span><span class="rcat__p">' + (R0.tot ? (x.v / R0.tot * 100).toFixed(1) : "0.0") + "%</span>" +
        '<span class="rcat__v">' + money(x.v) + "</span></div>";
    }).join("") + "</div>";
  }

  /* ---------- cards ---------- */

  function mnav() {
    var i = st.m;
    var m = live.months[i];
    return '<div class="bpanwrap"><span class="bpan">' +
      '<button type="button" data-rm="-1" aria-label="Previous month"' + (i <= 0 ? " disabled" : "") + ">" + f_chev(-1) + "</button>" +
      '<span class="bpan__lab">' + m.label + "</span>" +
      '<button type="button" data-rm="1" aria-label="Next month"' + (i >= live.months.length - 1 ? " disabled" : "") + ">" + f_chev(1) + "</button></span></div>";
  }

  function hero(m) {
    return card(whead("TOTAL SPEND", "", m.partial ? "so far this month" : "") + mnav() +
      '<div class="dhero"><div class="dhero__l">' +
        '<p class="rrec__k">Spent so far</p>' +
        '<p class="hero-amt">' + money(m.total) + "</p>" +
        '<p class="dhero__eq"><span><i class="dsw--day"></i>Day-to-day ' + money(m.day) + "</span>" +
        '<span class="dplus">+</span><span><i class="dsw--fixed"></i>Fixed costs ' + money(m.fixedTot) + "</span>" +
        (m.oneTot ? '<span class="dplus">+</span><span><i class="dsw--oneoff"></i>One-offs ' + money(m.oneTot) + "</span>" : "") + "</p>" +
      '</div><div class="dhero__r">' +
        '<p class="whead__k">ONE-OFF EXPENSES THIS MONTH</p>' +
        (m.one.length ? '<p class="done__v">' + money(m.oneTot) + "<small>one-off</small></p>" +
          m.one.slice().sort(function (a, b) { return a.date - b.date; }).map(function (o) {
            var sub = [o.s, dm(o.date)].filter(Boolean).join(" · ");
            return '<div class="ritem"><span>' + esc(shop(o)) + "<em>" + esc(sub) + "</em></span><span>" + money(o.a) + "</span></div>";
          }).join("")
         : '<p class="done__v done__v--q">None<small>one-off</small></p>') +
      "</div></div>");
  }

  function smHead(m) {
    var i = st.sm;
    return '<div class="whead"><div><div class="whead__k">SPEND SUMMARY</div>' +
      '<div class="bpanwrap bpanwrap--l"><span class="bpan">' +
      '<button type="button" data-rsm="-1" aria-label="Previous month"' + (i <= 0 ? " disabled" : "") + ">" + f_chev(-1) + "</button>" +
      '<span class="bpan__lab">' + m.label + "</span>" +
      '<button type="button" data-rsm="1" aria-label="Next month"' + (i >= live.months.length - 1 ? " disabled" : "") + ">" + f_chev(1) + "</button>" +
      "</span></div></div></div>";
  }

  function stmt(m) {
    var rows = [
      ["Day-to-day", m.day, "", "day"],
      ["Fixed costs", m.fixedTot, "rent, recurring, insurance", "fix"],
      ["One-offs", m.oneTot, "travel, tech, and other one-offs", "one"]
    ];

    var lines = rows.map(function (r) {
      var open = st.open[r[3]];
      var items = "";

      if (r[3] === "fix") {
        items = m.fixed.map(function (f) {
          var head = '<div class="ritem ritem--hd' + (f.charged ? "" : " ritem--due") + '"><span>' + esc(f.n) +
            (f.note ? "<em>" + esc(f.note) + "</em>" : "") + "</span><span>" + (f.charged ? money(f.a) : "due day " + f.day) + "</span></div>";
          var sub = (f.groups || []).map(function (g) {
            return '<div class="fxsub"><p class="fxk">' + esc(g[0]) + "</p>" + g[1].map(function (it) {
              return '<div class="fxi"><span>' + esc(it[0]) + (it[2] ? '<b class="fxb">' + esc(it[2]) + "</b>" : "") + "</span>" +
                "<span>" + money(it[1]) + "</span></div>";
            }).join("") + "</div>";
          }).join("");
          return '<div class="fxg">' + head + sub + (f.foot ? '<p class="fxf">' + esc(f.foot) + "</p>" : "") + "</div>";
        }).join("");
      }

      return '<div class="cst__r">' + (items ?
        '<button type="button" class="cst__b" data-ropen="' + r[3] + '" aria-expanded="' + (!!open) + '">' +
          '<span class="cst__n">' + r[0] + '<i class="rcar">' + (open ? "−" : "+") + "</i>" + (r[2] ? "<em>" + r[2] + "</em>" : "") + "</span>" +
          '<span class="cst__v">' + money(r[1]) + "</span></button>"
        : '<div class="cst__b"><span class="cst__n">' + r[0] + (r[2] ? "<em>" + r[2] + "</em>" : "") + "</span>" +
          '<span class="cst__v">' + (r[1] > 0 ? money(r[1]) : "None") + "</span></div>") +
        (open && items ? '<div class="rdrawer">' + items + "</div>" : "") + "</div>";
    }).join("");

    return card(smHead(m) +
      '<div class="rscope">' + scopeChips() + "</div>" +
      '<div class="sdon"><div class="sdon__l">' + donut(m, 236, 28) + "</div><div>" + cats(m) + "</div></div>" +
      '<div class="cst__tbl">' + lines +
        '<div class="cst__r cst__r--tot"><span class="cst__n">' + (m.partial ? "Total so far" : "Total for the month") + "</span>" +
        '<span class="cst__v">' + money(m.total) + "</span></div></div>");
  }

  /* ---------- ledger ---------- */

  // Every day with an everyday transaction, oldest first — the ledger browses this
  // across all months, not the month the two steppers above are showing.
  function allDays() {
    var out = [];
    live.months.forEach(function (m) {
      if (!m.empty) {
        m.groups.forEach(function (g) { out.push(g); });
      }
    });
    return out.sort(function (a, b) { return a.date - b.date; });
  }

  function ranges(view, ALLD) {
    var out = [];

    if (!ALLD.length) {
      return out;
    }

    if (view === "day") {
      return ALLD.map(function (g) {
        return { from: g.date, to: g.date, label: wdl(g.date) + " " + dm(g.date) };
      });
    }

    if (view === "month") {
      live.months.forEach(function (m) {
        if (!m.empty) {
          out.push({ from: new Date(m.y, m.mo - 1, 1), to: new Date(m.y, m.mo - 1, m.days), label: m.label });
        }
      });
      return out;
    }

    var s = weekStart(ALLD[0].date);
    var last = ALLD[ALLD.length - 1].date;

    while (s <= last) {
      var e = addDays(s, 6);
      out.push({
        from: s,
        to: e,
        label: s.getMonth() === e.getMonth() ? s.getDate() + " – " + dm(e) : dm(s) + " – " + dm(e)
      });
      s = addDays(s, 7);
    }

    return out;
  }

  function tIdx(ALLD) {
    var R = ranges(st.view, ALLD);

    if (st.ti == null) {
      var lab = live.months[st.m].label;
      R.forEach(function (x, k) { if (x.label === lab) { st.ti = k; } });
      if (st.ti == null) { st.ti = R.length - 1; }
    }

    return { R: R, i: Math.max(0, Math.min(R.length - 1, st.ti)) };
  }

  function history() {
    var ALLD = allDays();

    if (!ALLD.length) {
      return card(whead("EVERYDAY TRANSACTIONS", "") +
        '<p class="rempty">No day-to-day transactions in the last six months.</p>');
    }

    var T = tIdx(ALLD);
    var R = T.R;
    var i = T.i;
    var r = R[i];

    var days = ALLD.filter(function (g) {
      return g.date >= r.from && g.date <= r.to;
    }).sort(function (a, b) { return b.date - a.date; });

    var tot = {};
    days.forEach(function (g) {
      g.items.forEach(function (e) { tot[e.cat] = (tot[e.cat] || 0) + e.a; });
    });

    if (st.fcat && !tot[st.fcat]) {
      st.fcat = null;
    }

    var cs = [{ k: "", n: "All" }].concat(Object.keys(tot).sort(function (a, b) {
      return tot[b] - tot[a];
    }).map(function (k) {
      return { k: k, n: CAT[k].n };
    }));

    var views = [["day", "Day"], ["week", "Week"], ["month", "Month"]];

    var top = '<div class="ctop">' +
      '<span class="bpan"><button type="button" data-tp="-1" aria-label="Earlier"' + (i <= 0 ? " disabled" : "") + ">" + f_chev(-1) + "</button>" +
      '<span class="bpan__lab">' + esc(r.label) + "</span>" +
      '<button type="button" data-tp="1" aria-label="Later"' + (i >= R.length - 1 ? " disabled" : "") + ">" + f_chev(1) + "</button></span>" +
      '<span class="brng">' + views.map(function (v) {
        return '<button type="button" data-tv="' + v[0] + '" aria-pressed="' + (st.view === v[0]) + '">' + v[1] + "</button>";
      }).join("") + "</span></div>";

    var chips = '<span class="brng brng--scroll">' + cs.map(function (c) {
      return '<button type="button" data-rcat="' + c.k + '" aria-pressed="' + ((st.fcat || "") === c.k) + '">' + esc(c.n) + "</button>";
    }).join("") + "</span>";

    var groups = days.map(function (g) {
      var items = st.fcat ? g.items.filter(function (e) { return e.cat === st.fcat; }) : g.items;
      return items.length ? { g: g, items: items } : null;
    }).filter(Boolean);

    var shown = st.open.all ? groups : groups.slice(0, 8);

    var body = shown.map(function (x) {
      return x.items.map(function (e, n) {
        var C = CAT[e.cat];
        return '<div class="ctr' + (n === 0 ? " ctr--first" : "") + '">' +
          '<span class="ctr__d">' + (n === 0 ? '<span class="wd">' + wdl(x.g.date) + "</span> <b>" + dm(x.g.date) + "</b>" : "") + "</span>" +
          '<span class="ctr__m' + (e.m ? "" : " ctr__m--q") + '">' + esc(shop(e)) + "</span>" +
          '<span class="ctr__s"' + (e.s ? ' title="' + esc(e.s) + '"' : "") + ">" + esc(e.s) + "</span>" +
          '<span class="ctr__c"><i style="background:' + C.c + '"></i>' + esc(C.n) + "</span>" +
          '<span class="ctr__a">' + money(e.a) + "</span></div>";
      }).join("");
    }).join("");

    var sum = shown.reduce(function (a, x) {
      return a + x.items.reduce(function (b, e) { return b + e.a; }, 0);
    }, 0);

    var count = shown.reduce(function (a, x) { return a + x.items.length; }, 0);

    return card(whead("EVERYDAY TRANSACTIONS", "") + top + chips +
      '<div class="ctbl"><div class="ctr ctr--h"><span>Date</span><span>Merchant</span><span>Item</span>' +
      "<span>Category</span><span>Amount</span></div>" + body +
      '<div class="ctr ctr--tot"><span></span><span>' + (st.fcat ? esc(CAT[st.fcat].n) : "Total") +
      (st.open.all ? "" : " shown") + "</span><span></span><span>" + count + " entr" + (count === 1 ? "y" : "ies") + "</span>" +
      '<span class="ctr__a">' + money(r2(sum)) + "</span></div></div>" +
      (groups.length > 8 ? '<button type="button" class="lmore" data-ropen="all">' +
        (st.open.all ? "Show fewer days" : "Show all " + groups.length + " days of " + esc(r.label)) + "</button>" : "") +
      '<p class="rfn">Foreign purchases are converted to SGD at the rate B actually paid. ' +
      "Fixed costs and one-offs are itemised in the summary above, not mixed into this history.</p>");
  }

  /* ---------- notes ---------- */

  function notes() {
    var lines = [
      ["Everything is shown in SGD", "SGD is B’s home currency, and where she has earned most of her money over her lifetime, with only small amounts in USD and AUD."],
      ["Which day a purchase counts", "Spending is dated by the local time where B was when the purchase happened. This matches the rest of the dashboard."],
      ["Cash", "Cash spending uses the actual money-changer rate B received. Cash is matched first-in-first-out: the earliest currency bought is treated as the earliest currency spent. For example, if B exchanged THB twice at different rates, the first baht spent is matched against the first batch of baht she bought."],
      ["Electronic payments — cards, PromptPay, DuitNow, etc.", "Purchases on YouTrip, HSBC, Trust and similar cards are converted at the bank’s posted rate at the moment of payment. Bank transfers such as PromptPay and DuitNow are also converted using the bank or payment provider’s posted rate, which may differ slightly from the card rate."],
      ["Fixed monthly costs", "Rent, subscriptions, phone bills, insurance and instalments are stored once and applied automatically. Instalments stop after the final payment."],
      ["Insurance", "Currently an estimated tally of cash premiums, excluding CPF-paid components. Will be reconciled later. B also holds paid-up whole-life cover she finished paying off in 5 years in her youth. <a href=\"#\">Why she did that →</a> <span class=\"tsoon\">coming soon</span>"]
    ];

    return card(whead("", "Currency &amp; spending rules") +
      '<p class="nlead">B’s spending philosophy is ' +
      '<a href="https://link.awhitepen.com/expenditureInThailand" target="_blank" rel="noopener noreferrer">here</a>.</p>' +
      '<div class="notes">' + lines.map(function (n) {
        return '<div><div class="note__h">' + n[0] + '</div><div class="note__b">' + n[1] + "</div></div>";
      }).join("") + "</div>");
  }

  /* ---------- empty state ---------- */

  function empty(m) {
    var since = live.recordStart ? "Spending has been tracked since " + longDate(live.recordStart) + ", and the" : "The";
    var from = live.windowStart ? " — from " + longDate(live.windowStart) + " onwards" : "";
    return '<p class="rempty">Nothing recorded for ' + m.label + ". " + since +
      " observatory shows the last six months" + from + ".</p>";
  }

  /* ---------- render ---------- */

  function render() {
    var mh = live.months[st.m];
    var ms = live.months[st.sm];

    panel.innerHTML =
      (mh.empty ? card(whead("RESOURCES · SPENDING", mh.label) + mnav() + empty(mh)) : hero(mh)) +
      (ms.empty ? card(smHead(ms) + empty(ms)) : stmt(ms)) +
      history() + notes() + panelFoot();

    window.awhitepenShared.markOverflow(panel);
  }

  var xfadeTimer;

  window.addEventListener("resize", function () {
    clearTimeout(xfadeTimer);
    xfadeTimer = setTimeout(function () {
      window.awhitepenShared.markOverflow(panel);
    }, 150);
  });

  /* ---------- load ---------- */

  function showFailure(kind) {

    if (shared) {
      shared.clearSkeleton(panel);
      shared.showFailure(panel, kind || "server", settings.label || "", load);
    }
  }

  function load() {
    if (requested) {
      return;
    }

    requested = true;

    if (!settings.url) {
      showFailure("server");
      return;
    }

    fetch(settings.url, { credentials: "omit" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(String(response.status));
        }

        return response.json();
      })
      .then(function (json) {
        live = parse(json.data || {});
        st.m = live.months.length - 1;
        st.sm = live.months.length - 1;
        render();
        window.awhitepenShared.clearSkeleton(panel);
      })
      .catch(function (error) {
        console.error("status: resources failed", error);

        if (!live) {
          showFailure(window.awhitepenShared.failureKind(error));
        }
      });
  }

  /* ---------- events ---------- */

  panel.addEventListener("click", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-rm],[data-rsm],[data-tv],[data-tp],[data-ropen],[data-rcat],[data-rscope]");

    if (!t || !live) {
      return;
    }

    if (t.hasAttribute("data-rm")) {
      st.m = Math.max(0, Math.min(live.months.length - 1, st.m + +t.getAttribute("data-rm")));
    } else if (t.hasAttribute("data-rsm")) {
      st.sm = Math.max(0, Math.min(live.months.length - 1, st.sm + +t.getAttribute("data-rsm")));
      st.open.fix = st.open.one = false;
    } else if (t.hasAttribute("data-tv")) {
      var ALLD = allDays();
      var T = tIdx(ALLD);
      var anchor = T.R.length ? T.R[T.i].to : null;
      var nv = t.getAttribute("data-tv");
      var NR = ranges(nv, ALLD);
      var ni = 0;
      NR.forEach(function (x, k) { if (anchor && x.from <= anchor) { ni = k; } });
      st.view = nv;
      st.ti = ni;
      st.open.all = false;
    } else if (t.hasAttribute("data-tp")) {
      var T2 = tIdx(allDays());
      st.ti = Math.max(0, Math.min(T2.R.length - 1, T2.i + +t.getAttribute("data-tp")));
      st.open.all = false;
    } else if (t.hasAttribute("data-rscope")) {
      var sk = t.getAttribute("data-rscope");
      var on = ["day", "fixed", "one"].filter(function (k) { return st.inc[k]; });
      if (!(st.inc[sk] && on.length === 1)) {
        st.inc[sk] = !st.inc[sk];
      }
    } else if (t.hasAttribute("data-rcat")) {
      st.fcat = t.getAttribute("data-rcat") || null;
    } else {
      var k2 = t.getAttribute("data-ropen");
      st.open[k2] = !st.open[k2];
    }

    render();
  });

  panel.addEventListener("mousemove", function (ev) {
    var seg = ev.target.closest && ev.target.closest(".dseg");
    var don = panel.querySelector(".rdonut");
    var tip = don && don.querySelector("[data-dtip]");

    if (!tip) {
      return;
    }

    if (!seg) {
      tip.setAttribute("hidden", "");
      return;
    }

    tip.innerHTML = '<p class="btip__d">' + esc(seg.getAttribute("data-n")) + '</p><p class="btip__w">' + esc(seg.getAttribute("data-v")) +
      '</p><p class="btip__x">' + esc(seg.getAttribute("data-p")) + " of " + esc((tip.getAttribute("data-key") || "").toLowerCase()) + "</p>";
    tip.removeAttribute("hidden");

    var wb = don.getBoundingClientRect();
    var tw = tip.offsetWidth;
    var th = tip.offsetHeight;
    tip.style.left = Math.max(-20, Math.min(wb.width - tw + 20, ev.clientX - wb.left - tw / 2)) + "px";
    tip.style.top = Math.max(-th, ev.clientY - wb.top - th - 14) + "px";
  });

  panel.addEventListener("mouseover", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-cat]");
    var host = t && t.closest(".card");

    panel.querySelectorAll(".card").forEach(function (c) {
      c.classList.toggle("is-dim", !!t && c === host);
      c.querySelectorAll("[data-cat]").forEach(function (n) {
        n.classList.toggle("is-on", !!t && n.getAttribute("data-cat") === t.getAttribute("data-cat"));
      });
    });
  });

  var tab = document.querySelector('.tabs [data-tab="resources"]');

  if (tab) {
    tab.addEventListener("click", load);
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash.replace(/^#/, "").toLowerCase() === "resources") {
      load();
    }
  });

  if (!panel.hidden || window.location.hash.replace(/^#/, "").toLowerCase() === "resources") {
    load();
  }
})();
