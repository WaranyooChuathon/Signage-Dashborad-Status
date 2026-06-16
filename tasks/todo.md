# TODO — หน้า Settings (`/settings/profile`)

> อ้างอิง `tasks/plan.md` · `SPEC.md` · เริ่ม 2026-06-16
> กฎ: ทุก task ต้อง `npm run build` ผ่าน + รันโหมด mock (ไม่มี `.env.local`) ได้ ก่อน commit

## Phase 1 — Foundation + Profile (สิ้น 404)
- [ ] **T1** ThemeProvider: เพิ่ม `setTheme` (คง `toggleTheme` เดิม)
- [ ] **T2** mock client: เพิ่ม `auth.updateUser` stub
- [ ] **T3** `settings/profile/page.tsx` — server: ดึง user + profile (+fallback)
- [ ] **T4** `settings-client.tsx` + `settings.css` — Profile section (แก้ full_name + organization)
- [ ] **Checkpoint 1** — ไม่ 404, Profile edit ครบ 2 โหมด, build ผ่าน

## Phase 2 — Password + Appearance + Notifications
- [ ] **T5** Change Password section (`auth.updateUser`, validate ≥8 + ตรงกัน)
- [ ] **T6** Appearance section (ธีม via setTheme + ภาษา preference)
- [ ] **T7** Notifications section (toggle → `localStorage 'cc-noti'`)
- [ ] **Checkpoint 2** — 4 sections ทำงานโหมด mock, build ผ่าน

## Phase 3 — Polish + Verify
- [ ] **T8** responsive ≤860px + dark mode ครบ + verify ทั้งหน้า
- [ ] **Checkpoint 3** — dual-mode ผ่าน, build เขียว → อัปเดต CHANGELOG + พร้อม merge

---
**ไฟล์ที่จะแตะ:** `theme-provider.tsx`, `lib/mock/client.ts`, `settings/profile/{page,settings-client}.tsx` (ใหม่), `settings.css` (ใหม่)
**ห้ามแตะ:** `dashboard.css`, schema/DB, repo บริษัท
