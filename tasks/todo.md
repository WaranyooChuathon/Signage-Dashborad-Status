# TODO — Full-Stack upgrade (real Supabase, company-safe)

## Phase A — Infra (ทำได้เลย ไม่ต้องมี Supabase)
- [x] **T1** env-toggle data layer (`lib/supabase/client.ts`, `server.ts`, `config.ts`, `proxy.ts`) — มี env=real / ไม่มี=mock
  - ✅ verified: ไม่มี `.env` → build ผ่าน + dashboard/login render (mock)
- [x] **Checkpoint A** — mock mode ยังทำงาน 100% ✅

## Phase B — Supabase backend (ต้องมีบัญชี Supabase ของคุณ)
> 📝 ไฟล์ SQL/seed เขียนพร้อมแล้ว (`supabase/schema.sql`, `supabase/functions.sql`, `scripts/seed.ts`)
> เหลือแค่คุณสร้าง project + รัน
- [~] **T2** schema (`device_logs`, `profiles`) + RLS + index → **`supabase/schema.sql` พร้อมรัน** ⏳ รอคุณรันใน Supabase
  - ✅ verify: ตาราง/policy/index ครบตาม `types/database.ts`
- [~] **T3** RPC 4 ตัว → **`supabase/functions.sql` พร้อมรัน** ⏳ รอคุณรันใน Supabase
  - ✅ verify: signature + คอลัมน์ผลลัพธ์ตรงกับที่หน้าเดิมเรียก
- [~] **T4** **`scripts/seed.ts` เขียนแล้ว** (reuse `lib/mock/data.ts`, time-series 90 วัน + 8 profiles) ⏳ รอคุณตั้ง `.env.local` + `npx tsx scripts/seed.ts`
  - ✅ verify: ตั้ง `.env.local` ชี้ project ใหม่ → ทุกหน้าโชว์ข้อมูลจาก DB จริง
- [ ] **Checkpoint B** — local ชี้ Supabase จริง + RPC ทำงาน

## Phase C — Auth + demo
- [x] **T5** auth จริง + demo account (`scripts/create-demo-user.ts`) + ปุ่ม demo = sign-in จริง; proxy guard
  - ✅ verified: /dashboard ไม่มี session → 307 /login; ปุ่ม demo login สำเร็จ (sidebar โชว์ demo user)
- [x] **T6** API routes env-toggle (`users/create` real/mock) + user-modal create env-aware
  - ✅ verified: build ผ่าน real mode (routes เป็น dynamic)
- [x] **Checkpoint C** ✅ — full-stack ครบ: รัน functions.sql แล้ว, RPC ทั้ง 4 คืนข้อมูลถูก,
      dashboard ผ่าน browser โชว์ data จริง (29/5/34), auth + session ทำงาน

## Phase D — Deploy + polish
- [~] **T7** deploy Vercel + ตั้ง env (3 ตัว) + Supabase allowed URLs ⏳ รอคุณ (push GitHub + Vercel)
  - ✅ verify: URL public ใช้ backend จริง flow ครบ (incognito)
- [x] **T8** `ARCHITECTURE.md` + ลิงก์ SQL/RPC ใน README, demo credentials, ตรวจ secret
  - ✅ verified: ไม่มี `.env`/JWT ใน git (เจอ eyJ แค่ใน package-lock = integrity hash)
- [ ] **Checkpoint D** — live + ปลอดภัย + เล่า full-stack ได้ครบ (หลังคุณ deploy)

---
**กฎ:** ห้ามแตะ `.env.local`/key ของบริษัท — ใช้ Supabase project ใหม่เท่านั้น
