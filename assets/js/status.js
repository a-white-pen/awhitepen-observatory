/**
 * Status page — the TODAY dashboard.
 *
 * One cell per part of the day: presence, fuel, spending, training, body,
 * downtime, and where the time went. All of it is live from the status API.
 *
 * "Today" runs from B's last wake rather than from midnight. The API sends that
 * instant as window.since, and fuel, spending, training and the activity table
 * all count from it — so the tab never disagrees with itself about the day.
 */
(function () {
  "use strict";

  var panel = document.querySelector('[data-panel="today"]');

  if (!panel) {
    return;
  }

  var settings = window.awhitepenStatus || {};
  var live = null;
  var rendered = false;

  /* ---------- formatting ---------- */



  // Wall clock where B is.
  function t_there(d, tz) {
    return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).format(d);
  }



  // Macros arrive with a decimal the food log cannot really justify; the cell is a
  // glance, not a lab result.
  function whole(n) {
    return n == null ? null : Math.round(n);
  }

  function t_sgd(n) {
    return "S$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


  function t_dayKey(d, tz) {
    var opts = { year: "numeric", month: "2-digit", day: "2-digit" };

    if (tz) {
      opts.timeZone = tz;
    }

    return new Intl.DateTimeFormat("en-CA", opts).format(d);
  }

  // How long ago a reading was, in B's own days. Takes either an instant, which is
  // dated where she is, or a bare "2026-05-17", which is already a calendar date and
  // is used as-is. Counting and printing both run off the resulting YYYY-MM-DD, so
  // the words can never disagree with the date beside them.
  function t_when(value, now, tz) {
    var a = typeof value === "string" ? value : t_dayKey(value, tz);
    var b = t_dayKey(now, tz);

    if (a === b) {
      return "today";
    }

    var at = new Date(a + "T00:00:00Z");
    var days = Math.round((new Date(b + "T00:00:00Z") - at) / 864e5);

    if (days === 1) {
      return "yesterday";
    }

    return "on " + new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(at) +
      " \u00b7 " + days + "d ago";
  }


  function t_st(v, t, unit) {
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


  // status-shared.js holds everything more than one tab needs.
  var shared = window.awhitepenShared;
  var esc = shared.esc, t_pad = shared.t_pad, t_dur = shared.t_dur, t_num = shared.t_num,
      t_offset = shared.t_offset, t_v = shared.t_v, t_range = shared.t_range,
      t_chip = shared.t_chip, chev = shared.chev, card = shared.card;


  /* ---------- live data ---------- */

  var CATEGORIES = {
    work: "Work",
    eat: "Eat",
    exercise: "Exercise",
    meditation: "Meditation",
    self_care: "Self-care",
    downtime: "Downtime",
    social: "Social",
    transit: "Transit",
    admin: "Admin",
    other: "Other"
  };

  // Falls back to title case for any category the design never named.
  function categoryLabel(slug) {
    if (CATEGORIES[slug]) {
      return CATEGORIES[slug];
    }

    var parts = String(slug || "").split("_");

    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + (parts.length > 1 ? "-" + parts.slice(1).join("-") : "");
  }

  function parse(payload) {
    var place = payload.location || {};

    var nights = (payload.sleep || []).map(function (n) {
      return {
        from: n.bed_from ? new Date(n.bed_from) : null,
        to: n.bed_to ? new Date(n.bed_to) : null,
        min: n.in_bed_min
      };
    });

    var training = payload.training || {};
    var spend = payload.spend || [];
    var fuel = payload.fuel || {};
    var woke = payload.window && payload.window.since ? new Date(payload.window.since) : null;
    var body = payload.body || {};

    var sessions = (payload.attention || []).map(function (s) {
      return {
        category: s.category,
        from: new Date(s.started_at),
        to: s.ended_at ? new Date(s.ended_at) : null
      };
    });

    // The newest night is still open while B is in bed, which is how the page
    // knows she is asleep.
    var newest = nights.length ? nights[nights.length - 1] : null;
    var awake = !newest || newest.to !== null;

    // The waking stretch the activity table covers, measured from the same wake the
    // API dates the tab by: open-ended while she is up, otherwise ending at bedtime.
    var to = awake ? null : newest.from;

    var open = sessions.length && sessions[sessions.length - 1].to === null ? sessions[sessions.length - 1].category : null;

    return {
      city: place.city,
      country: place.country,
      tz: place.timezone || "Asia/Singapore",
      awake: awake,
      woke: woke,
      since: awake ? woke : newest.from,
      category: open,
      night: newest,
      from: woke,
      to: to,
      sessions: sessions,
      fuel: {
        kcal: whole(fuel.kcal), p: whole(fuel.protein_g), c: whole(fuel.carbs_g),
        f: whole(fuel.fat_g), fib: whole(fuel.fibre_g), sug: whole(fuel.sugar_g),
        sod: whole(fuel.sodium_mg)
      },
      training: (training.items || []).map(function (row) {
        return {
          kind: row.kind,
          planned: row.was_planned !== false,
          at: row.completed_at ? new Date(row.completed_at) : null,
          status: row.plan_status
        };
      }),
      spend: spend.map(function (row) {
        return { category: row.category, amount: row.sgd_amount || 0 };
      }),
      body: {
        kg: body.weight_kg,
        at: body.measured_at ? new Date(body.measured_at) : null,
        bf: body.body_fat_pct,
        on: body.measured_on || null
      }
    };
  }

  // Minutes per category inside the waking window, clipping sessions to it.
  function activity() {
    if (!live || !live.from) {
      return null;
    }

    var from = live.from.getTime();
    var to = (live.to || new Date()).getTime();
    var totals = {};

    live.sessions.forEach(function (s) {
      var a = Math.max(s.from.getTime(), from);
      var b = Math.min((s.to || new Date(to)).getTime(), to);

      if (b <= a) {
        return;
      }

      totals[s.category] = (totals[s.category] || 0) + Math.round((b - a) / 6e4);
    });

    var list = Object.keys(totals).map(function (k) {
      return [categoryLabel(k), totals[k]];
    });

    list.sort(function (x, y) {
      return y[1] - x[1];
    });

    var logged = list.reduce(function (sum, row) {
      return sum + row[1];
    }, 0);

    var span = Math.max(0, Math.round((to - from) / 6e4));

    return { awake: span, logged: logged, untracked: Math.max(0, span - logged), list: list };
  }

  /* ---------- render ---------- */

  var basis = "awake";

  function cell(label, colour, inner) {
    return '<div class="tcl" style="--cc:' + colour + '"><p class="tcl__k"><i></i>' + label + "</p>" + inner + "</div>";
  }

  function panelFoot() {
    return shared.panelFoot("All times in", live && live.city, live && live.tz);
  }

  function elapsed() {
    return live && live.since ? t_dur(new Date() - live.since) : "";
  }

  function actInner() {
    var d = activity();

    if (!d) {
      return '<div class="tcl__v tcl__v--word"><span class="tq">not recorded</span></div>';
    }

    var tracked = basis === "tracked";
    var total = Math.max(1, tracked ? d.logged : d.awake);
    var list = tracked ? d.list : d.list.concat([["Untracked", d.untracked, 1]]);

    var rows = list.map(function (a) {
      return '<div class="tact__r' + (a[2] ? " tact__r--un" : "") + '"><span>' + esc(a[0]) + "</span><b>" + t_dur(a[1] * 6e4) + "</b>" +
        '<span class="tact__p">' + ((a[1] / total) * 100).toFixed(1) + "%</span></div>";
    }).join("");

    return '<div class="tcl__v">' + t_dur(d.logged * 6e4) + "<small>" + (live.awake ? "tracked today" : "tracked while awake") + "</small></div>" +
      '<p class="tcl__n--q">Awake ' + t_dur(d.awake * 6e4) + (live.awake ? " so far" : " before bed") + "</p>" +
      '<div class="tact"><div class="tact__hd"><span>Category</span><span>Time</span><span>' + (tracked ? "% tracked" : "% awake") + "</span></div>" + rows + "</div>" +
      '<span class="bsw"><button type="button" data-b="awake" aria-pressed="' + !tracked + '">of awake<sup>^</sup></button>' +
      '<button type="button" data-b="tracked" aria-pressed="' + tracked + '">of tracked<sup>^</sup></button></span>' +
      '<p class="tact__f"><span><sup class="tmk">^</sup>% of B&rsquo;s awake time' + (live.awake ? " today so far" : " that day") + ".</span>" +
      '<span><sup class="tmk">^</sup>% of B&rsquo;s tracked time' + (live.awake ? " today so far" : " that day") + ".</span></p>";
  }

  function render() {
    var now = new Date();
    var where = [live.city, live.country].filter(Boolean).map(esc).join(", ");

    var pair = live.awake
      ? 'B is awake<span class="tpres__slash">/</span><span class="tpres__off">asleep</span>'
      : 'B is <span class="tpres__off">awake</span><span class="tpres__slash">/</span>asleep';

    var state = live.awake ? "Awake" : "Asleep";

    var sub = live.since
      ? state + ' for <span data-dur>' + elapsed() + "</span> &middot; since " + t_there(live.since, live.tz) + " " + t_offset(live.tz)
      : state;

    var attention = live.awake
      ? (live.category ? esc(categoryLabel(live.category)) : "Nothing tracked right now")
      : "B’s in dreamland";

    var pres = '<div class="tpres">' +
      '<h2 class="tpres__h">' + pair + "</h2>" +
      '<p class="tpres__sub">' + sub + "</p>" +
      '<div class="tpres__row">' +
        '<div><p class="tpres__ck">Attention currently on</p><p class="tpres__cv">' + attention + "</p></div>" +
        '<div><p class="tpres__ck">Location</p><p class="tpres__cv">' + (where || '<span class="tq">not shared</span>') + "</p></div>" +
        '<div><p class="tpres__ck">Local time</p><p class="tpres__cv"><span data-clock>' + t_there(now, live.tz) + '</span> <span class="tpres__z">' + t_offset(live.tz) + "</span></p></div>" +
      "</div></div>";

    // The fuel window runs from B's last wake to now, so a Saturday that is still
    // going at 1am on Sunday is still Saturday. Targets and the cheat-day rule both
    // come from the shared config FUEL reads too.
    var cheat = shared.isCheatDay(live.woke || now, live.tz);
    var fu = live.fuel;
    var tk = shared.macroTarget("kcal", cheat);
    var scale = "";

    if (fu.kcal != null) {
      // The track is scaled to the target even on a cheat day, so the bar fills at
      // the same rate all week. The cheat day drops the markers, not the bar.
      var mx = Math.max(fu.kcal, (tk || shared.targets.kcal)[1]) * 1.15;
      var marks = "";
      var label = "";
      var togo = "";

      if (tk) {
        var sk = t_st(fu.kcal, tk, "kcal");

        marks = '<span class="tsc__tick" style="left:' + ((tk[0] / mx) * 100) + '%"></span>' +
          '<span class="tsc__tick" style="left:' + ((tk[1] / mx) * 100) + '%"></span>';
        label = '<div class="tsc__lab"><span style="left:' + (((tk[0] + tk[1]) / 2 / mx) * 100) + '%">' + t_range(tk, "kcal") + "</span></div>";
        togo = '<p class="tsc__s">' + sk.s.charAt(0).toUpperCase() + sk.s.slice(1) + "</p>";
      }

      scale = '<div class="tsc"><div class="tsc__t"><span class="tsc__f" style="width:calc(' + ((fu.kcal / mx) * 100) + '% - 4px)"></span>' +
        marks + "</div>" + label + togo + "</div>";
    } else if (tk) {
      scale = '<p class="tsc__s tsc__s--plain">Target ' + t_range(tk, "kcal") + "</p>";
    }

    function tRow(key, label, unit) {
      var v = fu[key];
      var t = shared.macroTarget(key, cheat);

      return '<div class="ttr__r"><span class="ttr__l">' + label + "</span>" +
        '<span class="ttr__v">' + (v == null ? '<span class="tq">not logged</span>' : t_num(v) + "<small>" + unit + "</small>") + "</span>" +
        (t ? '<span class="ttr__s">target ' + t_range(t, unit) + t_chip(t_st(v, t, unit)) + "</span>" : "") + "</div>";
    }

    function pRow(key, label, unit) {
      var v = fu[key];

      return '<div class="trest__r"><span>' + label + "</span><b>" + (v == null ? '<span class="tq">&mdash;</span>' : t_num(v) + "<small>" + unit + "</small>") + "</b></div>";
    }

    var fuel = cell("Fuel", "var(--d-gold)",
      '<div class="tcl__v">' + (fu.kcal == null ? '<span class="tq">Nothing logged yet</span>' : t_num(fu.kcal) + "<small>kcal today</small>") + "</div>" +
      scale +
      '<div class="ttr">' + tRow("p", "Protein", "g") + tRow("fib", "Fibre", "g") + "</div>" +
      '<div class="trest">' + pRow("c", "Carbs", "g") + pRow("f", "Fat", "g") + pRow("sug", "Sugar", "g") + pRow("sod", "Sodium", "mg") + "</div>" +
      (cheat ? '<p class="tnote">Saturday is a cheat day &mdash; nothing carries a target.</p>' : ""));

    var spentToday = live.spend.reduce(function (sum, row) { return sum + row.amount; }, 0);

    // The month's rent, subscriptions and insurance spread over its days. Config
    // rather than ledger rows, shared with RESOURCES so the two cannot disagree.
    var monthKey = t_dayKey(now, live.tz).slice(0, 7);
    var daysInMonth = new Date(+monthKey.slice(0, 4), +monthKey.slice(5, 7), 0).getDate();
    var dailyFixed = shared ? shared.monthTotal(monthKey) / daysInMonth : null;

    var widest = live.spend.reduce(function (max, row) { return Math.max(max, row.amount); }, 0);

    var cats = live.spend.length
      ? '<div class="tcats"><p class="tcats__k">Spent today, by category</p>' + live.spend.map(function (row) {
          return '<div class="tcr"><span class="tcr__k">' + esc(categoryLabel(row.category)) + "</span>" +
            '<span class="tcr__b"><span style="width:' + Math.max(3, (row.amount / widest) * 100) + '%"></span></span>' +
            '<span class="tcr__v">' + t_sgd(row.amount) + "</span></div>";
        }).join("") + "</div>"
      : "";

    var spend = cell("Spending", "var(--d-plum)",
      '<div class="tsum">' +
        '<div class="tsum__r"><span class="tsum__n tsum__n--lead">' + t_sgd(spentToday) + '</span>' +
          '<span class="tsum__l">' + (live.spend.length ? "spent today" : "spent today so far") + "</span></div>" +
        (dailyFixed == null
          ? ""
          : '<div class="tsum__r tsum__r--quiet"><span class="tsum__op">+</span>' +
            '<span class="tsum__n tsum__n--quiet">' + t_sgd(dailyFixed) + "</span>" +
            '<span class="tsum__l">daily share of fixed costs<sup class="tmk">^</sup></span></div>' +
            '<div class="tsum__r tsum__r--tot"><span class="tsum__n tsum__n--tot">' + t_sgd(spentToday + dailyFixed) + "</span>" +
            '<span class="tsum__l">total today</span></div>') +
      "</div>" + cats +
      (dailyFixed == null
        ? ""
        : '<p class="tnote"><sup>^</sup>Fixed costs are the recurring bills \u2014 rent, insurance, subscriptions \u2014 spread evenly across the days they cover.</p>'));

    // The plan the day was given, and whether each part of it happened. Kinds come
    // straight from the planner's vocabulary, so one it gains later still renders.
    var PLAN_WORDS = { rest: "Rest Day", cardio: "Cardio", strength: "Strength", other: "Other" };
    var PLAN_OPTIONS = ["Strength", "Cardio", "Strength + Cardio", "Rest Day"];

    function planWord(slug) {
      return PLAN_WORDS[slug] || categoryLabel(slug);
    }

    // The view returns kinds alphabetically; the design words a two-a-day
    // "Strength + Cardio", so order them the way they are spoken.
    var PLAN_RANK = { strength: 0, cardio: 1, other: 2 };

    function byPlanOrder(a, b) {
      var ra = PLAN_RANK[a.kind] == null ? 9 : PLAN_RANK[a.kind];
      var rb = PLAN_RANK[b.kind] == null ? 9 : PLAN_RANK[b.kind];
      return ra - rb || (a.kind < b.kind ? -1 : 1);
    }

    var doing = live.training.filter(function (t) { return t.kind !== "rest"; }).sort(byPlanOrder);

    // The word is what the day was planned as. Anything she did on top of that
    // shows as a chip instead, so a rest day she trained on still reads as rest.
    var plannedDoing = doing.filter(function (t) { return t.planned; });
    var planLabel = plannedDoing.length
      ? plannedDoing.map(function (t) { return planWord(t.kind); }).join(" + ")
      : (live.training.length ? "Rest Day" : null);

    var others = PLAN_OPTIONS.filter(function (x) { return x !== planLabel; }).map(function (x) {
      return '<span class="toff">' + x + "</span>";
    }).join('<span class="tslash">/</span>');

    var trainChips = doing.map(function (t) {
      // With one discipline "Completed at" is unambiguous; with two it is not.
      if (t.at) {
        var named = !t.planned || doing.length > 1;
        return '<span class="tchip tchip--done">' +
          (named ? esc(planWord(t.kind)) + " at " : "Completed at ") + t_there(t.at, live.tz) + "</span>";
      }
      // The day is over once B is in bed, so anything still outstanding was skipped.
      // The plan does not turn over until she wakes, which is when the window moves.
      if (t.status === "skipped" || !live.awake) {
        return '<span class="tchip tchip--none">' + esc(planWord(t.kind)) + " skipped</span>";
      }
      return '<span class="tchip">' + esc(planWord(t.kind)) + " pending</span>";
    }).join("");

    var train = cell("Training &middot; today\u2019s plan", "var(--d-green)",
      planLabel == null
        ? '<div class="tcl__v tcl__v--word"><span class="tq">No plan today</span></div>'
        : '<div class="tcl__v tcl__v--word">' + esc(planLabel) + "</div>" +
          '<p class="tplans">' + others + "</p>" +
          (trainChips ? '<div class="tchips">' + trainChips + "</div>" : ""));

    var kg = live.body.kg;
    var bf = live.body.bf;

    var body = cell("Body", "var(--d-red)",
      (kg == null
        ? '<div class="tcl__v tcl__v--word"><span class="tq">No weigh-in yet</span></div>'
        : '<div class="tcl__v">' + kg.toFixed(1) + '<small>kg</small>' +
          (live.body.at ? '<small class="tcl__v__meta">at ' + t_there(live.body.at, live.tz) + " " + t_when(live.body.at, now, live.tz) + "</small>" : "") +
          "</div>") +
      (bf == null
        ? ""
        : '<p class="tcl__n tcl__n--sub"><b>' + bf.toFixed(1) + "%</b> body fat" +
          (live.body.on ? " " + t_when(live.body.on, now, live.tz) : "") + "</p>"));

    // Still in bed: the night has no end yet, so count from bedtime to now.
    var inBed = live.night && !live.night.to;
    var bedMs = live.night ? (inBed ? now - live.night.from : live.night.min * 6e4) : 0;

    var down = cell("Downtime", "var(--d-blue)",
      (live.night
        ? '<div class="tcl__v"><span data-bed>' + t_dur(bedMs) + "</span>" +
          '<small>in bed' + (inBed ? " so far" : "") + '<sup class="tmk">^</sup></small></div>' +
          '<p class="tcl__n--q">From ' + t_there(live.night.from, live.tz) + " to " +
          (inBed ? "now" : t_there(live.night.to, live.tz)) + "</p>"
        : '<div class="tcl__v tcl__v--word"><span class="tq">not recorded</span></div>') +
      '<p class="tsp__small">Time asleep <span class="tq">Xh XXm</span> <span class="tsoon">Coming soon</span></p>' +
      '<p class="tnote"><sup>^</sup>Time in bed is self-reported. Time asleep is device-recorded — coming soon (pending device procurement).</p>');

    var act = cell("Activity", "var(--d-teal)", '<div class="tactwrap">' + actInner() + "</div>");

    panel.innerHTML = pres + '<div class="tsheet">' + fuel + spend + train + body + down + act + "</div>" + panelFoot();
  }

  /* ---------- load ---------- */

  function showFailure(kind) {

    if (shared) {
      shared.clearSkeleton(panel);
      shared.showFailure(panel, kind || "server", settings.label || "", load);
    }
  }

  function load() {
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
        render();
        rendered = true;
        shared.clearSkeleton(panel);
      })
      .catch(function (error) {
        // Without this the panel just sits on "Loading…" and says nothing about why.
        console.error("status: today failed", error);

        // A failed refresh leaves the data already on screen alone.
        if (!rendered) {
          showFailure(shared.failureKind(error));
        }
      });
  }

  panel.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest(".bsw button");

    if (!button || !live) {
      return;
    }

    basis = button.getAttribute("data-b");
    panel.querySelector(".tactwrap").innerHTML = actInner();
  });

  var todayTab = document.querySelector('.tabs [data-tab="today"]');

  if (todayTab) {
    todayTab.addEventListener("click", load);
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash.replace(/^#/, "").toLowerCase() === "today") {
      load();
    }
  });

  setInterval(function () {
    if (!live || panel.hidden) {
      return;
    }

    var now = new Date();

    panel.querySelectorAll("[data-clock]").forEach(function (node) {
      node.textContent = t_there(now, live.tz);
    });

    if (live.since) {
      panel.querySelectorAll("[data-dur]").forEach(function (node) {
        node.textContent = elapsed();
      });
    }

    if (live.night && !live.night.to) {
      panel.querySelectorAll("[data-bed]").forEach(function (node) {
        node.textContent = t_dur(now - live.night.from);
      });
    }

    var wrap = panel.querySelector(".tactwrap");

    if (wrap && live.awake) {
      wrap.innerHTML = actInner();
    }
  }, 10000);

  load();
})();
