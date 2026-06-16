# Plan — งานค้างที่เหลือ (Future work 4 รายการ)

> สร้าง 2026-06-16 · ต่อจากหน้า Settings (เสร็จแล้ว)
> ทำทั้ง 4: Notifications · Command palette ⌘K · ลืมรหัสผ่าน · Sync จริง
> กฎเหล็ก: รักษา **dual-mode** (mock + real) ทุก task; `npm run build` ผ่าน + รันโหมด mock ได้ ก่อน commit

---

## ภาพรวม dependency

```
4 ฟีเจอร์ "อิสระต่อกัน" — ทำเรียงทีละอันได้ ไม่มี hard dependency ข้ามฟีเจอร์
แต่ละฟีเจอร์ = vertical slice (build ผ่าน + ใช้งานได้โหมด mock + commit)

ลำดับแนะนำ (ง่าย→ยาก, value):
  F1 Notifications → F2 Command palette → F3 ลืมรหัสผ่าน → F4 Sync จริง
```

---

## F1 — Notifications dropdown (ปุ่ม Bell ใน topbar)

> เดิม Bell เป็น decorative · แจ้งเตือน derive จาก device ที่ offline (RPC `get_latest_status`)

### T1.1 — topbar เป็น client + ดึง offline devices
- **ไฟล์:** `components/dashboard/topbar.tsx`
- ดึง `get_latest_status` ผ่าน `createClient().rpc(...)` → filter `active_status === 'Offline'`
- Bell badge แสดงจำนวน "unread" (offline ที่ยังไม่ acknowledge)

### T1.2 — Notification dropdown panel
- **ไฟล์:** `components/dashboard/notification-menu.tsx` (ใหม่) + CSS ใน `dashboard.css` หรือไฟล์ใหม่
- คลิก Bell → panel list: device name, "ออฟไลน์", last seen; empty state เมื่อไม่มี/อ่านหมด
- "ทำเครื่องหมายอ่านแล้วทั้งหมด" → เก็บ read-state ใน `localStorage 'cc-noti-read'` (timestamp) → badge เคลียร์
- ปิดเมื่อคลิกนอก/กด Esc
- **AC:** mock — Bell โชว์ badge = จำนวน offline; เปิด dropdown เห็นรายการ; mark read → badge หาย; refresh ค้าง read-state
- **Verify:** mock mode เปิด dropdown + mark read + reload

### ✅ Checkpoint F1

---

## F2 — Command palette (⌘K) (ช่อง Quick find ใน sidebar)

> เดิม readonly · ทำ palette จริง — นำทาง + action

### T2.1 — CommandPalette component + global ⌘K
- **ไฟล์:** `components/dashboard/command-palette.tsx` (ใหม่), render ใน `app/(dashboard)/layout.tsx`
- เปิดด้วย: keydown `Ctrl/Cmd+K` (global) หรือคลิกช่อง Quick find ใน sidebar
- modal overlay + input ค้นหา + รายการคำสั่ง: ไปหน้า Dashboard/Devices/Reports/User Management/Settings, สลับธีม, Sign out
- กรองตาม query; keyboard nav (↑/↓/Enter), Esc ปิด
- **AC:** กด ⌘K เปิด; พิมพ์กรอง; Enter ไปหน้า; Esc ปิด; คลิก Quick find ก็เปิด
- **Verify:** mock mode ⌘K + คลิก + นำทาง + keyboard

### T2.2 — sidebar Quick find → ปุ่มเปิด palette
- **ไฟล์:** `components/dashboard/sidebar.tsx`
- เปลี่ยน input readonly → ปุ่ม/clickable เปิด palette (ยัง render เหมือนเดิม)

### ✅ Checkpoint F2

---

## F3 — ลืมรหัสผ่าน (reset password) (หน้า login)

> เดิมลิงก์ไม่ทำงาน · ต่อ Supabase reset (real) / simulate (mock)

### T3.1 — mock stub `resetPasswordForEmail`
- **ไฟล์:** `lib/mock/client.ts` — เพิ่ม `auth.resetPasswordForEmail()` คืน `{ data:{}, error:null }`

### T3.2 — UI ขอ reset ในหน้า login
- **ไฟล์:** `app/login/login-form.tsx`, `app/login/login.css`
- คลิก "ลืมรหัสผ่าน?" → สลับเป็นฟอร์มกรอกอีเมล → `resetPasswordForEmail(email, { redirectTo: <origin>/reset-password })`
- success message (real: "ส่งลิงก์ไปอีเมลแล้ว", mock: simulate); ปุ่มกลับไป login
- **AC:** กดลิงก์ → ฟอร์มอีเมล; ส่ง → success; mock ไม่ crash

### T3.3 — หน้าตั้งรหัสใหม่ `/reset-password`
- **ไฟล์:** `app/reset-password/page.tsx` (+ client) — recovery link มาลงที่นี่
- ฟอร์มรหัสใหม่ + ยืนยัน → `supabase.auth.updateUser({ password })` (มี stub แล้ว) → toast → ไป /login
- **AC:** เปิดหน้าได้, validate ≥8+ตรงกัน, mock simulate สำเร็จ
- **Verify:** mock — flow ขอ reset + หน้า reset-password ตั้งรหัสใหม่
- ⚠️ real mode: ต้องเพิ่ม `<origin>/reset-password` ใน Supabase redirect URLs (note ใน README)

### ✅ Checkpoint F3

---

## F4 — Sync จริง (ปุ่ม "Sync ตอนนี้")

> เดิม `/api/sync` คืน timestamp เฉย ๆ · ทำให้ real mode "จำลอง scraper" เขียน snapshot ใหม่จริง

### T4.1 — /api/sync เขียน snapshot ใหม่ (real) / simulate (mock)
- **ไฟล์:** `app/api/sync/route.ts`
- real (มี `SUPABASE_SERVICE_ROLE_KEY`): generate snapshot ปัจจุบันต่อ device (reuse `getDevices` + สุ่มสถานะเล็กน้อย) → insert `device_logs` ด้วย service_role (scraped_timestamp = now)
  - ผลลัพธ์: dashboard re-fetch แล้วเห็นข้อมูล/เวลาใหม่จริง (latest status เปลี่ยน)
- mock (ไม่มี env): คืน success + timestamp เหมือนเดิม (mock generators เป็น static)
- เป็น **ข้อมูลสมมติล้วน** (company-safe) — comment ให้ชัดว่า simulate scraper
- **AC:** real — กด Sync → มี row ใหม่ใน device_logs (timestamp ล่าสุด) → KPI/รายการ refresh; mock — success ไม่ crash
- **Verify:** mock — กด Sync ไม่ error; (ถ้ามี env) real — เห็น row ใหม่

### ✅ Checkpoint F4

---

## ความเสี่ยง / หมายเหตุ
- **F1 topbar เป็น client** — เดิมเป็น client อยู่แล้ว (`useTheme`) → ปลอดภัย เพิ่ม fetch
- **F3 redirect URL** — recovery จริงต้อง config ใน Supabase; mock simulate ได้เลย
- **F4 เขียน DB** — เฉพาะ real mode + service_role; ข้อมูลสมมติ; อย่าให้ mock พัง
- **ห้ามแตะ `dashboard.css` แบบกระทบหน้าอื่น** — CSS ใหม่แยกไฟล์/scoped เท่าที่ทำได้
- ทุก commit: build ผ่าน + mock รันได้ + `.env.local` ไม่หลุด

## ลำดับ
F1 → F2 → F3 → F4 (หยุด verify ทุก Checkpoint, commit ทีละฟีเจอร์)
