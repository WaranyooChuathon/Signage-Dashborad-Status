# TODO — Brand logo + Avatar + ลบ AI-slop shadow ✅ เสร็จ (2026-06-16)

> อ้างอิง tasks/plan.md · verify แล้ว (Chrome DevTools): logo+avatar light/dark, ตาราง Users, nav active ไม่มี shadow

## T1 — util avatarFor
- [ ] `lib/ui/avatars.ts` — list ไฟล์รูป + `avatarFor(seed)` deterministic + pin demo email

## T2 — Brand logo (3 จุด)
- [ ] login: inline SVG → `<img src=/icon/logo-signage/signage-icon-128x128.png>` + แก้ `.lv-brand-icon`
- [ ] sidebar rail `.sb-rail-mark` → `<img>` (เอา gradient/bg ออก)
- [ ] sidebar panel `.sb-icon` → `<img>` (เอา gradient/shadow ออก)
- AC: โลโก้ใหม่ขึ้นครบ ไม่มีกล่องน้ำเงินทับ ทั้ง light/dark

## T3 — Avatar รูปจริง
- [ ] sidebar `.sb-rail-avatar` + `.sb-avatar` → `<img avatarFor(userEmail)>`
- [ ] ตาราง Users `.um-avatar` → `<img avatarFor(u.email)>`
- [ ] CSS: `img` object-fit:cover ครอบวงกลม
- AC: demo admin รูปตรงกัน sidebar + แถวตาราง; user อื่นได้รูปต่างกัน

## T4 — ลบ shadow
- [ ] ลบ `box-shadow: inset 3px 0 0 var(--brand);` ใน `.sb-item.active` (dashboard.css:216)
- AC: nav active ไม่มีแถบซ้าย (คง bg gradient + สี + bold)

## T5 — build + verify + commit
- [ ] `npm run build` ผ่าน
- [ ] mock: sidebar logo+avatar, /settings/users avatars, /login logo — light+dark
- [ ] commit (Co-Authored-By: Claude Opus 4.8)
