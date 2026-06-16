# Smart Signage Dashboard — Live Demo (Portfolio)

เว็บ portfolio แบบ full-stack ที่กดเล่นได้จริง — monitor สถานะจอ digital signage
**Live:** https://signage-dashborad-status.vercel.app · **Demo login:** `demo@smartsignage.app` / `demo1234` (หรือกดปุ่ม "เข้าชม Live Demo")

> โปรเจกต์นี้คือเวอร์ชัน demo ที่แยกออกมาจากงานบริษัท — **ใช้ข้อมูลสมมติทั้งหมด ห้ามใส่ข้อมูล/ความลับของบริษัท**
> ดูภาพรวมสถาปัตยกรรมเต็มใน [ARCHITECTURE.md](ARCHITECTURE.md)

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- CSS ธรรมดา (glassmorphism, deep navy) — **ไม่ใช้ Tailwind**; master file คือ `app/(dashboard)/dashboard.css`
- Supabase (PostgreSQL + RPC + Auth) — backend จริง
- Deploy: Vercel
- Charts: SVG เขียน path math เอง (ไม่มี chart lib หลัก)

## ⭐ สิ่งสำคัญที่สุด: Dual-mode (env-toggle)
แอปทำงาน 2 โหมด สลับอัตโนมัติด้วย `lib/supabase/config.ts` (`hasSupabaseEnv`):
- **มี Supabase env** → ใช้ backend จริง (auth guard, SSR, RPC) — โหมด production
- **ไม่มี env** → ใช้ mock (`lib/mock/`) — clone มารันได้ทันที ไม่ต้องตั้งค่า

**กฎเหล็ก:** การแก้ใด ๆ ต้อง**ไม่ทำให้โหมด mock พัง** — ทั้งสองโหมดต้องรันได้เสมอ
หน้า UI ทุกหน้าเรียก `createClient()` เหมือนกันทั้งสองโหมด (ไม่มี branching ในหน้า)

## โครงสร้างสำคัญ
- `app/(dashboard)/` — ทุกหน้าหลัง login (dashboard, devices, reports, settings/users)
  - `dashboard.css` — **MASTER CSS** แก้แล้วกระทบทุกหน้า ระวัง
- `components/dashboard/` — sidebar, topbar, charts, lists, kpi, demo-banner, theme-provider
- `lib/supabase/` — `config.ts` (toggle), `client.ts`/`server.ts` (คืน real หรือ mock)
- `lib/mock/` — `data.ts` (generators ข้อมูลสมมติ deterministic), `client.ts` (mock ของ supabase-js)
- `supabase/` — `schema.sql`, `functions.sql` (RPC 4 ตัว) — รันใน Supabase SQL Editor
- `scripts/` — `seed.ts`, `create-demo-user.ts` (รันด้วย `npx tsx`)
- `proxy.ts` — auth guard (Next.js 16 ใช้ proxy.ts ไม่ใช่ middleware.ts)
- `types/database.ts` — `DeviceLog`, `Profile`

ข้อมูลทั้งหมดมาจาก RPC: `get_online_summary`, `get_device_trend`, `get_device_uptime`, `get_latest_status`
ถ้าจะเพิ่ม/แก้ข้อมูล ต้องแก้ **ทั้ง mock** (`lib/mock/data.ts`) **และ real** (`supabase/functions.sql` + seed) ให้ตรงกัน

## วิธีรัน
```bash
npm run dev            # โหมด mock (ไม่ต้องมี .env)
# โหมด real: ตั้ง .env.local (ดู README) → npm run dev
npm run build          # ต้องผ่านก่อน commit เสมอ
```

## 🔧 Workflow เพิ่มฟีเจอร์ใหม่ (ใช้ skills ตามลำดับ)
สำหรับงานที่ใหญ่กว่าการแก้เล็ก ๆ ให้เดินตามนี้:
1. **/spec** — เขียน spec ก่อนโค้ด (ฟีเจอร์ทำอะไร, acceptance, ขอบเขต) เมื่อ requirement ยังไม่ชัด
2. **/plan** — แตกเป็น task ย่อย ๆ มี acceptance criteria + ลำดับ dependency
3. **/build** — ลงมือทีละ task: build → verify → commit
4. **/verify** หรือ skill `browser-testing-with-devtools` — เปิดแอปจริงเช็คผลด้วย Chrome DevTools MCP
5. **/code-review** ก่อน merge

แก้เล็ก/bug fix: ข้าม spec ได้ ใช้ /build หรือ /test (Prove-It) ตรง ๆ

## ✅ Checklist ก่อน commit ทุกครั้ง
- [ ] `npm run build` ผ่าน
- [ ] โหมด mock ยังรันได้ (รันโดยไม่มี `.env.local` แล้วเปิดทุกหน้า)
- [ ] ถ้าแตะ data layer: เช็คทั้ง mock และ real ตรงกัน
- [ ] ไม่มี secret/JWT หลุดเข้า git (`.env*` ถูก gitignore แล้ว)
- [ ] commit message ลงท้าย `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 📋 งานค้าง / ไอเดียอนาคต (Future work)
> ✅ งานค้างเดิมทั้งหมดเสร็จแล้ว (2026-06-16) — ดูรายละเอียดใน CHANGELOG
- ~~**หน้า Settings (`/settings/profile`)**~~ ✅ — โปรไฟล์/รหัสผ่าน/ธีม+ภาษา/noti prefs
- ~~ปุ่ม **Notifications** (topbar)~~ ✅ — dropdown แจ้งเตือนจริงจาก device offline + mark-as-read
- ~~ช่อง **Quick find / ⌘K**~~ ✅ — command palette จริง (นำทาง/สลับธีม/sign out)
- ~~ลิงก์ **"ลืมรหัสผ่าน?"**~~ ✅ — reset flow + หน้า `/reset-password` (dual-mode)
- ~~ปุ่ม **"Sync ตอนนี้"**~~ ✅ — real mode เขียน snapshot ใหม่ (จำลอง scraper); mock simulate
- **ไอเดียถัดไป:** i18n เต็มรูปแบบ (ตอนนี้ภาษาเป็น preference), command palette ค้นหา device,
  notification แบบ realtime (Supabase subscription)

> ⚠️ real mode ต้องตั้งค่าเพิ่ม: เพิ่ม `<origin>/reset-password` ใน Supabase Auth redirect URLs

## ⛔ ข้อห้าม
- ห้ามแตะ repo/โฟลเดอร์งานบริษัท (`signage-status-clude`) — โปรเจกต์นี้แยกขาดแล้ว
- ห้าม commit `.env.local` หรือ service_role key
- ห้ามแก้ logic ดึงข้อมูลให้ผูกกับข้อมูลจริงของบริษัท — demo ต้องใช้ข้อมูลสมมติเสมอ
