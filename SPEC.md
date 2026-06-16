# SPEC.md — Login page redesign (Coralcove / DESIGN.md)

> Spec-driven development · Smart Signage Dashboard (Live Demo)
> สร้างเมื่อ 2026-06-16 · งานค้างข้อสุดท้ายจาก CLAUDE.md ("เหลือ: หน้า login เท่านั้น")
> Scope: redesign `app/login/` only. ไม่แตะ data-layer / dashboard / auth-logic
> (สเปกเดิมของหน้า Settings เสร็จแล้ว — ถูกแทนที่ด้วยไฟล์นี้)

---

## 1. Objective (เป้าหมาย)

เปลี่ยนหน้า login จาก dark-glassmorphism เดิม → **layout สองพาเนลตาม
`public/reference/reference_1.jpg`** สไตล์ด้วย **Coralcove design system (`DESIGN.md`)**
โดยใช้ **`public/Image/Signage-Status-Login_Long.png`** เป็นภาพพาเนลซ้าย

**ผู้ใช้เป้าหมาย:** ผู้เยี่ยมชม portfolio / recruiter ที่เปิด live demo —
first impression ต้องดู production-grade, สงบ (calm), และเข้าชุดกับ dashboard

**Why now:** login เป็นหน้าเดียวที่ยังไม่ได้ใช้ Coralcove tokens และยังไม่มี i18n
(ตาม CLAUDE.md). หน้าเดิมยังอ้างฟอนต์ `'Sora'` ที่ไม่ได้โหลด → การ redesign นี้แก้บั๊กจริงด้วย

**Definition of done:** เปิด `/login` แล้วได้ layout ตาม reference, ใช้ DESIGN.md tokens,
รองรับ light+dark + TH/EN, ฟังก์ชัน login/demo/remember/show-pw ครบ, และ
**โหมด mock ยังรันได้** + `npm run build` ผ่าน

### Layout target (จาก reference_1.jpg)
```
┌───────────────────────────┬──────────────────────┐
│  LEFT  (≈55%)             │  RIGHT (≈45%)        │
│  Signage image (cover)    │  form card on canvas │
│  brand มุมบนซ้าย          │  H1 "ยินดีต้อนรับ"   │
│  headline + sub ซ้อนล่าง  │  email / password    │
│  (gradient scrim ให้อ่านออก)│  remember + show-pw │
│                           │  [เข้าสู่ระบบ]        │
│                           │  [เข้าชม Live Demo]   │
│                           │  demo notice         │
└───────────────────────────┴──────────────────────┘
```

---

## 2. Decisions (ยืนยันกับผู้ใช้แล้ว)

| หัวข้อ | การตัดสินใจ |
| --- | --- |
| Theme | **รองรับทั้ง light + dark** — light เป็น default (DESIGN.md); dark ตาม DESIGN.md §10. persist ผ่าน `localStorage 'cc-theme'` เดิม (sync กับ dashboard) |
| ภาพซ้าย | `Signage-Status-Login_Long.png` **เต็มพาเนลซ้าย `object-fit: cover`** + brand บนซ้าย + headline/sub ซ้อนบน gradient scrim ด้านล่างให้อ่านออก |
| Live Demo bypass | **คงไว้** — ปุ่ม "เข้าชม Live Demo" + demo notice (สำคัญต่อ portfolio) |
| Remember me + show/hide password | **คงไว้** — checkbox + ปุ่ม toggle ตา |
| i18n | **เพิ่ม login เข้า i18n** — คีย์ `login.*` ใน `lib/i18n/dict.ts` (TH+EN, default EN); login mount `LanguageProvider` |

---

## 3. Core Features & Acceptance Criteria

### 3.1 Layout & responsive
- ภาพซ้าย / ฟอร์มขวา ตาม reference_1.jpg
- **AC:** จอแคบ (`< 900px`) → พาเนลภาพยุบ (ซ่อน หรือเป็น banner บน), ฟอร์มใช้งานได้เต็มความกว้าง ไม่ล้น

### 3.2 Design tokens (DESIGN.md)
- brand `#3B6CFF`, ink `#0F1B3D`, surface `#FFFFFF`/`#EEF2FA`, line `#E3E9F4`
- ฟอนต์ผ่าน CSS vars เดิม `--font-display` / `--font-ui` / `--font-mono` (เลิกใช้ `'Sora'`)
- **AC:** ปุ่มหลัก = primary ของ DESIGN.md (`linear-gradient(135deg,#3B6CFF,#1F3FA8)`, ขาว, radius 10px, shadow `0 8px 18px -8px rgba(59,108,255,.55)`, press `translateY(1px)`)
- **AC:** input = form field ของ DESIGN.md (สูง 38–40px, radius 10px, border `#E3E9F4`, focus border `#3B6CFF` + ring `0 0 0 3px rgba(59,108,255,.15)`)

