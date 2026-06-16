# PLAN — เปลี่ยน Brand logo + Avatar (รูปจริง) + ลบ AI-slop shadow

> Date 2026-06-16 · ขอบเขตจำกัด ตามที่ผู้ใช้กำหนด
> Assets: logo `public/icon/logo-signage/` (64,128) · profile `public/icon/profile/{1x,2x}/` (18 รูปสัตว์)

## Decisions (ยืนยันกับผู้ใช้)
- Avatar: current user (sidebar 2 จุด) **+ ตาราง Users** (แมพรูปให้ทุกคน)
- รูป current user: ผมเลือกให้ (ตัว neutral) — pin ด้วย email `demo@smartsignage.app`
- แมพ deterministic ด้วย **email เป็น seed** → demo admin ได้รูปเดียวกันทั้ง sidebar + แถวในตาราง

## Dependency graph
```
T1 util avatarFor(seed) + รายชื่อไฟล์ (lib/ui/avatars.ts)
   │
   ├─► T2 Brand logo (login + sidebar rail + sidebar panel) — เอากล่อง gradient ออก, ใส่ <img>
   │
   └─► T3 Avatar (<img>) — sidebar rail + panel + ตาราง Users (.um-avatar) ใช้ avatarFor(email)
              │
T4 ลบ box-shadow: inset 3px 0 0 var(--brand) จาก .sb-item.active  (อิสระ)
              │
              ▼
T5 build + verify (light/dark, mock) + commit
```

## ไฟล์ที่จะแตะ
- `lib/ui/avatars.ts` — NEW: `avatarFor(seed)` (hash → 1 ใน N รูป) + pin demo email
- `components/dashboard/sidebar.tsx` — logo rail/panel เป็น `<img>`, avatar rail/panel เป็น `<img avatarFor(email)>`
- `app/login/login-form.tsx` — brand icon เป็น `<img>` (แทน inline SVG)
- `app/login/login.css` — `.lv-brand-icon` เอา gradient/shadow ออก, รองรับ `<img>`
- `app/(dashboard)/dashboard.css` — `.sb-rail-mark`/`.sb-icon`/`.sb-rail-avatar`/`.sb-avatar` รองรับ `<img>`; **ลบ** `inset 3px` ที่ `.sb-item.active`
- `app/(dashboard)/settings/users/user-management-client.tsx` — `.um-avatar` ใส่ `<img>`
- `app/(dashboard)/settings/users/users.css` — `.um-avatar img` cover

## หมายเหตุเทคนิค
- Logo มีสี/มิติ + พื้นโปร่งใส → **เอากล่อง gradient เดิมออก** วางรูปตรง ๆ (object-fit:contain) คงขนาดกล่องเดิม (login 38 / rail 36 / panel 34)
- ใช้ไฟล์ logo `signage-icon-128x128.png` (คม, ~11KB) · เลี่ยง `32x23` (ไม่จัตุรัส)
- Avatar profile: ใช้ชุดที่เป็นวงกลม (`set-animals-faces-circles`) เป็นหลัก (เหมาะครอบ `border-radius:50%`); ตรวจชุด `fun-pack` ตอน build ว่าครอบวงกลมแล้วไม่เพี้ยน — ถ้าใช้ได้รวม 18 รูป
- ใช้ไฟล์ `2x` เป็น `src` (คมบน retina) แสดงที่ 32px
- ใช้ `<img>` ธรรมดา (asset เล็ก, static) — ถ้า ESLint `no-img-element` ทำ build fail ค่อยเปลี่ยนเป็น `next/image`

## Checkpoints
- CP-1 (T2): logo ใหม่ขึ้นครบ 3 จุด, ไม่มีกล่องน้ำเงินทับ, build ผ่าน
- CP-2 (T3): avatar รูปจริงขึ้น sidebar + ตาราง Users, demo ตรงกันทุกที่
- CP-3 (T4): sidebar active ไม่มีแถบ shadow ซ้าย
- CP-4 (T5): light+dark+mock ผ่าน → commit

## Out of scope (ตามที่ผู้ใช้ตัดไว้)
- favicon / app icon / OG image · icon ทั่วไป (lucide) · empty-state
