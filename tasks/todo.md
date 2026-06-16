# TODO — งานค้างที่เหลือ (4 ฟีเจอร์)

> อ้างอิง `tasks/plan.md` · เริ่ม 2026-06-16
> กฎ: ทุก task `npm run build` ผ่าน + รันโหมด mock (ไม่มี `.env.local`) ได้ ก่อน commit

## F1 — Notifications dropdown
- [ ] **T1.1** topbar เป็น client + ดึง offline devices (RPC) + Bell badge
- [ ] **T1.2** notification-menu dropdown + mark-as-read (localStorage) + empty/close
- [ ] **Checkpoint F1** — mock: badge=offline count, dropdown, mark read persist, build ผ่าน

## F2 — Command palette (⌘K)
- [ ] **T2.1** command-palette component + global ⌘K + nav/action + keyboard
- [ ] **T2.2** sidebar Quick find → คลิกเปิด palette
- [ ] **Checkpoint F2** — mock: ⌘K/คลิกเปิด, กรอง, Enter นำทาง, Esc ปิด, build ผ่าน

## F3 — ลืมรหัสผ่าน (reset)
- [ ] **T3.1** mock stub `resetPasswordForEmail`
- [ ] **T3.2** login: ลิงก์ → ฟอร์มอีเมล → resetPasswordForEmail
- [ ] **T3.3** หน้า `/reset-password` ตั้งรหัสใหม่ (updateUser)
- [ ] **Checkpoint F3** — mock: flow ขอ reset + ตั้งรหัสใหม่, build ผ่าน

## F4 — Sync จริง
- [ ] **T4.1** /api/sync เขียน snapshot ใหม่ (real, service_role) / simulate (mock)
- [ ] **Checkpoint F4** — mock: Sync ไม่ error; (real) row ใหม่ใน device_logs

---
**ไฟล์หลักที่จะแตะ:** topbar.tsx, notification-menu.tsx(ใหม่), command-palette.tsx(ใหม่),
sidebar.tsx, layout.tsx, login-form.tsx, reset-password/(ใหม่), lib/mock/client.ts, api/sync/route.ts
**ห้ามแตะ:** schema/DB (เว้น F4 insert ผ่าน service_role), repo บริษัท
