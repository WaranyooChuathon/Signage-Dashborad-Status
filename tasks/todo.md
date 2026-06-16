# TODO — Login page redesign (Coralcove / DESIGN.md) ✅ เสร็จ (2026-06-16)

> อ้างอิง `tasks/plan.md` + `SPEC.md` · ทุก task: build ผ่าน + mock โหลดได้ ก่อนไปต่อ
> verify แล้ว (Chrome DevTools): light + dark, TH/EN live switch ตรง reference

## T1 — i18n keys
- [ ] เพิ่มบล็อก `login.*` ใน `lib/i18n/dict.ts` (ทั้ง `th` + `en`)
- keys: brandName, brandSub, headline, headlineEm, desc, welcome, formSub,
  emailLabel, passwordLabel, remember, signIn, signingIn, demoBtn, demoNotice,
  errEmpty, errAuth, errNoDemo, success, successDemo, showPw, hidePw, terms, privacy, contact
- **AC:** TS compile ผ่าน (`DictKey` ครอบคีย์ใหม่); ค่า en/th ครบทุกคีย์

## T2 — Provider shell + toggles
- [ ] `app/login/login-shell.tsx` (ใหม่, `'use client'`) — wrap `LanguageProvider` + `ThemeProvider`
- [ ] `page.tsx` render shell → form
- [ ] toggle ภาษา (TH/EN) + ธีม (light/dark) บนหน้า login
- **AC (CP-1):** `/login` โหลด, toggle ภาษา/ธีมทำงาน + persist localStorage, `npm run build` ผ่าน

## T3 — Layout + light theme (bulk)
- [ ] `login-form.tsx` markup ใหม่: ซ้าย=ภาพ cover + brand + headline scrim, ขวา=form card
- [ ] ใช้ `useLang().t()` แทน string ทั้งหมด; `useTheme()` ขับ `.dark`
- [ ] `login.css` เขียนใหม่: Coralcove tokens (light), primary button, input fields, fonts vars
- [ ] คง auth logic (`handleLogin`/`handleDemo`), remember-me, show/hide pw
- **AC (CP-2):** light ตรง reference_1.jpg; ปุ่ม/อินพุตตาม DESIGN.md; ไม่มี hardcoded string; ไม่มี `'Sora'`; build ผ่าน

## T4 — Dark theme
- [ ] `.login-page.dark` overrides ตาม DESIGN.md §10 (canvas #070C20, card #111A3D, brand #5C86FF, glow/inset)
- **AC:** สลับ dark → ทุกองค์ประกอบอ่านออก/คอนทราสต์โอเค

## T5 — Responsive
- [ ] `< 900px` → พาเนลภาพยุบ (ซ่อน/เป็น banner บน), ฟอร์มเต็มกว้าง ไม่ล้น
- **AC (CP-3):** desktop + narrow ใช้งานได้ทั้งคู่

## T6 — Build + verify + commit
- [ ] `npm run build` ผ่าน
- [ ] mock (`npm run dev`, ไม่มี `.env.local`): `/login` → light/dark, TH/EN, sign-in + Live Demo → `/dashboard`
- [ ] responsive ย่อจอ
- [ ] commit (`Co-Authored-By: Claude Opus 4.8`)
- **AC (CP-4):** ครบทุกข้อ → commit

## Out of scope
- command palette ค้นหา device · notification realtime
