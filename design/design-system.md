# awhitepen — design system

The visual language of awhitepen.com. Everything here is in use on the live
theme.

Scope is look and interaction patterns — colour, type, space, the components
those make, and how they behave. Nothing about data, sources or timing.

**How to use it.** Paste the token block in §6, then read §1–§3 for what the
tokens mean and §5 for the rules that keep a build coherent.

This document is the vocabulary, not the implementation. For a component's
exact padding, gaps and states, `css/base.css` and `css/status.css` are
normative — §4 tells you which class to look up.

### The four laws

1. **A value that has a token is never written as a literal.**
2. **Every colour is declared in both themes.**
3. **A style that is the same on every render is a class, not an inline style.**
4. **Large fill → dusty, small mark → vivid.**

Break these and the system stops being one.

---

## 1. Colour

**Two palettes, one set of names.** `:root` is light; `[data-theme="dark"]` on
the `<html>` element overrides it. Nothing branches on the theme except the
token values — no component knows which palette it is in.

`prefers-color-scheme` is not used. The toggle belongs to the reader, and a
reader who wants a dark page on a light machine should get one.

### Chrome — the structure of a page

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F4F2EC` | `#262320` | page |
| `--surface` | `#FFFFFF` | `#302C26` | cards, tables, raised panels |
| `--surface-alt` | `#FAF7F0` | `#363021` | tracks, inner placeholders |
| `--text` | `#201D16` | `#EFEAE0` | headings, UI text |
| `--muted` | `#857E70` | `#ABA08D` | meta, deks, secondary |
| `--soft` | `#6F695E` | `#C4BAA9` | secondary lines under a readout |
| `--edge` | `#E5E0D5` | `#3B362D` | hairlines, card borders |
| `--edge-strong` | `#201D16` | `#6E6656` | table header rule, total rows |
| `--rule` | `--muted` @55% | same | the dotted divider *inside* a card |
| `--grid` | `rgba(33,29,22,.085)` | `rgba(243,239,230,.055)` | graph-paper texture |

**Ink** is the header and footer. It stays dark in both themes, so it carries
its own foreground set: `--ink`, `--ink-fg`, `--ink-muted`, `--ink-line`.

### Accent — one blue, five roles

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--accent` | `#35618E` | `#82A9D0` | links, fills, the primary series |
| `--accent-dk` | `#28496A` | `#9CBBDD` | hover, the deeper of two fills |
| `--accent-ink` | `#3C6A97` | `#82A9D0` | focus ring |
| `--accent-soft` | `rgba(53,97,142,.10)` | `rgba(130,169,208,.16)` | target bands |
| `--accent-out` | `rgba(53,97,142,.30)` | `rgba(130,169,208,.40)` | outlines on fills |

Text on an accent fill uses `--on-accent`, never plain white — in dark mode the
fill is light and the text must go dark. `--on-accent-2/-3/-line` are its
softer steps.

### Data — two sets, and they are not interchangeable

**Dusty** (`--d-*`) is identity and state: which dashboard a column belongs to,
whether a segment is in or out. Never a chart series.

`--d-red` `--d-gold` `--d-teal` `--d-green` `--d-plum` `--d-blue` `--d-grey`

**Vivid** (`--c-*`) is for series and small marks — a dot, a thin bar, a donut
segment — where a muted colour would disappear.

`--c-red` `--c-gold` `--c-teal` `--c-green` `--c-plum` `--c-tan` `--c-blue`
`--c-orange`

The rule: **large fill → dusty, small mark → vivid.** A vivid colour across a
big area shouts; a dusty colour in a 7px dot vanishes.

`--c-gridline` shares the prefix but is neither: it is a hairline, for chart
gridlines and skeleton rules. It never carries meaning.

Which hue means which category is a per-site decision, not part of the palette.
awhitepen's assignments live in `redesign/STATUS-RULES.md`.

### Semantic

`--good` · `--alert` — state, not decoration. `--code-bg` / `--code-fg` are the
code panel, deliberately identical in both themes.

### Identity

`--grid` is a graph-paper texture — 22px rules behind the quote box
(`--qgrid`), and the same idea in chart gridlines. With the pen mark
(`assets/pen-mark.svg`) it is the notebook motif the site is named for. Optional
on a sister site, but it is the thing people recognise.

