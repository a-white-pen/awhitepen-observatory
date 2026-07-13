(() => {
  // spend-src/mod_0.js
  function snum(v) {
    if (v === null || v === void 0 || v === "") return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  var s$ = (n) => "S$" + snum(n).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var s$0 = (n) => "S$" + Math.round(snum(n)).toLocaleString();
  var money = (n) => "$" + snum(n).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var money0 = (n) => "$" + Math.round(snum(n)).toLocaleString();
  var pct = (n) => Math.round(n) + "%";
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var CATEGORIES = {
    meals: { label: "Meals", sub: "solo & everyday eating", color: "oklch(0.70 0.17 28)", bucket: "everyday" },
    dining: { label: "Dining & social", sub: "eating out with people", color: "oklch(0.78 0.14 70)", bucket: "everyday" },
    groceries: { label: "Groceries", sub: "supermarket & 7-Eleven", color: "oklch(0.68 0.14 145)", bucket: "everyday" },
    transport: { label: "Transport", sub: "MRT, Grab, rail", color: "oklch(0.70 0.12 230)", bucket: "everyday" },
    utilities: { label: "Utilities", sub: "water, power, phone data", color: "oklch(0.62 0.14 295)", bucket: "everyday" },
    others: { label: "Others", sub: "laundry, haircut, misc", color: "oklch(0.65 0.03 65)", bucket: "everyday" },
    subscriptions: { label: "Recurring", sub: "subs, phone & instalments", color: "oklch(0.64 0.13 335)", bucket: "fixed" },
    insurance: { label: "Insurance", sub: "monthly premium", color: "oklch(0.58 0.07 250)", bucket: "fixed" },
    rent: { label: "Rent", sub: "housing & common fees", color: "oklch(0.46 0.04 240)", bucket: "fixed" },
    installment: { label: "Instalment", sub: "big-ticket buys, monthly", color: "oklch(0.55 0.10 200)", bucket: "fixed" },
    travel: { label: "Travel", sub: "one-off trips", color: "oklch(0.67 0.17 50)", bucket: "oneoff" },
    oneoff: { label: "One-off", sub: "non-daily & not-mine", color: "oklch(0.62 0.11 15)", bucket: "oneoff" }
  };
  var CATEGORY_ORDER = ["meals", "dining", "groceries", "transport", "utilities", "others", "subscriptions", "insurance", "rent", "installment", "travel", "oneoff"];
  var RAW_TO_CAT = {
    food: "meals",
    meals: "meals",
    delivery: "meals",
    takeaway: "meals",
    dining: "dining",
    social: "dining",
    restaurant: "dining",
    groceries: "groceries",
    grocery: "groceries",
    transport: "transport",
    transit: "transport",
    utilities: "utilities",
    utility: "utilities",
    phone: "utilities",
    internet: "utilities",
    home: "others",
    household: "others",
    misc: "others",
    other: "others",
    others: "others",
    subscription: "subscriptions",
    subscriptions: "subscriptions",
    insurance: "insurance",
    rent: "rent",
    housing: "rent",
    installment: "installment",
    instalment: "installment",
    travel: "travel",
    trip: "travel",
    vacation: "travel",
    "one-off": "oneoff",
    oneoff: "oneoff"
  };
  function catKeyFromRaw(raw) {
    const k = (raw || "").toString().trim().toLowerCase();
    return RAW_TO_CAT[k] || "others";
  }
  function cleanMerchant(s) {
    if (!s) return "\u2014";
    let m = s.toString().trim();
    m = m.split(" - ")[0];
    m = m.split(/\s[\(（]/)[0];
    return m.trim() || s.toString().trim();
  }
  var FX_LABELS = {
    actual_youtrip: { short: "card", long: "multi-currency card (YouTrip)" },
    actual_dbs: { short: "card", long: "bank card (DBS)" },
    actual_hsbc: { short: "card", long: "bank card (HSBC)" },
    actual_trust: { short: "card", long: "bank card (Trust)" },
    actual_ocbc: { short: "bank", long: "PromptPay / DuitNow (OCBC)" },
    actual_superrich_fifo: { short: "cash\xB7FIFO", long: "cash, money-changer rate (FIFO)" },
    fixed_config: { short: "fixed", long: "fixed monthly cost (config)" }
  };
  function fxLabel(src) {
    if (FX_LABELS[src]) return FX_LABELS[src];
    if (/cash|superrich|fifo/i.test(src)) return { short: "cash\xB7FIFO", long: "cash, money-changer rate (FIFO)" };
    if (/promptpay|duitnow|ocbc/i.test(src)) return { short: "bank", long: "bank transfer rate" };
    if (/card|youtrip|dbs|hsbc|trust|visa|master/i.test(src)) return { short: "card", long: "card rate" };
    return { short: "", long: "" };
  }
  function itemsText(items) {
    if (items == null) return "";
    if (Array.isArray(items)) {
      return items.map((it) => it && typeof it === "object" ? it.name || it.item || it.label || it.title || "" : String(it)).map((s) => s.toString().trim()).filter(Boolean).join(", ");
    }
    return items.toString().trim();
  }
  function normalizeSpendRows(rows) {
    const entries = (rows || []).map((r, i) => {
      const ts = r.spent_at || r.created_at || r.timestamp;
      const d = ts ? new Date(ts) : /* @__PURE__ */ new Date();
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const da = String(d.getDate()).padStart(2, "0");
      const catKey = catKeyFromRaw(r.category);
      const cat = CATEGORIES[catKey];
      return {
        id: r.spend_entry_id || r.id || "row" + i,
        ts: +d,
        date: `${y}-${mo}-${da}`,
        monthKey: `${y}-${mo}`,
        dayNum: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        merchant: cleanMerchant(r.merchant_name_raw),
        desc: itemsText(r.items) || (r.notes || "").toString().trim(),
        platform: (r.platform || "").toString().trim(),
        catKey,
        bucket: cat.bucket,
        sgd: snum(r.sgd_amount),
        fx: fxLabel(r.fx_rate_source || r.payment_method || ""),
        payment: (r.payment_method || "").toString().trim(),
        isFixed: false
      };
    }).filter((e) => e.sgd > 0 || e.desc);
    entries.sort((a, b) => a.ts - b.ts);
    return entries;
  }
  function synthFixedEntries(monthKey) {
    if (!window.resolveFixedFor) return [];
    const fixed = window.resolveFixedFor(monthKey);
    const [y, m] = monthKey.split("-").map(Number);
    const d = new Date(y, m - 1, 1, 0, 5, 0);
    const ts = +d;
    const SUB_TO_CAT = {
      rent: "rent",
      subscriptions: "subscriptions",
      insurance: "insurance"
    };
    return fixed.map((f, i) => {
      const catKey = SUB_TO_CAT[f.subBucket] || "others";
      const cat = CATEGORIES[catKey];
      const payTag = f.paymentNo ? ` \xB7 payment ${f.paymentNo} of ${f.paymentTotal}` : "";
      return {
        id: `fix-${monthKey}-${f.id}`,
        ts: ts + i,
        date: `${y}-${String(m).padStart(2, "0")}-01`,
        monthKey,
        dayNum: 1,
        weekday: WEEKDAYS[d.getDay()],
        merchant: f.name,
        desc: f.subLabel + payTag,
        platform: "",
        catKey,
        bucket: "fixed",
        sgd: f.sgd,
        fx: { short: "fixed", long: "fixed monthly cost (config)" },
        payment: "fixed_config",
        isFixed: true
      };
    });
  }
  function mergeWithFixed(rawEntries) {
    const months = new Set(rawEntries.map((e) => e.monthKey));
    const now = /* @__PURE__ */ new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    const fixed = [];
    for (const mk of months) fixed.push(...synthFixedEntries(mk));
    const out = rawEntries.concat(fixed);
    out.sort((a, b) => a.ts - b.ts);
    return out;
  }
  function monthsIn(entries) {
    const set = new Set(entries.map((e) => e.monthKey));
    return [...set].sort();
  }
  function monthLabel(key) {
    const [y, m] = key.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  }
  function monthShort(key) {
    const [y, m] = key.split("-").map(Number);
    return `${MON_ABBR[m - 1]} '${String(y).slice(-2)}`;
  }
  function shiftMonth(key, delta) {
    let [y, m] = key.split("-").map(Number);
    m += delta;
    while (m < 1) {
      m += 12;
      y -= 1;
    }
    while (m > 12) {
      m -= 12;
      y += 1;
    }
    return `${y}-${String(m).padStart(2, "0")}`;
  }
  function bucketTotals(entries) {
    const t = { everyday: 0, fixed: 0, oneoff: 0, all: 0 };
    for (const e of entries) {
      t[e.bucket] += e.sgd;
      t.all += e.sgd;
    }
    return t;
  }
  function categoryTotals(entries, buckets) {
    const want = new Set(buckets);
    const map = /* @__PURE__ */ new Map();
    for (const e of entries) {
      if (!want.has(e.bucket)) continue;
      map.set(e.catKey, (map.get(e.catKey) || 0) + e.sgd);
    }
    const total = [...map.values()].reduce((a, b) => a + b, 0);
    return CATEGORY_ORDER.filter((k) => map.has(k)).map((k) => ({ key: k, ...CATEGORIES[k], value: map.get(k), pct: total ? map.get(k) / total * 100 : 0 })).sort((a, b) => b.value - a.value);
  }
  function subGroupForCategory(catKey, entries) {
    const items = entries.filter((e) => e.catKey === catKey);
    const total = items.reduce((a, e) => a + e.sgd, 0);
    const groups = /* @__PURE__ */ new Map();
    const add = (label, sgd) => groups.set(label, (groups.get(label) || 0) + sgd);
    if (catKey === "meals") {
      for (const e of items) {
        const p = e.platform.toLowerCase();
        if (p.includes("line")) add("LINE MAN", e.sgd);
        else if (p.includes("grab")) add("GrabFood", e.sgd);
        else if (p.includes("foodpanda") || p.includes("panda")) add("foodpanda", e.sgd);
        else if (p.includes("shopee")) add("ShopeeFood", e.sgd);
        else add("Other restaurants", e.sgd);
      }
    } else if (catKey === "transport") {
      for (const e of items) {
        const m = (e.merchant + " " + e.desc).toLowerCase();
        if (/mrt|bts|airport rail|bus|smrt|sbs|transitlink|ezlink|rabbit/.test(m)) add("Public transport", e.sgd);
        else if (/grab|bolt|taxi|gojek|cabb|comfort/.test(m)) add("Ride-hailing & taxi", e.sgd);
        else add("Other transport", e.sgd);
      }
    } else if (catKey === "groceries" || catKey === "dining" || catKey === "others") {
      for (const e of items) add(e.merchant, e.sgd);
    } else if (catKey === "utilities") {
      for (const e of items) {
        const m = (e.merchant + " " + e.desc).toLowerCase();
        if (/water|ro |reverse osmos/.test(m)) add("Water", e.sgd);
        else if (/dtac|ais|true|mobile|sim|data|phone/.test(m)) add("Phone & data", e.sgd);
        else if (/electric|power|mea|sp group|sp services/.test(m)) add("Electricity", e.sgd);
        else add(e.merchant, e.sgd);
      }
    } else if (catKey === "subscriptions" || catKey === "rent" || catKey === "installment" || catKey === "insurance") {
      for (const e of items) add(e.merchant, e.sgd);
    } else {
      for (const e of items) add(e.merchant, e.sgd);
    }
    return [...groups.entries()].map(([label, sgd]) => ({ label, sgd, pct: total ? sgd / total * 100 : 0 })).sort((a, b) => b.sgd - a.sgd);
  }
  function groupByDay(entries, newestFirst) {
    const byDate = /* @__PURE__ */ new Map();
    for (const e of entries) {
      if (!byDate.has(e.date)) byDate.set(e.date, []);
      byDate.get(e.date).push(e);
    }
    let days = [...byDate.entries()].map(([date, items]) => {
      const d = /* @__PURE__ */ new Date(date + "T00:00:00");
      return {
        date,
        dayNum: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        monAbbr: MON_ABBR[d.getMonth()],
        total: items.reduce((a, b) => a + b.sgd, 0),
        everyday: items.reduce((a, b) => a + (b.bucket === "everyday" ? b.sgd : 0), 0),
        items: items.slice().sort((a, b) => b.ts - a.ts)
      };
    });
    days.sort((a, b) => newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return days;
  }
  Object.assign(window, {
    snum,
    s$,
    s$0,
    money,
    money0,
    pct,
    MONTHS,
    MON_ABBR,
    WEEKDAYS,
    CATEGORIES,
    CATEGORY_ORDER,
    catKeyFromRaw,
    cleanMerchant,
    FX_LABELS,
    fxLabel,
    normalizeSpendRows,
    synthFixedEntries,
    mergeWithFixed,
    monthsIn,
    monthLabel,
    monthShort,
    shiftMonth,
    bucketTotals,
    categoryTotals,
    subGroupForCategory,
    groupByDay
  });
})();
(() => {
  // spend-src/mod_2.js
  window.SPEND_FIXED_CONFIG = {
    // Recurring forever (until edited).
    rent: {
      label: "Rent",
      items: [
        { id: "rent-main", name: "Housing & common fees", sgd: 350, start: "2024-01" }
      ]
    },
    // Recurring — subscriptions + phone bill + instalments, grouped together.
    subscriptions: {
      label: "Recurring",
      items: [
        { id: "sub-chatgpt", name: "ChatGPT Plus", type: "Subscriptions", sgd: 29, start: "2023-06" },
        { id: "sub-claude", name: "Claude Pro", type: "Subscriptions", sgd: 30, start: "2024-03" },
        { id: "sub-workspace", name: "Google Workspace", type: "Subscriptions", sgd: 12.5, start: "2022-01" },
        { id: "sub-icloud", name: "iCloud+", type: "Subscriptions", sgd: 14, start: "2022-01" },
        { id: "phone", name: "Mobile phone bill", type: "Phone bill", sgd: 12, start: "2024-01" },
        // MacBook Air — 24 payments × S$50 starting Sep 2025.
        { id: "macbook-air", name: "MacBook Air", type: "Instalments", sgd: 50, start: "2025-09", monthsToRun: 24 }
      ]
    },
    // Cash premiums only (excludes CPF-paid components). Estimated, not yet fully
    // reconciled. B also holds paid-up whole-life (finished in 5 years in her youth)
    // that isn't a recurring cost, so it's not listed here.
    insurance: {
      label: "Insurance",
      items: [
        { id: "ins-headstart", name: "Headstart", type: "Savings", sgd: 50, start: "2020-01" },
        { id: "ins-careshield", name: "CareShield Top-Up", type: "Long-term care / disability", sgd: 18, start: "2020-01" },
        { id: "ins-hospital", name: "Integrated Shield (IP)", type: "Hospitalisation", sgd: 48, start: "2020-01" },
        { id: "ins-fwd", name: "FWD", type: "Whole life", sgd: 74, start: "2020-01" },
        { id: "ins-ge", name: "GE", type: "Whole life", sgd: 6, start: "2020-01" },
        { id: "ins-ntuc", name: "Income", type: "Whole life", sgd: 46, start: "2020-01" },
        { id: "ins-msig", name: "MSIG", type: "Travel", sgd: 26, start: "2020-01" }
      ]
    }
  };
  function isFixedActive(item, monthKey) {
    if (!item.start) return true;
    if (monthKey < item.start) return false;
    if (!item.monthsToRun) return true;
    const [sy, sm] = item.start.split("-").map(Number);
    const [my, mm] = monthKey.split("-").map(Number);
    const idx = (my - sy) * 12 + (mm - sm);
    return idx >= 0 && idx < item.monthsToRun;
  }
  function fixedPaymentNumber(item, monthKey) {
    if (!item.monthsToRun || !item.start) return null;
    const [sy, sm] = item.start.split("-").map(Number);
    const [my, mm] = monthKey.split("-").map(Number);
    const idx = (my - sy) * 12 + (mm - sm);
    if (idx < 0 || idx >= item.monthsToRun) return null;
    return { current: idx + 1, total: item.monthsToRun };
  }
  function resolveFixedFor(monthKey) {
    const out = [];
    const groups = ["rent", "subscriptions", "insurance"];
    for (const g of groups) {
      const def = window.SPEND_FIXED_CONFIG[g];
      if (!def) continue;
      for (const it of def.items) {
        if (!isFixedActive(it, monthKey)) continue;
        const pay = fixedPaymentNumber(it, monthKey);
        out.push({
          subBucket: g,
          subLabel: def.label,
          id: it.id,
          name: it.name,
          type: it.type || null,
          sgd: it.sgd,
          paymentNo: pay ? pay.current : null,
          paymentTotal: pay ? pay.total : null
        });
      }
    }
    return out;
  }
  Object.assign(window, { isFixedActive, fixedPaymentNumber, resolveFixedFor });
})();
(() => {
  // spend-src/mod_3.js
  window.SPEND_SAMPLE_ROWS = [
    // ─── MAY 2026 — everyday ─────────────────────────────────────────
    // Rent / insurance / subscriptions / installments are generated dynamically
    // from spend-fixed-config.js — keep them OUT of the raw rows.
    { spend_entry_id: "m10", spent_at: "2026-05-02T05:20:00Z", merchant_name_raw: "Grain", platform: "LINE MAN", category: "food", notes: "Hokkaido spiced chicken salad + Moroccan rice", sgd_amount: "13.66", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m11", spent_at: "2026-05-02T11:40:00Z", merchant_name_raw: "7-Eleven", platform: "", category: "groceries", notes: "Pocari Sweat 500ml + banana x2 + chocolate milk", sgd_amount: "2.86", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m12", spent_at: "2026-05-03T06:10:00Z", merchant_name_raw: "MRT", platform: "", category: "transport", notes: "MRT to Asok and back", sgd_amount: "1.84", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "m13", spent_at: "2026-05-04T12:30:00Z", merchant_name_raw: "Barney's Burger", platform: "GrabFood", category: "food", notes: "Trucker Double and fries", sgd_amount: "18.01", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m14", spent_at: "2026-05-05T13:00:00Z", merchant_name_raw: "NanXiang Restaurant", platform: "", category: "dining", notes: "Dinner with Pim \u2014 xiaolongbao set, cucumber salad, scallion noodles", sgd_amount: "22.02", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m15", spent_at: "2026-05-06T03:45:00Z", merchant_name_raw: "dtac", platform: "", category: "utilities", notes: "100GB for 30 days at max speed", sgd_amount: "19.72", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "m16", spent_at: "2026-05-07T07:15:00Z", merchant_name_raw: "Laundry Shop", platform: "", category: "home", notes: "Regular laundry \u2014 washer & dryer", sgd_amount: "5.10", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m17", spent_at: "2026-05-08T05:30:00Z", merchant_name_raw: "FitFish", platform: "LINE MAN", category: "food", notes: "Healthy grill set + coupon", sgd_amount: "17.08", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m18", spent_at: "2026-05-09T09:00:00Z", merchant_name_raw: "Grab", platform: "Grab", category: "transport", notes: "Grab to Thonglor", sgd_amount: "4.35", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m19", spent_at: "2026-05-10T14:10:00Z", merchant_name_raw: "Teppen Izakaya", platform: "", category: "dining", notes: "Drinks & yakitori with the climbing crew", sgd_amount: "31.40", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m20", spent_at: "2026-05-11T02:30:00Z", merchant_name_raw: "Tops Supermarket", platform: "", category: "groceries", notes: "Eggs, greek yogurt, oats, fruit", sgd_amount: "16.74", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "m21", spent_at: "2026-05-12T06:00:00Z", merchant_name_raw: "KinHealthy", platform: "GrabFood", category: "food", notes: "Stewed eggs & chicken in sweet brown sauce", sgd_amount: "10.86", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m22", spent_at: "2026-05-13T08:20:00Z", merchant_name_raw: "Massage Shop", platform: "", category: "home", notes: "Thai massage, 2 hours", sgd_amount: "16.70", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m23", spent_at: "2026-05-14T04:00:00Z", merchant_name_raw: "Water Machine", platform: "", category: "utilities", notes: "6L reverse-osmosis water top-up", sgd_amount: "0.20", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m24", spent_at: "2026-05-15T10:30:00Z", merchant_name_raw: "Shopee", platform: "Shopee", category: "home", notes: "T-shirt for Pride", sgd_amount: "6.41", fx_rate_source: "actual_dbs", payment_method: "card_dbs" },
    { spend_entry_id: "m25", spent_at: "2026-05-16T05:50:00Z", merchant_name_raw: "CoCo Ichibanya", platform: "", category: "food", notes: "Pork katsu with omelette", sgd_amount: "10.69", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m26", spent_at: "2026-05-17T11:00:00Z", merchant_name_raw: "Saeng Chai Pochana", platform: "", category: "dining", notes: "Late supper with Marcus \u2014 crab omelette, morning glory", sgd_amount: "27.85", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m27", spent_at: "2026-05-18T06:30:00Z", merchant_name_raw: "Airport Rail", platform: "", category: "transport", notes: "Makkasan \u2194 Suvarnabhumi", sgd_amount: "2.74", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "m28", spent_at: "2026-05-19T07:40:00Z", merchant_name_raw: "Grain", platform: "LINE MAN", category: "food", notes: "Lunch bowl + delivery", sgd_amount: "13.01", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m29", spent_at: "2026-05-20T03:00:00Z", merchant_name_raw: "7-Eleven", platform: "", category: "groceries", notes: "2x 6L Nestle drinking water", sgd_amount: "3.38", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m30", spent_at: "2026-05-21T12:50:00Z", merchant_name_raw: "Barney's Burger", platform: "GrabFood", category: "food", notes: "Cheeseburger & onion rings", sgd_amount: "15.20", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m31", spent_at: "2026-05-22T09:30:00Z", merchant_name_raw: "Smart Wash 24", platform: "", category: "home", notes: "Dryer use for bedsheets", sgd_amount: "2.02", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "m32", spent_at: "2026-05-23T13:30:00Z", merchant_name_raw: "Bottega Milano", platform: "", category: "dining", notes: "Birthday dinner for Jane \u2014 shared pasta, wine", sgd_amount: "44.60", fx_rate_source: "actual_dbs", payment_method: "card_dbs" },
    { spend_entry_id: "m33", spent_at: "2026-05-24T06:10:00Z", merchant_name_raw: "Grab", platform: "Grab", category: "transport", notes: "Grab home after dinner", sgd_amount: "5.10", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m34", spent_at: "2026-05-25T05:20:00Z", merchant_name_raw: "Grain", platform: "LINE MAN", category: "food", notes: "Chicken panang with almond milk", sgd_amount: "10.86", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m35", spent_at: "2026-05-26T08:00:00Z", merchant_name_raw: "7-Eleven", platform: "", category: "groceries", notes: "Cut guava + banana", sgd_amount: "1.33", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m36", spent_at: "2026-05-27T04:30:00Z", merchant_name_raw: "RO Water Vending Machine", platform: "", category: "utilities", notes: "2x 6L RO water refill", sgd_amount: "0.40", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m37", spent_at: "2026-05-28T10:00:00Z", merchant_name_raw: "Monthong Durian", platform: "GrabFood", category: "food", notes: "400g Monthong durian", sgd_amount: "11.79", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m38", spent_at: "2026-05-29T07:10:00Z", merchant_name_raw: "Laundry Shop", platform: "", category: "home", notes: "Regular laundry \u2014 small load", sgd_amount: "2.35", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "m39", spent_at: "2026-05-30T11:20:00Z", merchant_name_raw: "CoCo Ichibanya", platform: "", category: "food", notes: "Curry rice dinner", sgd_amount: "9.40", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "m40", spent_at: "2026-05-31T12:00:00Z", merchant_name_raw: "Som Tam Nua", platform: "", category: "dining", notes: "Sunday lunch with the gym group", sgd_amount: "18.30", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    // ─── MAY 2026 — one-off / travel (excluded from day-to-day) ──────
    { spend_entry_id: "m50", spent_at: "2026-05-16T22:00:00Z", merchant_name_raw: "AirAsia", platform: "", category: "travel", notes: "Weekend flight BKK \u2194 Chiang Mai", sgd_amount: "96.40", fx_rate_source: "actual_dbs", payment_method: "card_dbs" },
    { spend_entry_id: "m51", spent_at: "2026-05-17T03:00:00Z", merchant_name_raw: "Tamarind Village", platform: "", category: "travel", notes: "2 nights, Chiang Mai", sgd_amount: "164.00", fx_rate_source: "actual_dbs", payment_method: "card_dbs" },
    { spend_entry_id: "m52", spent_at: "2026-05-17T09:00:00Z", merchant_name_raw: "Doi Suthep", platform: "", category: "travel", notes: "Songthaew + temple entry", sgd_amount: "8.20", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    // ─── JUNE 2026 — the real entries you shared ─────────────────────
    { spend_entry_id: "1", spent_at: "2026-06-01T05:28:00Z", merchant_name_raw: "Grain", platform: "LINE MAN", category: "food", notes: "Food delivery from Grain \u2014 S-OASIS", sgd_amount: "13.01", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "2", spent_at: "2026-06-02T07:56:19Z", merchant_name_raw: "Laundry Shop", platform: "", category: "home", notes: "30 baht cash on bedsheets laundry, washing only", sgd_amount: "1.19", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" },
    { spend_entry_id: "3", spent_at: "2026-06-02T05:38:00Z", merchant_name_raw: "Smart Wash 24", platform: "", category: "home", notes: "Dryer use for bedsheets laundry", sgd_amount: "2.02", fx_rate_source: "actual_ocbc", payment_method: "promptpay_ocbc" },
    { spend_entry_id: "4", spent_at: "2026-06-02T05:16:00Z", merchant_name_raw: "7-Eleven", platform: "", category: "groceries", notes: "Twin pack golden banana", sgd_amount: "0.55", fx_rate_source: "actual_superrich_fifo", payment_method: "truemoney" },
    { spend_entry_id: "5", spent_at: "2026-06-02T05:14:00Z", merchant_name_raw: "FitFish", platform: "LINE MAN", category: "food", notes: "Food delivery from FitFish", sgd_amount: "17.08", fx_rate_source: "actual_youtrip", payment_method: "youtrip" },
    { spend_entry_id: "6", spent_at: "2026-06-02T08:53:27Z", merchant_name_raw: "RO Water Vending Machine", platform: "", category: "utilities", notes: "2x 6L RO water refill for brushing teeth", sgd_amount: "0.40", fx_rate_source: "actual_superrich_fifo", payment_method: "cash" }
  ];
})();
(() => {
  // spend-src/mod_5.js
  var { useState: useStateC, useRef: useRefC } = React;
  function useCountUp(target, duration = 900) {
    const [v, setV] = React.useState(0);
    const fromRef = React.useRef(0);
    React.useEffect(() => {
      const from = fromRef.current;
      if (!target) {
        setV(0);
        fromRef.current = 0;
        return;
      }
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = from + (target - from) * eased;
        setV(cur);
        fromRef.current = cur;
        if (t < 1) raf = requestAnimationFrame(tick);
        else fromRef.current = target;
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return v;
  }
  function useHoverable() {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const onDocDown = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("pointerdown", onDocDown);
      return () => document.removeEventListener("pointerdown", onDocDown);
    }, [open]);
    return {
      ref,
      open,
      bind: {
        ref,
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onClick: () => setOpen((v) => !v)
      }
    };
  }
  function MonthNav({ monthKey, label, onPrev, onNext, canPrev, canNext }) {
    const Btn = ({ dir, on, enabled }) => /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: enabled ? on : void 0,
        disabled: !enabled,
        "aria-label": dir === "prev" ? "Previous month" : "Next month",
        style: {
          width: 38,
          height: 38,
          borderRadius: 12,
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: enabled ? "var(--ink)" : "var(--muted-2)",
          cursor: enabled ? "pointer" : "default",
          opacity: enabled ? 1 : 0.4,
          fontSize: 18,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
          flexShrink: 0,
          transition: "background .15s, border-color .15s"
        }
      },
      dir === "prev" ? "\u2039" : "\u203A"
    );
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Btn, { dir: "prev", on: onPrev, enabled: canPrev }), /* @__PURE__ */ React.createElement("div", { style: {
      minWidth: 168,
      textAlign: "center",
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: -0.4,
      fontVariantNumeric: "tabular-nums"
    } }, label), /* @__PURE__ */ React.createElement(Btn, { dir: "next", on: onNext, enabled: canNext }));
  }
  function SGDInfoTip() {
    const { bind, open } = useHoverable();
    return /* @__PURE__ */ React.createElement("span", { className: "sgd-info-wrap", ...bind }, /* @__PURE__ */ React.createElement("sup", { className: "sgd-sup" }, "i"), open && /* @__PURE__ */ React.createElement("div", { className: "sgd-info-tip", role: "tooltip" }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 8px", fontWeight: 500 } }, "All amounts are in ", /* @__PURE__ */ React.createElement("strong", null, "Singapore Dollars (SGD)"), " \u2014 B's home currency and purchasing power baseline."), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: "11.5px", color: "var(--muted)" } }, "Foreign currencies (THB, MYR, etc.) are converted at the rate actually paid.", " ", /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "#currency-notes",
        style: { color: "var(--accent)", textDecoration: "none", fontWeight: 600 },
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          document.getElementById("currency-notes")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },
      "See conversion notes \u2193"
    ))));
  }
  function Hero({ amount, monthShort, density }) {
    const shown = useCountUp(amount, 900);
    const fs = density === "compact" ? 30 : 42;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { style: {
      margin: 0,
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontSize: fs,
      fontWeight: 700,
      letterSpacing: -1.4,
      lineHeight: 1.08,
      textWrap: "pretty"
    } }, "B spent", " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)", fontVariantNumeric: "tabular-nums" } }, window.s$0(shown)), /* @__PURE__ */ React.createElement(SGDInfoTip, null), " ", "in", " ", /* @__PURE__ */ React.createElement("span", null, monthShort)));
  }
  function ChipTooltip({ open, children }) {
    if (!open) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "chip-tip", role: "tooltip" }, /* @__PURE__ */ React.createElement("div", { className: "chip-tip-arrow" }), /* @__PURE__ */ React.createElement("div", { className: "chip-tip-body" }, children));
  }
  function TipRows({ rows, total, sgdTotal }) {
    return /* @__PURE__ */ React.createElement("div", { className: "tip-rows" }, rows.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "tip-row", style: r.muted ? { opacity: 0.55 } : null }, r.dot && /* @__PURE__ */ React.createElement("span", { className: "tip-dot", style: { background: r.dot } }), /* @__PURE__ */ React.createElement("span", { className: "tip-label" }, r.label), r.note && /* @__PURE__ */ React.createElement("span", { className: "tip-note" }, r.note), /* @__PURE__ */ React.createElement("span", { className: "tip-amt" }, r.sgd != null ? window.money(r.sgd) : r.text || ""))), total != null && /* @__PURE__ */ React.createElement("div", { className: "tip-row tip-total" }, /* @__PURE__ */ React.createElement("span", { className: "tip-label" }, "Total"), /* @__PURE__ */ React.createElement("span", { className: "tip-amt" }, sgdTotal ? window.s$(total) : window.money(total))));
  }
  function StatChips({ totals, monthRows, density, monthKey }) {
    const { CATEGORIES, categoryTotals, resolveFixedFor } = window;
    const dailyCats = React.useMemo(
      () => categoryTotals(monthRows, ["everyday"]),
      [monthRows]
    );
    const dailyTipRows = dailyCats.map((c) => ({ label: c.label, sgd: c.value, dot: c.color }));
    const fixedFor = monthKey ? resolveFixedFor(monthKey) : [];
    const FIXED_DESCS = {
      rent: "B's 27sqm Bangkok shoebox",
      utilities_fixed: "Singapore & Thailand",
      installment: "MacBook Air"
    };
    const FIXED_LABELS = { rent: "Rent", subscriptions: "Recurring", insurance: "Insurance" };
    const fixedGroups = ["rent", "subscriptions", "insurance"].map((sb) => {
      const items2 = fixedFor.filter((f) => f.subBucket === sb);
      const sum = items2.reduce((a, b) => a + b.sgd, 0);
      const g = { sb, label: FIXED_LABELS[sb], desc: FIXED_DESCS[sb], items: items2, sum, single: items2.length <= 1 };
      if ((sb === "insurance" || sb === "subscriptions") && items2.length) {
        const order = [], byType = {};
        items2.forEach((it) => {
          const t = it.type || "Other";
          if (!byType[t]) {
            byType[t] = [];
            order.push(t);
          }
          byType[t].push(it);
        });
        g.typeGroups = order.map((t) => ({ type: t, items: byType[t] }));
        g.single = false;
      }
      return g;
    }).filter((g) => g.items.length);
    const allCats = React.useMemo(
      () => categoryTotals(monthRows, ["everyday", "fixed", "oneoff"]),
      [monthRows]
    );
    const allTipRows = allCats.map((c) => ({ label: c.label, sgd: c.value, dot: c.color }));
    const oneoff = monthRows.filter((e) => e.bucket === "oneoff");
    const oneoffByCat = (() => {
      const m = /* @__PURE__ */ new Map();
      for (const e of oneoff) m.set(e.catKey, (m.get(e.catKey) || 0) + e.sgd);
      return [...m.entries()].map(([k, v]) => ({ label: CATEGORIES[k].label, sgd: v, dot: CATEGORIES[k].color }));
    })();
    const items = [
      {
        key: "everyday",
        label: "Day-to-day",
        value: totals.everyday,
        note: "meals, transport, utilities\u2026",
        accent: true,
        tip: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-head" }, "Day-to-day \xB7 by category"), /* @__PURE__ */ React.createElement(TipRows, { rows: dailyTipRows, total: totals.everyday, sgdTotal: true }))
      },
      {
        key: "fixed",
        label: "Fixed",
        value: totals.fixed,
        note: "rent, recurring, insurance",
        tip: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-head" }, "Fixed monthly costs"), /* @__PURE__ */ React.createElement("div", { className: "tip-fixed-list" }, fixedGroups.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.sb, className: "tip-fixed-group" }, g.single ? /* @__PURE__ */ React.createElement("div", { className: "tip-flat-line" }, /* @__PURE__ */ React.createElement("div", { className: "tip-flat-left" }, /* @__PURE__ */ React.createElement("span", { className: "tip-flat-label" }, g.label), g.desc && /* @__PURE__ */ React.createElement("span", { className: "tip-flat-desc" }, g.desc), g.items[0] && g.items[0].paymentNo && /* @__PURE__ */ React.createElement("span", { className: "tip-flat-desc" }, "payment ", g.items[0].paymentNo, " of ", g.items[0].paymentTotal)), /* @__PURE__ */ React.createElement("span", { className: "tip-flat-amt" }, window.s$(g.sum))) : g.typeGroups ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-group-head" }, /* @__PURE__ */ React.createElement("span", null, g.label), /* @__PURE__ */ React.createElement("span", null, window.s$(g.sum))), g.typeGroups.map((tg) => /* @__PURE__ */ React.createElement("div", { key: tg.type }, /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 4, marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4 } }, tg.type), tg.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "tip-row", style: { paddingLeft: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "tip-label" }, it.name), it.paymentNo && /* @__PURE__ */ React.createElement("span", { className: "tip-note" }, "#", it.paymentNo, " of ", it.paymentTotal), /* @__PURE__ */ React.createElement("span", { className: "tip-amt" }, window.money(it.sgd))))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-group-head" }, /* @__PURE__ */ React.createElement("span", null, g.label), /* @__PURE__ */ React.createElement("span", null, window.s$(g.sum))), g.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "tip-row", style: { paddingLeft: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "tip-label" }, it.name), it.paymentNo && /* @__PURE__ */ React.createElement("span", { className: "tip-note" }, "#", it.paymentNo, " of ", it.paymentTotal), /* @__PURE__ */ React.createElement("span", { className: "tip-amt" }, window.money(it.sgd))))))), /* @__PURE__ */ React.createElement("div", { className: "tip-soft", style: { paddingLeft: 0, marginTop: 2, fontStyle: "italic" } }, "Insurance premiums are currently estimated and exclude CPF-paid portions.")), /* @__PURE__ */ React.createElement("div", { className: "tip-row tip-total", style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "tip-label" }, "Total fixed"), /* @__PURE__ */ React.createElement("span", { className: "tip-amt" }, window.s$(totals.fixed))))
      },
      {
        key: "oneoff",
        label: "One-off / travel & experiences",
        value: totals.oneoff,
        note: "big buys, trips & experiences",
        tip: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-head" }, "One-off, travel & experiences"), oneoffByCat.length ? /* @__PURE__ */ React.createElement(TipRows, { rows: oneoffByCat, total: totals.oneoff, sgdTotal: true }) : /* @__PURE__ */ React.createElement("div", { className: "tip-soft", style: { marginTop: 4 } }, "Nothing logged this month."), /* @__PURE__ */ React.createElement("div", { className: "tip-section" }, /* @__PURE__ */ React.createElement("div", { className: "tip-section-head" }, "What goes here"), /* @__PURE__ */ React.createElement("div", { className: "tip-soft" }, "Big-ticket buys (over ~S$150) \u2014 laptop replacement, new phone, dental work \u2014 plus trips and experiences like concert tickets & events. Small things like clothes & haircuts stay in ", /* @__PURE__ */ React.createElement("em", null, "Others"), "."), /* @__PURE__ */ React.createElement("div", { className: "tip-soft", style: { marginTop: 6, fontStyle: "italic" } }, "Not yet integrated \u2014 tracking will be wired in a future update.")))
      },
      {
        key: "all",
        label: "Total this month",
        value: totals.all,
        note: "everything combined",
        tip: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tip-head" }, "Total \xB7 by category"), /* @__PURE__ */ React.createElement(TipRows, { rows: allTipRows, total: totals.all, sgdTotal: true }))
      }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "chip-grid" }, items.map((it) => /* @__PURE__ */ React.createElement(StatChip, { key: it.key, item: it, density })));
  }
  function StatChip({ item, density }) {
    const { bind, open } = useHoverable();
    const pad = density === "compact" ? "13px 15px" : "16px 18px";
    return /* @__PURE__ */ React.createElement("div", { className: "chip-wrap", ...bind }, /* @__PURE__ */ React.createElement("div", { className: "chip", style: { padding: pad } }, /* @__PURE__ */ React.createElement("span", { className: "chip-label" }, item.label), /* @__PURE__ */ React.createElement("span", { className: "chip-value", style: {
      fontSize: density === "compact" ? 24 : 28,
      color: item.accent ? "var(--accent)" : "var(--ink)"
    } }, window.s$0(item.value)), /* @__PURE__ */ React.createElement("span", { className: "chip-note" }, item.note)), /* @__PURE__ */ React.createElement(ChipTooltip, { open }, item.tip));
  }
  function BucketToggle({ includeFixed, includeOneoff, onToggleFixed, onToggleOneoff }) {
    return /* @__PURE__ */ React.createElement("div", { className: "bucket-toggle" }, /* @__PURE__ */ React.createElement("span", { className: "bucket-pill active", title: "Always included" }, "Day-to-day"), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "bucket-pill" + (includeFixed ? " active" : ""),
        onClick: onToggleFixed
      },
      "+ Fixed"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "bucket-pill" + (includeOneoff ? " active" : ""),
        onClick: onToggleOneoff
      },
      "+ One-off / travel & experiences"
    ));
  }
  function Donut({ cats, total, label, monthRows }) {
    const [hover, setHover] = useStateC(null);
    const size = 230, stroke = 30, r = (size - stroke) / 2, C = 2 * Math.PI * r;
    let acc = 0;
    const segs = cats.map((c) => {
      const frac = total ? c.value / total : 0;
      const seg = { ...c, frac, offset: acc };
      acc += frac;
      return seg;
    });
    const active = hover != null ? segs.find((s) => s.key === hover) : null;
    const drill = active && monthRows ? window.subGroupForCategory(active.key, monthRows) : null;
    return /* @__PURE__ */ React.createElement("div", { className: "donut-block" }, /* @__PURE__ */ React.createElement("div", { className: "donut-main" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${size} ${size}`, style: { width: size, height: size, transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--line)", strokeWidth: stroke, opacity: "0.5" }), segs.map((s) => /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: s.key,
        cx: size / 2,
        cy: size / 2,
        r,
        fill: "none",
        stroke: s.color,
        strokeWidth: stroke,
        strokeDasharray: `${s.frac * C} ${C}`,
        strokeDashoffset: -s.offset * C,
        opacity: hover == null || hover === s.key ? 1 : 0.22,
        style: { transition: "opacity .15s", cursor: "pointer" },
        onMouseEnter: () => setHover(s.key),
        onMouseLeave: () => setHover(null),
        onClick: () => setHover((h) => h === s.key ? null : s.key)
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      pointerEvents: "none",
      padding: 16
    } }, active ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "donut-cap", style: { color: active.color } }, active.label), /* @__PURE__ */ React.createElement("span", { className: "donut-big" }, window.s$(active.value)), /* @__PURE__ */ React.createElement("span", { className: "donut-pct", style: { color: active.color } }, window.pct(active.frac * 100))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "donut-cap" }, label), /* @__PURE__ */ React.createElement("span", { className: "donut-big" }, window.s$0(total)), /* @__PURE__ */ React.createElement("span", { className: "donut-sub" }, "across ", segs.length, " categories")))), /* @__PURE__ */ React.createElement("div", { className: "donut-legend-v" }, segs.map((s) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: s.key,
        type: "button",
        className: "legend-row",
        onMouseEnter: () => setHover(s.key),
        onMouseLeave: () => setHover(null),
        onClick: () => setHover((h) => h === s.key ? null : s.key),
        style: { opacity: hover == null || hover === s.key ? 1 : 0.35 }
      },
      /* @__PURE__ */ React.createElement("span", { className: "legend-dot", style: { background: s.color } }),
      /* @__PURE__ */ React.createElement("span", { className: "legend-name" }, s.label),
      /* @__PURE__ */ React.createElement("span", { className: "legend-pct" }, window.pct(s.frac * 100)),
      /* @__PURE__ */ React.createElement("span", { className: "legend-amt" }, window.money(s.value))
    )))), /* @__PURE__ */ React.createElement("div", { className: "donut-drill " + (drill && drill.length ? "open" : "") }, drill && drill.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "drill-head" }, /* @__PURE__ */ React.createElement("span", { className: "drill-dot", style: { background: active.color } }), /* @__PURE__ */ React.createElement("span", { className: "drill-title" }, active.label), /* @__PURE__ */ React.createElement("span", { className: "drill-sub" }, drill.length, " ", drill.length === 1 ? "source" : "sources")), /* @__PURE__ */ React.createElement("div", { className: "drill-rows" }, drill.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "drill-row" }, /* @__PURE__ */ React.createElement("span", { className: "drill-label" }, d.label), /* @__PURE__ */ React.createElement("span", { className: "drill-bar-track" }, /* @__PURE__ */ React.createElement("span", { className: "drill-bar", style: { background: active.color, width: d.pct + "%" } })), /* @__PURE__ */ React.createElement("span", { className: "drill-pct" }, window.pct(d.pct)), /* @__PURE__ */ React.createElement("span", { className: "drill-amt" }, window.money(d.sgd))))))));
  }
  function Bars({ cats, total }) {
    const max = Math.max(...cats.map((c) => c.value), 1);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, cats.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.key, className: "bar-row" }, /* @__PURE__ */ React.createElement("div", { className: "bar-label" }, /* @__PURE__ */ React.createElement("span", { className: "legend-dot", style: { background: c.color } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c.label)), /* @__PURE__ */ React.createElement("div", { className: "bar-track" }, /* @__PURE__ */ React.createElement("div", { className: "bar-fill", style: { width: c.value / max * 100 + "%", background: c.color } })), /* @__PURE__ */ React.createElement("div", { className: "bar-vals" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--muted-2)", fontFamily: "'JetBrains Mono', monospace" } }, window.pct(c.pct)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontFamily: "'JetBrains Mono', monospace" } }, window.money(c.value))))));
  }
  Object.assign(window, { useCountUp, useHoverable, MonthNav, Hero, StatChips, Donut, Bars, TipRows, ChipTooltip, BucketToggle, SGDInfoTip });
})();
(() => {
  // spend-src/mod_1.js
  var ENDPOINT_URL = "https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation/spend";
  var { useState, useEffect, useMemo } = React;
  function useThemeMode() {
    const read = () => {
      try {
        const pdoc = window.parent && window.parent !== window ? window.parent.document : document;
        const t = pdoc.documentElement.getAttribute("data-theme");
        if (t === "dark" || t === "light") return t;
      } catch (e) {
      }
      try {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
      } catch (e) {
      }
      return "light";
    };
    const [mode, setMode] = useState(read);
    useEffect(() => {
      let doc;
      try {
        doc = window.parent && window.parent !== window ? window.parent.document : document;
      } catch (e) {
        doc = document;
      }
      const update = () => setMode(read());
      let obs = null;
      if (window.MutationObserver && doc && doc.documentElement) {
        obs = new MutationObserver(update);
        obs.observe(doc.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
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
  function useLocalTweaks(defaults) {
    const [t, setT] = useState(defaults);
    const set = (k, v) => setT((p) => ({ ...p, [k]: v }));
    return [t, set];
  }
  var {
    normalizeSpendRows,
    mergeWithFixed,
    monthsIn,
    monthLabel,
    monthShort,
    shiftMonth,
    bucketTotals,
    categoryTotals,
    groupByDay,
    CATEGORIES,
    s$,
    s$0,
    money,
    MonthNav,
    Hero,
    StatChips,
    Donut,
    Bars,
    BucketToggle
  } = window;
  var PALETTES = {
    candy: { name: "Candy", bg: "oklch(0.97 0.025 80)", card: "#ffffff", ink: "oklch(0.22 0.03 60)", muted: "oklch(0.55 0.03 60)", muted2: "oklch(0.72 0.02 70)", line: "oklch(0.92 0.02 70)", accent: "oklch(0.55 0.18 22)" },
    earth: { name: "Earth", bg: "oklch(0.96 0.02 75)", card: "#ffffff", ink: "oklch(0.24 0.03 50)", muted: "oklch(0.52 0.03 50)", muted2: "oklch(0.7 0.02 60)", line: "oklch(0.9 0.02 65)", accent: "oklch(0.5 0.14 35)" },
    berry: { name: "Berry", bg: "oklch(0.97 0.02 340)", card: "#ffffff", ink: "oklch(0.22 0.04 320)", muted: "oklch(0.55 0.03 320)", muted2: "oklch(0.72 0.02 330)", line: "oklch(0.92 0.02 330)", accent: "oklch(0.5 0.18 350)" },
    mono: { name: "Mono+", bg: "oklch(0.97 0.005 80)", card: "#ffffff", ink: "oklch(0.2 0.01 80)", muted: "oklch(0.5 0.01 80)", muted2: "oklch(0.68 0.01 80)", line: "oklch(0.92 0.005 80)", accent: "oklch(0.55 0.18 25)" }
  };
  PALETTES.light = { name: "Light", bg: "#FEFDF9", card: "#FFFFFF", ink: "#211C17", muted: "#857E70", muted2: "#857E70", line: "#ECE6DA", accent: "#2E4D72" };
  PALETTES.dark = { name: "Dark", bg: "#211C14", card: "#2C2619", ink: "#F2EFE8", muted: "rgba(242,239,232,0.62)", muted2: "rgba(242,239,232,0.62)", line: "rgba(242,239,232,0.14)", accent: "#88A7D0" };
  var TWEAK_DEFAULTS = (
    /*EDITMODE-BEGIN*/
    {
      "palette": "candy",
      "breakdownViz": "donut",
      "showBreakdown": true,
      "includeFixed": false,
      "includeOneoff": false,
      "order": "newest",
      "density": "comfortable",
      "showSelfCare": true
    }
  );
  function SpendRow({ e }) {
    const cat = CATEGORIES[e.catKey];
    return /* @__PURE__ */ React.createElement("div", { className: "spend-row" }, /* @__PURE__ */ React.createElement("span", { className: "spend-dot", style: { background: cat.color } }), /* @__PURE__ */ React.createElement("div", { className: "spend-main" }, /* @__PURE__ */ React.createElement("div", { className: "spend-title" }, e.merchant, /* @__PURE__ */ React.createElement("span", { className: "spend-cat", style: { color: cat.color } }, "\xB7 ", cat.label)), (e.desc || e.platform) && /* @__PURE__ */ React.createElement("div", { className: "spend-sub" }, e.desc, e.platform ? (e.desc ? " \xB7 " : "") + e.platform : "")), /* @__PURE__ */ React.createElement("div", { className: "spend-amt-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "spend-amt" }, money(e.sgd))));
  }
  function SpendTable({ days, dayTotal, footLabel }) {
    if (!days.length) return /* @__PURE__ */ React.createElement("div", { style: { padding: "48px 0", textAlign: "center", color: "var(--muted)" } }, "No entries this month.");
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, days.map((d) => /* @__PURE__ */ React.createElement("div", { key: d.date, className: "spend-day" }, /* @__PURE__ */ React.createElement("div", { className: "day-head" }, /* @__PURE__ */ React.createElement("span", { className: "day-date" }, d.weekday, " ", d.dayNum, " ", d.monAbbr), /* @__PURE__ */ React.createElement("span", { className: "day-total" }, money(d.total))), d.items.map((e) => /* @__PURE__ */ React.createElement(SpendRow, { key: e.id, e }))))), /* @__PURE__ */ React.createElement("div", { className: "table-foot" }, /* @__PURE__ */ React.createElement("span", null, (footLabel || "Day-to-day total") + " \xB7 ", days.length, " ", days.length === 1 ? "day" : "days"), /* @__PURE__ */ React.createElement("span", { className: "table-foot-amt" }, s$(dayTotal))));
  }
  var SC_WDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var SC_MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var SC_HW = [
    { name: "Vitamin B Complex", unit: 0.15 },
    { name: "Vitamin C", unit: 0.1 },
    { name: "Vitamin D + K2", unit: 0.2 },
    { name: "NMN", unit: 0.8 },
    { name: "TMG", unit: 0.25 },
    { name: "Co-Enzyme Q10", unit: 0.35 },
    { name: "Cocoa Powder", unit: 0.3 },
    { name: "Fish Oil", unit: 0.2 },
    { name: "Probiotics", unit: 0.4 }
  ];
  var SC_SKIN_DAILY = [
    { name: "Face Wash", unit: 0.15, times: 2 },
    { name: "Toner", unit: 0.12, times: 2 },
    { name: "Moisturiser", unit: 0.2, times: 2 },
    { name: "SK-II Facial Essence", unit: 1.5, times: 1 },
    { name: "Serum", unit: 0.6, times: 1 },
    { name: "Body Lotion", unit: 0.15, times: 1 },
    { name: "Hand Cream", unit: 0.1, times: 1 }
  ];
  function scBuildDay(d, dayIdx) {
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    const skipHalf = dow === 0;
    const hw = [];
    SC_HW.forEach((it, i) => {
      if (skipHalf && i % 2 === 1) return;
      hw.push({ name: it.name, times: 1, unit: it.unit });
    });
    const cg = dayIdx % 2 === 0 ? { name: "Creatine", unit: 0.1 } : { name: "Glucosamine", unit: 0.25 };
    hw.push({ name: cg.name, times: 1, unit: cg.unit });
    const skin = SC_SKIN_DAILY.map((it) => ({ name: it.name, times: it.times, unit: it.unit }));
    if (weekend) {
      skin.push({ name: "Sunblock \u2014 Face", times: 1, unit: 0.25 });
      skin.push({ name: "Sunblock \u2014 Body", times: 1, unit: 0.2 });
    }
    if (dow === 3 || dow === 0) skin.push({ name: "Hair Mask", times: 1, unit: 0.5 });
    if (dow === 2 || dow === 6) skin.push({ name: "Face Mask", times: 1, unit: 0.6 });
    const sum = (a) => a.reduce((s, x) => s + x.times * x.unit, 0);
    return {
      key: SC_WDAY[dow] + " " + d.getDate() + " " + SC_MON[d.getMonth()],
      hw,
      skin,
      hwTotal: sum(hw),
      skinTotal: sum(skin),
      total: sum(hw) + sum(skin)
    };
  }
  function scNavBtn(disabled) {
    return {
      width: 30,
      height: 30,
      borderRadius: 8,
      border: "1px solid var(--line)",
      background: "var(--card)",
      color: disabled ? "var(--muted-2)" : "var(--ink)",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.4 : 1,
      fontSize: 16,
      lineHeight: 1,
      fontFamily: "inherit",
      flexShrink: 0
    };
  }
  function scSection(title, items, total, fmt) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--muted)", fontFamily: "'JetBrains Mono',monospace" } }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums" } }, fmt(total))), items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderTop: i ? "1px solid var(--line)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13, color: "var(--ink)" } }, it.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)", fontVariantNumeric: "tabular-nums", minWidth: 30, textAlign: "right" } }, "\xD7" + it.times), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--muted)", fontVariantNumeric: "tabular-nums", minWidth: 58, textAlign: "right" } }, fmt(it.times * it.unit)))));
  }
  function SelfCareSketch() {
    const days = (() => {
      const out = [], now = /* @__PURE__ */ new Date();
      for (let i = 6; i >= 0; i--) out.push(scBuildDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), 6 - i));
      return out;
    })();
    const [idx, setIdx] = useState(days.length - 1);
    const day = days[idx];
    const fmt = (n) => "S$" + n.toFixed(2);
    return /* @__PURE__ */ React.createElement("section", { className: "card sketch-card" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono-badge" }, "Coming Soon"), /* @__PURE__ */ React.createElement("h2", { className: "card-title", style: { margin: 0 } }, "Self-care & upkeep \u2014 daily cost"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIdx((i) => Math.max(0, i - 1)), disabled: idx <= 0, "aria-label": "Previous day", style: scNavBtn(idx <= 0) }, "\u2039"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, minWidth: 92, textAlign: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontVariantNumeric: "tabular-nums" } }, day.key), /* @__PURE__ */ React.createElement("button", { onClick: () => setIdx((i) => Math.min(days.length - 1, i + 1)), disabled: idx >= days.length - 1, "aria-label": "Next day", style: scNavBtn(idx >= days.length - 1) }, "\u203A"))), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 2px", color: "var(--muted)", fontSize: 14, maxWidth: 640 } }, "A ", /* @__PURE__ */ React.createElement("strong", null, "sample mockup"), " of B's daily self-care spend \u2014 supplements + skincare amortised to an estimated per-use cost. Scroll the last 7 days; usage varies day to day. Sample numbers, not yet wired to real data."), scSection("Health & Wellness", day.hw, day.hwTotal, fmt), scSection("Skincare", day.skin, day.skinTotal, fmt), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16, paddingTop: 12, borderTop: "2px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink)" } }, "Combined total"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--accent)", fontFamily: "'Bricolage Grotesque',sans-serif", fontVariantNumeric: "tabular-nums" } }, fmt(day.total))));
  }
  function Notes() {
    const lines = [
      [
        "Everything is shown in SGD",
        "SGD is B's home currency, and where she has earned most of her money over her lifetime, with only small amounts in USD and AUD."
      ],
      [
        "Electronic payments \u2014 cards, PromptPay, DuitNow, etc.",
        "Purchases on YouTrip, HSBC, Trust and similar cards are converted at the bank's posted rate at the moment of payment. Bank transfers such as PromptPay and DuitNow are also converted using the bank or payment provider's posted rate, which may differ slightly from the card rate."
      ],
      [
        "Cash",
        "Cash spending uses the actual money-changer rate B received. Cash is matched first-in-first-out: the earliest currency bought is treated as the earliest currency spent. For example, if B exchanged THB twice at different rates, the first baht spent is matched against the first batch of baht she bought."
      ],
      [
        "Which day a purchase counts",
        "Spending is dated by the local time where B was when the purchase happened. This matches the rest of the dashboard."
      ],
      [
        "Fixed monthly costs",
        "Rent, subscriptions, phone bills, insurance and instalments are stored once and applied automatically. Instalments stop after the final payment."
      ]
    ];
    return /* @__PURE__ */ React.createElement("section", { id: "currency-notes", className: "card notes-card" }, /* @__PURE__ */ React.createElement("h2", { className: "card-title", style: { marginTop: 0, marginBottom: 6 } }, "Currency & spending rules"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 16px", fontSize: 14, color: "var(--muted)", maxWidth: 680 } }, "B's spending philosophy is", " ", /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "https://link.awhitepen.com/expenditureInThailand",
        target: "_blank",
        rel: "noopener noreferrer",
        style: { color: "var(--accent)", fontWeight: 600 }
      },
      "here"
    ), "."), /* @__PURE__ */ React.createElement("div", { className: "notes-grid" }, lines.map(([h, b]) => /* @__PURE__ */ React.createElement("div", { key: h, className: "note-item" }, /* @__PURE__ */ React.createElement("div", { className: "note-h" }, h), /* @__PURE__ */ React.createElement("div", { className: "note-b" }, b))), /* @__PURE__ */ React.createElement("div", { className: "note-item" }, /* @__PURE__ */ React.createElement("div", { className: "note-h" }, "Insurance"), /* @__PURE__ */ React.createElement("div", { className: "note-b" }, "Currently an estimated tally of cash premiums, excluding CPF-paid components. Will be reconciled later. B also holds paid-up whole-life cover she finished paying off in 5 years in her youth.", " ", /* @__PURE__ */ React.createElement("a", { href: "#", target: "_blank", rel: "noopener noreferrer", style: { color: "var(--accent)", fontWeight: 600 } }, "Why she did that \u2192"), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--muted-2)" } }, "(coming soon)")))));
  }
  function App() {
    const initialRows = useMemo(() => {
      const raw = normalizeSpendRows(window.SPEND_SAMPLE_ROWS || []);
      return mergeWithFixed(raw);
    }, []);
    const [rows, setRows] = useState(initialRows);
    const [loadState, setLoadState] = useState(ENDPOINT_URL ? "loading" : "sample");
    const [tweaks, setTweak] = useLocalTweaks(TWEAK_DEFAULTS);
    const palette = PALETTES.candy;
    const months = useMemo(() => monthsIn(rows), [rows]);
    const [monthKey, setMonthKey] = useState(null);
    useEffect(() => {
      if (months.length && (!monthKey || !months.includes(monthKey))) {
        setMonthKey(months[months.length - 1]);
      }
    }, [months]);
    useEffect(() => {
      if (!ENDPOINT_URL) return;
      fetch(ENDPOINT_URL).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then((json) => {
        const arr = Array.isArray(json) ? json : json.rows || json.data || [];
        setRows(mergeWithFixed(normalizeSpendRows(arr)));
        setLoadState("live");
      }).catch((err) => {
        console.error("spend fetch failed:", err);
        setLoadState("error");
      });
    }, []);
    const monthRows = useMemo(() => rows.filter((e) => e.monthKey === monthKey), [rows, monthKey]);
    const totals = useMemo(() => bucketTotals(monthRows), [monthRows]);
    const breakdownBuckets = useMemo(() => {
      const b = ["everyday"];
      if (tweaks.includeFixed) b.push("fixed");
      if (tweaks.includeOneoff) b.push("oneoff");
      return b;
    }, [tweaks.includeFixed, tweaks.includeOneoff]);
    const cats = useMemo(() => categoryTotals(monthRows, breakdownBuckets), [monthRows, breakdownBuckets]);
    const breakdownTotal = cats.reduce((a, c) => a + c.value, 0);
    const everydayRows = useMemo(() => monthRows.filter((e) => e.bucket === "everyday"), [monthRows]);
    const days = useMemo(() => groupByDay(everydayRows, tweaks.order === "newest"), [everydayRows, tweaks.order]);
    const oneoffRows = useMemo(() => monthRows.filter((e) => e.bucket === "oneoff"), [monthRows]);
    const oneoffDays = useMemo(() => groupByDay(oneoffRows, tweaks.order === "newest"), [oneoffRows, tweaks.order]);
    const mIdx = months.indexOf(monthKey);
    const ms = monthKey ? monthShort(monthKey) : "\u2014";
    const breakdownTitle = tweaks.includeOneoff ? "Where the month's money went" : tweaks.includeFixed ? "Summary breakdown \u2014 incl. fixed" : "Summary breakdown";
    const wrapStyle = {
      "--bg": palette.bg,
      "--card": palette.card,
      "--ink": palette.ink,
      "--muted": palette.muted,
      "--muted-2": palette.muted2,
      "--line": palette.line,
      "--accent": palette.accent,
      background: palette.bg,
      minHeight: 0,
      color: palette.ink
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: wrapStyle }, /* @__PURE__ */ React.createElement("div", { className: "shell" + (tweaks.density === "compact" ? " compact" : "") }, /* @__PURE__ */ React.createElement("header", { className: "head" }, /* @__PURE__ */ React.createElement(
      MonthNav,
      {
        monthKey,
        label: monthKey ? monthLabel(monthKey) : "\u2014",
        onPrev: () => setMonthKey(shiftMonth(monthKey, -1)),
        onNext: () => setMonthKey(shiftMonth(monthKey, 1)),
        canPrev: mIdx > 0,
        canNext: mIdx >= 0 && mIdx < months.length - 1
      }
    )), /* @__PURE__ */ React.createElement(Hero, { amount: totals.all, monthShort: ms, density: tweaks.density }), /* @__PURE__ */ React.createElement(StatChips, { totals, monthRows, density: tweaks.density, monthKey }), tweaks.showBreakdown && cats.length > 0 && /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "card-title", style: { margin: 0 } }, breakdownTitle), /* @__PURE__ */ React.createElement("div", { className: "card-subtitle" }, monthLabel(monthKey), " \xB7 hover a slice for detail")), /* @__PURE__ */ React.createElement("div", { className: "bd-total" }, s$0(breakdownTotal))), /* @__PURE__ */ React.createElement(
      BucketToggle,
      {
        includeFixed: tweaks.includeFixed,
        includeOneoff: tweaks.includeOneoff,
        onToggleFixed: () => setTweak("includeFixed", !tweaks.includeFixed),
        onToggleOneoff: () => setTweak("includeOneoff", !tweaks.includeOneoff)
      }
    ), tweaks.breakdownViz === "donut" ? /* @__PURE__ */ React.createElement(Donut, { cats, total: breakdownTotal, label: "day-to-day", monthRows }) : /* @__PURE__ */ React.createElement(Bars, { cats, total: breakdownTotal })), /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "card-title", style: { margin: 0 } }, "Day-to-day spending"), /* @__PURE__ */ React.createElement("div", { className: "card-subtitle" }, "Chronological \xB7 grouped by day \xB7 ", everydayRows.length, " entries \xB7 amounts in SGD"))), /* @__PURE__ */ React.createElement(SpendTable, { days, dayTotal: totals.everyday })), oneoffRows.length > 0 && /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "card-title", style: { margin: 0 } }, "One-off expenses"), /* @__PURE__ */ React.createElement("div", { className: "card-subtitle" }, "Not counted in day-to-day \xB7 ", oneoffRows.length, " entries \xB7 amounts in SGD"))), /* @__PURE__ */ React.createElement(SpendTable, { days: oneoffDays, dayTotal: totals.oneoff, footLabel: "One-off total" })), tweaks.showSelfCare &&/* @__PURE__ */ React.createElement(SelfCareSketch, null), /* @__PURE__ */ React.createElement(Notes, null), /* @__PURE__ */ React.createElement("footer", { className: "foot" }, "data via Cloud SQL \xB7 15-minute delay, by design"))), window.TweaksPanel && /* @__PURE__ */ React.createElement(window.TweaksPanel, { title: "Tweaks" }, /* @__PURE__ */ React.createElement(window.TweakSection, { label: "Breakdown" }, /* @__PURE__ */ React.createElement(
      window.TweakRadio,
      {
        label: "Chart",
        value: tweaks.breakdownViz,
        onChange: (v) => setTweak("breakdownViz", v),
        options: [{ value: "donut", label: "Donut" }, { value: "bars", label: "Bars" }]
      }
    ), /* @__PURE__ */ React.createElement(
      window.TweakToggle,
      {
        label: "Show breakdown",
        value: tweaks.showBreakdown,
        onChange: (v) => setTweak("showBreakdown", v)
      }
    )), /* @__PURE__ */ React.createElement(window.TweakSection, { label: "Table" }, /* @__PURE__ */ React.createElement(
      window.TweakRadio,
      {
        label: "Order",
        value: tweaks.order,
        onChange: (v) => setTweak("order", v),
        options: [{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }]
      }
    )), /* @__PURE__ */ React.createElement(window.TweakSection, { label: "Appearance" }, /* @__PURE__ */ React.createElement(
      window.TweakSelect,
      {
        label: "Palette",
        value: tweaks.palette,
        onChange: (v) => setTweak("palette", v),
        options: [{ value: "candy", label: "Candy" }, { value: "earth", label: "Earth" }, { value: "berry", label: "Berry" }, { value: "mono", label: "Mono+" }]
      }
    ), /* @__PURE__ */ React.createElement(
      window.TweakRadio,
      {
        label: "Density",
        value: tweaks.density,
        onChange: (v) => setTweak("density", v),
        options: [{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfy" }]
      }
    )), /* @__PURE__ */ React.createElement(window.TweakSection, { label: "Sections" }, /* @__PURE__ */ React.createElement(
      window.TweakToggle,
      {
        label: "Self-care preview",
        value: tweaks.showSelfCare,
        onChange: (v) => setTweak("showSelfCare", v)
      }
    ))));
  }
  (window.AWP_WIDGETS = window.AWP_WIDGETS || {}).resources = function(__el) {
    ReactDOM.createRoot(__el).render(/* @__PURE__ */ React.createElement(App, null));
  };
})();
