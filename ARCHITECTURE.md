# Architecture

Smart Signage Dashboard — a full-stack monitoring app for a network of digital-signage
displays. This document explains how the system is built end to end.

## High-level flow

```
                         ┌─────────────────────────────────────────────┐
   Signage devices ──▶   │  Ingest (scheduled scraper, ภายนอก repo นี้)  │
   (status feed)         └───────────────────┬─────────────────────────┘
                                             ▼
                              ┌──────────────────────────────┐
                              │  Supabase (PostgreSQL)        │
                              │  • device_logs  (time-series) │
                              │  • profiles     (users/RBAC)  │
                              │  • RPC functions (SQL)        │
                              │  • Auth + Row Level Security   │
                              └───────────────┬───────────────┘
                                              ▼  RPC over PostgREST
                              ┌──────────────────────────────┐
                              │  Next.js 16 (App Router)      │
                              │  • Server Components → SSR     │
                              │  • proxy.ts auth guard         │
                              │  • Client Components → charts  │
                              └───────────────┬───────────────┘
                                              ▼
                                        Browser (dashboard)
```

## Data model

| Table | บทบาท | คอลัมน์สำคัญ |
|-------|------|-------------|
| `device_logs` | time-series สถานะอุปกรณ์ (หลาย snapshot ต่อ device) | `device_id`, `active_status`, `scraped_timestamp`, playlist/mode/gps … |
| `profiles` | บัญชีผู้ใช้ + RBAC | `id` (= auth uid), `role` (super_admin/admin/viewer), `status` |

Index `(device_id, scraped_timestamp desc)` รองรับ query "latest per device" และช่วงเวลา

ดูสคีมาเต็ม: [supabase/schema.sql](supabase/schema.sql)

## RPC layer (business logic อยู่ใน SQL)

แทนที่จะดึง raw rows มา aggregate ที่ client เราใส่ logic ไว้ใน Postgres functions
แล้ว Next.js เรียกผ่าน `supabase.rpc(...)` — ลด over-fetching และให้ DB ทำงานที่ถนัด

| Function | คืนค่า | ใช้ที่ |
|----------|--------|--------|
| `get_latest_status()` | row ล่าสุดต่อ device (`distinct on`) | Dashboard, Device List |
| `get_online_summary(period)` | online/offline/total | KPI cards |
| `get_device_trend(days_back)` | online/offline ต่อวัน | Trend chart |
| `get_device_uptime(days_back)` | uptime % ต่อ device | Reports |

ดูโค้ดเต็ม: [supabase/functions.sql](supabase/functions.sql) — functions เป็น `security definer`
เพื่อให้ server fetch คืน demo data ได้สม่ำเสมอ

## Auth & access control

- **Supabase Auth** (email/password) — session เก็บใน cookie, อ่านฝั่ง server ผ่าน `@supabase/ssr`
- **`proxy.ts`** (Next.js 16 middleware) — guard ทุกหน้าใน `(dashboard)`; ไม่มี session → redirect `/login`
- **RLS** บน `device_logs`/`profiles` — อ่านได้เฉพาะ authenticated; การสร้าง user ใช้ `service_role` ผ่าน API route
- **RBAC** — `profiles.role` (super_admin / admin / viewer) คุมสิทธิ์ใน UI

## Rendering strategy

- Server Components (`page.tsx`) ทำ SSR ดึงข้อมูลครั้งแรกผ่าน RPC → first paint มีข้อมูลทันที
- Client Components จัดการ interactivity (charts, filter, pagination, theme, auto-refresh 15 นาที)
- ในโหมด real ที่มี session-bound data หน้าเหล่านี้เป็น **dynamic** (server-rendered on demand)

## Design decision: env-toggle (real ↔ mock)

`lib/supabase/config.ts` เช็ค env แล้วเลือก client:

```
มี NEXT_PUBLIC_SUPABASE_* → Supabase จริง (โหมด full-stack, deploy)
ไม่มี                      → mock client (lib/mock) — repo รันได้ทันทีโดยไม่ต้องตั้งค่า
```

`lib/mock/client.ts` จำลอง interface ของ supabase-js (`rpc` / `from` / `auth`) ทำให้
**โค้ดหน้าทุกหน้าเหมือนกันทั้งสองโหมด** — ไม่มี branching ในหน้า UI
ข้อดี: reviewer clone ไปรันได้ทันที, demo ไม่พังแม้ DB ล่ม, และ seed reuse generator ตัวเดียวกับ mock

## Trade-offs

- **Supabase free tier cold start** — pause หลังไม่ใช้งาน → first load อาจช้า
- **Demo CRUD เปิดให้แก้** — demo user จัดการ profiles ได้ (สำหรับโชว์) ; production จริงควรจำกัดด้วย role-based policy
- **`security definer` บน RPC** — เหมาะกับ demo data ที่ตั้งใจให้เห็นได้ ; ระบบจริงที่ข้อมูล sensitive ควรพึ่ง RLS + invoker
