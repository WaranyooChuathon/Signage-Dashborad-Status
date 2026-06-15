-- ============================================================================
-- Smart Signage Dashboard — Schema (Supabase / PostgreSQL)
-- รันใน Supabase SQL Editor ของ "project ใหม่ของคุณเอง" (ห้ามใช้ของบริษัท)
-- ลำดับ: schema.sql → functions.sql → scripts/seed.ts
-- ============================================================================

-- ── profiles : บัญชีผู้ใช้ + role ────────────────────────────────────────────
-- หมายเหตุ: ไม่ผูก FK กับ auth.users เพื่อให้ seed profiles แบบ standalone ได้
-- demo auth user จะถูกสร้างใน Phase C แล้ว insert profile ที่มี id = auth uid
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  email        text,
  full_name    text,
  role         text not null default 'viewer'
                 check (role in ('super_admin', 'admin', 'viewer')),
  organization text,
  status       text not null default 'active'
                 check (status in ('active', 'suspended')),
  created_at   timestamptz not null default now(),
  last_login   timestamptz
);

-- ── device_logs : time-series สถานะอุปกรณ์ (หลาย row ต่อ device) ──────────────
create table if not exists public.device_logs (
  id                bigint generated always as identity primary key,
  device_id         text,
  device_name       text,
  signage_id        text,
  organize_id       text,
  department_id     text,
  gps_position      text,
  playmode          text,
  playlist_name     text,
  alert             text,
  active_status     text,        -- 'Online' | 'Offline'
  action            text,
  scraped_timestamp timestamptz not null default now()
);

-- index สำหรับ "latest per device" และ query ตามช่วงเวลา
create index if not exists idx_device_logs_device_time
  on public.device_logs (device_id, scraped_timestamp desc);
create index if not exists idx_device_logs_time
  on public.device_logs (scraped_timestamp desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.device_logs enable row level security;

-- ผู้ใช้ที่ login แล้วอ่านได้ทั้งสองตาราง
create policy "read device_logs (authenticated)"
  on public.device_logs for select to authenticated using (true);

create policy "read profiles (authenticated)"
  on public.profiles for select to authenticated using (true);

-- demo: ผู้ใช้ที่ login แล้วจัดการ profiles ได้ (suspend/edit/delete)
-- การ "สร้าง user" จริงทำผ่าน API route ด้วย service_role (bypass RLS)
-- production จริงควรจำกัดด้วยเงื่อนไข role — ดู ARCHITECTURE.md
create policy "update profiles (authenticated)"
  on public.profiles for update to authenticated using (true) with check (true);

create policy "delete profiles (authenticated)"
  on public.profiles for delete to authenticated using (true);
