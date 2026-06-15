-- ============================================================================
-- RPC functions — ต้องตรง signature + คอลัมน์ผลลัพธ์กับที่หน้าเดิมเรียก
--   get_latest_status()                → dashboard/page, devices/page, dashboard-client
--   get_online_summary(period text)    → dashboard/page, dashboard-client
--   get_device_trend(days_back int)    → dashboard, reports
--   get_device_uptime(days_back int)   → reports/page, reports-client
-- รันหลัง schema.sql
-- ============================================================================

-- ── get_latest_status : row ล่าสุดต่อ device ─────────────────────────────────
create or replace function public.get_latest_status()
returns setof public.device_logs
language sql stable
security definer
set search_path = public
as $$
  select distinct on (device_id) *
  from public.device_logs
  order by device_id, scraped_timestamp desc;
$$;

-- ── get_online_summary : นับ online/offline/total จากสถานะล่าสุด ──────────────
create or replace function public.get_online_summary(period text default 'today')
returns table (online_count int, offline_count int, total int)
language sql stable
security definer
set search_path = public
as $$
  with latest as (
    select distinct on (device_id) active_status
    from public.device_logs
    order by device_id, scraped_timestamp desc
  )
  select
    count(*) filter (where active_status = 'Online')::int,
    count(*) filter (where active_status = 'Offline')::int,
    count(*)::int
  from latest;
$$;

-- ── get_device_trend : online/offline ต่อวัน (latest ต่อ device ต่อวัน) ───────
create or replace function public.get_device_trend(days_back int default 7)
returns table (day text, online_count int, offline_count int)
language sql stable
security definer
set search_path = public
as $$
  with daily as (
    select distinct on (device_id, (scraped_timestamp::date))
      (scraped_timestamp::date) as d,
      device_id,
      active_status
    from public.device_logs
    where scraped_timestamp >= (current_date - (days_back - 1))
    order by device_id, (scraped_timestamp::date), scraped_timestamp desc
  )
  select
    to_char(d, 'YYYY-MM-DD'),
    count(*) filter (where active_status = 'Online')::int,
    count(*) filter (where active_status = 'Offline')::int
  from daily
  group by d
  order by d;
$$;

-- ── get_device_uptime : uptime % ต่อ device ในช่วงที่เลือก ────────────────────
-- uptime_pct เป็น double precision เพื่อให้ supabase-js คืนค่าเป็น number (ไม่ใช่ string)
create or replace function public.get_device_uptime(days_back int default 7)
returns table (
  device_id       text,
  device_name     text,
  active_status   text,
  total_records   int,
  online_records  int,
  offline_records int,
  uptime_pct      double precision
)
language sql stable
security definer
set search_path = public
as $$
  with latest as (
    select distinct on (device_id) device_id, active_status as cur
    from public.device_logs
    order by device_id, scraped_timestamp desc
  ),
  agg as (
    select
      dl.device_id,
      max(dl.device_name) as device_name,
      count(*)::int                                          as total_records,
      count(*) filter (where dl.active_status = 'Online')::int  as online_records,
      count(*) filter (where dl.active_status = 'Offline')::int as offline_records
    from public.device_logs dl
    where dl.scraped_timestamp >= (current_date - (days_back - 1))
    group by dl.device_id
  )
  select
    a.device_id,
    a.device_name,
    l.cur,
    a.total_records,
    a.online_records,
    a.offline_records,
    round(a.online_records::numeric / nullif(a.total_records, 0) * 100, 1)::double precision
  from agg a
  join latest l using (device_id)
  order by uptime_pct desc;
$$;

-- เปิดให้เรียก RPC ได้
grant execute on function public.get_latest_status()           to anon, authenticated;
grant execute on function public.get_online_summary(text)      to anon, authenticated;
grant execute on function public.get_device_trend(int)         to anon, authenticated;
grant execute on function public.get_device_uptime(int)        to anon, authenticated;
