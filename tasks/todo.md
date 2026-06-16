# TODO — งานค้างที่เหลือ (4 ฟีเจอร์) ✅ เสร็จ (2026-06-16)

> อ้างอิง `tasks/plan.md` · ทุกฟีเจอร์ build ผ่าน + verify mock (Chrome DevTools) + commit

## F1 — Notifications dropdown ✅
- [x] **T1.1** topbar client + ดึง offline devices (RPC) + Bell badge
- [x] **T1.2** notification-menu dropdown + mark-as-read (localStorage) + empty/close
- [x] **Checkpoint F1** — badge=5 ตรง offline, dropdown, mark read persist

## F2 — Command palette (⌘K) ✅
- [x] **T2.1** command-palette + global ⌘K + nav/action + keyboard
- [x] **T2.2** sidebar Quick find → คลิกเปิด palette
- [x] **Checkpoint F2** — ⌘K/คลิกเปิด, filter, Enter นำทาง, Esc ปิด

## F3 — ลืมรหัสผ่าน (reset) ✅
- [x] **T3.1** mock stub `resetPasswordForEmail`
- [x] **T3.2** login: ลิงก์ → ฟอร์มอีเมล → resetPasswordForEmail
- [x] **T3.3** หน้า `/reset-password` ตั้งรหัสใหม่ (updateUser) + proxy public route
- [x] **Checkpoint F3** — forgot → success; reset-password validate + redirect

## F4 — Sync จริง ✅
- [x] **T4.1** /api/sync เขียน snapshot ใหม่ (real, service_role) / simulate (mock)
- [x] **Checkpoint F4** — mock 200 simulate, ปุ่ม Sync ไม่ crash

---
**ผลลัพธ์:** งานค้างเดิมใน CLAUDE.md เสร็จครบทุกข้อ · ดูสรุป `CHANGELOG.md` (2026-06-16)
**ค้างฝั่ง config (real mode):** เพิ่ม `<origin>/reset-password` ใน Supabase redirect URLs
