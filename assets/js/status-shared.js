/**
 * Shared by every status dashboard. Loaded before them, so each tab can alias
 * what it needs in a single line.
 *
 * Anything two or more tabs must agree on lives here: B's macro targets and the
 * cheat-day rule, the fixed monthly costs, date and duration formatting, the
 * loading skeleton, and the failure card.
 *
 * Fixed costs are config rather than ledger rows — they are not in the database,
 * and the spend view excludes the categories that would double-count them. In
 * each item, `start` is the first month charged and `months` ends an instalment
 * after that many payments, so a past month still shows what was being paid then.
 */
(function () {
  "use strict";

  var FIXED_ORDER = ["rent", "recurring", "insurance"];
  var FIXED_CONFIG = {
    rent: {
      label: "Rent", day: 1, c: "var(--accent-dk)", flat: true,
      note: "B’s 27sqm Bangkok shoebox",
      items: [{ n: "Housing & common fees", a: 350, start: "2024-01" }]
    },
    recurring: {
      label: "Recurring", day: 1, c: "var(--c-plum)",
      items: [
        { n: "ChatGPT Plus", a: 29, type: "Subscriptions", start: "2023-06" },
        { n: "Claude Pro", a: 30, type: "Subscriptions", start: "2024-03" },
        { n: "Google Workspace", a: 12.5, type: "Subscriptions", start: "2022-01" },
        { n: "iCloud+", a: 14, type: "Subscriptions", start: "2022-01" },
        { n: "Mobile line", a: 12, type: "Phone bill", start: "2024-01" },
        { n: "MacBook Air", a: 50, type: "Instalments", start: "2025-09", months: 24 }
      ]
    },
    insurance: {
      label: "Insurance", day: 1, c: "var(--c-red)",
      foot: "Insurance premiums are currently estimated and exclude CPF-paid portions.",
      items: [
        { n: "Headstart", a: 50, type: "Savings", start: "2020-01" },
        { n: "CareShield Top-Up", a: 18, type: "Long-term care / disability", start: "2020-01" },
        { n: "Integrated Shield (IP)", a: 48, type: "Hospitalisation", start: "2020-01" },
        { n: "FWD", a: 74, type: "Whole life", start: "2020-01" },
        { n: "GE", a: 6, type: "Whole life", start: "2020-01" },
        { n: "Income", a: 46, type: "Whole life", start: "2020-01" },
        { n: "MSIG", a: 26, type: "Travel", start: "2020-01" }
      ]
    }
  };

  function monthIndex(key) {
    var p = key.split("-");
    return +p[0] * 12 + (+p[1] - 1);
  }

  function fixedActive(item, mk) {
    if (item.start && mk < item.start) {
      return false;
    }
    if (!item.months) {
      return true;
    }
    var i = monthIndex(mk) - monthIndex(item.start);
    return i >= 0 && i < item.months;
  }

  // Everything charged in a given month, as one number. TODAY divides it by the
  // days in the month; RESOURCES itemises it.
  function monthTotal(mk) {
    var total = 0;

    FIXED_ORDER.forEach(function (key) {
      FIXED_CONFIG[key].items.forEach(function (item) {
        if (fixedActive(item, mk)) {
          total += item.a;
        }
      });
    });

    return Math.round(total * 100) / 100;
  }

  /* ---------- formatting every tab needs ---------- */

  function t_pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  // Minutes as "1h 05m", or "45m" under the hour.
  function t_dur(ms) {
    var t = Math.max(0, Math.round(ms / 6e4));
    var h = Math.floor(t / 60);

    return h ? h + "h " + t_pad(t % 60) + "m" : (t % 60) + "m";
  }

  function t_num(n) {
    return n.toLocaleString("en-US");
  }

  // Short UTC offset for a zone, e.g. GMT+7. Empty when the zone is unknown.
  function t_offset(tz) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date());

      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === "timeZoneName") {
          return parts[i].value;
        }
      }
    } catch (e) {}

    return "";
  }

  // Wall clock where B is.
  function t_v(d, tz) {
    return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).format(d);
  }

  // A target as "1,600-1,700 kcal", or "20 g or more" when it is a floor.
  function t_range(t, unit) {
    return (t[0] === t[1] ? t_num(t[0]) : t_num(t[0]) + "\u2013" + t_num(t[1])) + " " + unit +
      (t[2] === "floor" ? " or more" : "");
  }

  function t_chip(s) {
    return '<span class="tchip tchip--' + s.k + '">' + s.s + "</span>";
  }

  /* ---------- markup every tab needs ---------- */

  function chev(dir) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M' + (dir < 0 ? "15 5 8 12 15 19" : "9 5 16 12 9 19") + '"/></svg>';
  }

  function card(inner) {
    return '<div class="card">' + inner + "</div>";
  }

  // The line under every panel. lead differs because RESOURCES shows dates only.
  function panelFoot(lead, city, tz) {
    var place = city ? esc(city) + " (" + t_offset(tz) + ")" : t_offset(tz);

    return '<div class="wfoot"><span>' + lead + " " + place + " \u00b7 where B currently is</span>" +
      "<span>15-minute delay by design</span></div>";
  }

  /* ---------- B's macro targets ---------- */

  // Config, not a reading: the API returns what she ate, never what she was aiming
  // for. Saturday is a cheat day and carries no target at all, so the rule lives
  // beside the numbers - TODAY and FUEL both read this, and cannot disagree about
  // a Saturday the way they used to.
  var MACRO_TARGET = { kcal: [1600, 1700], p: [90, 110], fib: [20, 20, "floor"] };
  var CHEAT_WEEKDAY = "Sat";

  // Takes either an instant, which is dated where B is, or a bare "2026-09-26",
  // which is already her calendar date and is read as-is.
  function isCheatDay(value, tz) {
    var when = value;
    var opts = { weekday: "short", timeZone: tz };

    if (typeof value === "string") {
      when = new Date(value + "T12:00:00Z");
      opts.timeZone = "UTC";
    }

    return new Intl.DateTimeFormat("en-US", opts).format(when) === CHEAT_WEEKDAY;
  }

  function macroTarget(key, cheat) {
    return cheat ? null : MACRO_TARGET[key] || null;
  }

  /* ---------- the loading skeleton ---------- */

  // The panel ships with the skeleton already in it. Both marks come off together:
  // .sk drives the sweep, aria-busy tells a screen reader it is still loading.
  function clearSkeleton(panel) {
    panel.classList.remove("sk");
    panel.removeAttribute("aria-busy");
  }

  /* ---------- horizontal scroll affordance ---------- */

  // Marks a scrolling pill row only when it really has somewhere to scroll, so the
  // fade never clips a row that already fits.
  function markOverflow(root) {
    if (!root) {
      return;
    }

    root.querySelectorAll(".brng--scroll, .rscope .brng--wrap").forEach(function (el) {
      el.classList.toggle("xfade", el.scrollWidth > el.clientWidth + 1);
    });
  }

  /* ---------- the failure card ---------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function clockTime(date) {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
  }

  // A fetch rejection carries no status, so anything without one is treated as the
  // connection rather than the server.
  function failureKind(error) {
    var status = error && Number(error.message);

    if (status === 429) {
      return "rate";
    }

    return status >= 500 ? "server" : "network";
  }

  // The wait the rate limiter needs before it will answer again.
  var RATE_WAIT_MS = 60000;

  // Replaces a panel's contents with the failure card. `retry` is called when the
  // button is pressed; the caller decides what refetching means for its own tab.
  function showFailure(panel, kind, label, retry) {
    var text = window.awhitepenStatusText || {};
    var copy = text[kind] || text.server || {};
    var waiting = kind === "rate";

    panel.innerHTML = '<div class="card serr" role="alert">' +
      '<p class="serr__k"><i class="serr__dot serr__dot--' + kind + '"></i>' +
        esc(label) + " &middot; " + esc(copy.tag || "") + "</p>" +
      '<h2 class="serr__h">' + esc(copy.head || "") + "</h2>" +
      '<p class="serr__p"><b>' + esc(copy.lead1 || "") + "</b> " + esc(copy.body1 || "") + "</p>" +
      '<p class="serr__p"><b>' + esc(copy.lead2 || "") + "</b> " + esc(copy.body2 || "") + "</p>" +
      '<div class="wfoot">' +
        '<button type="button" class="lmore serr__try' + (waiting ? " serr__try--rate" : "") + '"' +
          (waiting ? ' aria-disabled="true" style="--serr-wait:' + (RATE_WAIT_MS / 1000) + 's"' : "") + ">" +
          esc(waiting ? text.retryWait : text.retry) + "</button>" +
        "<span>" + esc(text.triedAt || "Tried at") + " " + clockTime(new Date()) + "</span>" +
      "</div></div>";

    var button = panel.querySelector(".serr__try");

    if (!button) {
      return;
    }

    // aria-disabled leaves the button focusable and announced, so the press has to be
    // turned away here — the browser will not do it.
    button.addEventListener("click", function () {
      if (button.getAttribute("aria-disabled") === "true") {
        return;
      }

      button.setAttribute("aria-disabled", "true");
      retry();
    });

    // The limiter answers again on its own; the button comes back with it. Dropping
    // the modifier stops the countdown fill from replaying on the next press.
    if (waiting) {
      setTimeout(function () {
        button.classList.remove("serr__try--rate");
        button.removeAttribute("aria-disabled");
        button.textContent = text.retry;
      }, RATE_WAIT_MS);
    }
  }

  window.awhitepenShared = {
    esc: esc, t_pad: t_pad, t_dur: t_dur, t_num: t_num, t_offset: t_offset,
    t_v: t_v, t_range: t_range, t_chip: t_chip, chev: chev, card: card,
    panelFoot: panelFoot,
    markOverflow: markOverflow,
    targets: MACRO_TARGET,
    macroTarget: macroTarget,
    isCheatDay: isCheatDay,
    clearSkeleton: clearSkeleton,
    showFailure: showFailure,
    failureKind: failureKind,
    order: FIXED_ORDER,
    config: FIXED_CONFIG,
    monthIndex: monthIndex,
    active: fixedActive,
    monthTotal: monthTotal
  };
})();
