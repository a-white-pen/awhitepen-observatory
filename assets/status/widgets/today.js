(() => {
  // combined-today.jsx
  (function() {
    var AWP = window.AWPUtil = {};
    var WK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    AWP.tzParts = function(iso, tz) {
      var d = new Date(iso);
      var f = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      var p = {};
      f.formatToParts(d).forEach(function(o) {
        p[o.type] = o.value;
      });
      var hh = +p.hour % 24, mm = +p.minute;
      return {
        y: +p.year,
        m: +p.month,
        d: +p.day,
        hh,
        mm,
        minutesOfDay: hh * 60 + mm,
        dateKey: p.year + "-" + p.month + "-" + p.day
      };
    };
    AWP.nowParts = function(tz) {
      return AWP.tzParts((/* @__PURE__ */ new Date()).toISOString(), tz);
    };
    AWP.keyToUTC = function(key) {
      var a = key.split("-");
      return Date.UTC(+a[0], +a[1] - 1, +a[2]);
    };
    AWP.utcToKey = function(ms) {
      var d = new Date(ms);
      var mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      var dd = String(d.getUTCDate()).padStart(2, "0");
      return d.getUTCFullYear() + "-" + mm + "-" + dd;
    };
    AWP.addDays = function(key, n) {
      return AWP.utcToKey(AWP.keyToUTC(key) + n * 864e5);
    };
    AWP.weekStart = function(key) {
      var dow = new Date(AWP.keyToUTC(key)).getUTCDay();
      var back = (dow + 6) % 7;
      return AWP.addDays(key, -back);
    };
    AWP.weekDays = function(startKey) {
      var out = [];
      for (var i = 0; i < 7; i++) out.push(AWP.addDays(startKey, i));
      return out;
    };
    AWP.weekdayLabel = function(key) {
      var dow = new Date(AWP.keyToUTC(key)).getUTCDay();
      return WK[(dow + 6) % 7];
    };
    AWP.dayNum = function(key) {
      return +key.split("-")[2];
    };
    AWP.monShort = function(key) {
      return MON[+key.split("-")[1] - 1];
    };
    AWP.weekRangeLabel = function(startKey) {
      var endKey = AWP.addDays(startKey, 6);
      return AWP.dayNum(startKey) + " " + AWP.monShort(startKey) + " \u2013 " + AWP.dayNum(endKey) + " " + AWP.monShort(endKey);
    };
    AWP.dayLabel = function(key) {
      return AWP.weekdayLabel(key) + " " + AWP.dayNum(key) + " " + AWP.monShort(key);
    };
    AWP.pad = function(n) {
      return String(n).padStart(2, "0");
    };
    AWP.fmtClock = function(mins) {
      mins = (mins % 1440 + 1440) % 1440;
      return AWP.pad(Math.floor(mins / 60)) + ":" + AWP.pad(Math.round(mins % 60));
    };
    AWP.fmtDur = function(mins) {
      mins = Math.max(0, Math.round(mins));
      var h = Math.floor(mins / 60), m = mins % 60;
      if (h && m) return h + "h " + m + "m";
      if (h) return h + "h";
      return m + "m";
    };
    AWP.anchorOf = function(minutesOfDay) {
      return ((minutesOfDay - 1080) % 1440 + 1440) % 1440;
    };
    AWP.clockOfAnchor = function(anchor) {
      return ((anchor + 1080) % 1440 + 1440) % 1440;
    };
    AWP.niceRange = function(min, max, padMin, stepMin) {
      if (min == null || max == null) return null;
      var lo = Math.floor((min - padMin) / stepMin) * stepMin;
      var hi = Math.ceil((max + padMin) / stepMin) * stepMin;
      if (hi - lo < stepMin) hi = lo + stepMin;
      return { lo, hi };
    };
    AWP.buildNights = function(events, tz) {
      var sorted = events.slice().sort(function(a, b) {
        return new Date(a.occurred_at) - new Date(b.occurred_at);
      });
      var nights = [], open = null;
      sorted.forEach(function(e) {
        if (e.event_type === "sleep") {
          open = e;
        } else if (e.event_type === "wake" && open) {
          var s = AWP.tzParts(open.occurred_at, tz);
          var w = AWP.tzParts(e.occurred_at, tz);
          var durMin = Math.round((new Date(e.occurred_at) - new Date(open.occurred_at)) / 6e4);
          nights.push({
            wakeKey: w.dateKey,
            sleepIso: open.occurred_at,
            wakeIso: e.occurred_at,
            sleepMin: s.minutesOfDay,
            wakeMin: w.minutesOfDay,
            sleepAnchor: AWP.anchorOf(s.minutesOfDay),
            wakeAnchor: AWP.anchorOf(w.minutesOfDay),
            durMin
          });
          open = null;
        }
      });
      return nights;
    };
  })();
  window.AWP_SLEEP_EVENTS = [
    { event_type: "sleep", occurred_at: "2026-05-10T16:36:05Z" },
    { event_type: "wake", occurred_at: "2026-05-11T01:15:46Z" },
    { event_type: "sleep", occurred_at: "2026-05-11T15:14:25Z" },
    { event_type: "wake", occurred_at: "2026-05-11T23:57:32Z" },
    { event_type: "sleep", occurred_at: "2026-05-12T17:54:29Z" },
    { event_type: "wake", occurred_at: "2026-05-13T01:42:53Z" },
    { event_type: "sleep", occurred_at: "2026-05-13T16:36:13Z" },
    { event_type: "wake", occurred_at: "2026-05-14T01:33:37Z" },
    { event_type: "sleep", occurred_at: "2026-05-14T16:16:17Z" },
    { event_type: "wake", occurred_at: "2026-05-15T01:05:06Z" },
    { event_type: "sleep", occurred_at: "2026-05-15T17:54:59Z" },
    { event_type: "wake", occurred_at: "2026-05-16T03:22:09Z" },
    { event_type: "sleep", occurred_at: "2026-05-16T15:57:11Z" },
    { event_type: "wake", occurred_at: "2026-05-17T01:02:55Z" },
    { event_type: "sleep", occurred_at: "2026-05-17T16:28:58Z" },
    { event_type: "wake", occurred_at: "2026-05-18T01:14:48Z" },
    { event_type: "sleep", occurred_at: "2026-05-18T15:28:52Z" },
    { event_type: "wake", occurred_at: "2026-05-19T01:48:15Z" },
    { event_type: "sleep", occurred_at: "2026-05-19T16:23:10Z" },
    { event_type: "wake", occurred_at: "2026-05-20T00:49:02Z" },
    { event_type: "sleep", occurred_at: "2026-05-20T15:37:58Z" },
    { event_type: "wake", occurred_at: "2026-05-21T01:28:26Z" },
    { event_type: "sleep", occurred_at: "2026-05-21T17:55:59Z" },
    { event_type: "wake", occurred_at: "2026-05-22T01:29:58Z" },
    { event_type: "wake", occurred_at: "2026-05-23T01:34:37Z" },
    { event_type: "sleep", occurred_at: "2026-05-23T16:05:31Z" },
    { event_type: "wake", occurred_at: "2026-05-24T01:47:38Z" },
    { event_type: "sleep", occurred_at: "2026-05-24T17:06:03Z" },
    { event_type: "wake", occurred_at: "2026-05-25T02:57:03Z" },
    { event_type: "sleep", occurred_at: "2026-05-25T16:54:43Z" },
    { event_type: "wake", occurred_at: "2026-05-26T00:45:50Z" },
    { event_type: "sleep", occurred_at: "2026-05-26T15:26:49Z" },
    { event_type: "wake", occurred_at: "2026-05-27T01:10:08Z" },
    { event_type: "sleep", occurred_at: "2026-05-27T16:13:00Z" },
    { event_type: "wake", occurred_at: "2026-05-27T23:20:14Z" },
    { event_type: "sleep", occurred_at: "2026-05-28T15:20:49Z" },
    { event_type: "wake", occurred_at: "2026-05-29T01:20:44Z" },
    { event_type: "sleep", occurred_at: "2026-05-29T16:49:22Z" },
    { event_type: "wake", occurred_at: "2026-05-29T23:53:42Z" },
    { event_type: "sleep", occurred_at: "2026-05-30T17:26:10Z" },
    { event_type: "wake", occurred_at: "2026-05-31T01:01:53Z" },
    { event_type: "sleep", occurred_at: "2026-05-31T17:15:29Z" },
    { event_type: "wake", occurred_at: "2026-06-01T01:59:21Z" },
    { event_type: "sleep", occurred_at: "2026-06-01T15:33:55Z" },
    { event_type: "wake", occurred_at: "2026-06-01T23:59:10Z" },
    { event_type: "sleep", occurred_at: "2026-06-02T15:55:33Z" },
    { event_type: "wake", occurred_at: "2026-06-03T00:52:53Z" },
    { event_type: "sleep", occurred_at: "2026-06-03T16:30:06Z" },
    { event_type: "wake", occurred_at: "2026-06-04T00:06:28Z" },
    { event_type: "sleep", occurred_at: "2026-06-04T15:34:58Z" },
    { event_type: "wake", occurred_at: "2026-06-04T23:58:24Z" },
    { event_type: "sleep", occurred_at: "2026-06-05T16:52:46Z" },
    { event_type: "wake", occurred_at: "2026-06-05T23:45:28Z" },
    { event_type: "sleep", occurred_at: "2026-06-06T15:19:48Z" },
    { event_type: "wake", occurred_at: "2026-06-06T23:42:40Z" }
  ];
  window.AWP_ACTUAL_SLEEP = {
    "2026-06-04": { onset_offset_min: 16, wake_offset_min: 10, stages: { deep: 80, light: 246, rem: 88, awake: 16 } },
    "2026-06-05": { onset_offset_min: 18, wake_offset_min: 12, stages: { deep: 92, light: 268, rem: 96, awake: 18 } },
    "2026-06-06": { onset_offset_min: 14, wake_offset_min: 19, stages: { deep: 70, light: 224, rem: 74, awake: 12 } }
  };
  window.AWP_ATTENTION = [
    // ---- May 26
    { category: "downtime", subcategory: "rest", description: "nap", project: "", started_at: "2026-05-26T08:09:09Z", ended_at: "2026-05-26T09:43:10Z" },
    { category: "self_care", subcategory: "exercise", description: "run", project: "", started_at: "2026-05-26T09:43:10Z", ended_at: "2026-05-26T11:06:55Z" },
    { category: "self_care", subcategory: "personal_care", description: "shower", project: "", started_at: "2026-05-26T12:12:22Z", ended_at: "2026-05-26T13:04:48Z" },
    { category: "admin", subcategory: "errands", description: "hang up clothes", project: "", started_at: "2026-05-26T13:12:39Z", ended_at: "2026-05-26T13:35:21Z" },
    { category: "eat", subcategory: "food_prep", description: "heat up dinner", project: "", started_at: "2026-05-26T13:41:16Z", ended_at: "2026-05-26T14:00:35Z" },
    { category: "eat", subcategory: "eating", description: "eat dinner", project: "", started_at: "2026-05-26T14:00:35Z", ended_at: "2026-05-26T14:34:07Z" },
    // ---- May 29 (dentist day)
    { category: "transit", subcategory: "commute", description: "Take train to Thomson", project: "", started_at: "2026-05-29T03:11:51Z", ended_at: "2026-05-29T03:49:34Z" },
    { category: "transit", subcategory: "commute", description: "Walking to Ashford dental", project: "", started_at: "2026-05-29T03:49:34Z", ended_at: "2026-05-29T03:54:45Z" },
    { category: "eat", subcategory: "eating", description: "Eating breakfast", project: "", started_at: "2026-05-29T03:54:45Z", ended_at: "2026-05-29T04:05:41Z" },
    { category: "admin", subcategory: "health_admin", description: "dentist", project: "", started_at: "2026-05-29T04:09:28Z", ended_at: "2026-05-29T05:17:48Z" },
    { category: "eat", subcategory: "food_collection", description: "Queuing for ban mian", project: "", started_at: "2026-05-29T05:17:59Z", ended_at: "2026-05-29T05:52:14Z" },
    { category: "transit", subcategory: "commute", description: "back to Beauty World", project: "", started_at: "2026-05-29T05:52:14Z", ended_at: "2026-05-29T06:58:04Z" },
    { category: "eat", subcategory: "eating", description: "Eat lunch", project: "", started_at: "2026-05-29T06:58:04Z", ended_at: "2026-05-29T07:28:37Z" },
    { category: "eat", subcategory: "eating", description: "Eat dinner", project: "", started_at: "2026-05-29T11:16:23Z", ended_at: "2026-05-29T11:49:39Z" },
    // ---- May 31
    { category: "self_care", subcategory: "personal_care", description: "wash face", project: "", started_at: "2026-05-31T01:12:07Z", ended_at: "2026-05-31T01:25:26Z" },
    { category: "eat", subcategory: "food_prep", description: "Prep breakfast", project: "", started_at: "2026-05-31T01:44:02Z", ended_at: "2026-05-31T01:56:45Z" },
    { category: "admin", subcategory: "errands", description: "prep clothes for laundry", project: "", started_at: "2026-05-31T03:18:33Z", ended_at: "2026-05-31T03:30:57Z" },
    { category: "admin", subcategory: "errands", description: "laundry", project: "", started_at: "2026-05-31T03:30:57Z", ended_at: "2026-05-31T03:42:28Z" },
    { category: "admin", subcategory: "errands", description: "wash toilet bowl", project: "", started_at: "2026-05-31T03:42:28Z", ended_at: "2026-05-31T03:47:38Z" },
    { category: "admin", subcategory: "life_admin", description: "update finances", project: "", started_at: "2026-05-31T03:47:38Z", ended_at: "2026-05-31T04:00:46Z" },
    { category: "admin", subcategory: "errands", description: "move laundry to dryer", project: "", started_at: "2026-05-31T04:03:25Z", ended_at: "2026-05-31T04:23:56Z" },
    { category: "admin", subcategory: "errands", description: "hang up clothes", project: "", started_at: "2026-05-31T04:51:38Z", ended_at: "2026-05-31T05:02:23Z" },
    { category: "eat", subcategory: "eating", description: "snacking", project: "", started_at: "2026-05-31T05:12:47Z", ended_at: "2026-05-31T05:22:00Z" },
    { category: "eat", subcategory: "eating", description: "lunch (social)", project: "", started_at: "2026-05-31T07:43:54Z", ended_at: "2026-05-31T08:32:49Z" },
    { category: "transit", subcategory: "commute", description: "Commute home via BTS/MRT", project: "", started_at: "2026-05-31T14:20:41Z", ended_at: "2026-05-31T15:12:33Z" },
    // ---- Jun 1
    { category: "self_care", subcategory: "personal_care", description: "wash face", project: "", started_at: "2026-06-01T02:35:11Z", ended_at: "2026-06-01T02:45:06Z" },
    { category: "eat", subcategory: "food_prep", description: "breakfast prep", project: "", started_at: "2026-06-01T02:54:08Z", ended_at: "2026-06-01T03:09:30Z" },
    { category: "eat", subcategory: "eating", description: "eat breakfast", project: "", started_at: "2026-06-01T03:09:30Z", ended_at: "2026-06-01T03:33:56Z" },
    { category: "work", subcategory: "planning", description: "planning day & Project B", project: "Project B", started_at: "2026-06-01T03:37:26Z", ended_at: "2026-06-01T04:26:30Z" },
    { category: "eat", subcategory: "food_collection", description: "order lunch", project: "", started_at: "2026-06-01T04:26:30Z", ended_at: "2026-06-01T04:33:35Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-01T04:33:35Z", ended_at: "2026-06-01T04:47:07Z" },
    { category: "admin", subcategory: "errands", description: "mop floor", project: "", started_at: "2026-06-01T07:40:53Z", ended_at: "2026-06-01T08:37:38Z" },
    { category: "social", subcategory: "social_messaging", description: "reply messages", project: "", started_at: "2026-06-01T08:41:55Z", ended_at: "2026-06-01T09:35:50Z" },
    { category: "admin", subcategory: "life_admin", description: "sorting out photos", project: "", started_at: "2026-06-01T09:35:50Z", ended_at: "2026-06-01T10:07:00Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work", project: "project b", started_at: "2026-06-01T10:13:20Z", ended_at: "2026-06-01T11:16:07Z" },
    { category: "eat", subcategory: "food_prep", description: "heat up dinner", project: "", started_at: "2026-06-01T11:16:07Z", ended_at: "2026-06-01T11:28:45Z" },
    { category: "eat", subcategory: "eating", description: "eating dinner", project: "", started_at: "2026-06-01T11:35:29Z", ended_at: "2026-06-01T12:10:43Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on project b", project: "project b", started_at: "2026-06-01T12:31:53Z", ended_at: "2026-06-01T13:44:04Z" },
    { category: "eat", subcategory: "food_prep", description: "wash dishes", project: "", started_at: "2026-06-01T13:44:04Z", ended_at: "2026-06-01T13:49:23Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on project b", project: "project b", started_at: "2026-06-01T13:49:23Z", ended_at: "2026-06-01T14:02:25Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-01T14:02:25Z", ended_at: "2026-06-01T14:18:48Z" },
    // ---- Jun 2
    { category: "work", subcategory: "planning", description: "planning day work", project: "", started_at: "2026-06-02T01:34:34Z", ended_at: "2026-06-02T01:42:07Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on finance module", project: "finance module", started_at: "2026-06-02T01:42:07Z", ended_at: "2026-06-02T02:02:59Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-02T02:02:59Z", ended_at: "2026-06-02T02:16:34Z" },
    { category: "work", subcategory: "deep_work", description: "Deep work", project: "finance and aligners modules", started_at: "2026-06-02T02:29:10Z", ended_at: "2026-06-02T04:41:43Z" },
    { category: "admin", subcategory: "errands", description: "do laundry for bedsheet", project: "", started_at: "2026-06-02T04:41:43Z", ended_at: "2026-06-02T05:11:13Z" },
    { category: "eat", subcategory: "food_collection", description: "collect lunch", project: "", started_at: "2026-06-02T05:11:13Z", ended_at: "2026-06-02T05:19:41Z" },
    { category: "admin", subcategory: "errands", description: "move laundry to dryer", project: "", started_at: "2026-06-02T05:27:01Z", ended_at: "2026-06-02T05:42:13Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on project b", project: "project b", started_at: "2026-06-02T05:42:13Z", ended_at: "2026-06-02T06:00:00Z" },
    { category: "eat", subcategory: "food_prep", description: "make pre-run cereal drink", project: "", started_at: "2026-06-02T06:00:00Z", ended_at: "2026-06-02T06:04:42Z" },
    { category: "admin", subcategory: "errands", description: "collect laundry", project: "", started_at: "2026-06-02T06:04:42Z", ended_at: "2026-06-02T06:15:43Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on project b", project: "project b", started_at: "2026-06-02T08:30:07Z", ended_at: "2026-06-02T09:10:05Z" },
    { category: "self_care", subcategory: "exercise", description: "exercise", project: "", started_at: "2026-06-02T09:10:05Z", ended_at: "2026-06-02T10:31:57Z" },
    { category: "eat", subcategory: "food_prep", description: "post-workout isotonic drink", project: "", started_at: "2026-06-02T10:31:57Z", ended_at: "2026-06-02T10:37:43Z" },
    { category: "work", subcategory: "shallow_work", description: "light work on project b", project: "project b", started_at: "2026-06-02T10:37:43Z", ended_at: "2026-06-02T11:04:57Z" },
    { category: "social", subcategory: "social_messaging", description: "replying texts", project: "", started_at: "2026-06-02T11:04:57Z", ended_at: "2026-06-02T11:31:10Z" },
    { category: "self_care", subcategory: "personal_care", description: "shower", project: "", started_at: "2026-06-02T11:31:10Z", ended_at: "2026-06-02T12:15:09Z" },
    { category: "eat", subcategory: "food_prep", description: "Heat up dinner", project: "", started_at: "2026-06-02T12:15:09Z", ended_at: "2026-06-02T12:29:12Z" },
    { category: "eat", subcategory: "eating", description: "eating dinner", project: "", started_at: "2026-06-02T12:29:12Z", ended_at: "2026-06-02T13:13:50Z" },
    { category: "downtime", subcategory: "entertainment", description: "scroll ig", project: "", started_at: "2026-06-02T13:17:35Z", ended_at: "2026-06-02T13:43:37Z" },
    { category: "eat", subcategory: "food_prep", description: "Wash dishes", project: "", started_at: "2026-06-02T13:43:37Z", ended_at: "2026-06-02T13:57:00Z" },
    { category: "work", subcategory: "deep_work", description: "work on finance dashboard", project: "project b", started_at: "2026-06-02T13:58:14Z", ended_at: "2026-06-02T14:41:00Z" },
    // ---- Jun 3
    { category: "eat", subcategory: "eating", description: "eating breakfast", project: "", started_at: "2026-06-03T01:35:56Z", ended_at: "2026-06-03T02:00:54Z" },
    { category: "work", subcategory: "planning", description: "shallow work planning day", project: "", started_at: "2026-06-03T02:16:13Z", ended_at: "2026-06-03T02:33:16Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-03T02:33:16Z", ended_at: "2026-06-03T02:48:04Z" },
    { category: "work", subcategory: "deep_work", description: "Deep work on Aligners & Finance", project: "Project B", started_at: "2026-06-03T02:48:04Z", ended_at: "2026-06-03T04:58:09Z" },
    { category: "eat", subcategory: "food_collection", description: "ordering lunch", project: "", started_at: "2026-06-03T04:58:09Z", ended_at: "2026-06-03T05:07:37Z" },
    { category: "work", subcategory: "shallow_work", description: "Shallow work on project b", project: "project b", started_at: "2026-06-03T05:07:37Z", ended_at: "2026-06-03T05:28:48Z" },
    { category: "self_care", subcategory: "personal_care", description: "cut fingernails", project: "", started_at: "2026-06-03T05:28:48Z", ended_at: "2026-06-03T05:40:02Z" },
    { category: "eat", subcategory: "food_collection", description: "collect food", project: "", started_at: "2026-06-03T05:40:02Z", ended_at: "2026-06-03T05:49:28Z" },
    { category: "eat", subcategory: "eating", description: "eat lunch", project: "", started_at: "2026-06-03T05:49:28Z", ended_at: "2026-06-03T06:08:54Z" },
    { category: "work", subcategory: "deep_work", description: "aligner design", project: "project b", started_at: "2026-06-03T06:08:54Z", ended_at: "2026-06-03T06:46:12Z" },
    { category: "downtime", subcategory: "entertainment", description: "scrolling Instagram", project: "", started_at: "2026-06-03T07:53:40Z", ended_at: "2026-06-03T08:10:01Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work", project: "", started_at: "2026-06-03T08:10:01Z", ended_at: "2026-06-03T09:02:57Z" },
    { category: "downtime", subcategory: "entertainment", description: "scroll social media", project: "", started_at: "2026-06-03T09:02:57Z", ended_at: "2026-06-03T09:45:25Z" },
    { category: "downtime", subcategory: "rest", description: "nap", project: "", started_at: "2026-06-03T09:45:25Z", ended_at: "2026-06-03T09:59:56Z" },
    { category: "eat", subcategory: "eating", description: "Eat dinner", project: "", started_at: "2026-06-03T09:59:56Z", ended_at: "2026-06-03T10:41:38Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on portfolio page", project: "awhitepen observatory", started_at: "2026-06-03T10:41:38Z", ended_at: "2026-06-03T11:10:30Z" },
    { category: "work", subcategory: "deep_work", description: "Deep work finance/aligner/dashboard", project: "project b", started_at: "2026-06-03T11:10:30Z", ended_at: "2026-06-03T12:19:26Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-03T12:19:26Z", ended_at: "2026-06-03T12:34:23Z" },
    { category: "social", subcategory: "social_messaging", description: "reply messages", project: "", started_at: "2026-06-03T12:34:23Z", ended_at: "2026-06-03T12:52:43Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work", project: "", started_at: "2026-06-03T12:52:43Z", ended_at: "2026-06-03T13:33:02Z" },
    { category: "eat", subcategory: "food_prep", description: "wash dishes", project: "", started_at: "2026-06-03T13:33:02Z", ended_at: "2026-06-03T13:37:01Z" },
    // ---- Jun 4
    { category: "eat", subcategory: "eating", description: "eating breakfast", project: "", started_at: "2026-06-04T00:52:41Z", ended_at: "2026-06-04T01:22:22Z" },
    { category: "work", subcategory: "planning", description: "planning day", project: "", started_at: "2026-06-04T01:37:14Z", ended_at: "2026-06-04T02:02:32Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-04T02:02:32Z", ended_at: "2026-06-04T02:15:54Z" },
    { category: "work", subcategory: "deep_work", description: "work on Project B", project: "Project B", started_at: "2026-06-04T02:17:19Z", ended_at: "2026-06-04T05:34:41Z" },
    { category: "eat", subcategory: "food_collection", description: "collect lunch", project: "", started_at: "2026-06-04T05:34:41Z", ended_at: "2026-06-04T05:40:42Z" },
    { category: "eat", subcategory: "eating", description: "eat lunch", project: "", started_at: "2026-06-04T05:43:50Z", ended_at: "2026-06-04T06:24:49Z" },
    { category: "downtime", subcategory: "entertainment", description: "scrolling instagram", project: "", started_at: "2026-06-04T06:25:00Z", ended_at: "2026-06-04T06:40:10Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work - project b", project: "project b", started_at: "2026-06-04T06:40:10Z", ended_at: "2026-06-04T06:59:27Z" },
    { category: "self_care", subcategory: "personal_care", description: "brush teeth", project: "", started_at: "2026-06-04T06:59:27Z", ended_at: "2026-06-04T07:14:00Z" },
    { category: "eat", subcategory: "food_prep", description: "post-workout protein shake", project: "", started_at: "2026-06-04T10:42:00Z", ended_at: "2026-06-04T10:48:32Z" },
    { category: "eat", subcategory: "food_prep", description: "Heat dinner", project: "", started_at: "2026-06-04T10:48:32Z", ended_at: "2026-06-04T10:58:07Z" },
    { category: "eat", subcategory: "eating", description: "eat dinner", project: "", started_at: "2026-06-04T10:58:07Z", ended_at: "2026-06-04T11:54:55Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work project b", project: "project b", started_at: "2026-06-04T11:58:03Z", ended_at: "2026-06-04T12:22:31Z" },
    { category: "downtime", subcategory: "entertainment", description: "scroll ig", project: "", started_at: "2026-06-04T12:22:31Z", ended_at: "2026-06-04T12:41:03Z" },
    { category: "eat", subcategory: "food_prep", description: "Wash dishes", project: "", started_at: "2026-06-04T12:41:03Z", ended_at: "2026-06-04T12:48:41Z" },
    { category: "self_care", subcategory: "personal_care", description: "Brush teeth", project: "", started_at: "2026-06-04T12:48:41Z", ended_at: "2026-06-04T13:04:48Z" },
    { category: "downtime", subcategory: "entertainment", description: "Scroll internet", project: "", started_at: "2026-06-04T13:07:37Z", ended_at: "2026-06-04T13:17:36Z" },
    { category: "admin", subcategory: "errands", description: "throw rubbish", project: "", started_at: "2026-06-04T13:17:36Z", ended_at: "2026-06-04T13:20:16Z" },
    { category: "self_care", subcategory: "personal_care", description: "shower", project: "", started_at: "2026-06-04T13:20:16Z", ended_at: "2026-06-04T14:14:32Z" },
    { category: "social", subcategory: "social_messaging", description: "reply messages", project: "", started_at: "2026-06-04T14:18:47Z", ended_at: "2026-06-04T15:34:58Z" },
    // ---- Jun 5
    { category: "eat", subcategory: "food_prep", description: "Make breakfast", project: "", started_at: "2026-06-05T00:38:21Z", ended_at: "2026-06-05T01:02:06Z" },
    { category: "self_care", subcategory: "personal_care", description: "Brush teeth", project: "", started_at: "2026-06-05T02:38:08Z", ended_at: "2026-06-05T02:45:00Z" },
    { category: "downtime", subcategory: "rest", description: "Nap", project: "", started_at: "2026-06-05T02:48:04Z", ended_at: "2026-06-05T05:26:00Z" },
    { category: "eat", subcategory: "food_collection", description: "Order lunch", project: "", started_at: "2026-06-05T05:26:59Z", ended_at: "2026-06-05T05:31:32Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work", project: "", started_at: "2026-06-05T05:55:51Z", ended_at: "2026-06-05T06:49:50Z" },
    { category: "eat", subcategory: "food_collection", description: "collect lunch", project: "", started_at: "2026-06-05T06:49:50Z", ended_at: "2026-06-05T07:01:12Z" },
    { category: "eat", subcategory: "eating", description: "eat lunch", project: "", started_at: "2026-06-05T07:04:38Z", ended_at: "2026-06-05T07:50:31Z" },
    // ---- Jun 6
    { category: "eat", subcategory: "eating", description: "Eat breakfast", project: "", started_at: "2026-06-06T00:52:22Z", ended_at: "2026-06-06T01:22:37Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work", project: "project b", started_at: "2026-06-06T01:26:19Z", ended_at: "2026-06-06T02:10:52Z" },
    { category: "work", subcategory: "shallow_work", description: "shallow work on project b", project: "project b", started_at: "2026-06-06T02:32:05Z", ended_at: "2026-06-06T05:40:01Z" },
    { category: "eat", subcategory: "eating", description: "eat lunch", project: "", started_at: "2026-06-06T06:36:48Z", ended_at: "2026-06-06T07:20:56Z" },
    { category: "downtime", subcategory: "entertainment", description: "watching tv", project: "", started_at: "2026-06-06T07:25:35Z", ended_at: "2026-06-06T08:05:47Z" }
  ];
  window.AWP_CATEGORY_META = {
    work: { label: "Work", token: "--att-work" },
    eat: { label: "Eat", token: "--att-eat" },
    self_care: { label: "Self-care", token: "--att-self_care" },
    downtime: { label: "Downtime", token: "--att-downtime" },
    social: { label: "Social", token: "--att-social" },
    transit: { label: "Transit", token: "--att-transit" },
    admin: { label: "Admin", token: "--att-admin" }
  };
  window.AWP_SUBLABEL = function(s) {
    if (!s) return "";
    return s.replace(/_/g, " ").replace(/^\w/, function(c) {
      return c.toUpperCase();
    });
  };
  window.AWP_NUTRITION = {
    "2026-06-07": { meals: [
      { meal: "Breakfast", items: "Greek yoghurt, blueberries, granola, black coffee", calories: 430, protein: 28, carbs: 46, fat: 14, fibre: 7 },
      { meal: "Lunch", items: "Chicken rice (less oil), cucumber, kangkong, soya milk", calories: 720, protein: 42, carbs: 88, fat: 18, fibre: 5 },
      { meal: "Snack", items: "Protein shake, 2 kiwi", calories: 260, protein: 30, carbs: 24, fat: 4, fibre: 6 },
      { meal: "Dinner", items: "Salmon, brown rice, stir-fried broccoli & carrot", calories: 640, protein: 46, carbs: 58, fat: 22, fibre: 9 }
    ] },
    "2026-06-06": { meals: [
      { meal: "Breakfast", items: "2 soft-boiled eggs, wholemeal toast, kaya, kopi-o", calories: 390, protein: 20, carbs: 40, fat: 16, fibre: 4 },
      { meal: "Lunch", items: "Ban mian (less noodles), extra veg, egg", calories: 560, protein: 28, carbs: 70, fat: 16, fibre: 6 },
      { meal: "Dinner", items: "Leftover salmon, rice, sauteed spinach", calories: 610, protein: 40, carbs: 60, fat: 20, fibre: 7 }
    ] }
  };
  window.AWP_LOCATION = {
    city: "Singapore",
    region: "Central",
    country: "Singapore",
    timezone: "Asia/Singapore",
    // ← drives the time-of-day axis on every widget
    lat: 1.3521,
    lng: 103.8198,
    source: "location table",
    as_of: "2026-06-07T00:05:00Z"
  };
  window.AWP_TZ = window.AWP_LOCATION && window.AWP_LOCATION.timezone || "Asia/Singapore";
  var U = window.AWPUtil;
  function Scroller({ label, onPrev, onNext, prevDisabled, nextDisabled }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-scroller" }, /* @__PURE__ */ React.createElement("button", { className: "w-scroller__btn", onClick: onPrev, disabled: prevDisabled, "aria-label": "Previous" }, "\u2039"), /* @__PURE__ */ React.createElement("span", { className: "w-scroller__label" }, label), /* @__PURE__ */ React.createElement("button", { className: "w-scroller__btn", onClick: onNext, disabled: nextDisabled, "aria-label": "Next" }, "\u203A"));
  }
  function WidgetHead({ kicker, lede, children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-widget__head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "w-widget__kicker" }, kicker), lede && /* @__PURE__ */ React.createElement("div", { className: "w-widget__lede" }, lede)), /* @__PURE__ */ React.createElement("div", null, children));
  }
  function Foot({ mock }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-foot" }, /* @__PURE__ */ React.createElement("span", null, "data via Cloud SQL \xB7 15-minute delay, by design"), mock && /* @__PURE__ */ React.createElement("span", { className: "w-mock" }, mock));
  }
  function Grid({ ticks, fmt, valToPct }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "w-yaxis" }, ticks.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "w-ytick", style: { top: valToPct(t) + "%" } }, fmt(t)))));
  }
  function GridLines({ ticks, valToPct }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-grid" }, ticks.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "w-gridline", style: { top: valToPct(t) + "%" } })));
  }
  function XAxis({ days, todayKey }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-xrow" }, /* @__PURE__ */ React.createElement("div", { className: "w-xspacer" }), /* @__PURE__ */ React.createElement("div", { className: "w-xcols" }, days.map((k) => /* @__PURE__ */ React.createElement("div", { key: k, className: "w-xcell" + (k === todayKey ? " is-today" : "") }, /* @__PURE__ */ React.createElement("div", { className: "w-xcell__dow" }, U.weekdayLabel(k)), /* @__PURE__ */ React.createElement("div", { className: "w-xcell__day" }, U.dayNum(k))))));
  }
  function Frame({ kind, caption, children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-frame w-frame--" + kind }, /* @__PURE__ */ React.createElement("div", { className: "w-frame__cap" }, /* @__PURE__ */ React.createElement("b", null, caption), " \xB7 ", kind === "desktop" ? "760px" : "390px"), /* @__PURE__ */ React.createElement("div", { className: "w-frame__body" }, children));
  }
  function Screen({ id, eyebrow, title, dek, render }) {
    return /* @__PURE__ */ React.createElement("section", { className: "w-screen", id }, /* @__PURE__ */ React.createElement("header", { className: "w-screen__head" }, /* @__PURE__ */ React.createElement("div", { className: "w-screen__eyebrow" }, eyebrow), /* @__PURE__ */ React.createElement("h2", { className: "w-screen__title" }, title), dek && /* @__PURE__ */ React.createElement("p", { className: "w-screen__dek" }, dek)), /* @__PURE__ */ React.createElement("div", { className: "w-frames" }, /* @__PURE__ */ React.createElement(Frame, { kind: "desktop", caption: "Desktop" }, render("desktop")), /* @__PURE__ */ React.createElement(Frame, { kind: "mobile", caption: "Mobile" }, render("mobile"))));
  }
  Object.assign(window, { Scroller, WidgetHead, Foot, Grid, GridLines, XAxis, Frame, Screen });
  var U_L = window.AWPUtil;
  var TZ_L = window.AWP_TZ;
  function LocationWidget({ kind }) {
    const loc = window.AWP_LOCATION;
    const last = React.useMemo(() => {
      const s = window.AWP_SLEEP_EVENTS.slice().sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at));
      return s[s.length - 1];
    }, []);
    const awake = !last || last.event_type === "wake";
    const [now, setNow] = React.useState(() => /* @__PURE__ */ new Date());
    React.useEffect(() => {
      const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
      return () => clearInterval(id);
    }, []);
    const clockFmt = new Intl.DateTimeFormat("en-GB", { timeZone: loc.timezone, hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const localClock = clockFmt.format(now);
    const p = U_L.tzParts(now.toISOString(), loc.timezone);
    const localMin = p.minutesOfDay;
    const since = U_L.fmtDur((now - new Date(last.occurred_at)) / 6e4);
    return /* @__PURE__ */ React.createElement("div", { className: "w-widget" }, /* @__PURE__ */ React.createElement(WidgetHead, { kicker: "TODAY \xB7 PRESENCE", lede: /* @__PURE__ */ React.createElement("span", null, "Is B up ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "right now?")) }), /* @__PURE__ */ React.createElement("div", { className: "w-loc" }, /* @__PURE__ */ React.createElement("div", { className: "w-state" }, /* @__PURE__ */ React.createElement("div", { className: "w-state__row" }, /* @__PURE__ */ React.createElement("div", { className: "w-glyph " + (awake ? "w-glyph--awake" : "w-glyph--asleep") }, awake ? /* @__PURE__ */ React.createElement("span", { className: "w-glyph__sun" }) : /* @__PURE__ */ React.createElement("span", { className: "w-glyph__moon" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "w-state__label" }, awake ? "Awake" : "Asleep"), /* @__PURE__ */ React.createElement("div", { className: "w-state__since" }, awake ? "up for" : "asleep for", " ", since, " \xB7 since ", U_L.fmtClock(U_L.tzParts(last.occurred_at, loc.timezone).minutesOfDay)))), /* @__PURE__ */ React.createElement("div", { className: "w-arc" }, /* @__PURE__ */ React.createElement("div", { className: "w-arc__bar" }, /* @__PURE__ */ React.createElement("div", { className: "w-arc__marker", style: { left: localMin / 1440 * 100 + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "w-arc__scale" }, /* @__PURE__ */ React.createElement("span", null, "00"), /* @__PURE__ */ React.createElement("span", null, "06"), /* @__PURE__ */ React.createElement("span", null, "12"), /* @__PURE__ */ React.createElement("span", null, "18"), /* @__PURE__ */ React.createElement("span", null, "24")))), /* @__PURE__ */ React.createElement("div", { className: "w-place" }, /* @__PURE__ */ React.createElement("div", { className: "w-place__eyebrow" }, "Current location"), /* @__PURE__ */ React.createElement("div", { className: "w-place__city" }, loc.city), /* @__PURE__ */ React.createElement("div", { className: "w-place__country" }, loc.country), /* @__PURE__ */ React.createElement("div", { className: "w-place__clock" }, localClock), /* @__PURE__ */ React.createElement("div", { className: "w-place__tz" }, loc.timezone))), /* @__PURE__ */ React.createElement(Foot, null));
  }
  window.LocationWidget = LocationWidget;
  var U_N = window.AWPUtil;
  function NutritionWidget({ kind }) {
    const data = window.AWP_NUTRITION;
    const dayKeys = Object.keys(data).sort();
    const todayKey = U_N.nowParts(window.AWP_TZ).dateKey;
    const startKey = data[todayKey] ? todayKey : dayKeys[dayKeys.length - 1];
    const [dayKey, setDayKey] = React.useState(startKey);
    const idx = dayKeys.indexOf(dayKey);
    const meals = data[dayKey] && data[dayKey].meals || [];
    const tot = meals.reduce((acc, m) => {
      ["calories", "protein", "carbs", "fat", "fibre", "sugar", "sodium"].forEach((k) => {
        acc[k] += m[k] || 0;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, sugar: 0, sodium: 0 });
    const macroTh = (label, token) => /* @__PURE__ */ React.createElement("span", { className: "w-th-macro" }, /* @__PURE__ */ React.createElement("span", { className: "w-dot", style: { background: "var(" + token + ")" } }), label);
    return /* @__PURE__ */ React.createElement("div", { className: "w-widget" }, /* @__PURE__ */ React.createElement(WidgetHead, { kicker: "FUEL \xB7 NUTRITION", lede: /* @__PURE__ */ React.createElement("span", null, "What B ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "ate")) }, /* @__PURE__ */ React.createElement(
      Scroller,
      {
        label: U_N.dayLabel(dayKey),
        onPrev: () => setDayKey(dayKeys[Math.max(0, idx - 1)]),
        onNext: () => setDayKey(dayKeys[Math.min(dayKeys.length - 1, idx + 1)]),
        prevDisabled: idx <= 0,
        nextDisabled: idx >= dayKeys.length - 1
      }
    )), !meals.length ? /* @__PURE__ */ React.createElement("div", { className: "w-empty" }, "NOTHING LOGGED FOR THIS DAY") : /* @__PURE__ */ React.createElement("table", { className: "w-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "w-th-meal" }, "Meal"), /* @__PURE__ */ React.createElement("th", { className: "w-th-items" }, "What was eaten"), /* @__PURE__ */ React.createElement("th", null, "Cal"), /* @__PURE__ */ React.createElement("th", null, macroTh("Protein", "--mac-protein")), /* @__PURE__ */ React.createElement("th", null, macroTh("Carbs", "--mac-carbs")), /* @__PURE__ */ React.createElement("th", null, macroTh("Fat", "--mac-fat")), /* @__PURE__ */ React.createElement("th", null, macroTh("Fibre", "--mac-fibre")), /* @__PURE__ */ React.createElement("th", null, "Sugar"), /* @__PURE__ */ React.createElement("th", null, "Sodium"))), /* @__PURE__ */ React.createElement("tbody", null, meals.map((m, i) => /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { className: "w-td-meal" }, m.meal), /* @__PURE__ */ React.createElement("td", { className: "w-td-items" }, m.items), /* @__PURE__ */ React.createElement("td", { className: "w-td-cal" }, m.calories), /* @__PURE__ */ React.createElement("td", null, m.protein, "g"), /* @__PURE__ */ React.createElement("td", null, m.carbs, "g"), /* @__PURE__ */ React.createElement("td", null, m.fat, "g"), /* @__PURE__ */ React.createElement("td", null, m.fibre, "g"), /* @__PURE__ */ React.createElement("td", null, m.sugar, "g"), /* @__PURE__ */ React.createElement("td", null, m.sodium, "mg")))), /* @__PURE__ */ React.createElement("tfoot", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "w-td-total" }, "Total"), /* @__PURE__ */ React.createElement("td", { className: "w-td-items" }), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.calories)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.protein, "g")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.carbs, "g")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.fat, "g")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.fibre, "g")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.sugar, "g")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("b", null, tot.sodium, "mg"))))), /* @__PURE__ */ React.createElement(Foot, null));
  }
  window.NutritionWidget = NutritionWidget;
  function useV2Theme() {
    const read = () => {
      try {
        const t = document.documentElement.getAttribute("data-theme");
        if (t === "dark" || t === "light") return t;
      } catch (e) {
      }
      try {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
      } catch (e) {
      }
      return "light";
    };
    const [mode, setMode] = React.useState(read);
    React.useEffect(() => {
      const update = () => setMode(read());
      let obs = null;
      if (window.MutationObserver) {
        obs = new MutationObserver(update);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
      }
      const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (mq && mq.addEventListener) mq.addEventListener("change", update);
      return () => {
        if (obs) obs.disconnect();
        if (mq && mq.removeEventListener) mq.removeEventListener("change", update);
      };
    }, []);
    return mode;
  }
  var V2_BASE = "https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation";
  function v2json(path) {
    return fetch(V2_BASE + path).then((r) => {
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  }
  function awpNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function awpBuildNutrition(rows, tz) {
    const U2 = window.AWPUtil;
    const titleMeal = (s) => String(s || "other").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const order = ["breakfast", "brunch", "lunch", "snack", "pre_workout", "post_workout", "dinner", "supper", "other"];
    const byDay = {};
    for (const r of rows) {
      const iso = r.logged_at || r.created_at;
      if (!iso) continue;
      const key = U2.tzParts(iso, tz).dateKey;
      const mt = String(r.meal_type || "other").toLowerCase();
      if (!byDay[key]) byDay[key] = {};
      if (!byDay[key][mt]) byDay[key][mt] = { mt, meal: titleMeal(mt), items: [], calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, sugar: 0, sodium: 0 };
      const b = byDay[key][mt];
      if (r.food_item) b.items.push(r.food_item);
      b.calories += awpNum(r.kcal);
      b.protein += awpNum(r.protein_g);
      b.carbs += awpNum(r.carbs_g);
      b.fat += awpNum(r.fat_g);
      b.fibre += awpNum(r.fibre_g);
      b.sugar += awpNum(r.sugar_g);
      b.sodium += awpNum(r.sodium_mg);
    }
    const out = {};
    for (const key of Object.keys(byDay)) {
      out[key] = { meals: Object.values(byDay[key]).sort((a, b) => (order.indexOf(a.mt) + 1 || 99) - (order.indexOf(b.mt) + 1 || 99)).map((m) => ({ meal: m.meal, items: m.items.join(", "), calories: Math.round(m.calories), protein: Math.round(m.protein), carbs: Math.round(m.carbs), fat: Math.round(m.fat), fibre: Math.round(m.fibre), sugar: Math.round(m.sugar), sodium: Math.round(m.sodium) })) };
    }
    return out;
  }
  function TodayApp() {
    const mode = useV2Theme();
    const [ready, setReady] = React.useState(0);
    React.useEffect(() => {
      let alive = true;
      Promise.allSettled([v2json("/location"), v2json("/sleep"), v2json("/nutrition-new")]).then((res) => {
        if (!alive) return;
        const [loc, slp, nut] = res;
        if (loc.status === "fulfilled" && loc.value) {
          window.AWP_LOCATION = loc.value;
          if (loc.value.timezone) window.AWP_TZ = loc.value.timezone;
        }
        if (slp.status === "fulfilled" && slp.value) {
          window.AWP_SLEEP_EVENTS = slp.value.events || slp.value || [];
        }
        if (nut.status === "fulfilled" && nut.value) {
          const rows = Array.isArray(nut.value) ? nut.value : nut.value.data || nut.value.rows || [];
          const built = awpBuildNutrition(rows, window.AWP_TZ || "Asia/Singapore");
          if (Object.keys(built).length) window.AWP_NUTRITION = built;
        }
        setReady((n) => n + 1);
      });
      return () => {
        alive = false;
      };
    }, []);
    return /* @__PURE__ */ React.createElement("div", { className: "awp-page w-app", "data-theme": void 0 }, /* @__PURE__ */ React.createElement("div", { className: "w-stack" }, /* @__PURE__ */ React.createElement(LocationWidget, { kind: "desktop", key: "loc-" + ready }), /* @__PURE__ */ React.createElement(NutritionWidget, { kind: "desktop", key: "nut-" + ready })));
  }
  (window.AWP_WIDGETS = window.AWP_WIDGETS || {}).today = function(__el) {
    ReactDOM.createRoot(__el).render(/* @__PURE__ */ React.createElement(TodayApp, null));
  };
})();
