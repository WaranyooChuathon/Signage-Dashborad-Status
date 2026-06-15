# Plan — ยกระดับ Live Demo เป็น Full-Stack จริงบน Supabase (company-safe)

> เป้าหมาย: เปลี่ยน `signage-dashboard-demo` จาก mock-only → full-stack app จริง
> บน **Supabase project ใหม่ของคุณเอง** seed ด้วยข้อมูลสมมติ
> auth/CRUD/RPC ทำงานจริงและ persist — แต่ไม่มีข้อมูลหรือ connection กับระบบบริษัทเลย
>
> หลักการสำคัญ: **env-toggle** — ถ้ามี Supabase env = ใช้ backend จริง / ถ้าไม่มี = fallback เป็น mock
> (repo ยังรันได้ทันทีโดยไม่ต้องตั้งค่า และ reviewer clone ไปก็เห็นทั้งสองโหมด)

---

## สถาปัตยกรรมที่จะได้

```
                    ┌─ มี env ──► Supabase จริง (Postgres + RPC + Auth)  ◄── deploy บน Vercel
createClient() ─────┤
                    └─ ไม่มี env ─► mock client (lib/mock) — เหมือนเดิม, รันได้ทันที
```

- Schema: `device_logs` (time-series) + `profiles` (ผูกกับ auth.users)
- RPC 4 ตัว: `get_online_summary`, `get_device_trend`, `get_device_uptime`, `get_latest_status`
- Auth จริง + demo account; ปุ่ม "เข้าชม Live Demo" = auto sign-in เป็น demo user (session จริง) แทนการ skip
- Seed: reuse logic จาก `lib/mock/data.ts` ยิงเข้า DB ผ่าน seed script

---

## Dependency graph

```
[1] env-toggle data layer  ─────────────► (ทุกอย่างพึ่งตัวนี้ก่อน)
        │
        ▼
[2] Supabase project + schema + RLS ────► [3] RPC functions ────► [4] seed data
                                                                        │
                          ┌─────────────────────────────────────────────┤
                          ▼                                              ▼
                   [5] auth จริง + demo bypass                    [6] restore API routes (real)
                          │                                              │
                          └──────────────────┬───────────────────────────┘
                                             ▼
                                     [7] deploy Vercel + env
                                             ▼
                                     [8] polish (ARCHITECTURE.md, ลบ secret ออก git)
```

---

## Phase A — Infra: env-toggle data layer (ไม่ต้องมี Supabase ก็ทำได้)

### Task 1 — ทำ data layer ให้ toggle ระหว่าง real/mock
- **ไฟล์:** `lib/supabase/client.ts`, `lib/supabase/server.ts`, `proxy.ts`
- **ทำ:** กู้โค้ด Supabase จริง (createBrowserClient/createServerClient) กลับมา แล้วห่อด้วย guard:
  ```ts
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  export function createClient() {
    return hasSupabase ? createBrowserClient(url!, key!) : createMockClient()
  }
  ```
  - `proxy.ts`: ถ้า `hasSupabase` → auth guard จริง (redirect ถ้าไม่ login), ถ้าไม่มี → pass-through (โหมด mock)
- **Acceptance:** ไม่มี `.env` → app รันเหมือนเดิมทุกหน้า (mock); มี env ปลอม → ไม่ crash ตอน import
- **Verify:** `npm run build` ผ่าน + `npm run dev` ไม่มี env แล้วทุกหน้ายัง render
- ⚠️ ต้องมั่นใจว่า mock client มี method ครบเท่า code path เดิม (มีแล้วจากงานก่อน)

### ✅ Checkpoint A — repo ยังทำงาน mock ได้ 100% ก่อนแตะ Supabase

---

## Phase B — Supabase backend (ต้องใช้บัญชี Supabase ของคุณ)

### Task 2 — สร้าง project + schema + RLS
- **ทำใน Supabase dashboard / SQL editor:**
  - สร้าง project ใหม่ (region ใกล้, free tier)
  - `profiles` (id uuid PK = auth.users.id, email, full_name, role text check in super_admin/admin/viewer, organization, status text check active/suspended, created_at timestamptz default now(), last_login timestamptz)
  - `device_logs` (id bigserial PK, device_id, device_name, signage_id, organize_id, department_id, gps_position, playmode, playlist_name, alert, active_status, action, scraped_timestamp timestamptz) — เก็บ **time-series** (หลาย row ต่อ device)
  - index: `device_logs(device_id, scraped_timestamp desc)`
  - RLS: เปิดทั้ง 2 table; policy: authenticated อ่าน `device_logs` + `profiles` ได้; profiles เขียนได้เฉพาะ service_role (ผ่าน API)
- **เก็บ SQL ทั้งหมดไว้ใน repo:** `supabase/schema.sql` (ให้ reviewer เห็น = หลักฐาน backend)
- **Acceptance:** ตาราง + RLS + index ครบตาม DeviceLog/Profile type ใน `types/database.ts`
- **Verify:** `select` จาก SQL editor ได้ (ยังว่าง)

### Task 3 — เขียน RPC functions 4 ตัว (SQL)
- **เก็บใน:** `supabase/functions.sql`
- `get_latest_status()` → row ล่าสุดต่อ device (DISTINCT ON device_id ORDER BY scraped_timestamp DESC)
- `get_online_summary(period text)` → online_count/offline_count/total จาก latest status
- `get_device_trend(days_back int)` → group by day, นับ online/offline ต่อวัน
- `get_device_uptime(days_back int)` → ต่อ device: total_records, online_records, offline_records, uptime_pct
- **Acceptance:** signature + ชื่อ + คอลัมน์ผลลัพธ์ **ตรงเป๊ะ** กับที่หน้าเดิมเรียก (ดู `dashboard/page.tsx`, `reports/page.tsx`, `reports-client.tsx`)
- **Verify:** เรียกแต่ละ RPC ใน SQL editor ได้ shape ถูก (หลัง seed)

