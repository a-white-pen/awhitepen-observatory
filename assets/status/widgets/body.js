// Latest Invisalign data (7 events as of 2026-06-04).
window.ALIGNER_WEAR_EVENTS = [
  {
    aligner_wear_event_id: "1",
    removed_at: "2026-06-02T08:11:45Z",
    reinserted_at: "2026-06-02T08:27:20Z",
    upper_tray_number: "",
    lower_tray_number: "",
    notes: ""
  },
  {
    aligner_wear_event_id: "2",
    removed_at: "2026-06-02T08:27:44Z",
    reinserted_at: "2026-06-02T08:28:00Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  },
  {
    aligner_wear_event_id: "3",
    removed_at: "2026-06-02T12:30:09Z",
    reinserted_at: "2026-06-02T15:08:28Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  },
  {
    aligner_wear_event_id: "4",
    removed_at: "2026-06-03T01:14:52Z",
    reinserted_at: "2026-06-03T02:47:26Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  },
  {
    aligner_wear_event_id: "5",
    removed_at: "2026-06-03T07:00:40Z",
    reinserted_at: "2026-06-03T07:00:46Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  },
  {
    aligner_wear_event_id: "6",
    removed_at: "2026-06-03T09:59:48Z",
    reinserted_at: "2026-06-03T12:34:26Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  },
  {
    aligner_wear_event_id: "7",
    removed_at: "2026-06-04T00:26:34Z",
    reinserted_at: "2026-06-04T02:15:55Z",
    upper_tray_number: "1",
    lower_tray_number: "1",
    notes: ""
  }
];

window.ALIGNER_TRAY_CHANGES = [
  {
    aligner_tray_change_id: "1",
    arch: "upper",
    tray_number: "1",
    planned_days: "",
    started_at: "2026-05-29T05:00:00Z",
    ended_at: "",
    notes: ""
  },
  {
    aligner_tray_change_id: "2",
    arch: "lower",
    tray_number: "1",
    planned_days: "",
    started_at: "2026-05-29T05:00:00Z",
    ended_at: "",
    notes: ""
  }
];
// Weight sample data — replace with live endpoint.
window.WEIGHT_SAMPLE_DATA = [
  { "Date":"2026-06-04", "Day":"Thursday",  "Weighing Time":"07:24 am", "Weight kg":"55.60", "Minutes After Wake":"18" },
  { "Date":"2026-06-03", "Day":"Wednesday", "Weighing Time":"08:13 am", "Weight kg":"55.50", "Minutes After Wake":"20" },
  { "Date":"2026-06-02", "Day":"Tuesday",   "Weighing Time":"07:27 am", "Weight kg":"55.85", "Minutes After Wake":"28" },
  { "Date":"2026-06-01", "Day":"Monday",    "Weighing Time":"09:29 am", "Weight kg":"56.20", "Minutes After Wake":"30" },
  { "Date":"2026-05-31", "Day":"Sunday",    "Weighing Time":"08:01 am", "Weight kg":"56.60", "Minutes After Wake":"0" },
  { "Date":"2026-05-28", "Day":"Thursday",  "Weighing Time":"06:50 am", "Weight kg":"55.95", "Minutes After Wake":"30" },
  { "Date":"2026-05-27", "Day":"Wednesday", "Weighing Time":"08:30 am", "Weight kg":"55.60", "Minutes After Wake":"21" },
  { "Date":"2026-05-26", "Day":"Tuesday",   "Weighing Time":"08:03 am", "Weight kg":"55.85", "Minutes After Wake":"17" },
  { "Date":"2026-05-25", "Day":"Monday",    "Weighing Time":"10:12 am", "Weight kg":"55.90", "Minutes After Wake":"15" },
  { "Date":"2026-05-24", "Day":"Sunday",    "Weighing Time":"09:03 am", "Weight kg":"56.40", "Minutes After Wake":"16" },
  { "Date":"2026-05-23", "Day":"Saturday",  "Weighing Time":"08:52 am", "Weight kg":"56.10", "Minutes After Wake":"18" },
  { "Date":"2026-05-22", "Day":"Friday",    "Weighing Time":"08:45 am", "Weight kg":"55.55", "Minutes After Wake":"15" },
  { "Date":"2026-05-21", "Day":"Thursday",  "Weighing Time":"09:06 am", "Weight kg":"55.90", "Minutes After Wake":"39" },
  { "Date":"2026-05-20", "Day":"Wednesday", "Weighing Time":"07:49 am", "Weight kg":"56.25", "Minutes After Wake":"0" },
  { "Date":"2026-05-19", "Day":"Tuesday",   "Weighing Time":"09:05 am", "Weight kg":"56.15", "Minutes After Wake":"18" },
  { "Date":"2026-05-18", "Day":"Monday",    "Weighing Time":"08:35 am", "Weight kg":"57.05", "Minutes After Wake":"21" },
  { "Date":"2026-05-17", "Day":"Sunday",    "Weighing Time":"08:32 am", "Weight kg":"56.95", "Minutes After Wake":"30" },
  { "Date":"2026-05-16", "Day":"Saturday",  "Weighing Time":"07:29 am", "Weight kg":"56.60", "Minutes After Wake":"1404" },
  { "Date":"2026-05-15", "Day":"Friday",    "Weighing Time":"08:21 am", "Weight kg":"56.85", "Minutes After Wake":"16" },
  { "Date":"2026-05-14", "Day":"Thursday",  "Weighing Time":"08:36 am", "Weight kg":"56.80", "Minutes After Wake":"2" },
  { "Date":"2026-05-13", "Day":"Wednesday", "Weighing Time":"08:59 am", "Weight kg":"56.55", "Minutes After Wake":"16" },
  { "Date":"2026-05-12", "Day":"Tuesday",   "Weighing Time":"07:23 am", "Weight kg":"56.45", "Minutes After Wake":"26" }
];
(() => {
  // src/weight-chart-candy.jsx
  var { useState: wsUseState, useMemo: wsUseMemo, useRef: wsUseRef } = React;
  var W_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var W_WDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var W_DAY_MS = 864e5;
  function parseWeightData(raw) {
    const parsed = raw.map((r) => {
      const [y, m, d] = r.Date.split("-").map(Number);
      return {
        date: r.Date,
        day: r.Day,
        kg: parseFloat(r["Weight kg"]),
        time: (r["Weighing Time"] || "").trim(),
        minAfterWake: parseInt(r["Minutes After Wake"], 10) || 0,
        dayNum: d,
        mon: m - 1,
        year: y,
        ts: new Date(y, m - 1, d).getTime()
      };
    }).sort((a, b) => a.ts - b.ts);
    const byDate = /* @__PURE__ */ new Map();
    for (const p of parsed) {
      if (!byDate.has(p.date)) byDate.set(p.date, p);
    }
    return [...byDate.values()];
  }
  function wFmtTimeAP(t) {
    const parts = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (!parts) return t;
    return `${parseInt(parts[1], 10)}:${parts[2]} ${parts[3].toUpperCase()}`;
  }
  function shiftDate(dk, days) {
    const [y, m, d] = dk.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }
  function dkTs(dk) {
    const [y, m, d] = dk.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  function dkLabel(dk) {
    const [, m, d] = dk.split("-").map(Number);
    return `${d} ${W_MONTHS[m - 1]}`;
  }
  function linReg(points) {
    const n = points.length;
    if (n < 2) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (const [x, y] of points) {
      sx += x;
      sy += y;
      sxx += x * x;
      sxy += x * y;
    }
    const denom = n * sxx - sx * sx;
    if (Math.abs(denom) < 1e-10) return null;
    const slope = (n * sxy - sx * sy) / denom;
    const intercept = (sy - slope * sx) / n;
    return { slope, intercept };
  }
  function Sparkline({ data, width, height, color }) {
    if (data.length < 2) return null;
    const vals = data.map((d) => d.kg);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 0.5;
    const pad = 2;
    const pts = data.map((d, i) => {
      const x = pad + i / (data.length - 1) * (width - 2 * pad);
      const y = pad + (1 - (d.kg - min) / range) * (height - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return /* @__PURE__ */ React.createElement("svg", { width, height, viewBox: `0 0 ${width} ${height}`, style: { display: "block" } }, /* @__PURE__ */ React.createElement(
      "polyline",
      {
        points: pts,
        fill: "none",
        stroke: color,
        strokeWidth: 1.5,
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }
    ));
  }
  function WeightWeekNav({ startDK, endDK, onPrev, onNext, canPrev, canNext, palette }) {
    const btn = (enabled) => ({
      width: 34,
      height: 34,
      borderRadius: 99,
      border: `1px solid ${enabled ? palette.line : "transparent"}`,
      background: enabled ? palette.card : "transparent",
      color: enabled ? palette.ink : palette.muted2,
      cursor: enabled ? "pointer" : "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      fontFamily: "inherit",
      flexShrink: 0
    });
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { style: btn(canPrev), onClick: canPrev ? onPrev : void 0 }, "\u2039"), /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      fontWeight: 600,
      color: palette.muted,
      minWidth: 140,
      textAlign: "center"
    } }, dkLabel(startDK), " \u2013 ", dkLabel(endDK)), /* @__PURE__ */ React.createElement("button", { style: btn(canNext), onClick: canNext ? onNext : void 0 }, "\u203A"));
  }
  function WeightSection({ palette, density, rows }) {
    const raw = rows && rows.length ? rows : window.WEIGHT_SAMPLE_DATA || [];
    const allData = wsUseMemo(() => parseWeightData(raw), [raw]);
    const [hoverIdx, setHoverIdx] = wsUseState(null);
    const contRef = wsUseRef(null);
    const svgRef = wsUseRef(null);
    const todayDK = (() => {
      const d = /* @__PURE__ */ new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    const [endDK, setEndDK] = wsUseState(todayDK);
    const startDK = shiftDate(endDK, -27);
    const earliestDK = allData.length ? allData[0].date : todayDK;
    const canNext = endDK < todayDK;
    const canPrev = startDK > earliestDK;
    const data = wsUseMemo(() => {
      const sTs2 = dkTs(startDK), eTs2 = dkTs(endDK);
      return allData.filter((d) => d.ts >= sTs2 && d.ts <= eTs2);
    }, [allData, startDK, endDK]);
    const sparkData = wsUseMemo(() => {
      const cutoff = dkTs(shiftDate(todayDK, -90));
      return allData.filter((d) => d.ts >= cutoff);
    }, [allData]);
    if (!allData.length) return /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 0", textAlign: "center", color: palette.muted } }, "No weight data yet.");
    const latest = allData[allData.length - 1];
    const totalSpanDays = Math.max(1, Math.round((latest.ts - allData[0].ts) / W_DAY_MS) + 1);
    const last7 = allData.slice(-7);
    const w7 = last7.map((d) => d.kg);
    const avg7 = w7.reduce((a, b) => a + b, 0) / w7.length;
    const min7 = Math.min(...w7), max7 = Math.max(...w7);
    const W = 680, H = 272, PAD = { t: 20, r: 24, b: 56, l: 48 };
    const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
    const visWeights = data.map((d) => d.kg);
    const minW = visWeights.length ? Math.min(...visWeights) : 55;
    const maxW = visWeights.length ? Math.max(...visWeights) : 57;
    const yMin = Math.floor((minW - 0.3) * 2) / 2;
    const yMax = Math.ceil((maxW + 0.3) * 2) / 2;
    const yRange = yMax - yMin || 1;
    const yAt = (kg) => PAD.t + (1 - (kg - yMin) / yRange) * innerH;
    const sTs = dkTs(startDK), eTs = dkTs(endDK);
    const xSpan = eTs - sTs || 1;
    const xAt = (ts) => PAD.l + (ts - sTs) / xSpan * innerW;
    const yTicks = [];
    for (let v = yMin; v <= yMax; v += 0.5) yTicks.push(v);
    const xLabels = [];
    for (let dk = endDK; dkTs(dk) >= sTs; dk = shiftDate(dk, -7)) {
      const ts = dkTs(dk);
      const isToday = dk === todayDK;
      const [, lm, ld] = dk.split("-").map(Number);
      const lwd = W_WDAYS[new Date(dkTs(dk)).getDay()];
      xLabels.push({ ts, wd: lwd.toUpperCase(), dateStr: `${ld} ${W_MONTHS[lm - 1]}`, isToday });
    }
    let linePath = "";
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const x = xAt(d.ts).toFixed(1), y = yAt(d.kg).toFixed(1);
      if (i === 0) {
        linePath = `M${x},${y}`;
        continue;
      }
      const gap = d.ts - data[i - 1].ts;
      linePath += gap > 2 * W_DAY_MS ? ` M${x},${y}` : ` L${x},${y}`;
    }
    const trendReg = data.length >= 3 ? linReg(data.map((d) => [d.ts, d.kg])) : null;
    let trendPath = "";
    if (trendReg) {
      const tY1 = trendReg.slope * sTs + trendReg.intercept;
      const tY2 = trendReg.slope * eTs + trendReg.intercept;
      trendPath = `M${PAD.l},${yAt(tY1).toFixed(1)} L${(PAD.l + innerW).toFixed(1)},${yAt(tY2).toFixed(1)}`;
    }
    function onMove(e) {
      if (!svgRef.current || !data.length) return;
      const rect = svgRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width * W;
      let closest = 0, dist = Infinity;
      for (let i = 0; i < data.length; i++) {
        const d = Math.abs(xAt(data[i].ts) - relX);
        if (d < dist) {
          dist = d;
          closest = i;
        }
      }
      setHoverIdx(closest);
    }
    const hd = hoverIdx != null && data[hoverIdx] ? data[hoverIdx] : null;
    const chipPad = density === "compact" ? "10px 14px" : "14px 18px";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 18px", fontSize: 13, color: palette.muted, lineHeight: 1.5 } }, "B weighs herself every morning \u2014 after her morning poop and before any food or drinks \u2014 for the most consistent reading."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: 99,
      background: palette.muted2,
      color: palette.card,
      fontFamily: "'JetBrains Mono',monospace",
      flexShrink: 0
    } }, "Coming Soon"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: palette.muted } }, "Body fat % and muscle-mass tracking coming soon.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: `color-mix(in oklch, ${palette.line} 40%, ${palette.card})`,
      borderRadius: 14,
      padding: chipPad,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minHeight: 104
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: palette.muted,
      fontFamily: "'JetBrains Mono',monospace"
    } }, "Today"), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 28,
      fontWeight: 700,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      letterSpacing: -0.8,
      color: palette.ink,
      lineHeight: 1,
      marginTop: "auto"
    } }, latest.kg.toFixed(1), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: palette.muted, marginLeft: 3 } }, "kg")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted2, lineHeight: 1.4 } }, "at ", wFmtTimeAP(latest.time), latest.minAfterWake > 0 && latest.minAfterWake < 120 && ` \xB7 ${latest.minAfterWake}m after waking`)), /* @__PURE__ */ React.createElement("div", { style: {
      background: `color-mix(in oklch, ${palette.line} 40%, ${palette.card})`,
      borderRadius: 14,
      padding: chipPad,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minHeight: 104
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: palette.muted,
      fontFamily: "'JetBrains Mono',monospace"
    } }, "7-day range"), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 22,
      fontWeight: 700,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      letterSpacing: -0.6,
      color: palette.ink,
      lineHeight: 1,
      marginTop: "auto"
    } }, min7.toFixed(1), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 500, color: palette.muted, margin: "0 4px" } }, "\u2013"), max7.toFixed(1), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 500, color: palette.muted, marginLeft: 3 } }, "kg")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted2, lineHeight: 1.4 } }, "avg ", /* @__PURE__ */ React.createElement("strong", { style: { color: palette.ink } }, avg7.toFixed(2)), " kg")), /* @__PURE__ */ React.createElement("div", { style: {
      background: `color-mix(in oklch, ${palette.line} 40%, ${palette.card})`,
      borderRadius: 14,
      padding: chipPad,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minHeight: 104
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: palette.muted,
      fontFamily: "'JetBrains Mono',monospace"
    } }, "Sparkline"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "auto" } }, /* @__PURE__ */ React.createElement(Sparkline, { data: sparkData, width: 160, height: 34, color: palette.accent })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted2, lineHeight: 1.4 } }, "up to 3 months"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: palette.muted } }, "4-week view \xB7 hover any point for detail"), /* @__PURE__ */ React.createElement(
      WeightWeekNav,
      {
        startDK,
        endDK,
        onPrev: () => setEndDK((k) => shiftDate(k, -7)),
        onNext: () => setEndDK((k) => {
          const n = shiftDate(k, 7);
          return n > todayDK ? todayDK : n;
        }),
        canPrev,
        canNext,
        palette
      }
    )), /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: contRef,
        style: { position: "relative", width: "100%" },
        onMouseMove: onMove,
        onMouseLeave: () => setHoverIdx(null)
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          ref: svgRef,
          viewBox: `0 0 ${W} ${H}`,
          style: { width: "100%", height: "auto", display: "block", overflow: "visible" }
        },
        yTicks.map((v) => /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: PAD.l,
            x2: W - PAD.r,
            y1: yAt(v),
            y2: yAt(v),
            stroke: palette.line,
            strokeWidth: 0.5,
            strokeDasharray: "3 4"
          }
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: PAD.l - 8,
            y: yAt(v) + 4,
            textAnchor: "end",
            fontSize: "10",
            fill: palette.muted,
            fontFamily: "'JetBrains Mono',monospace"
          },
          v.toFixed(1)
        ))),
        xLabels.map((xl, i) => {
          const x = xAt(xl.ts);
          const anchor = x > W - PAD.r - 28 ? "end" : x < PAD.l + 28 ? "start" : "middle";
          return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: x,
              x2: x,
              y1: PAD.t,
              y2: H - PAD.b,
              stroke: palette.line,
              strokeWidth: 0.5,
              strokeDasharray: "2 6",
              opacity: 0.5
            }
          ), /* @__PURE__ */ React.createElement(
            "text",
            {
              x,
              y: H - PAD.b + 18,
              textAnchor: anchor,
              fontSize: "9.5",
              fontWeight: "700",
              fill: xl.isToday ? palette.accent : palette.muted,
              letterSpacing: "0.5",
              fontFamily: "'JetBrains Mono',monospace"
            },
            xl.wd
          ), /* @__PURE__ */ React.createElement(
            "text",
            {
              x,
              y: H - PAD.b + 32,
              textAnchor: anchor,
              fontSize: "11",
              fill: xl.isToday ? palette.ink : palette.muted,
              fontWeight: xl.isToday ? 700 : 500
            },
            xl.dateStr
          ), xl.isToday && /* @__PURE__ */ React.createElement(
            "text",
            {
              x,
              y: H - PAD.b + 45,
              textAnchor: anchor,
              fontSize: "8",
              fontWeight: "700",
              fill: palette.accent,
              letterSpacing: "0.8",
              fontFamily: "'JetBrains Mono',monospace"
            },
            "TODAY"
          ));
        }),
        trendPath && /* @__PURE__ */ React.createElement(
          "path",
          {
            d: trendPath,
            fill: "none",
            stroke: palette.muted2,
            strokeWidth: 1.5,
            strokeDasharray: "6 4",
            opacity: 0.6
          }
        ),
        linePath && /* @__PURE__ */ React.createElement(
          "path",
          {
            d: linePath,
            fill: "none",
            stroke: palette.accent,
            strokeWidth: 2.5,
            strokeLinejoin: "round",
            strokeLinecap: "round"
          }
        ),
        data.map((d, i) => /* @__PURE__ */ React.createElement(
          "circle",
          {
            key: i,
            cx: xAt(d.ts),
            cy: yAt(d.kg),
            r: hoverIdx === i ? 6 : 3.5,
            fill: hoverIdx === i ? palette.accent : palette.card,
            stroke: palette.accent,
            strokeWidth: hoverIdx === i ? 2.5 : 2,
            style: { transition: "r .1s, fill .1s", cursor: "pointer" }
          }
        )),
        hd && /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: xAt(hd.ts),
            x2: xAt(hd.ts),
            y1: PAD.t,
            y2: H - PAD.b,
            stroke: palette.accent,
            strokeWidth: 1,
            strokeDasharray: "4 3",
            opacity: 0.4
          }
        )
      ),
      hd && (() => {
        const svRect = svgRef.current?.getBoundingClientRect();
        const coRect = contRef.current?.getBoundingClientRect();
        if (!svRect || !coRect) return null;
        const sx = svRect.width / W;
        const px = xAt(hd.ts) * sx + (svRect.left - coRect.left);
        const py = yAt(hd.kg) * (svRect.height / H) + (svRect.top - coRect.top);
        const cw = coRect.width;
        const left = Math.max(10, Math.min(cw - 170, px - 80));
        return /* @__PURE__ */ React.createElement("div", { style: {
          position: "absolute",
          left,
          top: py - 14,
          transform: "translateY(-100%)",
          background: "white",
          padding: "10px 14px",
          borderRadius: 12,
          boxShadow: "0 8px 28px rgba(0,0,0,0.13),0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.06)",
          pointerEvents: "none",
          fontSize: 13,
          lineHeight: 1.5,
          zIndex: 50,
          minWidth: 140
        } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: palette.ink } }, hd.kg.toFixed(2), " kg"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted, fontFamily: "'JetBrains Mono',monospace" } }, hd.day, " ", hd.dayNum, " ", W_MONTHS[hd.mon]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted2, marginTop: 2 } }, "Weighed at ", wFmtTimeAP(hd.time), hd.minAfterWake > 0 && hd.minAfterWake < 120 && ` \xB7 ${hd.minAfterWake}m after waking`));
      })()
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 18,
      marginTop: 14,
      fontSize: 11,
      color: palette.muted2,
      fontFamily: "'JetBrains Mono',monospace",
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("span", null, "gaps in the line = days B didn't weigh in"), /* @__PURE__ */ React.createElement("span", null, "2+ weigh-ins in a day \u2192 earliest (morning) one shown")));
  }
  Object.assign(window, { WeightSection });
})();
(() => {
  // src/aligner-app-candy.jsx
  var ALIGNER_ENDPOINT_URL = "https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation/aligner";
  var WEIGHT_ENDPOINT_URL = "https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation/weight";
  var REFRESH_MS = 15 * 60 * 1e3;
  var { useState, useEffect, useMemo, useRef } = React;
  var HOUR_MS = 36e5;
  var DAY_MS = 864e5;
  var WARN_MS = 2 * HOUR_MS;
  var DEEP_MS = 6 * HOUR_MS;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function toLocal(ms) {
    const d = new Date(ms);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      dateKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    };
  }
  function localMidnight(dk) {
    const [y, m, d] = dk.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  function shiftDK(dk, days) {
    const [y, m, d] = dk.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }
  function dkRange(endDK, n) {
    const o = [];
    for (let i = n - 1; i >= 0; i--) o.push(shiftDK(endDK, -i));
    return o;
  }
  var pad2 = (n) => String(n).padStart(2, "0");
  function fmtTimeAP(h, m) {
    const ap = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${pad2(m)} ${ap}`;
  }
  function fmtDur(ms) {
    if (ms <= 0) return "0m";
    const tot = Math.round(ms / 6e4), h = Math.floor(tot / 60), m = tot % 60;
    if (!h) return `${m}m`;
    if (!m) return `${h}h`;
    return `${h}h ${m}m`;
  }
  function dkLabel(dk) {
    const [, m, d] = dk.split("-").map(Number);
    return `${d} ${MONTHS[m - 1]}`;
  }
  function dkWeekday(dk) {
    const [y, m, d] = dk.split("-").map(Number);
    return WEEKDAYS[new Date(y, m - 1, d).getDay()];
  }
  function processData(wearEvents, trayChanges) {
    const events = [...wearEvents].sort((a, b) => new Date(a.removed_at) - new Date(b.removed_at));
    const firstWornMs = trayChanges.length ? Math.min(...trayChanges.map((t) => new Date(t.started_at).getTime())) : null;
    return { events, firstWornMs };
  }
  function dayData(dk, events, firstWornMs, nowMs) {
    const dayStart = localMidnight(dk), dayEnd = localMidnight(shiftDK(dk, 1));
    if (dayStart >= nowMs) return { blocks: [{ startH: 0, endH: 24, state: "future" }], wearMs: 0, outMs: 0, trackMs: 0 };
    const effEnd = Math.min(dayEnd, nowMs), dayLen = dayEnd - dayStart;
    const trackStartMs = events.length ? new Date(events[0].removed_at).getTime() : null;
    const pts = /* @__PURE__ */ new Set([dayStart, effEnd]);
    if (trackStartMs != null && trackStartMs > dayStart && trackStartMs < effEnd) pts.add(trackStartMs);
    const ranges = [];
    for (const ev of events) {
      const remMs = new Date(ev.removed_at).getTime();
      const reinsMs = ev.reinserted_at ? new Date(ev.reinserted_at).getTime() : nowMs;
      const s = Math.max(remMs, dayStart), e = Math.min(reinsMs, effEnd);
      if (s < e) {
        ranges.push({ s, e, fullDur: reinsMs - remMs, ev });
        pts.add(s);
        pts.add(e);
      }
    }
    const sorted = [...pts].sort((a, b) => a - b);
    const blocks = [];
    let wearMs = 0, outMs = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const s = sorted[i], e = sorted[i + 1], mid = (s + e) / 2, dur = e - s;
      let state = "no_data", meta = null;
      if (trackStartMs != null && mid >= trackStartMs) {
        state = "in";
        wearMs += dur;
        for (const r of ranges) {
          if (mid >= r.s && mid < r.e) {
            state = r.fullDur >= WARN_MS ? "out_warn" : "out_ok";
            meta = r;
            wearMs -= dur;
            outMs += dur;
            break;
          }
        }
      }
      blocks.push({ startH: (s - dayStart) / dayLen * 24, endH: (e - dayStart) / dayLen * 24, state, meta, startMs: s, endMs: e });
    }
    if (effEnd < dayEnd) blocks.push({ startH: (effEnd - dayStart) / dayLen * 24, endH: 24, state: "future" });
    return { blocks, wearMs, outMs, trackMs: wearMs + outMs };
  }
  function currentStatus(events, firstWornMs, nowMs) {
    if (!firstWornMs || nowMs < firstWornMs) return { state: "not_started" };
    const last = [...events].sort((a, b) => new Date(b.removed_at) - new Date(a.removed_at))[0];
    if (!last) return { state: "in", sinceMs: firstWornMs };
    const remMs = new Date(last.removed_at).getTime();
    const reinsMs = last.reinserted_at ? new Date(last.reinserted_at).getTime() : null;
    if (!reinsMs) return { state: "out", sinceMs: remMs, ev: last };
    return { state: "in", sinceMs: reinsMs };
  }
  function traysAt(trayChanges, ms) {
    let upper = null, lower = null;
    for (const tc of trayChanges) {
      const s = new Date(tc.started_at).getTime(), e = tc.ended_at ? new Date(tc.ended_at).getTime() : Infinity;
      if (ms >= s && ms < e) {
        if (tc.arch === "upper") upper = tc.tray_number;
        if (tc.arch === "lower") lower = tc.tray_number;
      }
    }
    return { upper, lower };
  }
  function trayFromEvent(ev, trayChanges, fallbackMs) {
    let upper = ev?.upper_tray_number || null, lower = ev?.lower_tray_number || null;
    if ((!upper || !lower) && fallbackMs) {
      const l = traysAt(trayChanges, fallbackMs);
      if (!upper) upper = l.upper;
      if (!lower) lower = l.lower;
    }
    return { upper, lower };
  }
  function wearInPast24h(events, firstWornMs, nowMs) {
    const windowStart = nowMs - 24 * HOUR_MS;
    const effStart = firstWornMs ? Math.max(windowStart, firstWornMs) : windowStart;
    if (effStart >= nowMs) return 0;
    let outMs = 0;
    for (const ev of events) {
      const remMs = new Date(ev.removed_at).getTime();
      const reinsMs = ev.reinserted_at ? new Date(ev.reinserted_at).getTime() : nowMs;
      const s = Math.max(remMs, effStart), e = Math.min(reinsMs, nowMs);
      if (s < e) outMs += e - s;
    }
    return Math.min(Math.max(0, nowMs - effStart - outMs), 24 * HOUR_MS);
  }
  function actualInPeriod(mid, events, firstWornMs, nowMs) {
    let start = firstWornMs != null ? firstWornMs : 0;
    let end = nowMs;
    const sorted = events.slice().sort((a, b) => new Date(a.removed_at) - new Date(b.removed_at));
    for (const ev of sorted) {
      const remMs = new Date(ev.removed_at).getTime();
      const reinsMs = ev.reinserted_at ? new Date(ev.reinserted_at).getTime() : nowMs;
      if (remMs <= mid) {
        if (reinsMs <= mid) start = reinsMs;
      } else {
        end = remMs;
        break;
      }
    }
    return { start, end };
  }
  var PALETTES = {
    candy: {
      bg: "oklch(0.97 0.025 80)",
      card: "#ffffff",
      ink: "oklch(0.22 0.03 60)",
      muted: "oklch(0.55 0.03 60)",
      muted2: "oklch(0.72 0.02 70)",
      line: "oklch(0.92 0.02 70)",
      accent: "oklch(0.50 0.14 172)",
      wearing: "oklch(0.80 0.08 168)",
      // light green (<6h)
      wearingDeep: "oklch(0.55 0.16 168)",
      // deep green (>6h)
      out: "oklch(0.82 0.005 70)",
      outWarn: "oklch(0.63 0.19 26)",
      noData: "oklch(0.95 0.006 70)",
      bannerAccent: "oklch(0.55 0.18 22)"
    },
    earth: {
      bg: "oklch(0.96 0.02 75)",
      card: "#ffffff",
      ink: "oklch(0.24 0.03 50)",
      muted: "oklch(0.52 0.03 50)",
      muted2: "oklch(0.70 0.02 60)",
      line: "oklch(0.90 0.02 65)",
      accent: "oklch(0.48 0.13 172)",
      wearing: "oklch(0.78 0.07 162)",
      wearingDeep: "oklch(0.52 0.15 162)",
      out: "oklch(0.80 0.005 60)",
      outWarn: "oklch(0.59 0.18 28)",
      noData: "oklch(0.94 0.005 65)",
      bannerAccent: "oklch(0.50 0.14 35)"
    }
  };
  var SECTIONS = [
    { id: "section-weight", label: "Weight" },
    { id: "section-move", label: "Move" },
    { id: "section-invisalign", label: "Invisalign" }
  ];
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const frame = window.frameElement;
      if (frame && window.parent && window.parent !== window) {
        const pwin = window.parent;
        const pdoc = pwin.document;
        let chromeGap2 = 24;
        const seen = [];
        [".site-header", ".status-dashboard-nav-shell"].forEach((sel) => {
          const node = pdoc.querySelector(sel);
          if (!node || seen.indexOf(node) !== -1) return;
          seen.push(node);
          const pos = pwin.getComputedStyle(node).position;
          if (pos === "fixed" || pos === "sticky") chromeGap2 += node.getBoundingClientRect().height;
        });
        const frameTop = frame.getBoundingClientRect().top + (pwin.pageYOffset || pwin.scrollY || 0);
        const target = frameTop + el.getBoundingClientRect().top - chromeGap2;
        pwin.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
        return;
      }
    } catch (e) {
    }
    let chromeGap = 24;
    [".site-header", ".status-dashboard-nav-shell", ".status-dashboard-nav"].forEach((sel) => {
      const node = document.querySelector(sel);
      if (!node) return;
      const pos = getComputedStyle(node).position;
      if (pos === "fixed" || pos === "sticky") chromeGap += node.getBoundingClientRect().height;
    });
    const top = el.getBoundingClientRect().top + window.pageYOffset - chromeGap;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }
  function SectionPills({ activeId, palette }) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" } }, SECTIONS.map((s) => {
      const isActive = s.id === activeId;
      return /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => scrollToSection(s.id), style: {
        padding: "6px 16px",
        borderRadius: 99,
        border: `1px solid ${isActive ? palette.accent : palette.line}`,
        background: isActive ? `color-mix(in oklch, ${palette.accent} 12%, ${palette.card})` : palette.card,
        color: isActive ? palette.accent : palette.muted,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
        transition: "all .15s"
      } }, s.label);
    }));
  }
  function SectionArrows({ sectionId, palette }) {
    const idx = SECTIONS.findIndex((s) => s.id === sectionId);
    const above = SECTIONS.slice(0, idx);
    const below = SECTIONS.slice(idx + 1);
    const prev = idx > 0 ? SECTIONS[idx - 1] : null;
    const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
    const [tip, setTip] = useState(null);
    if (!prev && !next) return null;
    const btnStyle = {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: `1px solid ${palette.line}`,
      background: palette.card,
      color: palette.muted,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      fontFamily: "inherit",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "background .12s, color .12s, border-color .12s"
    };
    const tipStyle = {
      position: "absolute",
      right: 40,
      whiteSpace: "nowrap",
      background: palette.ink,
      color: palette.card,
      fontSize: 11,
      fontWeight: 600,
      padding: "6px 10px",
      borderRadius: 8,
      fontFamily: "'DM Sans',sans-serif",
      boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
      pointerEvents: "none"
    };
    return /* @__PURE__ */ React.createElement("div", { className: "section-arrows", style: {
      position: "absolute",
      right: -44,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      zIndex: 10
    } }, prev && /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => scrollToSection(prev.id),
        style: btnStyle,
        onMouseEnter: (e) => {
          e.currentTarget.style.color = palette.ink;
          e.currentTarget.style.borderColor = palette.accent;
          setTip("up");
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = palette.muted;
          e.currentTarget.style.borderColor = palette.line;
          setTip(null);
        }
      },
      "\u2191"
    ), tip === "up" && /* @__PURE__ */ React.createElement("div", { style: { ...tipStyle, top: "50%", transform: "translateY(-50%)" } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.6 } }, "Up to "), above.map((s) => s.label).join(" \xB7 "))), next && /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => scrollToSection(next.id),
        style: btnStyle,
        onMouseEnter: (e) => {
          e.currentTarget.style.color = palette.ink;
          e.currentTarget.style.borderColor = palette.accent;
          setTip("down");
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = palette.muted;
          e.currentTarget.style.borderColor = palette.line;
          setTip(null);
        }
      },
      "\u2193"
    ), tip === "down" && /* @__PURE__ */ React.createElement("div", { style: { ...tipStyle, top: "50%", transform: "translateY(-50%)" } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.6 } }, "Down to "), below.map((s) => s.label).join(" \xB7 "))));
  }
  function SectionWrapper({ sectionId, palette, showPills, children }) {
    return /* @__PURE__ */ React.createElement("div", null, showPills && /* @__PURE__ */ React.createElement(SectionPills, { activeId: sectionId, palette }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginTop: showPills ? 8 : 0 } }, children, /* @__PURE__ */ React.createElement(SectionArrows, { sectionId, palette })));
  }
  function WeekNav({ startDK, endDK, onPrev, onNext, canPrev, canNext, palette }) {
    const btn = (enabled) => ({
      width: 34,
      height: 34,
      borderRadius: 99,
      border: `1px solid ${enabled ? palette.line : "transparent"}`,
      background: enabled ? palette.card : "transparent",
      color: enabled ? palette.ink : palette.muted2,
      cursor: enabled ? "pointer" : "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      fontFamily: "inherit",
      flexShrink: 0
    });
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { style: btn(canPrev), onClick: canPrev ? onPrev : void 0 }, "\u2039"), /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      fontWeight: 600,
      color: palette.muted,
      minWidth: 140,
      textAlign: "center"
    } }, dkLabel(startDK), " \u2013 ", dkLabel(endDK)), /* @__PURE__ */ React.createElement("button", { style: btn(canNext), onClick: canNext ? onNext : void 0 }, "\u203A"));
  }
  function TimelineChart({ dks, events, firstWornMs, nowMs, trayChanges, palette }) {
    const [hover, setHover] = useState(null);
    const svgRef = useRef(null), contRef = useRef(null);
    const W = 700, H = 430, PAD = { t: 16, r: 28, b: 58, l: 52 };
    const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
    const colW = innerW / 7, barW = colW * 0.56;
    const yAt = (h) => PAD.t + h / 24 * innerH;
    const todayDK = toLocal(nowMs).dateKey;
    const nowLocal = toLocal(nowMs);
    const dataMap = useMemo(() => {
      const m = {};
      for (const dk of dks) m[dk] = dayData(dk, events, firstWornMs, nowMs);
      return m;
    }, [dks, events, firstWornMs, nowMs]);
    function onEnter(e, dayIdx, block) {
      if (!svgRef.current || !contRef.current) return;
      const sv = svgRef.current.getBoundingClientRect(), co = contRef.current.getBoundingClientRect();
      const sx = sv.width / W, sy = sv.height / H;
      setHover({
        block,
        px: (PAD.l + dayIdx * colW + colW / 2) * sx + (sv.left - co.left),
        py: (yAt(block.startH) + yAt(block.endH)) / 2 * sy + (sv.top - co.top)
      });
    }
    function blockColor(bl) {
      if (bl.state === "out_warn") return palette.outWarn;
      if (bl.state === "out_ok") return palette.out;
      if (bl.state === "in") {
        const mid = (bl.startMs + bl.endMs) / 2;
        const period = actualInPeriod(mid, events, firstWornMs, nowMs);
        return period.end - period.start >= DEEP_MS ? palette.wearingDeep : palette.wearing;
      }
      return "url(#awp-nodata)";
    }
    return /* @__PURE__ */ React.createElement("div", { ref: contRef, style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement("svg", { ref: svgRef, viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "auto", display: "block", overflow: "visible" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("pattern", { id: "awp-nodata", width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, /* @__PURE__ */ React.createElement("rect", { width: "6", height: "6", fill: palette.noData }), /* @__PURE__ */ React.createElement("rect", { width: "2.4", height: "6", fill: palette.muted2, opacity: "0.32" }))), [0, 6, 12, 18, 24].map(
      (h) => /* @__PURE__ */ React.createElement("g", { key: h }, /* @__PURE__ */ React.createElement(
        "line",
        {
          x1: PAD.l,
          x2: W - PAD.r,
          y1: yAt(h),
          y2: yAt(h),
          stroke: palette.line,
          strokeWidth: h === 0 || h === 24 ? 1 : 0.5,
          strokeDasharray: h === 0 || h === 24 ? "none" : "3 4"
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: PAD.l - 8,
          y: yAt(h) + 4,
          textAnchor: "end",
          fontSize: "10",
          fill: palette.muted,
          fontFamily: "'JetBrains Mono',monospace"
        },
        h === 0 ? "12 AM" : h === 6 ? "6 AM" : h === 12 ? "12 PM" : h === 18 ? "6 PM" : "12 AM"
      ))
    ), dks.map((dk, i) => {
      const dd = dataMap[dk], colX = PAD.l + i * colW + (colW - barW) / 2, isToday = dk === todayDK;
      return /* @__PURE__ */ React.createElement("g", { key: dk }, /* @__PURE__ */ React.createElement("rect", { x: colX, y: PAD.t, width: barW, height: innerH, fill: palette.noData, rx: 5, opacity: 0.55 }), dd.blocks.map((bl, j) => {
        if (bl.state === "future") return null;
        const y1 = yAt(bl.startH), y2 = yAt(bl.endH), bh = y2 - y1;
        if (bh < 0.5) return null;
        const isNoData = bl.state === "no_data";
        return /* @__PURE__ */ React.createElement(
          "rect",
          {
            key: j,
            x: colX,
            y: y1 + 0.75,
            width: barW,
            height: Math.max(bh - 1.5, 0.5),
            fill: blockColor(bl),
            rx: 3,
            style: { cursor: isNoData ? "default" : "pointer", pointerEvents: isNoData ? "none" : "auto" },
            onMouseEnter: isNoData ? void 0 : (e) => onEnter(e, i, bl),
            onMouseLeave: isNoData ? void 0 : () => setHover(null)
          }
        );
      }), isToday && (() => {
        const nY = yAt(nowLocal.hour + nowLocal.minute / 60);
        const nowLabel = fmtTimeAP(nowLocal.hour, nowLocal.minute);
        return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: colX - 2,
            x2: colX + barW + 2,
            y1: nY,
            y2: nY,
            stroke: palette.accent,
            strokeWidth: "1.5",
            strokeDasharray: "4 3",
            opacity: "0.9"
          }
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: colX + barW + 8,
            y: nY - 3,
            fontSize: "8",
            fontWeight: "700",
            fill: palette.accent,
            fontFamily: "'JetBrains Mono',monospace"
          },
          "Now"
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: colX + barW + 8,
            y: nY + 7,
            fontSize: "7.5",
            fontWeight: "600",
            fill: palette.muted,
            fontFamily: "'JetBrains Mono',monospace"
          },
          nowLabel
        ));
      })(), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: PAD.l + i * colW + colW / 2,
          y: H - PAD.b + 18,
          textAnchor: "middle",
          fontSize: "9.5",
          fontWeight: "700",
          fill: isToday ? palette.accent : palette.muted,
          letterSpacing: "0.5",
          fontFamily: "'JetBrains Mono',monospace"
        },
        dkWeekday(dk).toUpperCase()
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: PAD.l + i * colW + colW / 2,
          y: H - PAD.b + 34,
          textAnchor: "middle",
          fontSize: "12",
          fill: isToday ? palette.ink : palette.muted,
          fontWeight: isToday ? 700 : 500
        },
        dkLabel(dk)
      ), isToday && /* @__PURE__ */ React.createElement(
        "text",
        {
          x: PAD.l + i * colW + colW / 2,
          y: H - PAD.b + 48,
          textAnchor: "middle",
          fontSize: "8",
          fontWeight: "700",
          fill: palette.accent,
          letterSpacing: "0.8",
          fontFamily: "'JetBrains Mono',monospace"
        },
        "TODAY"
      ));
    })), hover && (() => {
      const bl = hover.block, isOut = bl.state !== "in", isWarn = bl.state === "out_warn";
      const mid = (bl.startMs + bl.endMs) / 2;
      let realStart, realEnd;
      if (isOut && bl.meta?.ev) {
        realStart = new Date(bl.meta.ev.removed_at).getTime();
        realEnd = bl.meta.ev.reinserted_at ? new Date(bl.meta.ev.reinserted_at).getTime() : nowMs;
      } else {
        const period = actualInPeriod(mid, events, firstWornMs, nowMs);
        realStart = period.start;
        realEnd = period.end;
      }
      const sS = toLocal(realStart), sE = toLocal(realEnd), dur = realEnd - realStart;
      const spansDays = toLocal(realStart).dateKey !== toLocal(realEnd).dateKey;
      const tray = isOut && bl.meta?.ev ? trayFromEvent(bl.meta.ev, trayChanges, mid) : traysAt(trayChanges, mid);
      const cw = contRef.current?.clientWidth || 600;
      const left = Math.max(10, Math.min(cw - 190, hover.px - 95));
      return /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        left,
        top: hover.py - 12,
        transform: "translateY(-100%)",
        background: "white",
        padding: "10px 14px",
        borderRadius: 12,
        boxShadow: "0 8px 28px rgba(0,0,0,0.13),0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.06)",
        pointerEvents: "none",
        fontSize: 13,
        lineHeight: 1.5,
        zIndex: 50,
        minWidth: 165
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: isOut ? isWarn ? palette.outWarn : palette.out : palette.wearingDeep,
        flexShrink: 0
      } }), bl.state === "in" ? "Aligners In" : isWarn ? "Aligners Out \u2014 over 2h" : "Aligners Out"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "oklch(0.55 0.03 60)" } }, fmtTimeAP(sS.hour, sS.minute), spansDays ? ` (${dkLabel(sS.dateKey)})` : "", " \u2013 ", fmtTimeAP(sE.hour, sE.minute), spansDays ? ` (${dkLabel(sE.dateKey)})` : "", /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, fontWeight: 600 } }, "\xB7 ", fmtDur(dur))), (tray.upper || tray.lower) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "oklch(0.55 0.03 60)", marginTop: 3 } }, tray.upper && /* @__PURE__ */ React.createElement("span", null, "Upper #", tray.upper), tray.upper && tray.lower && /* @__PURE__ */ React.createElement("span", null, " \xB7 "), tray.lower && /* @__PURE__ */ React.createElement("span", null, "Lower #", tray.lower)), isWarn && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.outWarn, fontWeight: 600, marginTop: 4 } }, "Exceeded 2h threshold"));
    })());
  }
  function ChartLegend({ palette }) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${palette.line}` } }, [
      { color: palette.wearingDeep, label: "Aligners In for over 6 hours +" },
      { color: palette.wearing, label: "Aligners In for under 6 hours" },
      { color: palette.out, label: "Aligners Out" },
      { color: palette.outWarn, label: "Aligners Out for over 2 hours" },
      { hatch: true, border: true, label: "No data" }
    ].map(
      (it) => /* @__PURE__ */ React.createElement("div", { key: it.label, style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        flexShrink: 0,
        background: it.hatch ? `repeating-linear-gradient(45deg, ${palette.noData} 0 2.5px, color-mix(in oklch, ${palette.muted2} 32%, ${palette.noData}) 2.5px 5px)` : it.color,
        border: it.border ? `1px solid ${palette.line}` : "none"
      } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: palette.muted } }, it.label))
    ));
  }
  function TrayColumn({ title, trays, nowMs, palette }) {
    if (!trays.length) return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: palette.muted,
      fontFamily: "'JetBrains Mono',monospace",
      marginBottom: 10
    } }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: palette.muted2, padding: "16px 0" } }, "No trays recorded"));
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: palette.muted,
      fontFamily: "'JetBrains Mono',monospace",
      marginBottom: 10
    } }, title), trays.map((t, i) => {
      const startMs = new Date(t.started_at).getTime(), endMs = t.ended_at ? new Date(t.ended_at).getTime() : nowMs;
      const daysWorn = Math.floor((endMs - startMs) / DAY_MS), isActive = !t.ended_at, sL = toLocal(startMs);
      return /* @__PURE__ */ React.createElement("div", { key: t.aligner_tray_change_id, style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: i < trays.length - 1 ? `1px solid ${palette.line}` : "none"
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        flexShrink: 0,
        background: `color-mix(in oklch,${isActive ? palette.wearingDeep : palette.muted2} 12%,${palette.card})`,
        border: `1.5px solid ${isActive ? palette.wearingDeep : palette.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Bricolage Grotesque',sans-serif",
        fontWeight: 700,
        fontSize: 14,
        color: isActive ? palette.wearingDeep : palette.muted
      } }, "#", t.tray_number), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 13, color: palette.ink } }, "Started ", sL.day, " ", MONTHS[sL.month]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted, marginTop: 1 } }, daysWorn, " day", daysWorn !== 1 ? "s" : "", " worn", t.planned_days ? ` \xB7 ${t.planned_days}d planned` : "")), /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 99,
        flexShrink: 0,
        background: `color-mix(in oklch,${isActive ? palette.wearingDeep : palette.muted2} 12%,${palette.card})`,
        color: isActive ? palette.wearingDeep : palette.muted,
        fontFamily: "'JetBrains Mono',monospace"
      } }, isActive ? "Active" : "Done"));
    }));
  }
  function WhyInfo({ palette, badge, question, border = true }) {
    return /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 20, borderTop: border ? `1px solid ${palette.line}` : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: 99,
      background: palette.muted2,
      color: palette.card,
      fontFamily: "'JetBrains Mono',monospace",
      flexShrink: 0
    } }, badge), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 600, color: palette.muted } }, question), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: palette.muted2, fontStyle: "italic" } }, "content coming soon")));
  }
  function WhyTwoHours({ palette }) {
    return /* @__PURE__ */ React.createElement(WhyInfo, { palette, badge: "WHY 2H?", question: "Why is two consecutive hours the threshold?" });
  }
  function WhySixHours({ palette }) {
    return /* @__PURE__ */ React.createElement(WhyInfo, { palette, badge: "WHY 6H?", question: "Why is six consecutive hours the deep-green threshold?", border: false });
  }
  function PlaceholderSection({ id, title, palette, density }) {
    return /* @__PURE__ */ React.createElement(SectionWrapper, { sectionId: id, palette }, /* @__PURE__ */ React.createElement("section", { id, style: {
      background: palette.card,
      border: `1px solid ${palette.line}`,
      borderRadius: 20,
      padding: density === "compact" ? "14px 18px" : "18px 24px"
    } }, /* @__PURE__ */ React.createElement("h2", { style: {
      margin: 0,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: -0.4,
      color: palette.ink
    } }, title), /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 0 28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: 99,
      background: `color-mix(in oklch, ${palette.muted2} 16%, ${palette.card})`,
      color: palette.muted2,
      fontFamily: "'JetBrains Mono',monospace"
    } }, "Coming Soon"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: palette.muted, marginTop: 4, maxWidth: 320, lineHeight: 1.5 } }, "Not available yet \u2014 this section is being built."))));
  }
  function App() {
    const nowMs = Date.now(), nowDK = toLocal(nowMs).dateKey;
    const [wearEvents, setWearEvents] = useState(window.ALIGNER_WEAR_EVENTS || []);
    const [trayChanges, setTrayChanges] = useState(window.ALIGNER_TRAY_CHANGES || []);
    const [weightRows, setWeightRows] = useState(window.WEIGHT_SAMPLE_DATA || []);
    const [loadState, setLoadState] = useState(ALIGNER_ENDPOINT_URL || WEIGHT_ENDPOINT_URL ? "loading" : "sample");
    const palette = PALETTES.candy;
    const density = "comfortable";
    const [endDK, setEndDK] = useState(nowDK);
    const startDK = shiftDK(endDK, -6), dks = dkRange(endDK, 7);
    const { events, firstWornMs } = useMemo(() => processData(wearEvents, trayChanges), [wearEvents, trayChanges]);
    const firstWornDK = firstWornMs ? toLocal(firstWornMs).dateKey : null;
    const canNext = endDK < nowDK;
    const canPrev = firstWornDK ? startDK > firstWornDK : false;
    useEffect(() => {
      if (!ALIGNER_ENDPOINT_URL && !WEIGHT_ENDPOINT_URL) return;
      let cancelled = false;
      async function load() {
        let anyOk = false, anyErr = false;
        if (ALIGNER_ENDPOINT_URL) {
          try {
            const r = await fetch(ALIGNER_ENDPOINT_URL);
            if (!r.ok) throw new Error("HTTP " + r.status);
            const json = await r.json();
            if (!cancelled) {
              setWearEvents(json.wear_events || json.wearEvents || []);
              setTrayChanges(json.tray_changes || json.trayChanges || []);
            }
            anyOk = true;
          } catch (err) {
            console.error("aligner fetch failed:", err);
            anyErr = true;
          }
        }
        if (WEIGHT_ENDPOINT_URL) {
          try {
            const r = await fetch(WEIGHT_ENDPOINT_URL);
            if (!r.ok) throw new Error("HTTP " + r.status);
            const json = await r.json();
            const wr = Array.isArray(json) ? json : json.data || json.weight || [];
            if (!cancelled) setWeightRows(wr);
            anyOk = true;
          } catch (err) {
            console.error("weight fetch failed:", err);
            anyErr = true;
          }
        }
        if (!cancelled) setLoadState(anyOk ? "live" : anyErr ? "error" : "sample");
      }
      load();
      const id = setInterval(load, REFRESH_MS);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }, []);
    const status = useMemo(() => currentStatus(events, firstWornMs, nowMs), [events, firstWornMs]);
    const tray = useMemo(() => traysAt(trayChanges, nowMs), [trayChanges]);
    const wear24 = useMemo(() => wearInPast24h(events, firstWornMs, nowMs), [events, firstWornMs]);
    const upperTrays = trayChanges.filter((t) => t.arch === "upper").sort((a, b) => Number(b.tray_number) - Number(a.tray_number));
    const lowerTrays = trayChanges.filter((t) => t.arch === "lower").sort((a, b) => Number(b.tray_number) - Number(a.tray_number));
    const isIn = status.state === "in", isOut = status.state === "out";
    const dur = status.sinceMs ? Date.now() - status.sinceMs : 0;
    const overLimit = isOut && dur >= WARN_MS;
    const dotColor = isIn ? palette.wearingDeep : overLimit ? palette.outWarn : palette.out;
    const sp = density === "compact" ? 18 : 28, sg = density === "compact" ? 14 : 20;
    const pad = density === "compact" ? "14px 18px" : "22px 28px";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { background: palette.bg, minHeight: 0, color: palette.ink } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 980, margin: "0 auto", padding: sp, display: "flex", flexDirection: "column", gap: sg } }, /* @__PURE__ */ React.createElement(SectionWrapper, { sectionId: "section-weight", palette, showPills: true }, /* @__PURE__ */ React.createElement("section", { id: "section-weight", style: {
      background: palette.card,
      border: `1px solid ${palette.line}`,
      borderRadius: 20,
      padding: density === "compact" ? "14px 18px" : "18px 24px"
    } }, /* @__PURE__ */ React.createElement("h2", { style: {
      margin: "0 0 4px",
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: -0.4,
      color: palette.ink
    } }, "Weight"), /* @__PURE__ */ React.createElement(window.WeightSection, { palette, density, rows: weightRows }))), /* @__PURE__ */ React.createElement(PlaceholderSection, { id: "section-move", title: "Move", palette, density }), /* @__PURE__ */ React.createElement(SectionWrapper, { sectionId: "section-invisalign", palette }, /* @__PURE__ */ React.createElement("section", { id: "section-invisalign", style: {
      background: palette.card,
      border: `1px solid ${palette.line}`,
      borderRadius: 24,
      padding: pad,
      display: "flex",
      flexDirection: "column"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 220 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 40, height: 40, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "pulse-ring", style: { position: "absolute", inset: 0, borderRadius: 99, background: dotColor, opacity: 0.18 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: 99, background: dotColor } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: dotColor,
      fontFamily: "'JetBrains Mono',monospace",
      marginBottom: 4
    } }, isIn ? "Aligners In" : isOut ? "Aligners Out" : "Not yet tracking"), isIn && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, color: palette.muted } }, "Worn for ", /* @__PURE__ */ React.createElement("strong", { style: { color: palette.ink, fontSize: 18 } }, fmtDur(wear24)), " in the past 24 hours"), isOut && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, color: palette.muted } }, "Out for ", /* @__PURE__ */ React.createElement("strong", { style: { color: overLimit ? palette.outWarn : palette.ink, fontSize: 18 } }, fmtDur(dur)), overLimit && /* @__PURE__ */ React.createElement("span", { style: { color: palette.outWarn, fontWeight: 600, marginLeft: 8 } }, "over 2h")))), (tray.upper || tray.lower) && /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 0.8,
      color: palette.muted,
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono',monospace",
      marginBottom: 6
    } }, "Current trays"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, tray.upper && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: palette.muted, fontFamily: "'JetBrains Mono',monospace", minWidth: 48 } }, "Upper"), /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 24,
      fontWeight: 700,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      letterSpacing: -0.8,
      lineHeight: 1,
      color: palette.ink
    } }, "#", tray.upper)), tray.lower && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: palette.muted, fontFamily: "'JetBrains Mono',monospace", minWidth: 48 } }, "Lower"), /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 24,
      fontWeight: 700,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      letterSpacing: -0.8,
      lineHeight: 1,
      color: palette.ink
    } }, "#", tray.lower))))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${palette.line}`, margin: "20px 0" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
      gap: 12,
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: -0.4 } }, "Aligner Wear Tracking"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: palette.muted, marginTop: 2 } }, "24-hour view per day \xB7 hover any block for detail")), /* @__PURE__ */ React.createElement(
      WeekNav,
      {
        startDK,
        endDK,
        onPrev: () => setEndDK((k) => shiftDK(k, -1)),
        onNext: () => setEndDK((k) => shiftDK(k, 1)),
        canPrev,
        canNext,
        palette
      }
    )), /* @__PURE__ */ React.createElement(
      TimelineChart,
      {
        dks,
        events,
        firstWornMs,
        nowMs,
        trayChanges,
        palette
      }
    ), /* @__PURE__ */ React.createElement(ChartLegend, { palette })), trayChanges.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${palette.line}`, margin: "20px 0" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: {
      margin: 0,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: -0.4,
      marginBottom: 4
    } }, "Tray history"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: palette.muted, marginBottom: 14 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 } }, /* @__PURE__ */ React.createElement(TrayColumn, { title: "Upper", trays: upperTrays, nowMs, palette }), /* @__PURE__ */ React.createElement(TrayColumn, { title: "Lower", trays: lowerTrays, nowMs, palette })))), /* @__PURE__ */ React.createElement(WhyTwoHours, { palette }), /* @__PURE__ */ React.createElement(WhySixHours, { palette }))), /* @__PURE__ */ React.createElement("footer", { style: {
      textAlign: "center",
      color: palette.muted2,
      fontSize: 11,
      paddingTop: 4,
      fontFamily: "'JetBrains Mono',monospace"
    } }, "data via Cloud SQL \xB7 15-minute delay, by design"))));
  }
  (window.AWP_WIDGETS = window.AWP_WIDGETS || {}).body = function(__el) {
    ReactDOM.createRoot(__el).render(/* @__PURE__ */ React.createElement(App, null));
  };
})();
