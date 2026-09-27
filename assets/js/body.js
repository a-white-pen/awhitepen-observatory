/**
 * Status page — the BODY dashboard.
 *
 * Weight against body composition, the Invisalign run day by day, and the vitals
 * that have no device yet. Everything but the vitals card is live from the status API.
 *
 * Dates and clocks are B's own, from the location the endpoint sends. Both wear
 * thresholds live in this file rather than in SQL, so changing either is a
 * front-end edit and not a view replacement.
 */
(function () {
  "use strict";

  var panel = document.querySelector('[data-panel="body"]');

  if (!panel) {
    return;
  }

  var settings = window.awhitepenBody || {};

  // status-shared.js holds everything more than one tab needs.
  var shared = window.awhitepenShared;
  var esc = shared.esc, t_pad = shared.t_pad, t_dur = shared.t_dur, t_num = shared.t_num,
      t_offset = shared.t_offset, t_v = shared.t_v, t_range = shared.t_range,
      t_chip = shared.t_chip, chev = shared.chev, card = shared.card;
  var live = null;
  var rendered = false;

  /* target and threshold the design sets, not the data */
  // Both wear thresholds live here, together. The view sends raw minutes and this
  // file decides what counts as short of target and what counts as a long removal,
  // so changing either is a front-end edit rather than a view replacement.
  var WEAR_TARGET_MIN = 18 * 60;
  var OUT_LONG_MIN = 2 * 60;
  var WINDOW_DAYS = 30;
  var ALIGNER_PAGE = 10;

  var weightOffset = 0;
  var alignerOffset = 0;

  /* ---------- formatting ---------- */



  // "2026-09-24" as a local calendar day. new Date(string) would read it as UTC
  // and land on the wrong day west of Greenwich.
  function dparse(value) {
    var p = String(value).split("-");

    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function dayAdd(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }

  function t_dayKey(d) {
    return d.getFullYear() + "-" + t_pad(d.getMonth() + 1) + "-" + t_pad(d.getDate());
  }

  // B's own calendar date for an instant, as YYYY-MM-DD. t_dayKey above reads back
  // a bare date built at local midnight and is left alone for that.
  function t_dayKeyIn(d, tz) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  }

  // The hour where B is, 0-23.
  function t_hourIn(d, tz) {
    return Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(d));
  }




  function b_dmy(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function b_dmyy(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function b_wd(d) {
    return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  }

  // How long ago a calendar day was. Date only — body scans carry no clock.
  function b_when(d, now, tz) {
    var a = t_dayKey(d);
    var b = t_dayKeyIn(now, tz);

    if (a === b) {
      return "today";
    }

    if (a === t_dayKeyIn(new Date(now.getTime() - 864e5), tz)) {
      return "yesterday";
    }

    return "on " + b_dmy(d) + " · " + Math.round((dparse(b) - dparse(a)) / 864e5) + "d ago";
  }

  // Minutes from local midnight as a wall clock.
  function b_clock(min) {
    var m = Math.round(min);
    var h = Math.floor(m / 60) % 24;
    var ap = h >= 12 ? "PM" : "AM";

    return (h % 12 || 12) + ":" + t_pad(m % 60) + " " + ap;
  }

  /* ---------- live data ---------- */

  function b_num(value, fallback) {
    var number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  }

  function parse(payload) {
    var place = payload.location || {};

    var weigh = (payload.weight || []).map(function (w) {
      return { d: dparse(w.measured_on), at: new Date(w.measured_at), kg: w.weight_kg, gap: w.minutes_after_wake };
    });

    var fat = (payload.composition || []).map(function (c) {
      return { d: dparse(c.measured_on), pct: c.body_fat_pct, src: c.source };
    });

    // In the quarter-hour after local midnight the API's cutoff still sits in
    // yesterday, so today's window has not opened and to lands before from.
    // Nothing to draw until it does.
    var days = (payload.aligner_days || []).filter(function (a) {
      return a.tracked_to_min > a.tracked_from_min;
    }).map(function (a) {
      return {
        d: dparse(a.day_date),
        from: a.tracked_from_min,
        to: a.tracked_to_min,
        worn: a.worn_minutes,
        partial: a.is_partial,
        outs: a.out_segments || []
      };
    });

    var trays = (payload.aligner_trays || []).map(function (t) {
      return {
        arch: t.arch,
        n: b_num(t.tray_number, 0),
        planned: t.planned_days == null ? null : b_num(t.planned_days, null),
        from: dparse(t.started_on),
        current: t.is_current,
        days: b_num(t.days_worn, 0),
        avg: t.avg_worn_minutes == null ? null : b_num(t.avg_worn_minutes, null)
      };
    });

    var st = payload.aligner_status || {};

    // The day grid runs to the last aligner day, which the view generates up to
    // today in B's own timezone. Weight alone would stop at her last weigh-in.
    var last = days.length ? days[days.length - 1].d : (weigh.length ? weigh[weigh.length - 1].d : new Date());

    return {
      city: place.city,
      tz: place.timezone || "Asia/Singapore",
      weigh: weigh,
      fat: fat,
      days: days,
      trays: trays,
      state: st.state || "not_started",
      since: st.since ? new Date(st.since) : null,
      treatmentDays: b_num(st.treatment_days, 0),
      worn24: st.worn_minutes_24h == null ? null : b_num(st.worn_minutes_24h, null),
      series: series(weigh, last)
    };
  }

  // One entry per calendar day from the first weigh-in to `last`, so the chart
  // can show the gaps. kg is null on a day with no reading.
  function series(weigh, last) {
    if (!weigh.length) {
      return [];
    }

    var byDay = {};

    weigh.forEach(function (w) {
      byDay[t_dayKey(w.d)] = w;
    });

    var out = [];
    var day = weigh[0].d;

    while (day <= last) {
      var hit = byDay[t_dayKey(day)];

      out.push({ d: day, kg: hit ? hit.kg : null, at: hit ? hit.at : null, gap: hit ? hit.gap : null, avg: null });
      day = dayAdd(day, 1);
    }

    // Rolling seven calendar days, never averaged from fewer than four readings.
    out.forEach(function (x, i) {
      var win = out.slice(Math.max(0, i - 6), i + 1).filter(function (y) {
        return y.kg != null;
      });

      x.avg = win.length >= 4 ? win.reduce(function (a, y) { return a + y.kg; }, 0) / win.length : null;
    });

    return out;
  }

  // Mean and range over the last seven calendar days, same four-reading floor as
  // the average line. Null when the window is too thin to mean anything.
  function recent(s) {
    var win = s.slice(-7).filter(function (x) {
      return x.kg != null;
    });

    if (win.length < 4) {
      return null;
    }

    var vals = win.map(function (x) { return x.kg; });

    return {
      avg: vals.reduce(function (a, b) { return a + b; }, 0) / vals.length,
      lo: Math.min.apply(null, vals),
      hi: Math.max.apply(null, vals),
      n: vals.length
    };
  }

  /* ---------- weight chart ---------- */

  function chart(width, height, offset) {
    var s = live.series;
    var end = s.length - offset;
    var data = s.slice(Math.max(0, end - WINDOW_DAYS), end);
    var padL = 38;
    var padR = live.fat.length ? 40 : 14;
    var padT = 12;
    var padB = 26;

    var vals = data.filter(function (x) { return x.kg != null; }).map(function (x) { return x.kg; });

    if (!vals.length) {
      return '<p class="hint">No weight observations in this range.</p>';
    }

    var ppd = (width - padL - padR) / data.length;
    var lo = Math.min.apply(null, vals) - 0.25;
    var hi = Math.max.apply(null, vals) + 0.25;
    var X = function (i) { return padL + i * ppd + ppd / 2; };
    var Y = function (v) { return padT + (hi - v) / (hi - lo) * (height - padT - padB); };

    var first = data[0].d;
    var last = data[data.length - 1].d;

    var fat = live.fat.filter(function (b) {
      return b.d >= first && b.d <= last;
    });

    var fLo = 0;
    var fHi = 0;
    var FY = function () { return 0; };

    if (fat.length) {
      var fv = live.fat.map(function (b) { return b.pct; });

      fLo = Math.floor((Math.min.apply(null, fv) - 0.4) * 2) / 2;
      fHi = Math.ceil((Math.max.apply(null, fv) + 0.4) * 2) / 2;
      FY = function (v) { return padT + (fHi - v) / (fHi - fLo) * (height - padT - padB); };
    }

    var out = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height +
      '" data-ppd="' + ppd + '" data-padl="' + padL + '" data-range="' + data.length + '" data-off="' + offset + '">';

    for (var g = Math.ceil(lo * 2) / 2; g <= hi; g += 0.5) {
      out += '<line class="bgl" x1="' + padL + '" x2="' + (width - padR) + '" y1="' + Y(g).toFixed(1) + '" y2="' + Y(g).toFixed(1) + '"/>' +
        '<text class="btick" x="' + (padL - 7) + '" y="' + (Y(g) + 3.5).toFixed(1) + '" text-anchor="end">' + g.toFixed(1) + "</text>";
    }

    if (fat.length) {
      for (var f = Math.ceil(fLo); f <= fHi; f++) {
        out += '<text class="btick btick--bf" x="' + (width - padR + 7) + '" y="' + (FY(f) + 3.5).toFixed(1) + '">' + f + "%</text>";
      }
    }

    var step = data.length <= 7 ? 1 : data.length <= 30 ? 5 : data.length <= 93 ? 14 : 30;
    var lastI = data.length - 1;
    var drawn = [];

    data.forEach(function (x, i) {
      if (i % step === 0) {
        drawn.push(i);
      }
    });

    if (lastI - drawn[drawn.length - 1] < 40 / ppd) {
      drawn.pop();
    }

    drawn.push(lastI);

    drawn.forEach(function (i) {
      out += '<text class="btick" x="' + X(i).toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle">' + b_dmy(data[i].d) + "</text>";
    });

    data.forEach(function (x, i) {
      if (x.kg != null) {
        out += '<circle class="bobs" data-i="' + i + '" cx="' + X(i).toFixed(1) + '" cy="' + Y(x.kg).toFixed(1) + '" r="' + (ppd > 20 ? 3 : 2.4) + '"/>';
      }
    });

    var seg = [];
    var paths = [];

    data.forEach(function (x, i) {
      if (x.avg == null) {
        if (seg.length > 1) {
          paths.push(seg);
        }

        seg = [];
        return;
      }

      seg.push([X(i), Y(x.avg)]);
    });

    if (seg.length > 1) {
      paths.push(seg);
    }

    paths.forEach(function (p) {
      out += '<path class="bavg" d="' + p.map(function (q, i) {
        return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1);
      }).join(" ") + '"/>';
    });

    fat.forEach(function (b) {
      var i = Math.round((b.d - first) / 864e5);

      if (i < 0 || i > lastI) {
        return;
      }

      var x = X(i);
      var y = FY(b.pct);

      out += '<line class="bbfl" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + (height - padB) + '"/>' +
        '<rect class="bbfm" x="' + (x - 4).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" width="8" height="8" transform="rotate(45 ' + x.toFixed(1) + " " + y.toFixed(1) + ')"/>';
    });

    return out + '<g class="bhov" data-hov hidden><line class="bcur" y1="' + padT + '" y2="' + (height - padB) + '"/><circle class="bring" r="5.5"/></g></svg>';
  }

  function windowDays(offset) {
    var end = live.series.length - offset;

    return live.series.slice(Math.max(0, end - WINDOW_DAYS), end);
  }

  function windowSpan(offset) {
    var w = windowDays(offset);

    return w.length ? b_dmy(w[0].d) + " – " + b_dmy(w[w.length - 1].d) : "";
  }

  // Inside half a kilo reads as steady; otherwise state the signed change.
  function windowChange(offset) {
    var d = windowDays(offset).filter(function (x) { return x.kg != null; });

    if (d.length < 2) {
      return "not enough observations in this window";
    }

    var change = d[d.length - 1].kg - d[0].kg;
    var tail = offset ? "over these " + WINDOW_DAYS + " days" : "in the last " + WINDOW_DAYS + " days";

    if (Math.abs(change) <= 0.5) {
      return "weight steady within ±0.5 kg " + tail;
    }

    return "weight " + (change > 0 ? "+" : "−") + Math.abs(change).toFixed(1) + " kg " + tail;
  }

  /* ---------- cards ---------- */


  function whead(key, lead) {
    return '<div class="whead"><div><div class="whead__k">' + key + '</div><div class="whead__l">' + lead + "</div></div></div>";
  }

  function weightCard(now) {
    var s = live.series;
    var obs = s.filter(function (x) { return x.kg != null; });

    if (!obs.length) {
      return '<div class="card">' + whead("BODY WEIGHT · PERCENTAGE BODY FAT", "No weigh-in yet") +
        '<p class="hint">Nothing has been logged on the scale yet. The chart appears with the first reading.</p></div>';
    }

    var latest = obs[obs.length - 1];
    var when = b_when(latest.d, now, live.tz);
    var lead = latest.kg.toFixed(1) + " kg " +
      (when === "today" ? (latest.at && t_hourIn(latest.at, live.tz) < 12 ? "this morning" : "today") : when);

    var r = recent(s);
    var fat = live.fat.length ? live.fat[live.fat.length - 1] : null;

    var left = r
      ? '<p class="bread__k">7-day average</p><p class="bread__v">' + r.avg.toFixed(2) + "<small>kg</small></p>" +
        '<p class="bread__n">range <b>' + r.lo.toFixed(1) + " – " + r.hi.toFixed(1) + " kg</b></p>"
      : '<p class="bread__k">7-day average</p><p class="bread__v">—</p>' +
        '<p class="bread__n">fewer than four readings in the last 7 days</p>';

    var right = fat
      ? '<p class="bread__k">Body fat</p><p class="bread__v">' + fat.pct.toFixed(1) + "<small>%</small></p>" +
        '<p class="bread__n">last measured ' + b_when(fat.d, now, live.tz) + (fat.src ? "<br>" + esc(fat.src) : "") + "</p>"
      : '<p class="bread__k">Body fat</p><p class="bread__v">—</p><p class="bread__n">no scan logged yet</p>';

    return '<div class="card">' + whead("BODY WEIGHT · PERCENTAGE BODY FAT", esc(lead)) +
      '<div class="bpanwrap"><span class="bpan">' +
        '<button type="button" data-pan="7" aria-label="Earlier 7 days">' + chev(-1) + "</button>" +
        '<span class="bpan__lab" data-wlab>' + windowSpan(weightOffset) + "</span>" +
        '<button type="button" data-pan="-7" aria-label="Later 7 days">' + chev(1) + "</button></span>" +
        '<p class="bpan__chg" data-wchg>' + windowChange(weightOffset) + "</p></div>" +
      '<div class="bsplit"><div>' + left + "</div><div>" + right + "</div></div>" +
      '<div class="bax"><span>Weight in kg</span>' + (live.fat.length ? '<span class="bax__bf">Percentage body fat</span>' : "<span></span>") + "</div>" +
      '<div class="bpane" data-pane="bw"><div class="bscroll" data-scroll></div><div class="btip" data-tip hidden></div></div>' +
      '<div class="legend">' +
        '<span class="legend__i"><span class="legend__sw legend__sw--dot legend__sw--weight"></span>weight</span>' +
        '<span class="legend__i"><span class="legend__sw legend__sw--line legend__sw--avg"></span>7-day average</span>' +
        (live.fat.length ? '<span class="legend__i"><span class="legend__sw legend__sw--dia legend__sw--fat"></span>body fat</span>' : "") +
        '<span class="legend__i legend__i--right">gaps = B did not weigh in</span></div></div>';
  }

  function visibleDays() {
    var end = live.days.length - alignerOffset;

    return live.days.slice(Math.max(0, end - ALIGNER_PAGE), end);
  }

  // Only whole days carry a meaningful wear figure - today is still running.
  function completeDays(list) {
    return list.filter(function (x) {
      return !x.partial;
    });
  }

  function alignerPan() {
    var days = visibleDays();

    if (!days.length) {
      return "";
    }

    var done = completeDays(days);
    var avg = done.length
      ? t_dur(done.reduce(function (a, x) { return a + x.worn; }, 0) / done.length * 6e4) +
        " average wear time over " + done.length + (done.length === 1 ? " complete day" : " complete days") + " here"
      : "no complete day in this window yet";

    return '<span class="bpan">' +
      '<button type="button" data-alpan="' + ALIGNER_PAGE + '" aria-label="Earlier"' +
        (live.days.length - alignerOffset - ALIGNER_PAGE <= 0 ? " disabled" : "") + ">" + chev(-1) + "</button>" +
      '<span class="bpan__lab">' + b_dmy(days[0].d) + " – " + b_dmy(days[days.length - 1].d) + "</span>" +
      '<button type="button" data-alpan="-' + ALIGNER_PAGE + '" aria-label="Later"' +
        (alignerOffset <= 0 ? " disabled" : "") + ">" + chev(1) + "</button></span>" +
      '<p class="bpan__chg">' + avg + "</p>";
  }

  // The band above the first row of a new tray, naming the tray it replaced.
  function trayBand(day) {
    var key = t_dayKey(day.d);
    var parts = [];

    ["upper", "lower"].forEach(function (arch) {
      var list = live.trays.filter(function (t) { return t.arch === arch; }).sort(function (a, b) { return a.n - b.n; });

      list.forEach(function (t, i) {
        if (t_dayKey(t.from) !== key || i === 0) {
          return;
        }

        var prev = list[i - 1];
        var label = arch.charAt(0).toUpperCase() + arch.slice(1);

        parts.push(label + " → <b>#" + t.n + "</b>");
        parts.push("#" + prev.n + ' <span class="nw">worn <b>' + prev.days + (prev.days === 1 ? " day" : " days") + "</b></span>" +
          (prev.avg != null ? ', <span class="nw">avg <b>' + t_dur(prev.avg * 6e4) + "</b></span>" : ""));
      });
    });

    if (!parts.length) {
      return "";
    }

    return '<div class="alchg"><span class="alchg__b">Tray change</span><span class="alchg__x">' + parts.join(" · ") + "</span></div>";
  }

  function alignerRows() {
    var days = visibleDays();

    if (!days.length) {
      return '<p class="hint">No aligner days logged yet.</p>';
    }

    var base = Math.max(0, live.days.length - alignerOffset - ALIGNER_PAGE);

    return days.map(function (x, idx) {
      // The bar is green by default and the segments are cut out of it: the day
      // starts worn, and only a logged removal takes wear away.
      var blocks = "";

      // Outside the window - before the treatment began, or later today.
      if (x.from > 0) {
        blocks += '<span class="alr__f" style="left:0;width:' + (x.from / 1440 * 100).toFixed(2) + '%"></span>';
      }

      if (x.to < 1440) {
        blocks += '<span class="alr__f" style="left:' + (x.to / 1440 * 100).toFixed(2) + '%;width:' + ((1440 - x.to) / 1440 * 100).toFixed(2) + '%"></span>';
      }

      blocks += x.outs.map(function (o) {
        return '<span class="alr__o' + (o.full_minutes >= OUT_LONG_MIN ? " alr__o--long" : "") + '" style="left:' +
          (o.from_min / 1440 * 100).toFixed(2) + "%;width:" + ((o.to_min - o.from_min) / 1440 * 100).toFixed(2) + '%"></span>';
      }).join("");

      // A day that is still running cannot have missed a full-day target.
      var under = !x.partial && x.worn < WEAR_TARGET_MIN;

      return trayBand(x) + '<div class="alr"><span class="alr__d"><span class="wd">' + b_wd(x.d) + "</span> <b>" + b_dmy(x.d) + "</b></span>" +
        '<span class="alr__t" data-alday="' + (base + idx) + '">' + blocks + "</span>" +
        '<span class="alr__v' + (under ? " alr__v--under" : "") + '">' + t_dur(x.worn * 6e4) + "</span></div>";
    }).reverse().join("");
  }

  function alignerCard() {
    if (!live.days.length) {
      return '<div class="card">' + whead("DENTAL ALIGNERS", "Not started") +
        '<p class="hint">No tray has been logged yet.</p></div>';
    }

    var out = live.state === "out";
    var lead = live.state === "not_started"
      ? "Not started"
      : '<span class="dotin' + (out ? " dotin--out" : "") + '"></span>Aligners ' + (out ? "out" : "in") +
        (live.since ? " · " + t_dur(new Date() - live.since) : "");

    var current = {};

    live.trays.forEach(function (t) {
      if (t.current) {
        current[t.arch] = t;
      }
    });

    function trayCell(arch, label) {
      var t = current[arch];

      if (!t) {
        return '<div><p class="bread__v">—<small>' + label + "</small></p><p class=\"bread__n\">no tray</p></div>";
      }

      return '<div><p class="bread__v">#' + t.n + "<small>" + label + "</small></p>" +
        '<p class="bread__n">day ' + t.days + (t.planned ? " of " + t.planned : "") + "</p></div>";
    }

    return '<div class="card">' + whead("DENTAL ALIGNERS", lead) +
      '<div class="bpanwrap" data-alpanwrap>' + alignerPan() + "</div>" +
      '<div class="bsplit"><div><p class="bread__k">Worn for</p>' +
        '<p class="bread__v">' + (live.worn24 == null ? "—" : t_dur(live.worn24 * 6e4)) + "</p>" +
        '<p class="bread__n">in the past 24 hours</p></div>' +
      '<div><p class="bread__k">Current trays</p><div class="btray">' + trayCell("upper", "upper") + trayCell("lower", "lower") + "</div></div></div>" +
      '<div class="bax bax--al"><span></span><span>Hours worn</span></div>' +
      '<div class="alwrap"><div class="alrows" data-alrows>' + alignerRows() + "</div>" +
        '<div class="alscale"><div></div><div><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span></div><div></div></div>' +
        '<div class="btip" data-altip hidden></div></div>' +
      '<div class="legend">' +
        '<span class="legend__i"><span class="legend__sw legend__sw--in"></span>in</span>' +
        '<span class="legend__i"><span class="legend__sw legend__sw--out"></span>out</span>' +
        '<span class="legend__i"><span class="legend__sw legend__sw--long"></span>out over 2h</span>' +
        (live.treatmentDays ? '<span class="legend__i legend__i--right">On Invisalign for ' + live.treatmentDays + " days so far</span>" : "") +
      "</div></div>";
  }

  function othersCard() {
    var rows = [["Steps", "daily step count"], ["Resting heart rate", "morning RHR"], ["Heart rate variability (HRV)", "overnight variability"]];

    return '<div class="card">' + whead("OTHERS", "") + '<div class="bfutgrid">' + rows.map(function (v) {
      return '<div class="bfutcard"><p class="bread__k">' + v[0] + "</p><p class=\"bfutcard__v\">—</p>" +
        '<p class="bfutcard__row"><span class="bfut__x">' + v[1] + '</span><span class="tsoon">Coming soon</span>' +
        '<span class="bfut__x">(pending device procurement)</span></p></div>';
    }).join("") + "</div></div>";
  }

  function panelFoot() {
    return shared.panelFoot("All times in", live && live.city, live && live.tz);
  }

  /* ---------- draw ---------- */

  function drawChart() {
    var pane = panel.querySelector('[data-pane="bw"]');

    if (!pane) {
      return;
    }

    var scroll = pane.querySelector("[data-scroll]");
    var width = Math.max(260, Math.round(scroll.getBoundingClientRect().width));

    scroll.innerHTML = chart(width, 240, weightOffset);

    var lab = panel.querySelector("[data-wlab]");
    var chg = panel.querySelector("[data-wchg]");

    if (lab) {
      lab.innerHTML = windowSpan(weightOffset);
    }

    if (chg) {
      chg.innerHTML = windowChange(weightOffset);
    }

    var max = Math.max(0, live.series.length - WINDOW_DAYS);

    panel.querySelectorAll("[data-pan]").forEach(function (b) {
      var d = +b.getAttribute("data-pan");

      b.disabled = (d < 0 && weightOffset <= 0) || (d > 0 && weightOffset >= max);
    });
  }

  function panTo(offset) {
    weightOffset = Math.max(0, Math.min(Math.max(0, live.series.length - WINDOW_DAYS), offset));
    drawChart();
  }

  function render() {
    var now = new Date();

    panel.innerHTML = '<div class="grid g-2 g-top">' + weightCard(now) + alignerCard() + "</div>" + othersCard() + panelFoot();
    drawChart();
  }

  /* ---------- interaction ---------- */

  panel.addEventListener("click", function (event) {
    if (!live || !event.target.closest) {
      return;
    }

    var pan = event.target.closest("[data-pan]");

    if (pan) {
      panTo(weightOffset + +pan.getAttribute("data-pan"));
      return;
    }

    var alpan = event.target.closest("[data-alpan]");

    if (alpan) {
      alignerOffset = Math.max(0, Math.min(Math.max(0, live.days.length - ALIGNER_PAGE), alignerOffset + +alpan.getAttribute("data-alpan")));
      panel.querySelector("[data-alrows]").innerHTML = alignerRows();
      panel.querySelector("[data-alpanwrap]").innerHTML = alignerPan();
      panel.querySelector("[data-altip]").setAttribute("hidden", "");
    }
  });

  (function () {
    var drag = null;

    panel.addEventListener("mousedown", function (event) {
      if (!live || !event.target.closest) {
        return;
      }

      var pane = event.target.closest('[data-pane="bw"]');

      if (!pane) {
        return;
      }

      var svg = pane.querySelector("svg");

      if (!svg) {
        return;
      }

      drag = { x: event.clientX, off: weightOffset, ppd: +svg.dataset.ppd };
      pane.style.cursor = "grabbing";
      event.preventDefault();
    });

    window.addEventListener("mousemove", function (event) {
      if (drag) {
        panTo(drag.off + Math.round((event.clientX - drag.x) / drag.ppd));
      }
    });

    window.addEventListener("mouseup", function () {
      if (!drag) {
        return;
      }

      drag = null;

      var pane = panel.querySelector('[data-pane="bw"]');

      if (pane) {
        pane.style.cursor = "";
      }
    });
  })();

  panel.addEventListener("mouseleave", function (event) {
    if (!event.target.closest) {
      return;
    }

    var pane = event.target.closest(".bpane");

    if (pane) {
      var svg = pane.querySelector("svg");

      if (svg) {
        var hov = svg.querySelector("[data-hov]");

        if (hov) {
          hov.setAttribute("hidden", "");
        }
      }

      var tip = pane.querySelector("[data-tip]");

      if (tip) {
        tip.setAttribute("hidden", "");
      }
    }

    var wrap = event.target.closest(".alwrap");

    if (wrap) {
      var at = wrap.querySelector("[data-altip]");

      if (at) {
        at.setAttribute("hidden", "");
      }
    }
  }, true);

  panel.addEventListener("mousemove", function (event) {
    if (!live || !event.target.closest) {
      return;
    }

    alignerHover(event);
    weightHover(event);
  });

  function alignerHover(event) {
    var wrap = panel.querySelector(".alwrap");
    var tip = wrap && wrap.querySelector("[data-altip]");

    if (!tip) {
      return;
    }

    var track = event.target.closest("[data-alday]");

    if (!track) {
      tip.setAttribute("hidden", "");
      return;
    }

    var day = live.days[+track.getAttribute("data-alday")];

    if (!day) {
      return;
    }

    var rect = track.getBoundingClientRect();
    var min = Math.max(0, Math.min(1439, (event.clientX - rect.left) / rect.width * 1440));
    var body;

    // Outside the day's window - before treatment began, or later today. The
    // date answers it on its own; the line is held open so the card keeps its
    // shape as the pointer crosses in and out.
    if (min < day.from || min > day.to) {
      body = '<p class="btip__w btip__w--q"></p>';
    } else {
      var hit = day.outs.filter(function (o) { return min >= o.from_min && min <= o.to_min; })[0];

      if (hit) {
        body = '<p class="btip__w' + (hit.full_minutes >= OUT_LONG_MIN ? " btip__w--out" : "") + '">' + t_dur(hit.minutes * 6e4) + " out</p>" +
          '<p class="btip__x">out ' + b_clock(hit.from_min) + " – " + b_clock(hit.to_min) + "</p>";
      } else {
        var from = day.from;
        var to = day.to;

        day.outs.forEach(function (o) {
          if (o.to_min <= min && o.to_min > from) {
            from = o.to_min;
          }

          if (o.from_min >= min && o.from_min < to) {
            to = o.from_min;
          }
        });

        body = '<p class="btip__w">' + t_dur((to - from) * 6e4) + " in</p>" +
          '<p class="btip__x">in ' + b_clock(from) + " – " + b_clock(to) + "</p>";
      }
    }

    tip.innerHTML = '<p class="btip__d">' + b_dmyy(day.d) + "</p>" + body;
    tip.removeAttribute("hidden");

    var wb = wrap.getBoundingClientRect();
    var rowsTop = wrap.querySelector("[data-alrows]").getBoundingClientRect().top - wb.top;
    var above = rect.top - wb.top - tip.offsetHeight - 8;

    tip.style.left = Math.max(0, Math.min(wb.width - tip.offsetWidth, event.clientX - wb.left - tip.offsetWidth / 2)) + "px";
    tip.style.top = (above < rowsTop ? rect.bottom - wb.top + 8 : above) + "px";
  }

  function weightHover(event) {
    var scroll = event.target.closest("[data-scroll]");

    if (!scroll) {
      return;
    }

    var svg = scroll.querySelector("svg");

    if (!svg) {
      return;
    }

    var rect = svg.getBoundingClientRect();
    var ppd = +svg.dataset.ppd;
    var padL = +svg.dataset.padl;
    var range = +svg.dataset.range;
    var i = Math.round((event.clientX - rect.left - padL - ppd / 2) / ppd);

    i = Math.max(0, Math.min(range - 1, i));

    var hov = svg.querySelector("[data-hov]");
    var x = padL + i * ppd + ppd / 2;

    if (hov) {
      hov.removeAttribute("hidden");

      var line = hov.querySelector(".bcur");

      line.setAttribute("x1", x.toFixed(1));
      line.setAttribute("x2", x.toFixed(1));

      var ring = hov.querySelector(".bring");
      var dot = svg.querySelector('.bobs[data-i="' + i + '"]');

      if (dot) {
        ring.setAttribute("cx", dot.getAttribute("cx"));
        ring.setAttribute("cy", dot.getAttribute("cy"));
        ring.removeAttribute("hidden");
      } else {
        ring.setAttribute("hidden", "");
      }
    }

    var base = live.series.length - weightOffset - range;
    var day = live.series[base + i];

    if (!day) {
      return;
    }

    var pane = scroll.closest(".bpane");
    var tip = pane.querySelector("[data-tip]");

    if (!tip) {
      return;
    }

    var fat = live.fat.filter(function (b) { return t_dayKey(b.d) === t_dayKey(day.d); })[0];

    tip.innerHTML = '<p class="btip__d">' + b_dmyy(day.d) + "</p>" +
      (day.kg == null
        ? '<p class="btip__w btip__w--q">not weighed</p>'
        : '<p class="btip__w">' + day.kg.toFixed(2) + " kg</p>" +
          '<p class="btip__x">weighed ' + t_v(day.at, live.tz) +
            (day.gap != null && day.gap > 0 && day.gap < 120 ? " · " + day.gap + "m after waking" : "") + "</p>") +
      (fat ? '<p class="btip__bf">' + fat.pct.toFixed(1) + "% body fat" + (fat.src ? " · " + esc(fat.src) : "") + "</p>" : "");

    tip.removeAttribute("hidden");

    var dot2 = svg.querySelector('.bobs[data-i="' + i + '"]');
    var cx = dot2 ? +dot2.getAttribute("cx") : x;
    var cy = dot2 ? +dot2.getAttribute("cy") : 40;

    tip.style.left = Math.max(2, Math.min(pane.clientWidth - tip.offsetWidth - 2, cx - tip.offsetWidth / 2)) + "px";
    tip.style.top = Math.max(2, cy - tip.offsetHeight - 12) + "px";
  }

  var resizeTimer;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (live && !panel.hidden) {
        drawChart();
      }
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
        window.awhitepenShared.clearSkeleton(panel);
      })
      .catch(function (error) {
        // A failed refresh leaves the data already on screen alone.
        if (!rendered) {
          showFailure(window.awhitepenShared.failureKind(error));
        }
      });
  }

  var tab = document.querySelector('.tabs [data-tab="body"]');

  if (tab) {
    tab.addEventListener("click", load);
  }

  function onBody() {
    return window.location.hash.replace(/^#/, "").toLowerCase() === "body";
  }

  window.addEventListener("hashchange", function () {
    if (onBody()) {
      load();
    }
  });

  // main.js switches panels from DOMContentLoaded, which runs after this file,
  // so the panel still carries its server-rendered `hidden` here. Go by the
  // hash instead: a direct link to #body loads itself, a tab click has its own
  // listener, and landing on another tab fetches nothing until BODY is opened.
  if (onBody()) {
    load();
  }
})();
