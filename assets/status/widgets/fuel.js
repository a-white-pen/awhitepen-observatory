// Sample rows — your actual Cloud SQL data, May 10-15 2026.
// This file is here so the widget has something to render before you
// wire up your endpoint. Once ENDPOINT_URL is set, this is ignored.
window.SAMPLE_ROWS = [
  { food_log_id: "1",  meal_type: "breakfast", food_item: "Unsweetened Pistachio Milk", kcal: "56.00",  protein_g: "0.60",  carbs_g: "7.80",  fat_g: "2.20",  fibre_g: "6.70", sugar_g: "0.60",  sodium_mg: "72.00",  created_at: "2026-05-10T02:22:34Z" },
  { food_log_id: "2",  meal_type: "breakfast", food_item: "30g of mixed nuts",          kcal: "200.00", protein_g: "6.00",  carbs_g: "5.00",  fat_g: "17.00", fibre_g: "",     sugar_g: "1.00",  sodium_mg: "45.00",  created_at: "2026-05-10T02:23:08Z" },
  { food_log_id: "3",  meal_type: "breakfast", food_item: "Goji berries",               kcal: "51.00",  protein_g: "2.10",  carbs_g: "9.80",  fat_g: "0.10",  fibre_g: "1.70", sugar_g: "6.80",  sodium_mg: "38.00",  created_at: "2026-05-10T02:49:41Z" },
  { food_log_id: "4",  meal_type: "breakfast", food_item: "Extra Virgin Olive Oil",     kcal: "165.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "18.30", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-10T04:03:18Z" },
  { food_log_id: "5",  meal_type: "snack",     food_item: "blueberries",                kcal: "68.00",  protein_g: "0.80",  carbs_g: "17.00", fat_g: "0.40",  fibre_g: "2.90", sugar_g: "12.00", sodium_mg: "1.00",   created_at: "2026-05-10T06:16:20Z" },
  { food_log_id: "6",  meal_type: "lunch",     food_item: "McFried Chicken (2pc) — McDonald's TH", kcal: "480.00", protein_g: "30.00", carbs_g: "26.00", fat_g: "28.00", fibre_g: "4.00", sugar_g: "0.00",  sodium_mg: "1100.00", created_at: "2026-05-10T06:16:57Z" },
  { food_log_id: "7",  meal_type: "dinner",    food_item: "Korean thin-skinned dumplings (5pc)", kcal: "420.00", protein_g: "28.00", carbs_g: "48.00", fat_g: "23.00", fibre_g: "2.00", sugar_g: "4.00",  sodium_mg: "2200.00", created_at: "2026-05-10T13:16:59Z" },
  { food_log_id: "9",  meal_type: "dinner",    food_item: "Edamame (50g)",              kcal: "61.00",  protein_g: "6.00",  carbs_g: "5.00",  fat_g: "2.60",  fibre_g: "2.60", sugar_g: "1.10",  sodium_mg: "3.00",   created_at: "2026-05-10T13:25:50Z" },
  { food_log_id: "8",  meal_type: "dinner",    food_item: "Eggs (2)",                   kcal: "156.00", protein_g: "12.60", carbs_g: "1.20",  fat_g: "10.60", fibre_g: "0.00", sugar_g: "1.20",  sodium_mg: "124.00", created_at: "2026-05-10T13:23:37Z" },
  { food_log_id: "10", meal_type: "dinner",    food_item: "Jasmine Rice Porridge (Pork)", kcal: "110.00", protein_g: "3.00",  carbs_g: "24.00", fat_g: "0.00",  fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "620.00", created_at: "2026-05-10T13:30:59Z" },

  { food_log_id: "11", meal_type: "breakfast", food_item: "Almond Breeze Unsweetened",   kcal: "28.00",  protein_g: "2.20",  carbs_g: "0.00",  fat_g: "2.20",  fibre_g: "",     sugar_g: "0.00",  sodium_mg: "78.00",  created_at: "2026-05-11T02:04:43Z" },
  { food_log_id: "12", meal_type: "breakfast", food_item: "Goji Berries",                kcal: "53.00",  protein_g: "2.10",  carbs_g: "11.60", fat_g: "0.20",  fibre_g: "2.00", sugar_g: "6.80",  sodium_mg: "38.00",  created_at: "2026-05-11T02:04:43Z" },
  { food_log_id: "13", meal_type: "breakfast", food_item: "Mixed Nuts",                  kcal: "180.00", protein_g: "6.00",  carbs_g: "4.50",  fat_g: "16.50", fibre_g: "2.40", sugar_g: "1.20",  sodium_mg: "2.00",   created_at: "2026-05-11T02:04:43Z" },
  { food_log_id: "14", meal_type: "breakfast", food_item: "Extra Virgin Olive Oil",      kcal: "165.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "18.30", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-11T02:12:42Z" },
  { food_log_id: "15", meal_type: "lunch",     food_item: "Broccoli Boost Bowl",         kcal: "619.00", protein_g: "44.80", carbs_g: "39.70", fat_g: "31.00", fibre_g: "9.00", sugar_g: "",      sodium_mg: "215.00", created_at: "2026-05-11T06:19:49Z" },
  { food_log_id: "16", meal_type: "snack",     food_item: "SHEN NUN Nutrimix powder",    kcal: "99.00",  protein_g: "2.40",  carbs_g: "19.20", fat_g: "1.50",  fibre_g: "2.70", sugar_g: "8.00",  sodium_mg: "74.00",  created_at: "2026-05-11T09:16:24Z" },
  { food_log_id: "18", meal_type: "snack",     food_item: "Banana",                      kcal: "90.00",  protein_g: "1.10",  carbs_g: "22.80", fat_g: "0.30",  fibre_g: "2.60", sugar_g: "12.20", sodium_mg: "1.00",   created_at: "2026-05-11T11:38:09Z" },
  { food_log_id: "17", meal_type: "snack",     food_item: "Meiji Chocolate Milk",        kcal: "130.00", protein_g: "6.00",  carbs_g: "20.00", fat_g: "3.00",  fibre_g: "",     sugar_g: "19.00", sodium_mg: "80.00",  created_at: "2026-05-11T11:38:09Z" },
  { food_log_id: "19", meal_type: "dinner",    food_item: "Chipotle Tahini Bowl (Grain)", kcal: "557.50", protein_g: "33.40", carbs_g: "43.30", fat_g: "24.70", fibre_g: "5.50", sugar_g: "",      sodium_mg: "",       created_at: "2026-05-11T11:55:58Z" },

  { food_log_id: "20", meal_type: "breakfast", food_item: "Unsweetened Pistachio Milk",  kcal: "56.00",  protein_g: "0.60",  carbs_g: "7.80",  fat_g: "2.20",  fibre_g: "6.70", sugar_g: "0.60",  sodium_mg: "72.00",  created_at: "2026-05-12T00:25:54Z" },
  { food_log_id: "21", meal_type: "breakfast", food_item: "Extra Virgin Olive Oil",      kcal: "160.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "18.00", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-12T00:53:53Z" },
  { food_log_id: "22", meal_type: "breakfast", food_item: "Goji berries",                kcal: "53.00",  protein_g: "2.10",  carbs_g: "9.60",  fat_g: "0.10",  fibre_g: "2.00", sugar_g: "6.80",  sodium_mg: "3.00",   created_at: "2026-05-12T00:54:08Z" },
  { food_log_id: "23", meal_type: "breakfast", food_item: "Mixed nuts",                  kcal: "180.00", protein_g: "6.00",  carbs_g: "6.00",  fat_g: "16.50", fibre_g: "2.70", sugar_g: "1.40",  sodium_mg: "2.00",   created_at: "2026-05-12T00:54:08Z" },
  { food_log_id: "54", meal_type: "lunch",     food_item: "Ohkajhu Buffalo Garlic Chicken Wrap", kcal: "620.00", protein_g: "36.00", carbs_g: "52.00", fat_g: "28.00", fibre_g: "5.00", sugar_g: "",      sodium_mg: "1400.00", created_at: "2026-05-12T08:23:55Z" },
  { food_log_id: "68", meal_type: "dinner",    food_item: "Peking Duck Fantuan",         kcal: "500.00", protein_g: "20.00", carbs_g: "70.00", fat_g: "25.00", fibre_g: "3.00", sugar_g: "5.00",  sodium_mg: "600.00", created_at: "2026-05-12T13:37:29Z" },

  { food_log_id: "69", meal_type: "breakfast", food_item: "Almond Breeze Unsweetened",   kcal: "28.00",  protein_g: "2.20",  carbs_g: "0.00",  fat_g: "2.20",  fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "78.00",  created_at: "2026-05-13T02:24:25Z" },
  { food_log_id: "70", meal_type: "breakfast", food_item: "Extra Virgin Olive Oil",      kcal: "162.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "18.30", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-13T02:45:52Z" },
  { food_log_id: "71", meal_type: "breakfast", food_item: "Mixed nuts",                  kcal: "182.00", protein_g: "5.40",  carbs_g: "5.60",  fat_g: "16.40", fibre_g: "2.00", sugar_g: "1.50",  sodium_mg: "8.00",   created_at: "2026-05-13T02:47:17Z" },
  { food_log_id: "72", meal_type: "breakfast", food_item: "Goji berries",                kcal: "52.00",  protein_g: "2.10",  carbs_g: "9.60",  fat_g: "0.10",  fibre_g: "1.20", sugar_g: "6.80",  sodium_mg: "4.00",   created_at: "2026-05-13T02:47:17Z" },
  { food_log_id: "84", meal_type: "lunch",     food_item: "Tuna Salad Roll (EZY FRESH)", kcal: "280.00", protein_g: "14.00", carbs_g: "28.00", fat_g: "13.00", fibre_g: "2.00", sugar_g: "4.00",  sodium_mg: "530.00", created_at: "2026-05-13T06:05:21Z" },
  { food_log_id: "98", meal_type: "lunch",     food_item: "Fresh Spring Rolls w/ Grilled Pork", kcal: "480.00", protein_g: "30.00", carbs_g: "110.00", fat_g: "30.00", fibre_g: "8.00", sugar_g: "25.00", sodium_mg: "1200.00", created_at: "2026-05-13T09:12:39Z" },
  { food_log_id: "99", meal_type: "post_workout", food_item: "Organic flax seeds",       kcal: "63.20",  protein_g: "2.16",  carbs_g: "3.44",  fat_g: "5.04",  fibre_g: "3.28", sugar_g: "0.24",  sodium_mg: "3.20",   created_at: "2026-05-13T12:02:45Z" },
  { food_log_id: "100",meal_type: "post_workout", food_item: "Almond Breeze Unsweetened",kcal: "28.00",  protein_g: "2.20",  carbs_g: "0.00",  fat_g: "2.20",  fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "78.00",  created_at: "2026-05-13T12:03:11Z" },
  { food_log_id: "101",meal_type: "post_workout", food_item: "ON Gold Standard Whey",    kcal: "120.00", protein_g: "24.00", carbs_g: "3.00",  fat_g: "1.50",  fibre_g: "0.50", sugar_g: "1.00",  sodium_mg: "130.00", created_at: "2026-05-13T12:03:43Z" },
  { food_log_id: "104",meal_type: "snack",     food_item: "Kinder Bueno bar",            kcal: "120.00", protein_g: "2.00",  carbs_g: "11.00", fat_g: "8.00",  fibre_g: "0.00", sugar_g: "9.00",  sodium_mg: "20.00",  created_at: "2026-05-13T15:40:48Z" },
  { food_log_id: "105",meal_type: "dinner",    food_item: "Chicken & Bacon Caesar Wrap (Salad Factory)", kcal: "560.00", protein_g: "32.00", carbs_g: "48.00", fat_g: "28.00", fibre_g: "4.00", sugar_g: "4.00", sodium_mg: "950.00", created_at: "2026-05-13T15:53:59Z" },

  { food_log_id: "125",meal_type: "breakfast", food_item: "EVOO",                        kcal: "160.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "18.66", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-14T10:45:11Z" },
  { food_log_id: "126",meal_type: "breakfast", food_item: "Goji Berries",                kcal: "53.55",  protein_g: "1.60",  carbs_g: "11.25", fat_g: "0.00",  fibre_g: "1.60", sugar_g: "6.96",  sodium_mg: "40.19",  created_at: "2026-05-14T10:45:37Z" },
  { food_log_id: "127",meal_type: "breakfast", food_item: "Mixed Nuts",                  kcal: "192.90", protein_g: "6.41",  carbs_g: "5.36",  fat_g: "16.08", fibre_g: "2.13", sugar_g: "1.07",  sodium_mg: "85.80",  created_at: "2026-05-14T10:45:37Z" },
  { food_log_id: "128",meal_type: "breakfast", food_item: "Almond Breeze Unsweetened",   kcal: "28.00",  protein_g: "2.20",  carbs_g: "0.00",  fat_g: "2.20",  fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "78.00",  created_at: "2026-05-14T10:46:46Z" },
  { food_log_id: "129",meal_type: "lunch",     food_item: "Grilled Tofu Wrap (Jones Salad)", kcal: "395.00", protein_g: "21.00", carbs_g: "48.00", fat_g: "14.00", fibre_g: "9.00", sugar_g: "5.00",  sodium_mg: "510.00", created_at: "2026-05-14T10:53:58Z" },
  { food_log_id: "133",meal_type: "snack",     food_item: "Yogurt (CP)",                 kcal: "90.00",  protein_g: "6.00",  carbs_g: "11.00", fat_g: "2.50",  fibre_g: "0.00", sugar_g: "6.00",  sodium_mg: "65.00",  created_at: "2026-05-14T14:37:20Z" },
  { food_log_id: "134",meal_type: "dinner",    food_item: "Viking Chicken Breast Wrap (Jones Salad)", kcal: "609.00", protein_g: "44.00", carbs_g: "70.00", fat_g: "17.00", fibre_g: "10.00", sugar_g: "10.00", sodium_mg: "1000.00", created_at: "2026-05-14T14:40:19Z" },

  { food_log_id: "135",meal_type: "breakfast", food_item: "Blue Diamond Almond Milk",    kcal: "28.00",  protein_g: "2.20",  carbs_g: "0.00",  fat_g: "2.20",  fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "78.00",  created_at: "2026-05-15T01:59:47Z" },
  { food_log_id: "136",meal_type: "breakfast", food_item: "Goji berries",                kcal: "55.00",  protein_g: "2.00",  carbs_g: "10.00", fat_g: "0.50",  fibre_g: "2.00", sugar_g: "8.00",  sodium_mg: "",       created_at: "2026-05-15T01:59:47Z" },
  { food_log_id: "137",meal_type: "breakfast", food_item: "Mixed nuts",                  kcal: "180.00", protein_g: "6.00",  carbs_g: "6.00",  fat_g: "16.00", fibre_g: "2.50", sugar_g: "1.50",  sodium_mg: "",       created_at: "2026-05-15T01:59:47Z" },
  { food_log_id: "142",meal_type: "breakfast", food_item: "Extra Virgin Olive Oil",      kcal: "171.00", protein_g: "0.00",  carbs_g: "0.00",  fat_g: "19.00", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-15T03:14:22Z" },
  { food_log_id: "148",meal_type: "snack",     food_item: "Yogurt",                      kcal: "90.00",  protein_g: "6.00",  carbs_g: "11.00", fat_g: "2.50",  fibre_g: "0.26", sugar_g: "6.00",  sodium_mg: "65.00",  created_at: "2026-05-15T04:01:05Z" },
  { food_log_id: "149",meal_type: "lunch",     food_item: "Stir Fried Chicken w/ Cashew (KIN)", kcal: "388.42", protein_g: "29.89", carbs_g: "37.47", fat_g: "13.22", fibre_g: "0.00", sugar_g: "0.00",  sodium_mg: "0.00",   created_at: "2026-05-15T05:12:48Z" },
];
(() => {
  // macros-src/mod_4-candy.js
  var ENDPOINT_URL = "https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation/nutrition-new";
  var { useState, useEffect, useMemo, useRef } = React;
  function num(v) {
    if (v === null || v === void 0 || v === "") return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function normalizeRows(rows, weekOffset) {
    const byDate = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const ts = r.created_at || r.logged_at || r.timestamp;
      if (!ts) continue;
      const d = new Date(ts);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;
      if (!byDate.has(dateKey)) byDate.set(dateKey, /* @__PURE__ */ new Map());
      const meals = byDate.get(dateKey);
      const mealType = (r.meal_type || "other").toLowerCase();
      if (!meals.has(mealType)) meals.set(mealType, []);
      meals.get(mealType).push({
        food_item: r.food_item,
        kcal: num(r.kcal),
        protein_g: num(r.protein_g),
        carbs_g: num(r.carbs_g),
        fat_g: num(r.fat_g),
        fibre_g: num(r.fibre_g),
        sugar_g: num(r.sugar_g),
        sodium_mg: num(r.sodium_mg)
      });
    }
    const today = /* @__PURE__ */ new Date();
    const anchor = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7 * (weekOffset || 0));
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const mealsMap = byDate.get(key) || /* @__PURE__ */ new Map();
      days.push({
        date: key,
        meals: [...mealsMap.entries()].map(([meal_type, items]) => ({ meal_type, items }))
      });
    }
    return {
      range: { start: days[0].date, end: days[days.length - 1].date },
      days
    };
  }
  var SAMPLE_ROWS = typeof window !== "undefined" && window.SAMPLE_ROWS || [];
  var PALETTES = {
    candy: {
      name: "Candy",
      bg: "oklch(0.97 0.025 80)",
      card: "#ffffff",
      ink: "oklch(0.22 0.03 60)",
      muted: "oklch(0.55 0.03 60)",
      line: "oklch(0.92 0.02 70)",
      protein: "oklch(0.7 0.18 22)",
      carbs: "oklch(0.82 0.16 78)",
      fat: "oklch(0.74 0.12 195)",
      fibre: "oklch(0.68 0.15 145)",
      accent: "oklch(0.55 0.18 22)"
    },
    earth: {
      name: "Earth",
      bg: "oklch(0.96 0.02 75)",
      card: "#ffffff",
      ink: "oklch(0.24 0.03 50)",
      muted: "oklch(0.52 0.03 50)",
      line: "oklch(0.9 0.02 65)",
      protein: "oklch(0.62 0.14 35)",
      carbs: "oklch(0.78 0.13 85)",
      fat: "oklch(0.7 0.09 145)",
      fibre: "oklch(0.55 0.1 165)",
      accent: "oklch(0.5 0.14 35)"
    },
    berry: {
      name: "Berry",
      bg: "oklch(0.97 0.02 340)",
      card: "#ffffff",
      ink: "oklch(0.22 0.04 320)",
      muted: "oklch(0.55 0.03 320)",
      line: "oklch(0.92 0.02 330)",
      protein: "oklch(0.6 0.18 350)",
      carbs: "oklch(0.82 0.14 55)",
      fat: "oklch(0.78 0.12 165)",
      fibre: "oklch(0.6 0.16 280)",
      accent: "oklch(0.5 0.18 350)"
    },
    mono: {
      name: "Mono+",
      bg: "oklch(0.97 0.005 80)",
      card: "#ffffff",
      ink: "oklch(0.2 0.01 80)",
      muted: "oklch(0.55 0.01 80)",
      line: "oklch(0.92 0.005 80)",
      protein: "oklch(0.25 0.02 80)",
      carbs: "oklch(0.55 0.02 80)",
      fat: "oklch(0.78 0.02 80)",
      fibre: "oklch(0.4 0.02 80)",
      accent: "oklch(0.65 0.2 25)"
    }
  };
  var sum = (arr, key) => arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);
  var round = (n, d = 0) => {
    const m = Math.pow(10, d);
    return Math.round(n * m) / m;
  };
  var fmt = (n) => Math.round(n).toLocaleString();
  var fmt1 = (n) => (Math.round(n * 10) / 10).toLocaleString(void 0, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseDate(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function fmtDateRange(start, end) {
    const s = parseDate(start), e = parseDate(end);
    return `${s.getDate()} ${MONTHS[s.getMonth()]} \u2013 ${e.getDate()} ${MONTHS[e.getMonth()]}`;
  }
  function dayLabel(dateStr, style) {
    const d = parseDate(dateStr);
    if (style === "weekday") return WEEKDAYS[d.getDay()];
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }
  function aggregateDay(day) {
    const all = day.meals.flatMap((m) => m.items);
    return {
      date: day.date,
      kcal: sum(all, "kcal"),
      protein_g: sum(all, "protein_g"),
      carbs_g: sum(all, "carbs_g"),
      fat_g: sum(all, "fat_g"),
      fibre_g: sum(all, "fibre_g"),
      sugar_g: sum(all, "sugar_g"),
      sodium_mg: sum(all, "sodium_mg"),
      meals: day.meals
    };
  }
  function aggregateMealType(days, mealType) {
    const allItems = days.flatMap((d) => d.meals.filter((m) => m.meal_type === mealType).flatMap((m) => m.items));
    if (allItems.length === 0) return null;
    const dayCount = new Set(days.flatMap((d) => d.meals.filter((m) => m.meal_type === mealType).map((_) => d.date))).size || 1;
    return {
      meal_type: mealType,
      avg_kcal: sum(allItems, "kcal") / dayCount,
      protein_g: sum(allItems, "protein_g") / dayCount,
      carbs_g: sum(allItems, "carbs_g") / dayCount,
      fat_g: sum(allItems, "fat_g") / dayCount,
      count: dayCount
    };
  }
  PALETTES.light = {
    bg: "#FEFDF9",
    card: "#FFFFFF",
    ink: "#211C17",
    muted: "#857E70",
    line: "#ECE6DA",
    protein: "#E04A3A",
    carbs: "#E0991C",
    fat: "#2BA8C0",
    fibre: "#23A35E",
    accent: "#2E4D72",
    barNeutral: "#D9CEB9"
  };
  PALETTES.dark = {
    bg: "#211C14",
    card: "#2C2619",
    ink: "#F2EFE8",
    muted: "rgba(242,239,232,0.62)",
    line: "rgba(242,239,232,0.14)",
    protein: "#F0604E",
    carbs: "#E9AE3E",
    fat: "#46BBD0",
    fibre: "#3FB873",
    accent: "#88A7D0",
    barNeutral: "#4D4636"
  };
  function Tooltip({ x, y, children, container }) {
    if (x == null) return null;
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -110%)",
      background: "white",
      padding: "10px 12px",
      borderRadius: 12,
      boxShadow: "0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.06)",
      pointerEvents: "none",
      fontSize: 13,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      zIndex: 50
    } }, children);
  }
  function MainChart({ days, palette, focused }) {
    const [hover, setHover] = React.useState(null);
    const W = 720, H = 340;
    const PAD = { t: 36, r: 24, b: 72, l: 56 };
    const innerW = W - PAD.l - PAD.r;
    const innerH = H - PAD.t - PAD.b;
    const macroMeta = {
      kcal: { label: "Calories", color: palette.accent, unit: "" },
      protein_g: { label: "Protein", color: palette.protein, unit: "g" },
      carbs_g: { label: "Carbs", color: palette.carbs, unit: "g" },
      fat_g: { label: "Fat", color: palette.fat, unit: "g" },
      fibre_g: { label: "Fibre", color: palette.fibre, unit: "g" }
    };
    const m = macroMeta[focused];
    const values = days.map((d) => d[focused] || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    let yMax = Math.max(...values, avg, 1);
    const niceStep = yMax > 200 ? 50 : yMax > 50 ? 20 : yMax > 20 ? 10 : 5;
    yMax = Math.ceil(yMax / niceStep) * niceStep;
    const xBand = innerW / days.length;
    const xAt = (i) => PAD.l + i * xBand + xBand / 2;
    const yAt = (v) => PAD.t + innerH - v / yMax * innerH;
    const yTicks = 4;
    const ticks = Array.from({ length: yTicks + 1 }, (_, i) => Math.round(yMax * i / yTicks));
    const containerRef = React.useRef(null);
    function moveHover(e, i) {
      if (!containerRef.current) return;
      const svg = containerRef.current.querySelector("svg").getBoundingClientRect();
      const scaleX = svg.width / W;
      const scaleY = svg.height / H;
      setHover({
        i,
        px: xAt(i) * scaleX,
        py: yAt(values[i]) * scaleY
      });
    }
    const today = days.length - 1;
    return /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "auto", display: "block", overflow: "visible" } }, ticks.map(
      (t, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: PAD.l, x2: W - PAD.r, y1: yAt(t), y2: yAt(t), stroke: palette.line, strokeWidth: "1", strokeDasharray: i === 0 ? "0" : "3 4" }), /* @__PURE__ */ React.createElement("text", { x: PAD.l - 10, y: yAt(t) + 4, textAnchor: "end", fontSize: "11", fill: palette.muted, fontFamily: "'JetBrains Mono', monospace" }, t, m.unit))
    ), avg > 0 && /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
      "line",
      {
        x1: PAD.l,
        x2: W - PAD.r,
        y1: yAt(avg),
        y2: yAt(avg),
        stroke: m.color,
        strokeWidth: "2",
        strokeDasharray: "6 5",
        opacity: "0.6"
      }
    ), /* @__PURE__ */ React.createElement("g", { transform: `translate(${W - PAD.r + 4}, ${yAt(avg) + 4})` }, /* @__PURE__ */ React.createElement("text", { fontSize: "10.5", fill: m.color, fontWeight: "700", fontFamily: "'JetBrains Mono', monospace" }, "avg"), /* @__PURE__ */ React.createElement("text", { y: "12", fontSize: "10.5", fill: m.color, fontWeight: "600", fontFamily: "'JetBrains Mono', monospace" }, fmt1(avg), m.unit))), false ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
      "path",
      {
        d: values.map((v, i) => (i === 0 ? "M" : "L") + xAt(i) + "," + yAt(v)).join(" "),
        fill: "none",
        stroke: m.color,
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ), values.map(
      (v, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
        "circle",
        {
          cx: xAt(i),
          cy: yAt(v),
          r: "5",
          fill: "white",
          stroke: m.color,
          strokeWidth: "2.5",
          onMouseEnter: (e) => moveHover(e, i),
          onMouseLeave: () => setHover(null)
        }
      ), /* @__PURE__ */ React.createElement("text", { x: xAt(i), y: yAt(v) - 12, textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: palette.ink, fontFamily: "'JetBrains Mono', monospace" }, v > 0 ? fmt(v) : ""))
    )) : days.map((d, i) => {
      const v = values[i];
      const yTop = yAt(v);
      const yBot = yAt(0);
      const h = Math.max(yBot - yTop, 0);
      const bw = Math.min(46, xBand * 0.55);
      const isToday = i === today;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: xAt(i) - bw / 2,
          y: yTop,
          width: bw,
          height: h,
          fill: m.color,
          rx: 6,
          opacity: v > 0 ? 1 : 0.15,
          onMouseEnter: (e) => moveHover(e, i),
          onMouseLeave: () => setHover(null)
        }
      ), v > 0 && /* @__PURE__ */ React.createElement(
        "text",
        {
          x: xAt(i),
          y: yTop - 8,
          textAnchor: "middle",
          fontSize: "12",
          fontWeight: "700",
          fill: palette.ink,
          fontFamily: "'JetBrains Mono', monospace"
        },
        fmt(v)
      ), isToday && /* @__PURE__ */ React.createElement(
        "text",
        {
          x: xAt(i),
          y: H - PAD.b + 56,
          textAnchor: "middle",
          fontSize: "9",
          fontWeight: "700",
          fill: m.color,
          letterSpacing: "0.8",
          fontFamily: "'JetBrains Mono', monospace"
        },
        "TODAY"
      ));
    }), days.map((d, i) => {
      const dt = parseDate(d.date);
      const weekday = WEEKDAYS[dt.getDay()];
      const dateStr = `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
      const isToday = i === today;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
        "text",
        {
          x: xAt(i),
          y: H - PAD.b + 20,
          textAnchor: "middle",
          fontSize: "10.5",
          fontWeight: "700",
          fill: isToday ? m.color : palette.muted,
          letterSpacing: "0.6",
          fontFamily: "'JetBrains Mono', monospace"
        },
        weekday.toUpperCase()
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: xAt(i),
          y: H - PAD.b + 38,
          textAnchor: "middle",
          fontSize: "13",
          fill: isToday ? palette.ink : palette.muted,
          fontWeight: isToday ? 700 : 500
        },
        dateStr
      ));
    })), hover && /* @__PURE__ */ React.createElement(Tooltip, { x: hover.px, y: hover.py }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, marginBottom: 4 } }, dayLabel(days[hover.i].date, "date"), " \xB7 ", dayLabel(days[hover.i].date, "weekday")), ["kcal", "protein_g", "carbs_g", "fat_g", "fibre_g"].map((k) => {
      const mm = macroMeta[k];
      return /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "flex", alignItems: "center", gap: 8, fontVariantNumeric: "tabular-nums", opacity: k === focused ? 1 : 0.5 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: mm.color } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, mm.label), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, fmt1(days[hover.i][k] || 0), mm.unit));
    })));
  }
  function StatCard({ label, value, unit, daily, color, palette, density }) {
    const displayed = useCountUp(value, 900);
    const pad = density === "compact" ? "14px 16px" : "20px 22px";
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: palette.card,
      borderRadius: 20,
      padding: pad,
      border: `1px solid ${palette.line}`,
      display: "flex",
      flexDirection: "column",
      gap: density === "compact" ? 6 : 10
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: 3, background: color } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: palette.muted, letterSpacing: 0.4, textTransform: "uppercase" } }, label)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: density === "compact" ? 28 : 36, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: -0.5, lineHeight: 1, fontVariantNumeric: "tabular-nums" } }, fmt(displayed)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: palette.muted, fontWeight: 500 } }, unit)), daily != null && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: palette.muted, fontVariantNumeric: "tabular-nums" } }, fmt(daily), unit, " / day"));
  }
  var MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"];
  var MEAL_EMOJI = { breakfast: "\u2600", lunch: "\u25D0", dinner: "\u263E", snack: "\u2726", pre_workout: "\u2191", post_workout: "\u26A1" };
  var MEAL_LABEL = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", pre_workout: "Pre-workout", post_workout: "Post-workout" };
  function MealBreakdown({ days, palette, density }) {
    const found = new Set(days.flatMap((d) => d.meals.map((m) => m.meal_type)));
    const order = [...MEAL_ORDER.filter((t) => found.has(t)), ...[...found].filter((t) => !MEAL_ORDER.includes(t))];
    const meals = order.map((t) => aggregateMealType(days, t)).filter(Boolean);
    const maxKcal = Math.max(...meals.map((m) => m.avg_kcal), 1);
    const [hover, setHover] = useState(null);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: density === "compact" ? 10 : 14 } }, meals.map((m) => {
      const total = m.protein_g * 4 + m.carbs_g * 4 + m.fat_g * 9;
      const pPct = m.protein_g * 4 / total * 100;
      const cPct = m.carbs_g * 4 / total * 100;
      const fPct = m.fat_g * 9 / total * 100;
      const barW = m.avg_kcal / maxKcal * 100;
      return /* @__PURE__ */ React.createElement("div", { key: m.meal_type, style: { display: "grid", gridTemplateColumns: "112px 1fr 80px", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, color: palette.muted } }, MEAL_EMOJI[m.meal_type] || "\u25CF"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, textTransform: "capitalize" } }, MEAL_LABEL[m.meal_type] || m.meal_type.replace(/_/g, " "))), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: { position: "relative" },
          onMouseLeave: () => setHover(null)
        },
        /* @__PURE__ */ React.createElement("div", { style: { height: 22, width: barW + "%", display: "flex", borderRadius: 8, overflow: "hidden", minWidth: 4 } }, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: { width: pPct + "%", background: palette.protein },
            onMouseEnter: (e) => setHover({ meal: m.meal_type, macro: "protein", grams: m.protein_g, x: e.clientX, y: e.clientY })
          }
        ), /* @__PURE__ */ React.createElement(
          "div",
          {
            style: { width: cPct + "%", background: palette.carbs },
            onMouseEnter: (e) => setHover({ meal: m.meal_type, macro: "carbs", grams: m.carbs_g, x: e.clientX, y: e.clientY })
          }
        ), /* @__PURE__ */ React.createElement(
          "div",
          {
            style: { width: fPct + "%", background: palette.fat },
            onMouseEnter: (e) => setHover({ meal: m.meal_type, macro: "fat", grams: m.fat_g, x: e.clientX, y: e.clientY })
          }
        ))
      ), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 } }, round(m.avg_kcal), " ", /* @__PURE__ */ React.createElement("span", { style: { color: palette.muted, fontWeight: 400, fontSize: 11 } }, "kcal")));
    }), hover && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", left: hover.x, top: hover.y, transform: "translate(-50%, -130%)", background: "white", padding: "8px 12px", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", fontSize: 12, pointerEvents: "none", zIndex: 100 } }, /* @__PURE__ */ React.createElement("strong", { style: { textTransform: "capitalize" } }, hover.meal, " \xB7 ", hover.macro), /* @__PURE__ */ React.createElement("div", { style: { fontVariantNumeric: "tabular-nums" } }, round(hover.grams, 1), "g avg / day")));
  }
  function Sparkline({ data, color, accent, w = 100, h = 32 }) {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const xStep = w / Math.max(data.length - 1, 1);
    const pts = data.map((v, i) => [i * xStep, h - v / max * h * 0.85 - 2]);
    const path = pts.map(([x, y], i) => (i === 0 ? "M" : "L") + x + "," + y).join(" ");
    const areaPath = path + ` L ${w},${h} L 0,${h} Z`;
    return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, style: { display: "block" } }, /* @__PURE__ */ React.createElement("path", { d: areaPath, fill: color, opacity: "0.18" }), /* @__PURE__ */ React.createElement("path", { d: path, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: "3.5", fill: color, stroke: "white", strokeWidth: "1.5" }));
  }
  function MicrosRow({ days, palette, density }) {
    const items = [
      { key: "fibre_g", label: "Fibre", unit: "g", color: palette.fat, target: 30 },
      { key: "sugar_g", label: "Sugar", unit: "g", color: palette.carbs, target: 50 },
      { key: "sodium_mg", label: "Sodium", unit: "mg", color: palette.protein, target: 2300 }
    ];
    const pad = density === "compact" ? "12px 14px" : "16px 18px";
    return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, items.map(({ key, label, unit, color, target }) => {
      const data = days.map((d) => d[key]);
      const avg = sum(days.map((d) => ({ v: d[key] })), "v") / days.length;
      return /* @__PURE__ */ React.createElement("div", { key, style: { background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 16, padding: pad, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: palette.muted, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif" } }, round(avg)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: palette.muted } }, unit, " avg"))), /* @__PURE__ */ React.createElement(Sparkline, { data, color }));
    }));
  }
  function MacroLegend({ focused, setFocused, palette, totals }) {
    const items = [
      { key: "protein_g", label: "Protein", color: palette.protein, value: totals.protein_g },
      { key: "carbs_g", label: "Carbs", color: palette.carbs, value: totals.carbs_g },
      { key: "fat_g", label: "Fat", color: palette.fat, value: totals.fat_g },
      { key: "fibre_g", label: "Fibre", color: palette.fibre, value: totals.fibre_g }
    ];
    return /* @__PURE__ */ React.createElement("div", { "data-macro-pill": true, style: { display: "flex", gap: 8, flexWrap: "wrap" } }, items.map((it) => {
      const on = focused === it.key;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: it.key,
          "data-macro-pill": true,
          onClick: (e) => {
            e.stopPropagation();
            setFocused(it.key);
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            border: `1.5px solid ${on ? it.color : palette.line}`,
            background: on ? `color-mix(in oklch, ${it.color} 14%, white)` : "white",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: palette.ink,
            transition: "background .15s, border-color .15s, box-shadow .15s",
            fontFamily: "inherit",
            boxShadow: on ? `0 2px 8px color-mix(in oklch, ${it.color} 30%, transparent)` : "none",
            minWidth: 96,
            justifyContent: "center"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: 3, background: it.color } }),
        /* @__PURE__ */ React.createElement("span", null, it.label),
        /* @__PURE__ */ React.createElement("span", { style: { color: palette.muted, fontVariantNumeric: "tabular-nums", fontSize: 12 } }, fmt(it.value), "g")
      );
    }));
  }
  function useCountUp(target, duration = 900) {
    const [v, setV] = React.useState(0);
    React.useEffect(() => {
      if (!target) {
        setV(0);
        return;
      }
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setV(target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return v;
  }
  function WeekNav({ label, onPrev, onNext, canPrev, canNext, palette }) {
    const Btn = ({ dir, on, enabled }) => /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: enabled ? on : void 0,
        disabled: !enabled,
        "aria-label": dir === "prev" ? "Previous week" : "Next week",
        style: {
          width: 38,
          height: 38,
          borderRadius: 12,
          border: `1px solid ${palette.line}`,
          background: palette.card,
          color: enabled ? palette.ink : palette.muted,
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
      minWidth: 176,
      textAlign: "center",
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: -0.4,
      fontVariantNumeric: "tabular-nums"
    } }, label), /* @__PURE__ */ React.createElement(Btn, { dir: "next", on: onNext, enabled: canNext }));
  }
  function App() {
    const [rawRows, setRawRows] = useState(SAMPLE_ROWS);
    const [preAgg, setPreAgg] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [loadState, setLoadState] = useState(ENDPOINT_URL ? "loading" : "sample");
    const [focused, setFocused] = useState("kcal");
    const palette = PALETTES.candy;
    useEffect(() => {
      const handler = (e) => {
        if (!e.target.closest("[data-macro-pill]")) setFocused("kcal");
      };
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }, []);
    useEffect(() => {
      if (!ENDPOINT_URL) return;
      fetch(ENDPOINT_URL).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then((json) => {
        if (Array.isArray(json)) {
          setRawRows(json);
          setPreAgg(null);
        } else if (json && json.days) {
          setPreAgg(json);
        } else {
          setRawRows(json && (json.rows || json.data) || []);
          setPreAgg(null);
        }
        setLoadState("live");
      }).catch((err) => {
        console.error("macros fetch failed:", err);
        setLoadState("error");
      });
    }, []);
    const data = useMemo(
      () => preAgg || normalizeRows(rawRows, weekOffset),
      [preAgg, rawRows, weekOffset]
    );
    const windowStart = useMemo(() => {
      const [y, m, d] = data.range.start.split("-").map(Number);
      return new Date(y, m - 1, d).getTime();
    }, [data.range.start]);
    const canPrev = useMemo(
      () => !preAgg && rawRows.some((r) => {
        const ts = r.created_at || r.logged_at || r.timestamp;
        return ts && new Date(ts).getTime() < windowStart;
      }),
      [preAgg, rawRows, windowStart]
    );
    const canNext = !preAgg && weekOffset < 0;
    const days = useMemo(() => data.days.map(aggregateDay), [data]);
    const totals = useMemo(() => ({
      kcal: sum(days, "kcal"),
      protein_g: sum(days, "protein_g"),
      carbs_g: sum(days, "carbs_g"),
      fat_g: sum(days, "fat_g"),
      fibre_g: sum(days, "fibre_g")
    }), [days]);
    const daysWithData = days.filter((d) => d.kcal > 0).length || 1;
    const heroKcal = useCountUp(totals.kcal, 1e3);
    const containerPad = false ? 20 : 32;
    const sectionGap = false ? 16 : 24;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      background: palette.bg,
      minHeight: 0,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: palette.ink
    } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 980, margin: "0 auto", padding: containerPad, display: "flex", flexDirection: "column", gap: sectionGap } }, /* @__PURE__ */ React.createElement("header", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(
      WeekNav,
      {
        label: fmtDateRange(data.range.start, data.range.end) + " " + data.range.end.slice(0, 4),
        onPrev: () => setWeekOffset((w) => w - 1),
        onNext: () => setWeekOffset((w) => w + 1),
        canPrev,
        canNext,
        palette
      }
    )), /* @__PURE__ */ React.createElement("h1", { style: {
      margin: 0,
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontSize: false ? 32 : 44,
      fontWeight: 700,
      letterSpacing: -1.5,
      lineHeight: 1
    } }, "B consumed ", /* @__PURE__ */ React.createElement("span", { style: { color: palette.accent, fontVariantNumeric: "tabular-nums" } }, fmt(heroKcal)), " calories ", weekOffset === 0 ? "in the last 7 days" : "that week"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 } }, /* @__PURE__ */ React.createElement(StatCard, { label: "total kcal", value: totals.kcal, unit: "", daily: totals.kcal / daysWithData, color: palette.accent, palette, density: "comfortable" }), /* @__PURE__ */ React.createElement(StatCard, { label: "total protein", value: totals.protein_g, unit: "g", daily: totals.protein_g / daysWithData, color: palette.protein, palette, density: "comfortable" }), /* @__PURE__ */ React.createElement(StatCard, { label: "total carbs", value: totals.carbs_g, unit: "g", daily: totals.carbs_g / daysWithData, color: palette.carbs, palette, density: "comfortable" }), /* @__PURE__ */ React.createElement(StatCard, { label: "total fat", value: totals.fat_g, unit: "g", daily: totals.fat_g / daysWithData, color: palette.fat, palette, density: "comfortable" })), /* @__PURE__ */ React.createElement("section", { style: { background: palette.card, borderRadius: 24, border: `1px solid ${palette.line}`, padding: false ? 20 : 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -0.5 } }, focused === "kcal" ? "Calories by day" : focused === "protein_g" ? "Protein by day" : focused === "carbs_g" ? "Carbs by day" : focused === "fat_g" ? "Fat by day" : "Fibre by day"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: palette.muted, marginTop: 2 } }, focused === "kcal" ? "Tap a macro to focus on it \xB7 tap outside to go back to calories" : "Dashed line shows the 7-day average \xB7 tap outside to reset")), /* @__PURE__ */ React.createElement(MacroLegend, { focused, setFocused, palette, totals })), /* @__PURE__ */ React.createElement(MainChart, { days, palette, focused })), /* @__PURE__ */ React.createElement("section", { style: { background: palette.card, borderRadius: 24, border: `1px solid ${palette.line}`, padding: false ? 20 : 28 } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -0.5 } }, "Where B's calories come from"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: palette.muted, marginTop: 2 } }, "Average per meal \xB7 split by macro")), /* @__PURE__ */ React.createElement(MealBreakdown, { days, palette, density: "comfortable" })), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement(MicrosRow, { days, palette, density: "comfortable" })), /* @__PURE__ */ React.createElement("footer", { style: { textAlign: "center", color: palette.muted, fontSize: 11, paddingTop: 8 } }, "data via Cloud SQL \xB7 15-minute delay, by design"))));
  }
  (window.AWP_WIDGETS = window.AWP_WIDGETS || {}).fuel = function(__el) {
    ReactDOM.createRoot(__el).render(/* @__PURE__ */ React.createElement(App, null));
  };
})();
