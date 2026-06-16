# PLAN — Login page redesign (Coralcove / DESIGN.md)

> Source spec: [SPEC.md](../SPEC.md) · Date 2026-06-16
> Scope: `app/login/*` + `login.*` keys in `lib/i18n/dict.ts`. Nothing else.
> (แทนที่ plan เดิมของ Future-work 4 รายการ ที่เสร็จไปแล้ว)

## Dependency graph

```
T1 i18n keys (dict.ts)
      │
      ▼
T2 provider shell (LanguageProvider + ThemeProvider on /login)
      │            keys ready → can call t(); theme ctx → useTheme()
      ▼
T3 layout + light theme (login-form.tsx markup + login.css)   ◄── needs T1 (t) + T2 (ctx)
      │
      ▼
T4 dark theme overrides (login.css §10)                        ◄── needs T3 markup/classes
      │
      ▼
T5 responsive (<900px collapse)                                ◄── needs T3 layout
      │
      ▼
T6 build + verify (mock, light/dark, TH/EN, responsive)        ◄── gate before commit
```

Each task is a **vertical slice**: it leaves `/login` rendering and `npm run build`
passing. T1+T2 are foundation but small; T3 is the bulk; T4/T5 layer onto T3's classes.

## Files touched
- `lib/i18n/dict.ts` — add `login.*` block to `th` and `en` (T1)
- `app/login/page.tsx` — server entry, render client shell (T2)
- `app/login/login-shell.tsx` — NEW `'use client'`: mounts providers + toggles (T2)
- `app/login/login-form.tsx` — new markup, `useLang()`/`useTheme()`, keep auth logic (T3)
- `app/login/login.css` — rewrite: Coralcove tokens, layout, light (T3), dark (T4), responsive (T5)

## Key technical notes
- Image: `background-image:url('/Image/Signage-Status-Login_Long.png')`,
  `background-size:cover` (public path, not import). Bottom gradient scrim for legibility.
- Providers default `en`/`light`, read localStorage in effect → no hydration mismatch.
  Mount BOTH above any component calling `useLang()`/`useTheme()`.
- Theme applied to `.login-page` root via `.dark` class derived from `useTheme()`.
- Fonts: `var(--font-display)` (Plus Jakarta), `var(--font-ui)` (Inter),
  `var(--font-mono)` (JetBrains) — drop `'Sora'`.
- Auth logic in `handleLogin`/`handleDemo` copied verbatim — only strings → `t()`.

## Checkpoints
- **CP-1 (after T2):** `/login` loads with providers; lang + theme toggle work; build passes.
- **CP-2 (after T3):** light theme matches reference layout; all strings via `t()`; build passes.
- **CP-3 (after T5):** dark + responsive complete.
- **CP-4 (T6):** full manual verify in mock mode → commit.

## Risks
- Provider placement / hydration → mitigate with existing effect-based localStorage read.
- Wide image in tall left panel → `cover` + scrim handles crop; verify focal area looks ok.
- CSS leak into dashboard → all rules scoped under `.login-page`.
