# Changelog — Smart Signage Dashboard

## 2026-05-27 — Reports Page Polish & User Management

### Reports — Uptime Card: Sort Toggle

- `reports-client.tsx` — เพิ่ม `uptimeSortAsc` state (default `false` = สูง→ต่ำ)
  - ปุ่ม **sort toggle** ในหัว card แสดง icon ↓/↑ + label "สูง→ต่ำ" / "ต่ำ→สูง"
  - กด toggle แล้ว reset กลับหน้า 1 (`setUptimePage(0)`) อัตโนมัติ
  - `card-sub` label เปลี่ยนตาม sort ปัจจุบัน

### Reports — Device Stats Table: Sort Toggle

- `reports-client.tsx` — เพิ่ม `sortAsc` state ใน `DeviceStatsTable` (default `false` = สูง→ต่ำ)
  - Column header **"Uptime %"** กดได้ แสดง ↓/↑ icon
  - Hover เปลี่ยนสีเป็น brand color เพื่อบ่งบอกว่ากดได้
  - `card-sub` แสดง sort ปัจจุบัน

### Reports — Uptime Card: Fixed Height & Pagination

- `reports-client.tsx` — `UPTIME_PAGE = 10`, `uptimePage` state, reset เมื่อ `changeRange()`
  - `sortedUptime` sort ตาม `uptimeSortAsc`
  - `uptimeEmptyRows` — render `div.rp-uptime-row-empty` เพื่อ pad ให้ครบ 10 แถวเสมอ → card height ไม่เปลี่ยน
  - Rank number column (`.rp-up-rank`) แสดงลำดับจริงข้ามหน้า
  - Pagination แสดงเฉพาะเมื่อ `uptimeTotalPages > 1`
- `reports.css` — `.rp-charts-row` เพิ่ม `align-items: stretch`
  - `.rp-charts-row .card` — `display: flex; flex-direction: column; min-width: 0`
  - `.rp-trend-card .chart-area` — `flex: 1; flex-direction: column; justify-content: center`
  - `.rp-uptime-card .rp-uptime-list` — `flex: 1` → list ยืดเต็ม card
  - `.rp-uptime-row` — `min-height: 30px` ป้องกัน card หด
  - `.rp-sort-btn`, `.rp-th-sort`, `.rp-up-rank` — CSS ใหม่สำหรับ sort UI

### Reports — Overlay default ซ่อน

- `reports-client.tsx` — เปลี่ยน `useState(true)` → `useState(false)` สำหรับ `showOverlay`
  - ผู้ใช้ต้องกด **Show overlay** เองเพื่อดูเส้น Online Rate

### User Management — Password Field

- `user-modal.tsx` — เพิ่ม `generatePassword()` สุ่มรหัสผ่าน 12 ตัว (uppercase + lowercase + digit + special)
  - เมื่อเปิด modal สร้าง User ใหม่ → auto-generate รหัสผ่าน
  - ช่องรหัสผ่านพร้อมปุ่ม Eye/EyeOff toggle และปุ่ม Shuffle สุ่มใหม่
  - หลัง create สำเร็จ: `navigator.clipboard.writeText(password)` + toast แสดงรหัสผ่าน
  - Validation: ต้องมีอย่างน้อย 8 ตัวอักษร
- `users.css` — เพิ่ม `.um-pw-wrap`, `.um-pw-btn`, `.um-pw-hint` และ dark mode overrides

---

### Files Changed (2026-05-27)

| ไฟล์ | ประเภท | รายละเอียด |
|------|--------|------------|
| `app/(dashboard)/reports/reports-client.tsx` | แก้ไข | Sort toggle, pagination, fixed height, overlay default |
| `app/(dashboard)/reports/reports.css` | แก้ไข | Fixed-height cards, sort button, rank column |
| `app/(dashboard)/settings/users/user-modal.tsx` | แก้ไข | Password field, auto-generate, clipboard copy |
| `app/(dashboard)/settings/users/users.css` | แก้ไข | Password UI styles |

---

## 2026-05-24 (Session 2) — Dashboard UX Polish & Responsive

