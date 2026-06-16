# TODO — หน้า Settings (`/settings/profile`) ✅ เสร็จ (2026-06-16)

> อ้างอิง `tasks/plan.md` · `SPEC.md`
> กฎ: ทุก task `npm run build` ผ่าน + รันโหมด mock (ไม่มี `.env.local`) ได้ ก่อน commit

## Phase 1 — Foundation + Profile (สิ้น 404)
- [x] **T1** ThemeProvider: เพิ่ม `setTheme` (คง `toggleTheme` เดิม)
- [x] **T2** mock client: เพิ่ม `auth.updateUser` stub
- [x] **T3** `settings/profile/page.tsx` — server: ดึง user + profile (+fallback)
- [x] **T4** `settings-client.tsx` + `settings.css` — Profile section (แก้ full_name + organization)
- [x] **Checkpoint 1** — ไม่ 404, Profile edit ครบ 2 โหมด, build ผ่าน

## Phase 2 — Password + Appearance + Notifications
- [x] **T5** Change Password section (`auth.updateUser`, validate ≥8 + ตรงกัน)
- [x] **T6** Appearance section (ธีม via setTheme + ภาษา preference)
- [x] **T7** Notifications section (toggle → `localStorage 'cc-noti'`)
- [x] **Checkpoint 2** — 4 sections ทำงานโหมด mock, build ผ่าน

## Phase 3 — Polish + Verify
- [x] **T8** responsive ≤860px + dark mode ครบ + verify ทั้งหน้า (Chrome DevTools)
- [x] **Checkpoint 3** — dual-mode ผ่าน, build เขียว, อัปเดต CHANGELOG/CLAUDE.md, commit

---
**ผลลัพธ์:** `/settings/profile` ใช้งานได้จริง 4 sections, dual-mode, dark + responsive ผ่าน
ดูสรุปใน `CHANGELOG.md` (2026-06-16)
