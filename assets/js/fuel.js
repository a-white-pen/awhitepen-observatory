/**
 * Status page — the FUEL dashboard.
 *
 * Macros against target, the food log a day at a time, and the overnight fasts.
 * All of it is live from the status API.
 *
 * A day runs wake to wake, so a supper eaten at 2am belongs to the evening it
 * finished rather than to the morning after. Fasts are measured between eating
 * sessions, not food-log entries: the log records when B wrote a meal down,
 * which is often hours from when she ate it.
 */
(function () {
  "use strict";

  var panel = document.querySelector('[data-panel="fuel"]');

  if (!panel) {
    return;
  }

  var settings = window.awhitepenFuel || {};
  var live = null;
  var rendered = false;
  var loading = false;

  /* ---------- the macros, in the order the design shows them ---------- */

  var KEYS = ["kcal", "p", "fib", "c", "f", "sug", "sod"];
  var LEAD = ["kcal", "p", "fib"];
  var QUIET = ["c", "f", "sug", "sod"];

  var NAME = { kcal: "Calories", p: "Protein", fib: "Fibre", c: "Carbs", f: "Fat", sug: "Sugar", sod: "Sodium" };
  var UNIT = { kcal: "kcal", p: "g", fib: "g", c: "g", f: "g", sug: "g", sod: "mg" };
  var COL = {
    kcal: "var(--accent)", p: "var(--c-red)", fib: "var(--c-green)", c: "var(--c-teal)",
    f: "var(--c-gold)", sug: "var(--c-plum)", sod: "var(--c-tan)"
  };

  // Payload field behind each key.
  var FIELD = {
    kcal: "kcal", p: "protein_g", fib: "fibre_g", c: "carbs_g",
    f: "fat_g", sug: "sugar_g", sod: "sodium_mg"
  };

  // status-shared.js holds everything more than one tab needs.
  var shared = window.awhitepenShared;
  var esc = shared.esc, t_pad = shared.t_pad, t_dur = shared.t_dur, t_num = shared.t_num,
      t_offset = shared.t_offset, t_v = shared.t_v, t_range = shared.t_range,
      t_chip = shared.t_chip, chev = shared.chev, card = shared.card;

  var TGT = shared.targets;

  // nutrition.food_log meal_type vocabulary.
  var SLOT = {
    breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", pre_workout: "Pre-workout",
    post_workout: "Post-workout", dinner: "Dinner", supper: "Supper"
  };

  // A day reads top to bottom the way it was eaten, not the order B typed it in.
  // The food log carries no eaten-at time, only when each item was written down,
  // and she often logs a whole day at once - so the slot name is the only signal
  // of when a meal belongs. A slot not listed here sorts last, in log order.
  var SLOT_ORDER = Object.keys(SLOT);

  var WEEK = 7;
  var state = { key: "kcal", bars: 0, log: 0 };

  /* ---------- formatting ---------- */







  // B's own day, formatted from the payload's local_day so the label never
  // drifts to the viewer's date.
  function dmy(d) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(d);
  }

  function wd(d) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(d).toUpperCase();
  }

  function dmyy(d) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(d);
  }

  function wdp(d) {
    return wd(d) + " " + dmy(d);
  }

  // A night is labelled by the two days it spans, because the fast runs from the
  // evening of one into the morning of the next. The month shows once unless the
  // night crosses into a new one.
  function wdd(d) {
    var next = new Date(d.getTime() + 864e5);
    var day = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric" });
    var parts = d.getUTCMonth() === next.getUTCMonth()
      ? [day.format(d) + "\u2013" + day.format(next), dmy(next).replace(/^\d+\s/, "")]
      : [dmy(d) + "\u2013", dmy(next)];

    return '<span class="wd">' + wd(d) + '</span> <b class="flr__dp">' + parts[0] +
      '</b> <b class="flr__dp">' + parts[1] + "</b>";
  }

  // Minutes a zone is ahead of UTC at a given instant.
  function zoneOffset(tz, at) {
    var parts = {};

    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).formatToParts(at).forEach(function (part) {
      parts[part.type] = part.value;
    });

    var wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);

    return Math.round((wall - at.getTime()) / 6e4);
  }

  // A wall-clock hour on one of B's days, as an instant.
  function atLocal(dayKey, tz, hour) {
    var guess = new Date(dayKey + "T00:00:00Z").getTime() + hour * 36e5;

    return new Date(guess - zoneOffset(tz || "Asia/Singapore", new Date(guess)) * 6e4);
  }

  /* ---------- targets ---------- */


  function t_st(v, t, unit) {
    if (t == null) {
      return { k: "none", s: "No target today" };
    }

    if (v == null) {
      return { k: "none", s: "—" };
    }

    if (t[2] === "floor") {
      return v < t[0] ? { k: "togo", s: t_num(t[0] - v) + " " + unit + " to go" } : { k: "in", s: "met" };
    }

    if (v < t[0]) {
      var a = t[0] - v;
      var b = t[1] - v;

      return { k: "togo", s: (a === b ? t_num(a) : t_num(a) + "–" + t_num(b)) + " " + unit + " to go" };
    }

    if (v > t[1]) {
      return { k: "over", s: "over by " + t_num(v - t[1]) + " " + unit };
    }

    return { k: "in", s: "in range" };
  }


  function fv(key, v) {
    if (v == null) {
      return "—";
    }

    return key === "kcal" || key === "sod" ? t_num(Math.round(v)) : "" + Math.round(v);
  }

  /* ---------- parse ---------- */

  function dayStamp(dayKey) {
    return new Date(dayKey + "T12:00:00Z");
  }

  function parse(payload) {
    var place = payload.location || {};
    var rows = payload.days || [];
    var mealRows = payload.meals || [];

    if (!rows.length) {
      return null;
    }

    var bySlotDay = {};

    mealRows.forEach(function (m) {
      (bySlotDay[m.local_day] = bySlotDay[m.local_day] || []).push({
        rank: SLOT_ORDER.indexOf(m.meal_type) < 0 ? SLOT_ORDER.length : SLOT_ORDER.indexOf(m.meal_type),
        slot: SLOT[m.meal_type] || m.meal_type,
        items: m.items,
        kcal: m.kcal, p: m.protein_g, fib: m.fibre_g, c: m.carbs_g,
        f: m.fat_g, sug: m.sugar_g, sod: m.sodium_mg
      });
    });

    Object.keys(bySlotDay).forEach(function (day) {
      bySlotDay[day].sort(function (a, b) { return a.rank - b.rank; });
    });

    var days = rows.map(function (r, i) {
      var totals = {};

      KEYS.forEach(function (k) {
        totals[k] = r[FIELD[k]];
      });

      return {
        i: i,
        ds: r.local_day,
        date: dayStamp(r.local_day),
        t: totals,
        meals: bySlotDay[r.local_day] || [],
        mealCount: r.meal_count,
        partial: false
      };
    });

    // One row per night, already bounded by the API. The fast is measured between
    // eating sessions, not food-log entries: the log records when B wrote a meal
    // down, which is often hours from when she ate it. Either end can be missing.
    var nights = (payload.fast || []).map(function (r) {
      var lastEnd = r.last_meal_end ? new Date(r.last_meal_end) : null;
      var firstStart = r.first_meal_start ? new Date(r.first_meal_start) : null;
      var bed = r.bed_at ? new Date(r.bed_at) : null;

      return {
        ds: r.night_date,
        date: dayStamp(r.night_date),
        tz: r.tz || "Asia/Singapore",
        bed: bed,
        wake: r.wake_at ? new Date(r.wake_at) : null,
        lastEnd: lastEnd,
        firstStart: firstStart,
        fast: lastEnd && firstStart ? firstStart - lastEnd : null,
        // A meal eaten after getting into bed would read as a negative gap.
        preBed: bed && lastEnd && bed > lastEnd ? bed - lastEnd : null
      };
    });

    // The newest day is still being lived if it is today where B is.
    var newest = days[days.length - 1];
    var tz = place.timezone || "Asia/Singapore";

    newest.partial = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date()) === newest.ds;

    // The 7 complete days ending yesterday. Today is partial, so it is excluded.
    var complete = days.filter(function (d) {
      return !d.partial;
    });

    var window7 = complete.slice(-7);
    var avg = null;

    if (window7.length === 7) {
      avg = {};

      KEYS.forEach(function (k) {
        var got = window7.filter(function (d) {
          return d.t[k] != null;
        });

        avg[k] = got.length ? got.reduce(function (s, d) { return s + d.t[k]; }, 0) / got.length : null;
      });

    }

    return { city: place.city, tz: place.timezone || "Asia/Singapore",
             days: days, n: days.length, avg: avg, nights: nights };
  }

  /* ---------- shared chrome ---------- */


  function whead(k) {
    return '<div class="whead"><div><div class="whead__k">' + k + '</div><div class="whead__l"></div></div></div>';
  }

  function panelFoot() {
    return shared.panelFoot("All times in", live && live.city, live && live.tz);
  }


  function pan(action, offset, max, label) {
    return '<div class="bpanwrap"><span class="bpan">' +
      '<button type="button" data-f="' + action + '" data-v="1" aria-label="Earlier"' + (offset >= max ? " disabled" : "") + ">" + chev(-1) + "</button>" +
      '<span class="bpan__lab">' + label + "</span>" +
      '<button type="button" data-f="' + action + '" data-v="-1" aria-label="Later"' + (offset <= 0 ? " disabled" : "") + ">" + chev(1) + "</button></span></div>";
  }

  function pages() {
    return Math.max(0, Math.ceil(live.n / WEEK) - 1);
  }

  /* ---------- card 1 · macro summary ---------- */

  function scale(key, v) {
    var t = TGT[key];

    if (!t || v == null) {
      return "";
    }

    var mx = Math.max(v, t[1]) * 1.2;
    var L = function (x) { return (x / mx * 100).toFixed(1); };
    var end = t[2] === "floor" ? mx : t[1];

    return '<div class="fsc"><span class="fsc__band" style="left:' + L(t[0]) + "%;width:" + L(end - t[0]) + '%"></span>' +
      '<span class="fsc__f" style="width:' + L(v) + "%;background:" + COL[key] + '"></span>' +
      '<span class="fsc__tick" style="left:' + L(t[0]) + '%"></span>' +
      (t[2] === "floor" ? "" : '<span class="fsc__tick" style="left:' + L(t[1]) + '%"></span>') + "</div>";
  }

  function reads() {
    var avg = live.avg;

    var lead = LEAD.map(function (k) {
      var v = avg ? avg[k] : null;

      return "<div><p class=\"fkey\"><i style=\"background:" + COL[k] + '"></i>' + NAME[k] + "</p>" +
        '<p class="fval">' + fv(k, v) + "<small>" + UNIT[k] + "</small></p>" +
        scale(k, v) +
        '<p class="fsub">target ' + t_range(TGT[k], UNIT[k]) + " " + t_chip(t_st(v == null ? null : Math.round(v), TGT[k], UNIT[k])) + "</p></div>";
    }).join("");

    var quiet = QUIET.map(function (k) {
      return '<div><p class="fkey fkey--sm"><i style="background:' + COL[k] + '"></i>' + NAME[k] + "</p>" +
        '<p class="fval fval--sm">' + fv(k, avg ? avg[k] : null) + "<small>" + UNIT[k] + "</small></p></div>";
    }).join("");

    return '<p class="favgl__k">7-day average, per day</p>' +
      '<div class="fhero">' + lead + "</div>" +
      '<div class="fquiet">' + quiet + "</div>";
  }

  function nice(range, count) {
    var raw = range / count;

    if (!(raw > 0)) {
      return 1;
    }

    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var n = raw / mag;

    // Every macro is labelled as a whole number, so a sub-integer step would
    // print the same tick twice.
    return Math.max(1, (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag);
  }

  function barsSVG(w, h) {
    var key = state.key;
    var hi = live.n - state.bars * WEEK;
    var lo = Math.max(0, hi - WEEK);
    var data = live.days.slice(lo, hi);

    if (!data.length) {
      return "";
    }

    var narrow = w < 560;
    var padL = 48;
    var padR = narrow ? 14 : 76;
    var padT = 30;
    var padB = 40;
    var ppd = (w - padL - padR) / data.length;
    var t = TGT[key];

    var values = data.map(function (d) {
      return d.t[key] == null ? 0 : d.t[key];
    });

    var mx = Math.max.apply(null, values);

    if (t) {
      mx = Math.max(mx, t[1]);
    }

    // A page where nothing was logged would otherwise divide by zero.
    mx = mx > 0 ? mx * 1.18 : 1;

    var Y = function (v) { return padT + (mx - v) / mx * (h - padT - padB); };
    var base = Y(0);

    // Today counts. It is a running total rather than a finished day, so the line
    // sits low in the morning and climbs as she eats.
    var full = data.filter(function (d) {
      return d.t[key] != null;
    });

    var av = full.length ? full.reduce(function (a, d) { return a + d.t[key]; }, 0) / full.length : null;
    var s = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">';
    var step = nice(mx, 4);

    for (var g = 0; g <= mx; g += step) {
      s += '<line class="bgl" x1="' + padL + '" x2="' + (w - padR) + '" y1="' + Y(g).toFixed(1) + '" y2="' + Y(g).toFixed(1) + '"/>' +
        '<text class="btick" x="' + (padL - 8) + '" y="' + (Y(g) + 3.5).toFixed(1) + '" text-anchor="end">' + t_num(Math.round(g)) + "</text>";
    }

    if (t) {
      var top = t[2] === "floor" ? padT : Y(t[1]);

      s += '<rect class="ftgt" x="' + padL + '" y="' + top.toFixed(1) + '" width="' + (w - padL - padR) +
        '" height="' + Math.max(2, Y(t[0]) - top).toFixed(1) + '"/>';
    }

    var bw = Math.max(8, Math.min(46, ppd - 14));

    data.forEach(function (d, i) {
      var v = d.t[key] == null ? 0 : d.t[key];
      var x = padL + i * ppd + (ppd - bw) / 2;
      var y = Y(v);

      s += '<rect class="fdbar' + (d.partial ? " fdbar--part" : "") + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
        '" width="' + bw.toFixed(1) + '" height="' + (base - y).toFixed(1) + '" rx="' + Math.min(7, bw / 3).toFixed(1) +
        '" style="fill:' + COL[key] + '" data-fbar="' + d.i + '"></rect>' +
        '<text class="fdlab' + (narrow ? " fdlab--sm" : "") + '" x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 8).toFixed(1) +
        '" text-anchor="middle">' + fv(key, d.t[key]) + "</text>" +
        '<text class="fdx' + (d.partial ? " fdx--now" : "") + '" x="' + (padL + i * ppd + ppd / 2).toFixed(1) + '" y="' + (base + 17) +
        '" text-anchor="middle">' + wd(d.date) + "</text>" +
        '<text class="fdx2' + (d.partial ? " fdx--now" : "") + '" x="' + (padL + i * ppd + ppd / 2).toFixed(1) + '" y="' + (base + 31) +
        '" text-anchor="middle">' + (narrow ? new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric" }).format(d.date) : dmy(d.date)) + "</text>";
    });

    if (av != null) {
      s += '<line class="favgl" style="stroke:' + COL[key] + '" x1="' + padL + '" x2="' + (w - padR) +
        '" y1="' + Y(av).toFixed(1) + '" y2="' + Y(av).toFixed(1) + '"/>';

      if (narrow) {
        s += '<text class="fdavg" style="fill:' + COL[key] + '" x="' + (w - padR) + '" y="' + (Y(av) - 5).toFixed(1) +
          '" text-anchor="end">avg ' + fv(key, av) + " " + UNIT[key] + "</text>";
      } else {
        s += '<text class="fdavg" style="fill:' + COL[key] + '" x="' + (w - padR + 8) + '" y="' + (Y(av) - 4).toFixed(1) + '">avg</text>' +
          '<text class="fdavg" style="fill:' + COL[key] + '" x="' + (w - padR + 8) + '" y="' + (Y(av) + 9).toFixed(1) + '">' +
          fv(key, av) + " " + UNIT[key] + "</text>";
      }
    }

    return s + "</svg>";
  }

  function byDay() {
    var hi = live.n - state.bars * WEEK;
    var a = live.days[Math.max(0, hi - WEEK)];
    var b = live.days[hi - 1];

    var keys = KEYS.map(function (k) {
      return '<button type="button" data-f="key" data-v="' + k + '" aria-pressed="' + (k === state.key) + '">' + NAME[k] + "</button>";
    }).join("");

    return card(
      whead("MACRO SUMMARY") +
      reads() +
      '<div class="fbarhead"><span class="brng brng--scroll">' + keys + "</span></div>" +
      pan("bars", state.bars, pages(), dmy(a.date) + " – " + dmy(b.date)) +
      '<div class="bpane" data-fplot="bars" data-h="300"><div class="bscroll" data-scroll></div><div class="btip" data-btip hidden></div></div>' +
      '<div class="legend"><span class="legend__i"><span class="legend__sw" style="background:' + COL[state.key] + '"></span>each day</span>' +
      '<span class="legend__i"><span class="legend__sw legend__sw--dotline" style="border-top-color:' + COL[state.key] + '"></span>average of days shown</span>' +
      (TGT[state.key] ? '<span class="legend__i"><span class="legend__sw legend__sw--target"></span>target</span>' : "") +
      "</div>"
    );
  }

  /* ---------- card 2 · food log ---------- */

  function log() {
    var d = live.days[live.n - 1 - state.log];

    var head = KEYS.map(function (k) {
      return '<th><span class="thm"><i style="background:' + COL[k] + '"></i>' + NAME[k] + "</span></th>";
    }).join("");

    var body = d.meals.map(function (m) {
      return '<tr><td class="meal">' + esc(m.slot) + '</td><td class="items">' + esc(m.items) + "</td>" +
        KEYS.map(function (k) {
          return "<td" + (k === "kcal" ? ' class="cal"' : "") + ">" + fv(k, m[k]) + "</td>";
        }).join("") + "</tr>";
    }).join("");

    var foot = KEYS.map(function (k) {
      return "<td>" + fv(k, d.t[k]) + "<small> " + UNIT[k] + "</small></td>";
    }).join("");

    return card(
      whead("FOOD LOG") +
      pan("log", state.log, live.n - 1, wdp(d.date)) +
      '<div class="mscroll"><table class="mtable"><thead><tr><th class="l">Meal</th><th class="l">Items</th>' + head + "</tr></thead>" +
      "<tbody>" + body + "</tbody>" +
      '<tfoot><tr><td class="tot">Day total</td><td class="items"></td>' + foot + "</tr></tfoot></table></div>"
    );
  }

  /* ---------- card 3 · eating and fasting ---------- */

  function nights() {
    return live.nights;
  }

  function rows(list) {
    // A fast that runs past the right edge of its own day carries onto the row for
    // the following day, which sits above it once the list is reversed. carry[i] is
    // the tail row i has to draw on behalf of the night before it.
    var carry = list.map(function () { return null; });

    list.forEach(function (n, i) {
      var next = list[i + 1];

      // Nothing to continue if the night has no fast to draw in the first place.
      if (n.fast == null || !next) {
        return;
      }

      var edge = atLocal(n.ds, n.tz, 12).getTime() + 24 * 36e5;

      // Only carries onto a row that really is the next day, never across a gap.
      if (n.firstStart <= edge || atLocal(next.ds, next.tz, 12).getTime() !== edge) {
        return;
      }

      carry[i + 1] = { at: n.firstStart, night: i };
    });

    return list.map(function (n, i) {
      var origin = atLocal(n.ds, n.tz, 12);
      var L = function (t) { return Math.max(0, Math.min(100, (t - origin) / 36e5 / 24 * 100)); };
      var bar = "";
      var band = "";

      // The carry carries its own night, so hovering it reaches the right tooltip
      // and the pair can light up together.
      if (carry[i]) {
        bar = '<span class="flbar flbar--carry" data-fnight="' + carry[i].night +
          '" style="left:0;width:' + L(carry[i].at).toFixed(2) + '%"></span>';
      }

      if (n.fast != null) {
        var a = L(n.lastEnd);
        var b = L(n.firstStart);
        var cut = n.firstStart - origin > 24 * 36e5;

        bar += '<span class="flbar' + (cut ? " flbar--cut" : "") + '" style="left:' + a.toFixed(2) +
          "%;width:" + Math.max(0.8, b - a).toFixed(2) + '%"></span>';
      }

      if (n.bed && n.wake) {
        band = '<span class="flslp" style="left:' + L(n.bed).toFixed(2) + "%;width:" +
          Math.max(0, L(n.wake) - L(n.bed)).toFixed(2) + '%"></span>';
      }

      return '<div class="flr"><span class="alr__d">' + wdd(n.date) + "</span>" +
        '<span class="flr__t' + (n.fast == null ? " flr__t--none" : "") + '" data-fnight="' + i + '">' + bar + band + "</span>" +
        '<span class="alr__v' + (n.fast == null ? " alr__v--q" : "") + '">' +
        (n.fast == null ? "\u2014" : t_dur(n.fast)) + "</span>" +
        '<span class="alr__v' + (n.preBed == null ? " alr__v--q" : "") + '">' +
        (n.preBed == null ? "\u2014" : t_dur(n.preBed)) + "</span></div>";
    }).reverse().join("");
  }

  function rhythm() {
    var list = nights();

    if (!list.length) {
      return "";
    }

    // Each average counts only the nights that have the pair it needs, and reports
    // how many that was. A week with two unlogged meals is not an average of seven.
    var mean = function (vals) {
      var got = vals.filter(function (v) { return v != null; });

      return got.length
        ? { v: got.reduce(function (a, b) { return a + b; }, 0) / got.length, n: got.length }
        : { v: null, n: 0 };
    };

    var fastAvg = mean(list.map(function (n) { return n.fast; }));
    var bedAvg = mean(list.map(function (n) { return n.preBed; }));
    var total = list.length;

    // The denominator is shown whenever nights were left out, so the reader can see
    // the average is not over the whole week.
    var note = function (lead, got, none) {
      if (!got) {
        return none;
      }

      if (got === total) {
        return "average " + lead + " over the last " + total + " nights";
      }

      return (got === 1 ? lead : "average " + lead) +
        ", <b>" + got + " of the last " + total + "</b> nights";
    };

    var readout = function (key, lead, avg, none) {
      return "<div><p class=\"bread__k\">" + key + '</p><p class="bread__v">' +
        (avg.v != null ? t_dur(avg.v) : '<span class="flq">\u2014</span>') + "</p>" +
        '<p class="bread__n">' + note(lead, avg.n, none) + "</p></div>";
    };

    // The joint only needs explaining when one is on screen.
    var hasWrap = list.some(function (n) {
      return n.fast != null && n.firstStart - atLocal(n.ds, n.tz, 12) > 24 * 36e5;
    });

    var origin = atLocal(list[0].ds, list[0].tz, 12);
    var ticks = "";

    for (var k = 0; k <= 24; k += 3) {
      ticks += "<span>" + t_v(new Date(origin.getTime() + k * 36e5), live.tz).replace(":00", "") + "</span>";
    }

    return card(
      whead("FASTING") +
      '<div class="bsplit">' +
        readout("Overnight fast", "fasting duration", fastAvg,
          "no night in the last " + total + " has a meal logged on both sides of sleep") +
        readout("Last meal → bed", "time from last meal to bed", bedAvg,
          "no night in the last " + total + " has a meal logged before bed") +
      "</div>" +
      '<p class="frange">' + dmy(list[0].date) + " – " + dmy(new Date(list[list.length - 1].date.getTime() + 864e5)) + "</p>" +
      '<div class="flscale flscale--h"><div></div><div></div><div>Fast</div>' +
        '<div><span class="flh--lg">Last meal →&nbsp;bed</span><span class="flh--sm">To bed</span></div></div>' +
      '<div class="flwrap"><div class="flrows">' + rows(list) + '</div><div class="btip" data-ftip hidden></div></div>' +
      '<div class="flscale"><div></div><div class="flsc">' + ticks + "</div><div></div><div></div></div>" +
      '<div class="legend"><span class="legend__i"><span class="legend__sw legend__sw--fasting"></span>fasting</span>' +
      '<span class="legend__i"><span class="legend__sw legend__sw--asleep"></span>asleep</span>' +
      '<span class="legend__i"><span class="legend__sw legend__sw--unlogged"></span>not logged</span>' +
      (hasWrap
        ? '<span class="legend__i"><span class="legend__sw legend__sw--fasting flsw-wrap"></span>continues in the row above</span>'
        : "") + "</div>"
    );
  }

  /* ---------- tooltips ---------- */

  function place(tip, wrap, anchor, cx) {
    var wb = wrap.getBoundingClientRect();
    var tr = anchor.getBoundingClientRect();
    var tw = tip.offsetWidth;
    var th = tip.offsetHeight;
    var above = tr.top - wb.top - th - 8;

    tip.style.left = Math.max(0, Math.min(wb.width - tw, cx - wb.left - tw / 2)) + "px";
    tip.style.top = (above < 0 ? tr.bottom - wb.top + 8 : above) + "px";
  }

  function barTip(event) {
    var pane = panel.querySelector('[data-fplot="bars"]');

    if (!pane) {
      return;
    }

    var tip = pane.querySelector("[data-btip]");
    var bar = event.target.closest && event.target.closest("[data-fbar]");

    if (!bar) {
      tip.setAttribute("hidden", "");
      return;
    }

    var d = live.days[+bar.getAttribute("data-fbar")];
    var key = state.key;
    var t = TGT[key];
    var v = d.t[key];

    tip.innerHTML = '<p class="btip__d">' + wd(d.date) + " " + dmyy(d.date) + (d.partial ? " · so far" : "") + "</p>" +
      '<p class="btip__w">' + fv(key, v) + " " + UNIT[key] + "</p>" +
      '<p class="btip__x">' + d.mealCount + (d.mealCount === 1 ? " meal" : " meals") +
      (t && v != null && !shared.isCheatDay(d.ds) ? " · " + t_st(Math.round(v), t, UNIT[key]).s : "") + "</p>";

    tip.removeAttribute("hidden");

    var br = bar.getBoundingClientRect();

    place(tip, pane, bar, br.left + br.width / 2);
  }

  // "24 to 25 Sept 2026", or the month when it changes, or the year when that does.
  function nightRange(d) {
    var next = new Date(d.getTime() + 864e5);

    if (d.getUTCFullYear() !== next.getUTCFullYear()) {
      return dmyy(d) + " to " + dmyy(next);
    }

    if (d.getUTCMonth() !== next.getUTCMonth()) {
      return dmy(d) + " to " + dmyy(next);
    }

    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric" }).format(d) +
      " to " + dmyy(next);
  }

  // A wrapped fast is two pieces in two rows; light both whenever either is under
  // the cursor, so the joint reads as one thing.
  function linkWrap(idx) {
    panel.querySelectorAll(".flbar--on").forEach(function (b) {
      b.classList.remove("flbar--on");
    });

    if (idx == null) {
      return;
    }

    var own = panel.querySelector('.flr__t[data-fnight="' + idx + '"]');

    if (own) {
      own.querySelectorAll(".flbar:not(.flbar--carry)").forEach(function (b) {
        b.classList.add("flbar--on");
      });
    }

    var tail = panel.querySelector('.flbar--carry[data-fnight="' + idx + '"]');

    if (tail) {
      tail.classList.add("flbar--on");
    }
  }

  function nightTip(event) {
    barTip(event);

    var wrap = panel.querySelector(".flwrap");

    if (!wrap) {
      return;
    }

    var tip = wrap.querySelector("[data-ftip]");
    var track = event.target.closest && event.target.closest("[data-fnight]");
    var n = track ? live.nights[+track.getAttribute("data-fnight")] : null;

    if (!n) {
      tip.setAttribute("hidden", "");
      linkWrap(null);
      return;
    }

    var body;

    if (n.fast != null) {
      body = '<p class="btip__w">' + t_dur(n.fast) + " fasted</p>" +
        '<p class="btip__x">last meal ended at ' + t_v(n.lastEnd, live.tz) + "</p>" +
        '<p class="btip__x">next meal started at ' + t_v(n.firstStart, live.tz) + "</p>";
    } else if (n.lastEnd) {
      body = '<p class="btip__w btip__w--q">Fast not known</p>' +
        '<p class="btip__x">last meal ended at ' + t_v(n.lastEnd, live.tz) + "</p>" +
        '<p class="btip__x">no meal logged after waking</p>';
    } else if (n.firstStart) {
      body = '<p class="btip__w btip__w--q">Fast not known</p>' +
        '<p class="btip__x">no meal logged before bed</p>' +
        '<p class="btip__x">next meal started at ' + t_v(n.firstStart, live.tz) + "</p>";
    } else {
      // Nothing either side; a second section would only repeat the first.
      body = '<p class="btip__w btip__w--q">Fast not known</p>' +
        '<p class="btip__x">no meal logged before bed or after waking</p>';
    }

    if (n.lastEnd || n.firstStart) {
      body += n.preBed != null
        ? '<p class="btip__w btip__w--2">' + t_dur(n.preBed) + '</p><p class="btip__x">between last meal and bed</p>'
        : '<p class="btip__w btip__w--2 btip__w--q">Not known</p><p class="btip__x">between last meal and bed</p>';
    }

    tip.innerHTML = '<p class="btip__d">' + nightRange(n.date) + "</p>" + body;

    tip.removeAttribute("hidden");
    linkWrap(+track.getAttribute("data-fnight"));
    place(tip, wrap, track, event.clientX);
  }

  /* ---------- render ---------- */

  function drawPlot() {
    var pane = panel.querySelector('[data-fplot="bars"]');

    if (!pane) {
      return;
    }

    var scroll = pane.querySelector("[data-scroll]");
    var w = Math.max(280, Math.round(scroll.getBoundingClientRect().width));

    scroll.innerHTML = barsSVG(w, +pane.getAttribute("data-h"));
  }

  function render() {
    panel.innerHTML = byDay() + log() + rhythm() + panelFoot();
    drawPlot();
    window.awhitepenShared.markOverflow(panel);
  }

  /* ---------- load ---------- */

  function showFailure(kind) {

    if (shared) {
      shared.clearSkeleton(panel);
      shared.showFailure(panel, kind || "server", settings.label || "", load);
    }
  }

  function load() {
    if (rendered || loading) {
      return;
    }

    if (!settings.url) {
      showFailure("server");
      return;
    }

    loading = true;

    fetch(settings.url, { credentials: "omit" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(String(response.status));
        }

        return response.json();
      })
      .then(function (json) {
        live = parse(json.data || {});
        loading = false;

        if (!live) {
          showFailure("server");
          return;
        }

        render();
        rendered = true;
        window.awhitepenShared.clearSkeleton(panel);
      })
      .catch(function (error) {
        loading = false;
        console.error("status: fuel failed", error);

        if (!rendered) {
          showFailure(window.awhitepenShared.failureKind(error));
        }
      });
  }

  panel.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-f]");

    if (!button || !live) {
      return;
    }

    var action = button.getAttribute("data-f");
    var value = button.getAttribute("data-v");

    if (action === "key") {
      state.key = value;
    } else if (action === "bars") {
      state.bars = Math.max(0, Math.min(pages(), state.bars + +value));
    } else if (action === "log") {
      state.log = Math.max(0, Math.min(live.n - 1, state.log + +value));
    }

    render();
  });

  panel.addEventListener("mousemove", nightTip);

  panel.addEventListener("mouseleave", function () {
    panel.querySelectorAll("[data-ftip],[data-btip]").forEach(function (tip) {
      tip.setAttribute("hidden", "");
    });
  });

  var resizeTimer;

  window.addEventListener("resize", function () {
    if (!rendered) {
      return;
    }

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      drawPlot();
      window.awhitepenShared.markOverflow(panel);
    }, 150);
  });

  var tab = document.querySelector('.tabs [data-tab="fuel"]');

  if (tab) {
    tab.addEventListener("click", load);
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash.replace(/^#/, "").toLowerCase() === "fuel") {
      load();
    }
  });

  if (!panel.hidden || window.location.hash.replace(/^#/, "").toLowerCase() === "fuel") {
    load();
  }
})();