---

## 2. Type

Three families, one job each. Mixing them is the fastest way to stop looking
like this site.

```css
--display: 'Schibsted Grotesk'   /* headlines, hero figures, card titles */
--body:    'Figtree'             /* prose, labels, UI, numbers in rows */
--mono:    'IBM Plex Mono'       /* dates, category meta, code */
```

### Site scale

| Token | Size | Setting |
|---|---|---|
| `--fs-page-title` | 48 | 700 · lh 1.04 · -.03em |
| `--fs-h2` / `--fs-h3` / `--fs-h4` | 30 / 23 / 19 | display |
| `--fs-card-title` | 26 | 700 · lh 1.14 · -.02em |
| `--fs-lede` | 22 | 500 · lh 1.55 |
| `--fs-quote` | 21 | 500 |
| `--fs-entry` | 19 | lh 1.65 — post body |
| `--fs-excerpt` | 17 | lh 1.7 |
| `--fs-dek` | 16 | muted |
| `--fs-code` | 13.5 | mono |
| `--fs-eyebrow` | 12 | 600 · .18em · caps · accent |
| `--fs-nav` | 11.5 | 600 · .1em · caps |
| `--fs-meta` / `--fs-kicker` | 11 | mono .06em caps / Figtree 600 .16em caps |

### Dashboard tiers

Display 700 for figures, body for everything else, no mono.

| Tier | Setting | Example |
|---|---|---|
| Card key | 700 · 10.5 · .18em · caps · muted | BODY WEIGHT |
| Field key | 700 · 10.5 · .12em · caps | 7-DAY AVERAGE |
| Column head | 700 · 10 · .1em · caps | MERCHANT |
| Axis tick | 500 · 10 · tabular | 55.5 · 12 AM |
| Card title | display 700 · 20 · -.02em | 55.6 kg this morning |
| Readout XL | display 700 · clamp(38px,6vw,56px) · -.03em | S$1,705.34 |
| Readout L | display 700 · 30 · -.03em | 1,180 kcal today |
| Readout M | display 700 · 21 · -.025em | 19h 36m |
| Readout S | display 700 · 18 · -.02em | 1,816 mg |
| Unit | 500 · 12.5 · muted · 5px after the figure | kg |
| Row text | 400/600 · 13.5 | Protein 74 g |
| Secondary | 12.5 · soft or muted | weighed 6:24 AM |
| Note | 12 · muted · dotted rule above | ^ Fixed costs are … |
| Legend | 11.5 · muted · lowercase | 7-day average |
| Panel footer | 600 · 11 · .06em | All times in Bangkok (GMT+7) |

Only one Readout XL per view. More than one and neither reads as the headline.

**Numerals.** Rows, tables and lists use `tabular-nums` so columns align.
Display figures use proportional numerals — a hero number should look set, not
tabulated.

**Floor.** 12px for anything a reader must read. 10–11.5 is for keys, ticks,
legends and footers only.

---

## 3. Space and shape

```css
--s1:4px  --s2:8px  --s3:12px  --s4:16px  --s5:24px
--s6:32px --s7:48px --s8:64px  --s9:96px
```

### Radii

| Token | Value | Used for |
|---|---|---|
| `--r-sm` | 8px | small controls, thumbnails |
| `--r-md` | 12px | media, code, quote |
| `--r-lg` | 16px | cards, menus, embeds |
| `--r-pill` | 999px | chips, tabs, badges |

### Layout

| Token | Value | Used for |
|---|---|---|
| `--measure` | 828px | the reading shell — text column plus its padding |
| `--text-measure` | 740px | the text column itself |
| `--quote-measure` | 620px | pull quotes |
| `--wide` | 1120px | header, footer, portfolio, dashboards |
| `--gutter` | 44px | shell padding |
| `--header-h` | 78px | site header |

`--measure` and `--wide` are two names because they are two things. One shell
overriding the other's value under a single name reads as a bug the next time
anyone looks.

### Depth and motion

`--shadow-hover` · `--shadow-menu` · `--shadow-tip` — hover lifts and floating
surfaces only. `--ease: .16s ease` for everything that moves.