### Donut Chart — Redesign ตาม DESIGN.md

- `trend-chart.tsx` — เขียน `DonutChart` ใหม่ทั้งหมดด้วย SVG arc path math (R=64 outer, r=44 inner, viewBox 200×200)
  - `arcPath(a, expand)` — คำนวณ arc path จริงด้วย M/A/L/Z command แทน `strokeDasharray`
  - Hover state: segment ที่ active ขยายออก 4px (`expand=4`), segment อื่น `opacity=0.45`, `transition: opacity .15s`
  - Center text: absolute div ทับ SVG แสดง % และ label ด้วยสีของ segment นั้น
  - Legend เปลี่ยนเป็น `<button>` ที่ `onMouseEnter` ทริก hover — active item ได้ `bg-2/line` border
  - Default hover = 0 (Online segment)

### Trend Chart — Bug Fixes

- `trend-chart.tsx` — `aggregateMonthly()` แก้ให้ pre-initialize ทุก 12 เดือนของปีปัจจุบันด้วย `online_count: 0` เสมอ ก่อน fill ข้อมูลจริง → ปีนี้แสดงครบ 12 แท่งเสมอแม้บางเดือนไม่มีข้อมูล
- `dashboard-client.tsx` — `changePeriod()` เรียก `setTrend([])` ก่อน `fetchData()` → ป้องกัน stale chart flash เมื่อสลับ period

### Layout — Online/Offline Cards เคียงกัน

- `dashboard.css` — เปลี่ยน `.section-grid` จาก `1fr 320px` (2 คอลัมน์) เป็น `1fr 240px 240px` (3 คอลัมน์)
- `dashboard-client.tsx` — ลบ `<div className="section-panels">` wrapper ออก, ให้ `OfflineList` และ `OnlineList` เป็น direct grid child

### Layout — Card Height สม่ำเสมอ

- `dashboard.css` — ลบ `align-items: start` ออกจาก `.section-grid` → ใช้ default `stretch` ทำให้ทั้ง 3 card สูงเท่ากัน
- เพิ่ม `display: flex; flex-direction: column; overflow: hidden` ให้ list cards (`:nth-child(2), :nth-child(3)`)
- เพิ่ม `flex: 1; overflow-y: auto; min-height: 0` ให้ `.offline-list` / `.online-list` → list scroll ภายใน card แทนการขยาย

### Trend Chart — Vertical Centering & Horizontal Scroll

- `trend-chart.tsx` — เพิ่ม class `trend-card` ให้ card wrapper ทุก branch (today/empty/bar)
- `trend-chart.tsx` — ห่อ `.chart-bars` ด้วย `<div className="chart-scroll">` ใหม่
- `dashboard.css` — `.chart-scroll { overflow-x: auto; min-width: 0; }`
- `dashboard.css` — `.bar-col { min-width: 22px; flex-shrink: 0; }` → 30 แท่ง (เดือนนี้) ใช้ scroll แทนขยาย card
- `dashboard.css` — `.section-grid .trend-card { min-width: 0; overflow: hidden; }` → **ป้องกัน grid item ขยายเกิน `1fr` track** (CSS Grid `min-width: auto` gotcha)
- `dashboard.css` — `.trend-card .chart-area { flex: 1; flex-direction: column; justify-content: center; }` → chart content จัดกลางแนวตั้งภายใน card ที่ถูก stretch

### KPI Sync ล่าสุด — Fix

- `dashboard-client.tsx` — ลบ prop `lastSync` ออกจาก component (เดิม init จาก `scraped_timestamp` ในฐานข้อมูล ซึ่งอาจเป็นวันเก่า)
- เปลี่ยน `useState(lastSync)` → `useState(() => new Date().toISOString())` → แสดงเวลาที่ page โหลด
- `setSyncTime(new Date().toISOString())` หลัง auto-refresh และหลัง manual sync สำเร็จ
- ลบ `setSyncTime` ออกจาก `fetchData()` → period change ไม่ update sync time
- `page.tsx` — ลบตัวแปร `lastSync` และ prop ที่ส่งไปที่ `DashboardClient`