### Task 4 — Seed ข้อมูลสมมติ (reuse mock generators)
- **ทำ:** `scripts/seed.ts` — import generators จาก `lib/mock/data.ts` แล้ว insert เข้า `device_logs`
  - generate time-series ย้อนหลัง ~90 วัน (เช่น snapshot ทุก 1–6 ชม.) ให้ trend/uptime มีข้อมูลจริง
  - insert profiles seed (8 คน) ผ่าน service_role
  - รันด้วย `npx tsx scripts/seed.ts` (ใช้ `.env.local` ของ project ใหม่)
- **Acceptance:** row count สมเหตุผล (เช่น 34 devices × snapshots), demo data ยังเป็นชื่อสมมติ (Aurora City, SG-0xx)
- **Verify:** ตั้ง `.env.local` ชี้ project ใหม่ → `npm run dev` → ทุกหน้าโชว์ข้อมูล "จาก DB จริง" (เทียบกับ mock ต้องใกล้เคียง)

### ✅ Checkpoint B — local ชี้ Supabase จริงแล้วทุกหน้า render + RPC ทำงาน

---

## Phase C — Auth จริง + demo experience

### Task 5 — Auth จริง + demo account + bypass-as-login
- **ทำ:**
  - สร้าง demo auth user (เช่น `demo@smartsignage.app` / รหัสที่โชว์ได้) + profile role=admin
  - `login-form.tsx`: ปุ่ม "เข้าชม Live Demo" เปลี่ยนจาก `router.push('/dashboard')` → `signInWithPassword(demo creds)` จริง แล้วค่อย push (ได้ session จริง, sidebar โชว์ user จริง, sign out ใช้ได้จริง)
  - คง prefill demo creds ในฟอร์มไว้
  - `proxy.ts` auth guard ทำงาน (โหมด real) → /dashboard ต้องมี session
- **Acceptance:** ไม่ login → เข้า /dashboard ไม่ได้ (redirect /login); กดปุ่ม demo → เข้าได้จริง; refresh แล้ว session ค้าง
- **Verify:** login จริง + demo button + sign out ครบ flow

### Task 6 — Restore API routes ให้ทำงานจริง (env-toggle)
- **ไฟล์:** `app/api/users/create/route.ts`, `app/api/sync/route.ts`
- **ทำ:** ถ้ามี `SUPABASE_SERVICE_ROLE_KEY` → ใช้ admin createUser + insert profile จริง; ไม่มี → stub mock เดิม
- **Acceptance:** สร้าง user ใหม่ผ่าน UI แล้ว persist ใน DB จริง + login ด้วย user นั้นได้
- **Verify:** เพิ่ม user → reload → ยังอยู่; CRUD (suspend/delete) persist

### ✅ Checkpoint C — full-stack ครบ local: auth + CRUD persist + RPC

---

## Phase D — Deploy + polish

### Task 7 — Deploy Vercel พร้อม env
- ตั้ง env บน Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Supabase Auth → เพิ่ม Vercel domain ใน redirect/allowed URLs
- **Acceptance:** URL public ใช้ backend จริง, demo button เข้าได้, refresh ค้าง
- **Verify:** เปิดจากเครื่องอื่น/incognito แล้ว flow ครบ

### Task 8 — Polish หลักฐาน full-stack + ความปลอดภัย
- `ARCHITECTURE.md` + diagram (scraper → Supabase → RPC → SSR → dashboard), อธิบาย design decisions
- ลิงก์ `supabase/schema.sql` + `functions.sql` ใน README (โชว์ SQL/RPC จริง)
- อัปเดต README/README-TH: เพิ่ม "demo credentials" + หมายเหตุ env
- ⚠️ **ตรวจ git ว่าไม่มี `.env*` / service_role key หลุดเข้า repo** (gitignore คุมอยู่แล้ว — verify อีกรอบ)
- **Acceptance:** reviewer อ่าน repo แล้วเข้าใจว่าเป็นระบบ full-stack จริง, ไม่มี secret หลุด

### ✅ Checkpoint D — live, ปลอดภัย, เล่า full-stack ได้ครบ

---

## ความเสี่ยง / ข้อควรระวัง
- **Free tier cold start** — Supabase free จะ pause หลังไม่ใช้งานนาน → demo โหลดแรกช้า/ค้าง. ทางแก้: cron ping เบา ๆ หรือบอกใน README ว่า "first load may be slow"
- **Seed ใหญ่** — 90 วัน × hourly อาจหลายหมื่น row; ปรับ granularity ถ้าช้า
- **RPC ต้องตรง signature เดิมเป๊ะ** — ไม่งั้นหน้าเดิมพัง (acceptance ของ Task 3 คุมเรื่องนี้)
- **company-safe** — ใช้ project ใหม่ + key ใหม่เท่านั้น ห้ามแตะ `.env.local` หรือ key ของบริษัท
- **Demo CRUD ถูกแก้โดยคนนอก** — demo user แก้ profiles ได้ → ตั้ง cron reset seed รายวัน หรือจำกัด policy ถ้ากังวล

## ลำดับแนะนำ
A(1) → B(2→3→4) → C(5→6) → D(7→8) โดยหยุดทบทวนทุก Checkpoint
ทำ Phase A ได้เลยทันที (ไม่ต้องรอ Supabase) ส่วน B เป็นต้นไปต้องมีบัญชี Supabase ของคุณ