### Dividers

Two weights, and the distinction is load-bearing:

- **1px dotted `--rule`** — inside a card: sub-groups, legends, footers
- **1px solid `--edge`** — structure: card borders, section boundaries

---

## 4. Components

Vocabulary and rules. Exact padding, gaps and states: `css/base.css` for site
components, `css/status.css` for dashboard components.

### Card

Surface, 1px `--edge`, `--r-lg`, padding `clamp(20px,2.4vw,28px)`.

```
.card
  .whead            head
    .whead__k       key      — caps, muted, always present on a data card
    .whead__l       title    — optional
    .whead__note    right-aligned aside
  …content…
  .legend           optional, dotted rule above
  .wfoot            footer — left span, right span
```

Data cards open with the key. Prose cards open with a title.

### Chip

`--r-pill`, 11.5px. Lowercase for states (`in range`, `met`), sentence case for
actions (`Pending workout`). One word of state beats a sentence of explanation.

### Stepper

Two arrow buttons around a label. The label is fixed at `--stepper-label-w`
(8.8em) so the arrows hold still as the text changes width — a stepper whose
arrows move as you press them is a stepper you misclick.

### Legend

`.legend__sw` is the swatch. Shape modifiers (`--dot`, `--line`, `--dia`,
`--dotline`) and colour modifiers (`--in`, `--out`, `--target`, …) are separate
so either can change alone. A legend swatch must resolve to the *same token* as
the mark it describes — if the bar and its swatch are set independently they
will drift, and the legend will quietly lie.

### Skeleton

`--sk-fill` with a `--sk-glint` sweep; `--sk-fill-on` / `--sk-glint-on` on ink.
A skeleton occupies the height its content will occupy, so nothing jumps when
the content arrives.

### Failure card

Written per kind of failure, not per view. A reader wants to know whether the
thing is broken, slow, or rate limited — three different sentences, three
different next actions.

### Story card · Building card · Code · Quote

`.story-card`, `.pcard`, `.cbw`, `.entry blockquote`. The building card's media
has two states: `.pcard__ph` (hatched, content not ready) and
`.pcard__soon-badge` (page does not exist yet).

---

## 5. Conventions

**BEM.** `block__element--modifier`. One block per component.

**Tokens, not literals.** If a value has a token, the token is what gets
written. This is the rule most often broken and the one that costs most: 71
hardcoded values in this build all had a token sitting unused beside them.

Three exceptions, and only three:

- Media query conditions — custom properties are not allowed there
- Editor swatch hexes — attribute selectors must match the literal text
- Deliberately theme-flat colours, which point at a flat token instead

**No static inline styles.** A style that is the same on every render is a
class. Inline is for values that come from data — a bar width, a series colour.

**Both themes, always.** A colour declared in one theme only is a bug waiting
for someone to hit the toggle.

**Responsive: components adapt, they do not shrink.** A table becomes rows. A
row becomes a stack. Nothing is scaled down until it is unreadable.

The build's breakpoints, all `max-width`:

| px | What changes |
|---|---|
| 1024 | header search hides |
| 860 | header collapses to the menu button; footer embed grid stacks |
| 640 | the phone break — search, rows, post chrome |
| 600 | dashboard tabs wrap; TODAY's sheet goes single column |
| 520 | year and panel grids stack |
| 480 | split readouts stack |

Four more exist for single components (900, 820, 760, 440), and two are
off-by-one partners of the main ones (859, 599) where a rule needs "below" and
its sibling needs "at or above". Reuse the six; add a seventh only when a
component genuinely breaks somewhere else.

---

## 6. Starter block