### 3.3 Light + Dark
- **AC:** ทั้งสองธีม render ถูกต้อง; dark ใช้ §10 tokens (canvas `#070C20`, card `#111A3D`, brand `#5C86FF`)
- **AC:** toggle ธีมบน login → persist `localStorage 'cc-theme'` + ค่าตรงกับที่ dashboard เก็บ

### 3.4 i18n (TH/EN)
- **AC:** ทุกข้อความที่มองเห็นมาจาก `t('login.*')`; สลับ TH/EN re-render ทันที ไม่ reload; default EN; ไม่เหลือ hardcoded string

### 3.5 Functionality (คงของเดิม)
- **AC:** email/password sign-in, ปุ่ม "เข้าสู่ระบบ", Live Demo bypass, remember-me, show/hide password, loading + error/success states ทำงานเหมือนเดิมทุกอย่าง

### 3.6 Dual-mode
- **AC (สำคัญสุด):** mock mode (ไม่มี `.env.local`) → `/login` โหลดได้, ปุ่ม Demo พาไป `/dashboard` ได้; `npm run build` ผ่าน
- **AC:** ภาพอ้างจาก `/Image/Signage-Status-Login_Long.png` (public) ไม่ import เป็น module

---

## 4. Tech Stack & Constraints
- Next.js 16 (App Router) + React 19 + TS; CSS ธรรมดา (**ไม่ใช้ Tailwind**)
- Dual-mode: เรียก `createClient()` เหมือนเดิม — ห้าม branch ในหน้า
- ฟอนต์โหลดแล้วใน `app/layout.tsx` เป็น CSS vars (`--font-display/ui/mono`)
- ธีม/ภาษา: ใช้ provider เดิม (`ThemeProvider`, `LanguageProvider`) — login ต้อง mount เอง (ปัจจุบัน wrap แค่ dashboard)

---

## 5. Project Structure (ไฟล์ที่จะเพิ่ม/แก้)

```
app/login/
  page.tsx          # คงเป็น server entry; render client wrapper
  login-form.tsx    # แก้ — markup/JSX ใหม่ตาม reference + useLang()/useTheme(); auth logic เดิม
  login.css         # เขียนใหม่ — Coralcove tokens, light + .login-page.dark, responsive
  login-shell.tsx   # ใหม่ (ถ้าจำเป็น) — 'use client' wrapper ใส่ LanguageProvider + ThemeProvider + toggles

lib/i18n/
  dict.ts           # แก้ — เพิ่มคีย์ login.* ทั้ง th และ en
```

**หมายเหตุ:** ถ้าไม่อยากเพิ่ม `login-shell.tsx` แยก สามารถ mount providers ใน `login-form.tsx`
หรือ wrap ใน `page.tsx` ก็ได้ — เลือกตอน build ให้ provider อยู่เหนือ component ที่เรียก `useLang()`/`useTheme()`

---

## 6. Code Style & Testing

### Code style
- CSS scope ใต้ `.login-page` (+ `.login-page.dark`) เพื่อกันรั่วไป dashboard; ไม่ใช้ Tailwind
- นิยาม CSS-var tokens ของ DESIGN.md ใน `login.css`; ไม่ hardcode hex inline ใน TSX ที่มี token อยู่แล้ว
- ไอคอน stroke-only (DESIGN.md) — แทน emoji ตา/brand ด้วย inline SVG หรือ lucide
- comment ไทยสั้น ๆ ตาม voice เดิมของ repo

### Testing / Verify (manual — ตาม CLAUDE.md checklist)
1. `npm run build` ผ่าน (บังคับก่อน commit)
2. **mock mode** (ไม่มี `.env.local`): `npm run dev` → `/login`
   - light + dark ถูกต้อง; TH + EN สลับได้
   - sign-in + ปุ่ม Live Demo → ไป `/dashboard`
3. responsive: ย่อจอ `< 900px` → พาเนลภาพยุบ, ฟอร์มไม่ล้น
4. (option) `browser-testing-with-devtools` screenshot light & dark เทียบ reference

---

## 7. Boundaries (ขอบเขต)

### ✅ Always
- รักษา dual-mode (mock + real ทำงานได้เสมอ); คง auth logic เดิม
- ใช้ Coralcove DESIGN.md tokens; `npm run build` ผ่านก่อน commit
- commit ลงท้าย `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

### ⚠️ Ask first
- การแก้นอก `app/login/` (ยกเว้นเพิ่มคีย์ `login.*` ใน `dict.ts`)
- เพิ่ม dependency ใหม่
- เปลี่ยน default theme/language ระดับ global

### ❌ Never
- commit `.env.local` / service_role key
- แตะ repo บริษัท `signage-status-clude`; ผูก login กับข้อมูลจริงของบริษัท
- ลบปุ่ม Live Demo bypass หรือ demo notice ("ใส่อะไรก็เข้าได้")
- แตะ `dashboard.css` (MASTER)

---

## Out of scope (รอบถัดไป)
- command palette ค้นหา device
- notification realtime (Supabase subscription)
