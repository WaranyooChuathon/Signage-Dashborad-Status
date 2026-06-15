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
- [ ] **T5** auth จริง + demo account + ปุ่ม demo = sign-in จริง; proxy guard (real mode)
  - ✅ verify: ไม่ login เข้า dashboard ไม่ได้ / ปุ่ม demo เข้าได้ / session ค้างหลัง refresh
- [ ] **T6** restore API routes (`users/create`, `sync`) ให้ env-toggle real/mock
  - ✅ verify: สร้าง/suspend/delete user แล้ว persist ใน DB จริง
- [ ] **Checkpoint C** — full-stack ครบ local

## Phase D — Deploy + polish
- [ ] **T7** deploy Vercel + ตั้ง env (3 ตัว) + Supabase allowed URLs
  - ✅ verify: URL public ใช้ backend จริง flow ครบ (incognito)
- [ ] **T8** `ARCHITECTURE.md` + diagram, ลิงก์ SQL/RPC ใน README, demo credentials, ตรวจไม่มี secret หลุด
  - ✅ verify: reviewer เข้าใจว่าเป็น full-stack จริง + ไม่มี `.env`/key ใน git
- [ ] **Checkpoint D** — live + ปลอดภัย + เล่า full-stack ได้ครบ

---
**กฎ:** ห้ามแตะ `.env.local`/key ของบริษัท — ใช้ Supabase project ใหม่เท่านั้น