### Responsive Layout

- `dashboard.css` — เพิ่ม media queries ท้ายไฟล์:
  - **≤ 1280px**: `.section-grid` เปลี่ยนเป็น `1fr 1fr`, trend chart `grid-column: 1 / -1` (full width row 1), list cards เคียงกัน (row 2)
  - **≤ 860px**: `.section-grid` เปลี่ยนเป็น `1fr` (single column stack), KPI grid เปลี่ยนเป็น `1fr 1fr` (2×2)

---

## 2026-05-24 (Session 1) — Auto-refresh & UX Polish

### Auto-refresh (15 นาที)
- `dashboard-client.tsx` — เพิ่ม `useEffect` ตั้ง `setInterval` ทุก **15 นาที** ดึงข้อมูลใหม่อัตโนมัติ (`get_online_summary`, `get_device_trend`, `get_latest_status`) โดยไม่ต้องกด Sync
- ใช้ `useRef` เก็บ `period` ปัจจุบันไว้ใน interval callback เพื่อไม่ให้ stale closure
- กด **Sync ตอนนี้** ยังคง POST ไปที่ `/api/sync` เพื่อดึงข้อมูลจาก Signage System จริง จากนั้น refresh อัตโนมัติ
- `page.tsx` — ลบ `console.log` debug ออกทั้งหมด, เปลี่ยนมาใช้ `Promise.all` สำหรับ parallel fetch

### Trend Chart — Donut สำหรับวันนี้
- `trend-chart.tsx` — เมื่อ `period === 'today'` จะแสดงเป็น **Donut Chart** (SVG) แทน bar chart
  - แสดง Online Rate % ตรงกลาง
  - Legend แสดงจำนวน Online / Offline / Total
  - ใช้ `strokeDasharray` + `strokeDashoffset` สำหรับ arc teal (online) และ rose (offline)

### Trend Chart — รายเดือนสำหรับปีนี้
- `trend-chart.tsx` — เมื่อ `period === 'year'` จะ **aggregate ข้อมูลรายวัน → รายเดือน** (12 แท่ง) โดย `aggregateMonthly()`
  - จัดกลุ่มตาม `YYYY-MM`, sum `online_count` และ `offline_count`
  - Label แสดงเป็นชื่อเดือนภาษาไทย (ม.ค. – ธ.ค.)
  - แก้ปัญหา card ยาวเกินเมื่อแสดง 365 แท่ง

### Overlay default = ซ่อน
- `trend-chart.tsx` — เปลี่ยน `useState(true)` → `useState(false)` สำหรับ `showOverlay`
- ผู้ใช้ต้องกด **Show overlay** เองเพื่อดูเส้น Online Rate

### Device ที่ Online (ใหม่)
- `components/dashboard/online-list.tsx` — component ใหม่แสดง Device ที่ Online
  - สไตล์สีเขียว (`--on-bg`, `--on`) คู่กับ OfflineList
  - Dot animation `on-blink`
  - Pagination 5 รายการต่อหน้า
- `dashboard-client.tsx` — derive `onlineDevices` และ `offlineDevices` จาก `allDevices` state เดียว

### Dark Mode Support
- CSS ใหม่ทั้งหมด (Donut, OnlineList) ใช้ CSS variables (`--on-bg`, `--on-text`, `--line`, `--ink`, `--muted`) — รองรับ dark mode อัตโนมัติ

---

### Files Changed (Session 1 + 2 รวม)

| ไฟล์ | ประเภท | รายละเอียด |
|------|--------|------------|
| `components/dashboard/trend-chart.tsx` | แก้ไข | Donut redesign, scroll, centering, 12-month fix |
| `components/dashboard/online-list.tsx` | ใหม่ | Device Online list component |
| `app/(dashboard)/dashboard/dashboard-client.tsx` | แก้ไข | Auto-refresh, layout, sync time, flicker fix |
| `app/(dashboard)/dashboard/page.tsx` | แก้ไข | ลบ lastSync prop |
| `app/(dashboard)/dashboard.css` | แก้ไข | Donut CSS, section-grid, responsive |
