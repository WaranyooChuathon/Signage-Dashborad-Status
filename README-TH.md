# Smart Signage Dashboard — Live Demo

**[English](README.md)** · ภาษาไทย

> ระบบ monitor สถานะจอ digital signage แบบ real-time — ออกแบบและพัฒนาเป็น dashboard สำหรับทีม operations
> **เวอร์ชันนี้คือ Live Demo** ใช้ข้อมูลตัวอย่างทั้งหมด ไม่เชื่อมต่อฐานข้อมูลจริง เปิดเล่นได้ทันทีโดยไม่ต้องล็อกอิน

🔗 **Live Demo:** _<ใส่ลิงก์ Vercel ของคุณที่นี่หลัง deploy>_
👤 **โดย:** Waranyoo Chuathon · [GitHub](https://github.com/WaranyooChuathon)

---

## ภาพตัวอย่าง

![Dashboard](docs/02-dashboard.png)

| Login Showcase | Reports |
|:--:|:--:|
| ![Login](docs/01-login.png) | ![Reports](docs/03-reports.png) |
| **Device List + Side Panel** | **User Management** |
| ![Devices](docs/04-devices.png) | ![Users](docs/05-users.png) |

## ภาพรวม

Dashboard สำหรับติดตามสถานะเครือข่ายจอโฆษณาดิจิทัล (digital signage) หลายสิบจุดพร้อมกัน
แสดง online/offline แบบ real-time, แนวโน้มย้อนหลัง, สถิติ uptime รายเครื่อง และระบบจัดการผู้ใช้

## ฟีเจอร์หลัก

- **Dashboard** — KPI cards (online/offline/uptime rate), donut chart สรุปวันนี้, bar chart แนวโน้ม (วัน/สัปดาห์/เดือน/ปี), รายการอุปกรณ์ online/offline แบบ scroll + pagination
- **Device List** — ตารางอุปกรณ์ทั้งหมด ค้นหา/กรองตามสถานะ + side panel รายละเอียดรายเครื่อง
- **Reports** — กราฟ trend, อันดับ uptime % รายเครื่อง (sort สูง↔ต่ำ), ตารางสถิติ และ **Export CSV**
- **User Management** — เพิ่ม/แก้ไข/ระงับ/ลบผู้ใช้ พร้อม role (Super Admin / Admin / Viewer) และ generate รหัสผ่าน
- **Dark / Light mode** — สลับธีมได้ทั้งระบบผ่าน CSS variables
- **Responsive** — ปรับ layout ตั้งแต่จอใหญ่ถึงมือถือ

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | CSS ล้วน (glassmorphism, deep navy) — ไม่ใช้ utility framework |
| Charts | SVG ที่เขียน arc/path math เอง (donut, trend, overlay) |
| Icons / Fonts | lucide-react · Inter / Plus Jakarta Sans / JetBrains Mono |
| Production data | Supabase (PostgreSQL + RPC functions) |
| Deploy | Vercel |

## สถาปัตยกรรมเรื่องข้อมูล (Production vs Demo)

โปรเจกต์จริงดึงข้อมูลจาก Supabase ผ่าน RPC (`get_online_summary`, `get_device_trend`,
`get_device_uptime`, `get_latest_status`) เวอร์ชัน demo นี้สลับชั้นข้อมูลออกมาเป็น **mock layer**
โดยไม่แตะ UI/logic ของหน้าใด ๆ เลย:

```
lib/mock/data.ts     → generate ข้อมูลตัวอย่าง deterministic (อุปกรณ์ 34 เครื่อง, trend, uptime, users)
lib/mock/client.ts   → mock client ที่มี interface เหมือน supabase-js (rpc / from / auth)
lib/supabase/*.ts    → คืน mock client แทน client จริง
```

ผลคือ demo build และรันได้โดย **ไม่ต้องมี environment variable หรือ secret ใด ๆ** และไม่มีการเชื่อมต่อฐานข้อมูลจริง

## รันบนเครื่อง

```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

ไม่ต้องตั้งค่า `.env` ใด ๆ — ทุกอย่างทำงานด้วยข้อมูลตัวอย่าง

## Deploy (Vercel)

1. push repo นี้ขึ้น GitHub ของคุณ
2. import เข้า [Vercel](https://vercel.com/new) → framework preset = Next.js
3. กด Deploy ได้เลย (ไม่ต้องตั้ง env)

---

_เวอร์ชัน demo นี้ใช้ข้อมูลสมมติทั้งหมด สร้างขึ้นเพื่อแสดงผลงานเท่านั้น ไม่มีข้อมูลหรือการเชื่อมต่อกับระบบจริงขององค์กรใด_
