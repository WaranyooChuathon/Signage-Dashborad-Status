# DESIGN.md — Coralcove Health

> A cool-toned operations design system for healthcare dashboards.
> Extracted from `Cool Health Dashboard.html` and codified for AI coding agents.

- **Project:** Coralcove Health · Operations Dashboard
- **Version:** 1.1 · 19 May 2026 · adds dark mode
- **Domain:** Clinical / hospital operations
- **Spec format:** [DESIGN.md (Google Stitch)](https://stitch.withgoogle.com/docs/design-md/format/)
- **Themes:** Light (default) · Dark (`[data-theme="dark"]`)

---

## 1. Visual Theme & Atmosphere

**Mood:** Calm, precise, clinically credible. The interface should feel like a quiet operating room — low-contrast surfaces, generous whitespace, and a single color speaking at a time.

**Design philosophy:**
- **Calm by default.** The base canvas is soft slate-toned and low-contrast so vital signs and anomalies stand out when they need to.
- **Cool, never cold.** Blues lean warm-blue; teal and cyan keep the system alive. Avoid icy greys and pure-white surfaces.
- **Data first, chrome last.** Numbers, names, and trends get heavy display weights. Borders, dividers, and chrome fade into the background.
- **Precision in motion.** Transitions are 150–250ms and never decorative — they confirm causation, never distract from the data.

**Density:** Medium-comfortable. Cards have 18–24px padding, KPIs around 16–18px, and inputs stay at 36–38px tall.

**Surface treatment:**
- Background uses two faint radial gradients (cyan top-right, ocean top-left) over a warm-slate base — never a flat color.
- Cards are pure white (`#FFFFFF`) with a 1px `#E3E9F4` border and a barely-visible `0 1px 2px` shadow.
- KPI hero cards use bold linear gradients with a colored ambient blob in the lower-right corner for depth.

**Voice & tone:** Direct, factual, warm. "Good morning, Dr. Suthida" — name-first, no exclamation marks. Metrics are always labeled with units. Avoid jargon-heavy clinical phrasing on UI chrome; reserve it for content surfaces.

---

## 2. Color Palette & Roles

### Brand (signature gradient set)

| Token         | Hex       | Role                                      |
| ------------- | --------- | ----------------------------------------- |
| `--brand-deep`| `#1F3FA8` | Active states, sidebar rail, gradient end |
| `--brand`     | `#3B6CFF` | Primary buttons, links, key data series   |
| `--brand-2`   | `#5C86FF` | Hover state for `--brand`                 |
| `--cyan`      | `#22D3EE` | Highlight accent inside gradients         |
| `--teal`      | `#14B8A6` | Success, cost-line series, "alive" accent |

### Supporting hues (data viz only — never brand surfaces)

| Token       | Hex       | Use                                  |
| ----------- | --------- | ------------------------------------ |
| `--indigo`  | `#6366F1` | 4th data series, "ICU" tag           |
| `--violet`  | `#8B5CF6` | 5th data series, "Surgery" tag       |
| `--sky`     | `#38BDF8` | Reserved — alternate cyan if needed  |
| `--pink`    | `#F472B6` | 6th data series only                 |

### Semantic

| Token       | Hex       | Role                                    |
| ----------- | --------- | --------------------------------------- |
| `--success` | `#14B8A6` | Stable status, positive trend, approve  |
| `--warning` | `#F59E0B` | Caution, pending review                 |
| `--danger`  | `#F43F5E` | Critical alerts, discharge, destructive |

### Neutrals — Warm slate (all subtly blue-tinted, never pure grey)

| Token         | Hex       | Role                                       |
| ------------- | --------- | ------------------------------------------ |
| `--bg-2`      | `#F7F9FD` | Subtle surface (segmented track, demo bg)  |
| `--bg`        | `#EEF2FA` | App canvas base                            |
| `--line-2`    | `#EEF1F8` | Faint divider                              |
| `--line`      | `#E3E9F4` | Default border                             |
| `--muted-2`   | `#98A2BD` | Tertiary text, axis labels                 |
| `--muted`     | `#6B7799` | Secondary text                             |
| `--ink-2`     | `#1F2A4D` | Body text, form values                     |
| `--ink`       | `#0F1B3D` | Primary text, display numbers              |

### Signature gradients (KPI hero cards only)

```css
/* Teal — for "Total Patients" */
background: linear-gradient(135deg, #0E9488 0%, #14B8A6 55%, #2DD4BF 100%);

/* Ocean — for "Operational Cost" */
background: linear-gradient(135deg, #1F3FA8 0%, #3B6CFF 55%, #60A5FA 100%);

/* Indigo — for "Avg Patient / Doctor" */
background: linear-gradient(135deg, #4338CA 0%, #6366F1 55%, #818CF8 100%);
```

Each gradient pairs with a colored ambient blob: `#5EEAD4` (teal), `#93C5FD` (ocean), `#A5B4FC` (indigo) at 22% opacity, blurred 2px, positioned bottom-right.

---

## 3. Typography Rules

### Font families

| Family               | Role                                          | Source        |
| -------------------- | --------------------------------------------- | ------------- |
| `Plus Jakarta Sans`  | Display, headlines, KPI values                | Google Fonts  |
| `Inter`              | All UI text, body, labels, buttons            | Google Fonts  |
| `JetBrains Mono`     | Metrics, IDs, percentages, codes, axis labels | Google Fonts  |

**Fallback stack:** `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`

### Type scale

| Style          | Family               | Size / Line       | Weight | Tracking | Usage                                        |
| -------------- | -------------------- | ----------------- | ------ | -------- | -------------------------------------------- |
| `display-xl`   | Plus Jakarta Sans    | 52 / 1.04         | 800    | -0.035em | Hero numbers, marketing headlines            |
| `display-l`    | Plus Jakarta Sans    | 34 / 1.05         | 700    | -0.025em | KPI values, section heroes                   |
| `display-m`    | Plus Jakarta Sans    | 24 / 1.15         | 700    | -0.02em  | Page H1 ("Good morning, Dr. …")              |
| `display-s`    | Plus Jakarta Sans    | 16                | 700    | -0.01em  | Card titles                                  |
| `body-l`       | Inter                | 15.5 / 1.55       | 400    | normal   | Marketing copy, hero descriptions            |
| `body`         | Inter                | 13.5 / 1.55       | 400    | normal   | Default body text                            |
| `body-s`       | Inter                | 12.5 / 1.5        | 400    | normal   | Captions, helper text, card subtitles        |
| `caption`      | Inter                | 11                | 400    | normal   | Smallest secondary text                      |
| `eyebrow`      | Inter                | 10.5              | 600    | 0.08em   | Uppercase section labels, KPI labels         |
| `mono-metric`  | JetBrains Mono       | 12                | 500    | normal   | All numerals, codes, hex values              |

### Typography rules

- **Numbers are always mono.** Patient counts, IDs, percentages, currency, timestamps — everything tabular uses `JetBrains Mono`.
- **Display type uses negative tracking.** Larger sizes get tighter letter-spacing (-0.035em at XL, -0.01em at S).
- **Body uses Inter at 1.55 line-height.** Never compress body line-height below 1.5.
- **Eyebrow labels are uppercase + 0.08em tracking + weight 600.** Used above KPI labels and section numbers.
- **Headings never use weight below 700.** Display always feels confident, never thin.

---

## 4. Component Stylings

### Buttons

**Anatomy:** `36px` height (default) · `10px` radius · `12.5px` font · weight `600` · gap `7px` for icon+label.

| Variant       | Background                                  | Text    | Border  | Shadow                                            |
| ------------- | ------------------------------------------- | ------- | ------- | ------------------------------------------------- |
| `primary`     | `linear-gradient(135deg,#3B6CFF,#1F3FA8)`   | `#FFF`  | none    | `0 8px 18px -8px rgba(59,108,255,.55)`            |
| `teal`        | `linear-gradient(135deg,#14B8A6,#0E9488)`   | `#FFF`  | none    | `0 8px 18px -8px rgba(20,184,166,.55)`            |
| `secondary`   | `#FFF`                                      | `#1F2A4D` | `1px #E3E9F4` | `var(--shadow-sm)`                       |
| `ghost`       | transparent                                 | `#6B7799` | none  | none                                              |
| `danger`      | `linear-gradient(135deg,#F43F5E,#E11D48)`   | `#FFF`  | none    | `0 8px 18px -8px rgba(244,63,94,.55)`             |

**Sizes:** `sm` 30/8/11.5px · `default` 36/10/12.5px · `lg` 44/11/13.5px (height/radius/font).

**Press state:** `transform: translateY(1px)` · transition 120ms.

### Badges

`3px 9px` padding · `20px` radius · `11px` font · weight `600`. Each color pair is a tinted background + deeper text of the same hue.

| Variant     | BG        | Text      | Use                         |
| ----------- | --------- | --------- | --------------------------- |
| `blue`      | `#EEF2FF` | `#1F3FA8` | "Admitted"                  |
| `teal`      | `#CCFBF1` | `#0F766E` | "Stable", "Success"         |
| `cyan`      | `#CFFAFE` | `#0E7490` | "Outpatient"                |
| `indigo`    | `#E0E7FF` | `#3730A3` | "ICU"                       |
| `violet`    | `#EDE9FE` | `#5B21B6` | "Surgery"                   |
| `rose`      | `#FFE4E6` | `#9F1239` | "Critical"                  |
| `slate`     | `#F1F5F9` | `#475569` | "Archived"                  |
| `up` (trend)| `rgba(20,184,166,.12)` | `#0F766E` | `+4.6%`        |
| `down`(trend)| `rgba(244,63,94,.12)` | `#9F1239` | `-2.1%`        |

Optional leading dot: `6px` circle, full color (matches badge intent), `5px` gap from text.

### Form fields

- **Input height:** 38px · **radius:** 10px · **padding:** 0 12px
- **Default:** `#FFF` background, `1px #E3E9F4` border, `var(--shadow-sm)`
- **Focused:** border `#3B6CFF`, ring `0 0 0 3px rgba(59,108,255,.15)`
- **Value text:** `Inter` 12.5px `#0F1B3D`
- **Label:** `Inter` 11.5px weight 500 `#1F2A4D` · 6px gap above input
- **Helper text:** `Inter` 10.5px `#6B7799` · `.help.err` flips to `#9F1239`
- **Icon affordance:** 14px stroke icon in `#6B7799`, 8px gap from value

### Segmented control

- Track: `#F7F9FD` background, `1px #E3E9F4` border, 9px radius, 3px padding
- Buttons: 11.5px font, 6px/12px padding, 7px radius, weight 500, color `#6B7799`
- Active button: `#FFF` background, color `#1F3FA8`, weight 600, shadow `0 1px 2px rgba(15,27,61,.06), 0 0 0 1px var(--line)`

### Toggle

- Track: 34×20 · radius 20 · default `#E2E8F0` · on: `linear-gradient(135deg,#3B6CFF,#22D3EE)`
- Thumb: 16×16 circle, `#FFF`, shadow `0 2px 4px rgba(15,27,61,.2)` · slides left 2 → left 16 over 200ms

### KPI hero cards

- **Container:** 18px radius · 18/20px padding · min-height 142px · color `#FFF`
- **Gradient:** one of the three signature gradients above
- **Shadow:** gradient-tinted glow + neutral lift, e.g. `0 18px 36px -16px rgba(20,184,166,.45), 0 6px 14px -8px rgba(15,27,61,.25)`
- **Decoration:** a 140×140 colored blob at 22% opacity, bottom-right offset, blurred 2px
- **Label:** eyebrow style (10.5px / 600 / .05em uppercase / 88% opacity)
- **Icon affordance:** 36×36 rounded-10 square, `rgba(255,255,255,.18)` background, `1px rgba(255,255,255,.25)` border, `backdrop-filter: blur(4px)`, top-right
- **Value:** Plus Jakarta 30–34px / 700 / -0.02em
- **Trend pill:** built-in bottom-right, mirrors the badge style but on a translucent white background

### Sidebar navigation

Two-pillar layout:
- **Slim rail:** 60px wide · gradient `linear-gradient(180deg,#1F3FA8 0%,#1A3494 100%)` · holds icons-only shortcuts
- **Panel:** 252px wide · `#FFF` · holds brand, search, grouped nav, info card, settings

**Nav item:**
- Resting: 13px Inter weight 500 · color `#6B7799` · 9/10px padding · 9px radius
- Active: background `linear-gradient(90deg, rgba(59,108,255,.10), rgba(34,211,238,.06))` · color `#1F3FA8` · weight 600 · 3px gradient bar on the left (offset -12px, gradient `#3B6CFF → #22D3EE`)
- Badge inside: `#EEF2FF` background, `#1F3FA8` text, 10px font weight 600, 2/6px padding, 6px radius

### Cards (data widgets)

- Background `#FFF` · 1px `#E3E9F4` border · 18px radius · 18/20px padding · `var(--shadow-sm)`
- **Card head:** flex row, space-between. Left = display-s title + 11.5px muted subtitle. Right = `···` menu button (26×26 / 7px radius / 1px line)
- **Subtitle gap:** 2px below title
- **Internal vertical rhythm:** 14px between major blocks

### Tooltip (chart)

- Background `#0F1B3D` · color `#FFF` · 10/12px padding · 10px radius · 170px width fixed
- Shadow `0 16px 30px -10px rgba(15,27,61,.4)`
- Title: Plus Jakarta 12.5px / 600
- Row: 7px gap · 11.5px font · series dot (7×7 / 2px radius / series color) + label (70% opacity) + mono value

### Progress bars

- Track: 8px height · 6px radius · `var(--bg-2)` background · 1px `var(--line-2)` border
- Fill: same radius · `linear-gradient(90deg, <series>, <series>cc)` · shadow `0 3px 8px -3px <series>88`
- Animation: width transitions 800ms `cubic-bezier(.22,.61,.36,1)`

---

## 5. Layout Principles

### Grid & containers

- **Page container:** max 1240px, 40px horizontal padding
- **Sidebar + main:** flex row, sidebar fixed 312px (60 rail + 252 panel)
- **Main padding:** 22/30/0px (top/sides/bottom-auto)
- **KPI row:** 3 equal columns, 18px gap
- **Bottom widgets row:** 3 columns at ratio `1.05fr 1.05fr 1fr`, 18px gap
- **Section spacing:** 18–22px between major rows

### Spacing scale (4pt grid)

| Token   | Value | Use                                          |
| ------- | ----- | -------------------------------------------- |
| `xs`    | 4px   | Icon-to-text in inline runs                  |
| `sm`    | 8px   | Inline gaps, segmented padding               |
| `md`    | 12px  | Field gaps, internal card padding            |
| `md-2`  | 14px  | Section internal rhythm, card-to-card        |
| `lg`    | 18px  | **Default grid gap, card padding**           |
| `xl`    | 24px  | Card padding (loose), TOC spacing            |
| `2xl`   | 32px  | Hero column gap                              |
| `3xl`   | 48px  | Page top padding                             |
| `4xl`   | 64px  | Major section separation                     |

> The dashboard primarily uses 8 / 14 / 18 / 24. Smaller values are reserved for tight UI states.

### Shape (radii)

| Token     | Value  | Use                                |
| --------- | ------ | ---------------------------------- |
| `chip`    | 6px    | Small chips, color swatches        |
| `sm`      | 8px    | Small buttons, kbd keys            |
| `input`   | 10px   | Inputs, default buttons, icon btns |
| `card-sm` | 14px   | Compact cards, segmented controls  |
| `card`    | 18px   | **Default card radius**, KPI hero  |
| `pill`    | 999px  | Badges, user chip, eyebrows        |

### Whitespace philosophy

- Headlines breathe — never push them against card edges; minimum 18px padding.
- Numbers never wrap. If a KPI value risks wrapping, downgrade size before wrapping.
- Charts get 24/36px inner padding (top/left) so axis labels never touch the card border.

---

## 6. Depth & Elevation

Three standard shadow tiers, all tinted with brand-ink (`rgba(15,27,61,…)`) for harmony with the cool palette.

| Token         | Value                                                                         | Use                       |
| ------------- | ----------------------------------------------------------------------------- | ------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(15,27,61,.04), 0 1px 1px rgba(15,27,61,.03)`                  | Resting cards, inputs     |
| `--shadow`    | `0 12px 28px -14px rgba(15,27,61,.18), 0 4px 10px -6px rgba(15,27,61,.08)`    | Floating elements, hover  |
| `--shadow-lg` | `0 28px 60px -28px rgba(15,27,61,.30), 0 10px 22px -14px rgba(15,27,61,.12)`  | Popovers, modals          |

### Colored glows

KPI hero cards layer a tinted glow that matches their gradient:

```css
/* Teal KPI */
box-shadow: 0 18px 36px -16px rgba(20,184,166,.45), 0 6px 14px -8px rgba(15,27,61,.25);

/* Ocean KPI */
box-shadow: 0 18px 36px -16px rgba(59,108,255,.45), 0 6px 14px -8px rgba(15,27,61,.25);

/* Indigo KPI */
box-shadow: 0 18px 36px -16px rgba(99,102,241,.45), 0 6px 14px -8px rgba(15,27,61,.25);
```

### Surface hierarchy (back to front)

1. **App canvas** — radial gradients on `--bg`. No shadow.
2. **Cards** — `--shadow-sm`, 1px `--line` border.
3. **KPI heroes / Primary buttons** — colored glow + gradient surface.
4. **Tooltips / popovers** — `--shadow-lg`, ink-90 background, no border.
5. **Modals** — `--shadow-lg` + page dim `rgba(15,27,61,.4)` overlay.

---

## 7. Do's and Don'ts

### ✅ Do

- **Lead with one accent per surface.** Pick the dominant series color for the card; supporting series fade to muted tints.
- **Use mono for every number.** Metrics, IDs, percentages, currency — everything tabular uses `JetBrains Mono`.
- **Reserve rose / danger for true alerts.** Discharge confirmations, critical badges, destructive actions. Never decorative.
- **Use the 3 signature gradients in that order.** Teal · Ocean · Indigo, left-to-right in the KPI row.
- **Pair every gradient with a tinted glow shadow.** A gradient surface without its colored shadow looks flat.
- **Tint neutrals blue.** All greys carry a faint cool tint (`#F7F9FD`, `#EEF2FA`, `#E3E9F4`) — they sit harmoniously against brand.
- **Animate state changes in 150–250ms.** Crisp enough to feel responsive, slow enough to register causation.

### ❌ Don't

- **Don't mix three gradients on one card.** Stacked gradients fight for attention and lose the cool, calm field.
- **Don't use pure black (`#000`) or pure white (`#FFF`) for text/surfaces.** Use `#0F1B3D` for ink and `#F7F9FD`/`#EEF2FA` for surfaces.
- **Don't color-code by department.** Departments use icons + labels. Color is reserved for data series and status.
- **Don't introduce warm hues outside `danger`/`warning`.** No oranges, reds, browns anywhere else.
- **Don't use icy / neutral greys.** A `#9CA3AF` Tailwind slate looks out of place — use `#98A2BD` instead.
- **Don't fill icons.** Every icon is stroke-only at weight 1.6 (default) or 2 (active).
- **Don't pad card padding under 18px.** Cards always breathe; tightening padding flattens the calm field.

---

## 8. Responsive Behavior

### Breakpoints

| Name      | Min width | Strategy                                              |
| --------- | --------- | ----------------------------------------------------- |
| `mobile`  | 0         | Sidebar collapses to top app bar; KPIs stack 1-col    |
| `tablet`  | 768px     | Sidebar collapses to slim rail only; KPIs 2-col       |
| `laptop`  | 1024px    | Full sidebar; KPIs 3-col; bottom widgets 2+1 stacked  |
| `desktop` | 1280px    | Full 3-col bottom row; full 1240px page container     |

### Collapsing strategy

- **Sidebar** has a `<` collapse button next to the brand. Collapsed = slim rail only (60px). On `tablet`, this is automatic.
- **KPI row** breaks from 3 → 2 → 1 column. The 3rd KPI moves to a new row at tablet, individual rows at mobile.
- **Bottom widgets** (donut · progress · radar): at tablet, donut + progress stay side-by-side, radar moves to a new row spanning full width.
- **Topbar actions** collapse right-to-left: avatar always visible → bell hides on mobile → export becomes icon-only on tablet → filter group becomes a single overflow menu on mobile.

### Touch targets

- Minimum 44×44 hit area on all interactive elements on touch viewports.
- On mobile, `btn` height bumps from 36 → 44 by default; small buttons go from 30 → 40.
- Chart bars maintain full-column-width invisible hit zones so tapping anywhere in a bar's lane reveals its tooltip.

### Density toggle

Not exposed in v1.0, but tokens are reserved: `--density-comfortable` (default), `--density-compact` (-2px on every height/padding).

---

## 9. Agent Prompt Guide

### Quick color reference

```
Brand deep    #1F3FA8   Primary blue    #3B6CFF   Hover blue   #5C86FF
Cyan accent   #22D3EE   Teal accent     #14B8A6
Indigo aux    #6366F1   Violet aux      #8B5CF6   Pink aux     #F472B6
Success       #14B8A6   Warning         #F59E0B   Danger       #F43F5E
Ink           #0F1B3D   Ink-2           #1F2A4D
Muted         #6B7799   Muted-2         #98A2BD
Line          #E3E9F4   Line-2          #EEF1F8
Bg            #EEF2FA   Bg-2            #F7F9FD
```

### Stack signature

- Fonts: `Plus Jakarta Sans` (display), `Inter` (UI), `JetBrains Mono` (numbers)
- Default radius: 10px (inputs/buttons) · 18px (cards)
- Default shadow: `0 1px 2px rgba(15,27,61,.04), 0 1px 1px rgba(15,27,61,.03)`
- Default border: `1px solid #E3E9F4`

### Ready-to-use prompts

**Build a dashboard widget:**
> Build a card widget for [metric]. Use `#FFF` background, `1px solid #E3E9F4` border, `18px` radius, `18px 20px` padding, and the standard `shadow-sm`. Title in Plus Jakarta Sans 14.5/700, subtitle in Inter 11.5/400 `#6B7799`. Numbers in JetBrains Mono. No fills on icons — stroke 1.6.

**Build a KPI hero card:**
> Build a KPI card with the [teal / ocean / indigo] signature gradient (`135deg`, three stops). Add a 140×140 colored blob (cyan/lavender/pale) at 22% opacity, blurred 2px, bottom-right. Include eyebrow label (10.5px / 600 / uppercase / .05em), 36×36 frosted icon top-right, value in Plus Jakarta 30/700 with `-0.02em` tracking, and a trend pill bottom-right with a translucent white background.

**Build a chart:**
> Use this categorical sequence in order: `#3B6CFF → #22D3EE → #14B8A6 → #6366F1 → #8B5CF6 → #F472B6`. Bars get vertical gradients (top brighter, bottom 60% darker). Line series get a 25→0% fill ramp underneath. Tooltip on hover: 170px wide, `#0F1B3D` background, mono numbers, series-colored dots.

**Build a sidebar:**
> Two-column sidebar: 60px navy gradient rail (`linear-gradient(180deg,#1F3FA8,#1A3494)`) + 252px white panel. Active nav item gets a 3px left bar with `linear-gradient(180deg,#3B6CFF,#22D3EE)` and a faint gradient background tint `linear-gradient(90deg, rgba(59,108,255,.10), rgba(34,211,238,.06))`. Active text color `#1F3FA8`.

**Build a button:**
> Primary button: `linear-gradient(135deg,#3B6CFF,#1F3FA8)` background, `#FFF` text, 10px radius, 36px height, Inter 12.5/600. Shadow `0 8px 18px -8px rgba(59,108,255,.55)`. Press state: `translateY(1px)`.

### What to avoid in prompts

- Don't reach for Tailwind defaults (`bg-blue-500`, `text-gray-900`) — they're too saturated and too cool-grey. Use the tokens.
- Don't request "modern gradients" — the system has three. Pick one.
- Don't use emoji unless the user explicitly asks. The aesthetic is clinical, not casual.
- Don't suggest a naive `filter:invert(1)` dark mode — Coralcove Dark is a parallel system, not an inversion (see § 10).

---

## 10. Dark Mode

Coralcove ships a full dark theme tuned for sustained low-light reading (overnight shifts, OR control rooms, dimmed war rooms). It is **not** an inversion of the light theme — surfaces, accents, and elevation are all retuned independently.

### Philosophy

- **Deep midnight, never pure black.** The canvas is `#070C20` — a navy so dark it reads black, but stays in the same blue family as the brand.
- **Glow replaces drop shadow.** In dark mode, depth comes from inner highlights + colored outer glows. A traditional drop shadow is invisible on dark surfaces.
- **Accents bump a half-step.** Saturation reads lower in low light; brand and accent colors shift slightly more luminous to compensate.
- **Borders are blue-tinted, not grey.** Lines pick up a faint blue cast (`#1E2856`) so they belong to the same color family as the gradients.

### Color tokens (dark)

#### Surfaces & ink

| Token        | Dark hex    | Role                                |
| ------------ | ----------- | ----------------------------------- |
| `--bg`       | `#070C20`   | App canvas (deep midnight)          |
| `--bg-2`     | `#0E1633`   | Raised surface, input backgrounds   |
| `--card`     | `#111A3D`   | Card / panel surface                |
| `--card-2`   | `#18224D`   | Card hover state                    |
| `--line-2`   | `#161E42`   | Faint divider                       |
| `--line`     | `#1E2856`   | Default border (blue-tinted)        |
| `--muted-2`  | `#5A6594`   | Tertiary text, axis labels          |
| `--muted`    | `#7E89B4`   | Muted body text                     |
| `--ink-2`    | `#BFCAEC`   | Secondary text, form values         |
| `--ink`      | `#EAF0FF`   | Primary text, display numbers       |

#### Accents (luminous +)

| Token         | Light       | Dark        | Notes                              |
| ------------- | ----------- | ----------- | ---------------------------------- |
| `--brand`     | `#3B6CFF`   | `#5C86FF`   | Primary brand bumps lighter        |
| `--brand-2`   | `#5C86FF`   | `#7C9DFF`   | Hover state, also bumped           |
| `--brand-deep`| `#1F3FA8`   | `#3B6CFF`   | Reserves the original brand here   |
| `--teal`      | `#14B8A6`   | `#2DD4BF`   | More luminous, less olive          |
| `--cyan`      | `#22D3EE`   | `#22D3EE`   | Unchanged — already luminous       |
| `--indigo`    | `#6366F1`   | `#818CF8`   | Bumped lighter                     |
| `--violet`    | `#8B5CF6`   | `#A78BFA`   | Bumped lighter                     |
| `--danger`    | `#F43F5E`   | `#FB7185`   | Softer rose, less harsh on dark    |

### Surface treatment

```css
/* App canvas */
background:
  radial-gradient(1100px 600px at 90% -10%, rgba(34,211,238,.12), transparent 60%),
  radial-gradient(900px 500px at -10% 10%, rgba(92,134,255,.16), transparent 55%),
  radial-gradient(700px 400px at 50% 110%, rgba(45,212,191,.08), transparent 60%),
  #070C20;

/* Card */
background: #111A3D;
border: 1px solid #1E2856;
box-shadow:
  0 1px 2px rgba(0,0,0,.35),
  inset 0 1px 0 rgba(255,255,255,.025);   /* the "lit-from-top" highlight */
```

### Elevation in dark

| Token         | Dark value                                                                                  | Use                       |
| ------------- | ------------------------------------------------------------------------------------------- | ------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.025)`                           | Resting cards             |
| `--shadow`    | `0 16px 36px -16px rgba(0,0,0,.55), 0 4px 10px -6px rgba(0,0,0,.4)`                          | Floating elements         |
| `--shadow-lg` | `0 32px 64px -28px rgba(0,0,0,.65), 0 10px 22px -14px rgba(0,0,0,.5)`                        | Popovers, modals          |

### Colored glows (KPI hero cards)

Each gradient pairs with a brighter glow (40% larger blur, +10% opacity vs. light mode) plus a 1px top inner highlight:

```css
/* Teal KPI in dark */
background: linear-gradient(135deg, #0B6B62 0%, #14B8A6 55%, #2DD4BF 100%);
box-shadow:
  0 24px 48px -20px rgba(45,212,191,.55),
  0 6px 14px -8px rgba(0,0,0,.55),
  inset 0 1px 0 rgba(94,234,212,.30);

/* Ocean KPI in dark */
background: linear-gradient(135deg, #1B358F 0%, #3B6CFF 55%, #7AA0FF 100%);
box-shadow:
  0 24px 48px -20px rgba(92,134,255,.55),
  0 6px 14px -8px rgba(0,0,0,.55),
  inset 0 1px 0 rgba(147,197,253,.30);

/* Indigo KPI in dark */
background: linear-gradient(135deg, #3A2EB8 0%, #6366F1 55%, #A5B4FC 100%);
box-shadow:
  0 24px 48px -20px rgba(129,140,248,.55),
  0 6px 14px -8px rgba(0,0,0,.55),
  inset 0 1px 0 rgba(165,180,252,.30);
```

### Component overrides

- **Buttons (primary):** background remains a gradient, but pickup a top inner highlight: `inset 0 1px 0 rgba(255,255,255,.20)`.
- **Inputs:** background `#0E1633` (= `--bg-2`) instead of `#FFF`. Focus ring opacity stays at 15% but on `#5C86FF`.
- **Segmented control track:** `--bg-2`. Active button background: `rgba(92,134,255,.16)` with `inset 0 0 0 1px rgba(92,134,255,.30)`.
- **Sidebar rail:** darken the gradient further — `linear-gradient(180deg, #0B1330 0%, #050A1F 100%)`.
- **Sidebar panel:** `--card` background, `1px solid --line` right border.
- **Active nav item:** background `linear-gradient(90deg, rgba(92,134,255,.18), rgba(34,211,238,.08))` + `inset 0 0 0 1px rgba(92,134,255,.18)`. Text `--ink`.
- **Tooltip:** background stays the same value (`#070C20`) but gets a `1px solid rgba(92,134,255,.25)` border and a deeper shadow `0 22px 40px -12px rgba(0,0,0,.7)` so it reads on canvas.
- **Progress bars:** swap drop shadow for outer glow — `0 0 14px -2px <series>88, inset 0 1px 0 rgba(255,255,255,.15)`.
- **Chart grid lines:** `#1E2856`. Axis text: `#5A6594`. Hover guide: `#5C86FF` at 70% opacity.
- **Donut center circle:** fills with `--card` instead of `#FFF`. Active label text gets a subtle glow: `text-shadow: 0 0 12px <color>55`.
- **Notification dot:** add a halo glow `0 0 10px rgba(251,113,133,.6)` so it pulls focus without enlarging.
- **Scrollbar:** `#1E2856` thumb, `#2A356A` on hover, transparent track.

### Switching at runtime

Both themes share token names. Wrap dark overrides under `[data-theme="dark"]` on `<html>` and let CSS variables propagate.

```css
:root {
  --bg: #EEF2FA;    --card: #FFFFFF;
  --ink: #0F1B3D;   --line: #E3E9F4;
  --brand: #3B6CFF; --teal: #14B8A6;
  /* …rest of light tokens */
}

[data-theme="dark"] {
  --bg: #070C20;    --card: #111A3D;
  --ink: #EAF0FF;   --line: #1E2856;
  --brand: #5C86FF; --teal: #2DD4BF;
  /* …rest of dark tokens */
}
```

For static markup that hardcoded hex values (e.g. SVG charts), use a JS-side theme manager that swaps colors through the same token registry — never `filter: invert()`.

### Dark mode do's and don'ts

#### ✅ Do
- **Use colored outer glows for lift.** A drop shadow disappears on dark; a colored glow communicates depth and energy at once.
- **Add a 1px inner-top highlight (`inset 0 1px 0 rgba(255,255,255,.025)`) on every card.** It's invisible-but-felt — the "lit-from-above" trick.
- **Bump brand colors a half-step lighter in dark.** `#3B6CFF` → `#5C86FF`. `#14B8A6` → `#2DD4BF`.
- **Tint scrollbars and selections with brand.** `::selection` is `rgba(92,134,255,.35)`. Scrollbar thumb is `#1E2856`.

#### ❌ Don't
- **Don't use pure black `#000`.** It crushes the cool palette into a dead grey field. Use `#070C20`.
- **Don't invert the light theme** with CSS filters or naive color flipping. Gradients, photos, and trend colors all break.
- **Don't keep light-mode drop shadows on dark surfaces.** They're invisible. Replace with glow + inner highlight.
- **Don't darken the gradients fully.** Keep the lightest stop in each KPI gradient bright (`#2DD4BF`, `#7AA0FF`, `#A5B4FC`) — that's what gives dark mode its luminous quality.

### Ready-to-use prompt (dark)

> Build a dark dashboard card. Background `#111A3D`, border `1px solid #1E2856`, radius 18px, padding 18/20px. Add `inset 0 1px 0 rgba(255,255,255,.025)` for a subtle top highlight. Text in `#EAF0FF`, muted text in `#7E89B4`. Numbers in JetBrains Mono. Sit it on a canvas of `#070C20` with three ambient radial glows (cyan top-right, ocean top-left, teal bottom).


---

## File map

```
.
├──Dashborad Prototype Cool Toon
    ├── Cool Health Dashboard.html       # Light reference implementation
    ├── Cool Health Dashboard Dark.html  # Dark reference implementation
    ├── Coralcove Design System.html     # Visual token catalog (both themes)
    ├── DESIGN.md                        # This file — agent-readable spec
    ├── src/                             # Light dashboard sources
    │   ├── icons.jsx
    │   ├── sidebar.jsx
    │   ├── kpi.jsx
    │   ├── overview-chart.jsx
    │   ├── bottom-widgets.jsx
    │   └── app.jsx
    └── src-dark/                        # Dark dashboard sources (mirrors src/)
        └── …
```

---

*Coralcove Design System · v1.1 · Light + Dark. When you change a token here, update `Cool Health Dashboard.html`, `Cool Health Dashboard Dark.html`, and `Coralcove Design System.html` in the same commit.*