```css
:root{
  /* chrome */
  --bg:#F4F2EC;--surface:#FFFFFF;--surface-alt:#FAF7F0;
  --text:#201D16;--muted:#857E70;--soft:#6F695E;
  --edge:#E5E0D5;--edge-strong:#201D16;
  --rule:color-mix(in oklch,var(--muted) 55%,transparent);
  --grid:rgba(33,29,22,.085);
  /* ink — header and footer, dark in both themes */
  --ink:#16140E;--ink-fg:#F3EFE6;--ink-muted:rgba(243,239,230,.62);
  --ink-line:rgba(243,239,230,.12);
  /* accent */
  --accent:#35618E;--accent-dk:#28496A;--accent-ink:#3C6A97;
  --accent-soft:rgba(53,97,142,.10);--accent-out:rgba(53,97,142,.30);
  --on-accent:#FFFFFF;--on-accent-2:rgba(255,255,255,.88);
  --on-accent-3:rgba(255,255,255,.6);--on-accent-line:rgba(255,255,255,.22);
  /* data — dusty for identity and state */
  --d-red:#B9695E;--d-gold:#BC9152;--d-teal:#5E93A1;--d-green:#5D9375;
  --d-plum:#8571A8;--d-blue:#6E869E;--d-grey:#8C8A87;
  /* data — vivid for series and small marks */
  --c-red:#E04A3A;--c-gold:#E0991C;--c-teal:#2BA8C0;--c-green:#23A35E;
  --c-plum:#8E5BC0;--c-tan:#B79A6B;--c-blue:#5E7A99;--c-orange:#DE6F00;
  --c-gridline:#EBE5D9;
  /* semantic */
  --good:#1F9A86;--alert:#D23B2C;--code-bg:#5A554C;--code-fg:#F3EFE6;
  /* prose */
  --text-body:color-mix(in srgb,var(--text) 86%,var(--bg));
  --surface-sunk:color-mix(in srgb,var(--text) 4%,var(--bg));
  --qgrid:rgba(33,29,22,.05);
  /* skeleton */
  --sk-fill:var(--c-gridline);--sk-glint:var(--surface-alt);
  --sk-fill-on:var(--on-accent-line);--sk-glint-on:rgba(255,255,255,.34);
  /* type */
  --display:'Schibsted Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --body:'Figtree','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --mono:'IBM Plex Mono',monospace;
  /* space */
  --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;
  --s6:32px;--s7:48px;--s8:64px;--s9:96px;
  /* shape */
  --r-sm:8px;--r-md:12px;--r-lg:16px;--r-pill:999px;
  /* layout */
  --measure:828px;--text-measure:740px;--quote-measure:620px;--wide:1120px;
  --gutter:44px;--header-h:78px;
  /* depth and motion */
  --shadow-hover:0 10px 24px rgba(33,29,22,.12);
  --shadow-menu:0 18px 44px rgba(0,0,0,.4);
  --shadow-tip:0 6px 20px rgba(32,29,22,.14);
  --ease:.16s ease;
}

[data-theme="dark"]{
  --bg:#262320;--surface:#302C26;--surface-alt:#363021;
  --text:#EFEAE0;--muted:#ABA08D;--soft:#C4BAA9;
  --edge:#3B362D;--edge-strong:#6E6656;--grid:rgba(243,239,230,.055);
  --ink:#1C1A15;--ink-fg:#F3EFE6;--ink-muted:rgba(243,239,230,.58);
  --ink-line:rgba(243,239,230,.12);
  --accent:#82A9D0;--accent-dk:#9CBBDD;--accent-ink:#82A9D0;
  --accent-soft:rgba(130,169,208,.16);--accent-out:rgba(130,169,208,.40);
  --on-accent:#16140E;--on-accent-2:rgba(22,20,14,.84);
  --on-accent-3:rgba(22,20,14,.55);--on-accent-line:rgba(22,20,14,.22);
  --d-red:#CE8478;--d-gold:#D3A768;--d-teal:#7BAEBD;--d-green:#79B292;
  --d-plum:#A48CC4;--d-blue:#8DA3BD;--d-grey:#A8A6A2;
  --c-red:#F0604E;--c-gold:#E9AE3E;--c-teal:#46BBD0;--c-green:#3FB873;
  --c-plum:#A877D6;--c-tan:#CBB07E;--c-blue:#86A2C0;--c-orange:#F48D2F;
  --c-gridline:rgba(243,239,230,.12);
  --good:#3FB873;--alert:#E2645A;
  --qgrid:rgba(239,234,224,.045);
  --sk-fill:var(--edge);--sk-glint:var(--c-gridline);
  --sk-fill-on:var(--on-accent-line);--sk-glint-on:rgba(22,20,14,.08);
}
```

Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700;800&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:wght@400;500&display=swap">
```
