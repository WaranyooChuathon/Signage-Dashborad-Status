# Plan — หน้า Settings (`/settings/profile`)

> อ้างอิง `SPEC.md` · สร้าง 2026-06-16
> เป้าหมาย: สร้างหน้า `/settings/profile` (ปัจจุบัน 404) ให้ใช้งานได้จริง 4 sections
> รักษา **dual-mode** (mock + real Supabase) ทุก task

---

## Dependency graph

```
[T1] theme-provider: เพิ่ม setTheme ───┐
                                       │
[T2] mock client: auth.updateUser ─────┤  (สอง prerequisite เล็ก ๆ ทำก่อนได้เลย)
                                       │
                                       ▼
[T3] page.tsx (server: user+profile) ──► [T4] Profile section (สิ้น 404, edit ได้ครบเส้น)
                                              │
            ┌─────────────────┬──────────────┼───────────────┐
            ▼                 ▼              ▼               ▼
   [T5] Change Password  [T6] Appearance  [T7] Notifications  │
   (ใช้ T2)              (ใช้ T1)         (localStorage)      │
            └─────────────────┴──────────────┴───────────────┘
                                  ▼
                        [T8] responsive + dark polish + verify ครบหน้า
```

**ลำดับแนะนำ:** T1 → T2 → T3 → T4 → (Checkpoint 1) → T5 → T6 → T7 → (Checkpoint 2) → T8

แต่ละ task = vertical slice ที่ build ผ่าน + ทำงานได้ในโหมด mock; commit ทีละ task

---

## Phase 1 — Foundation + Profile (สิ้น 404)

### T1 — ขยาย ThemeProvider ให้มี `setTheme`
- **ไฟล์:** `components/dashboard/theme-provider.tsx`
- **ทำ:** เพิ่ม `setTheme(t: Theme)` ใน context (เก็บ state + `localStorage 'cc-theme'`), คง `toggleTheme` เดิมไว้ (ใช้ `setTheme` ภายใน) — backward-compatible กับ topbar
- **AC:** topbar เดิม (toggleTheme) ยังทำงาน; `useTheme()` คืน `{ theme, toggleTheme, setTheme }`
- **Verify:** `npm run build` ผ่าน; ปุ่มธีมใน topbar ยังสลับได้

### T2 — Mock client: เพิ่ม `auth.updateUser` stub
- **ไฟล์:** `lib/mock/client.ts`
- **ทำ:** เพิ่ม method `async updateUser(_attrs) { return { data: { user: DEMO_USER }, error: null } }` ใน `auth`
- **AC:** mock mode เรียก `supabase.auth.updateUser({ password })` ได้ คืน `error: null` ไม่ crash
- **Verify:** `npm run build` ผ่าน; type ตรงกับที่ client section จะเรียก

### T3 — Server page: ดึง user + profile
- **ไฟล์:** `app/(dashboard)/settings/profile/page.tsx` (ใหม่)
- **ทำ:** `force-dynamic`; `getUser()` → query `profiles` ของ id นั้น; ถ้าไม่พบ → fallback จาก auth user (email, user_metadata.full_name); ส่ง `initialProfile` + `email` ให้ client
- **AC:** เข้า `/settings/profile` **ไม่ 404 อีกต่อไป**; mock mode ได้ profile ของ `u-001` (Demo Admin)
- **Verify:** `npm run dev` (mock) → เปิดหน้าได้, ไม่มี error ใน console

### T4 — Profile section (แก้ full_name + organization)
- **ไฟล์:** `app/(dashboard)/settings/profile/settings-client.tsx` (ใหม่), `settings.css` (ใหม่)
- **ทำ:** โครง client + การ์ด Profile: input `full_name`/`organization`, read-only `email`/`role` badge/`status`; ปุ่มบันทึก → `from('profiles').update().eq('id')`; `showToast`; ปุ่ม disabled เมื่อ saving/ไม่เปลี่ยน; validate full_name ไม่ว่าง
- **AC:** prefill ถูก; กดบันทึก → toast สำเร็จ; mock อัปเดต in-memory; full_name ว่าง → กันไว้
- **Verify:** mock mode แก้ชื่อ → บันทึก → toast; reload (real) ค่าใหม่อยู่

### ✅ Checkpoint 1 — หน้าไม่ 404, Profile edit ครบเส้นทั้ง 2 โหมด, build ผ่าน

---

## Phase 2 — Password + Appearance + Notifications

### T5 — Change Password section
- **ไฟล์:** `settings-client.tsx`, `settings.css`
- **ทำ:** การ์ดรหัสผ่าน: 2 ช่อง (ใหม่ + ยืนยัน) + eye toggle (pattern `user-modal.tsx`); ปุ่ม → `supabase.auth.updateUser({ password })`; validate ≥ 8 + ตรงกัน; เคลียร์ช่องหลังสำเร็จ
- **AC:** < 8 → error toast; ไม่ตรงกัน → error; ผ่าน → toast สำเร็จ + เคลียร์; mock ไม่ crash (T2)
- **Verify:** mock mode ทดสอบ 3 เคส (สั้น/ไม่ตรง/ผ่าน)

### T6 — Appearance section (ธีม + ภาษา)
- **ไฟล์:** `settings-client.tsx`, `settings.css`
- **ทำ:** เลือกธีม Light/Dark ผ่าน `useTheme().setTheme` (T1); ภาษา TH/EN → `localStorage 'cc-lang'` (preference เท่านั้น)
- **AC:** เลือก dark → ทั้งหน้า + topbar sync + persist refresh; เลือกภาษา → persist refresh, ไม่ throw, ไม่แปล UI
- **Verify:** สลับธีมในหน้า → topbar icon เปลี่ยนตาม; refresh ค้าง; lang ค้าง

### T7 — Notifications section (preference)
- **ไฟล์:** `settings-client.tsx`, `settings.css`
- **ทำ:** toggle switches (DESIGN.md toggle): "แจ้งเตือนเมื่อ device offline", "สรุปรายวันทางอีเมล" (+ option ที่เหมาะสม); เก็บ `localStorage 'cc-noti'` (JSON); default สมเหตุผล
- **AC:** toggle → persist; refresh ค่าคงอยู่; default ครั้งแรกถูก
- **Verify:** mock mode toggle → refresh → คงอยู่

### ✅ Checkpoint 2 — ทั้ง 4 sections ทำงานในโหมด mock, build ผ่าน

---

## Phase 3 — Polish + Verify

### T8 — Responsive + dark mode + verify ครบหน้า
- **ไฟล์:** `settings.css`
- **ทำ:** การ์ด stack ≤ 860px ไม่ล้น; ตรวจ dark mode ทุก section (CSS variables); เก็บรายละเอียด spacing ตาม DESIGN.md
- **AC:** ทุก AC ใน SPEC §2.5 ผ่าน; ไม่มี horizontal scroll บนจอแคบ; dark อ่านง่ายครบ
- **Verify:** `npm run build`; mock mode เปิดทุก section + ย่อจอ + สลับ dark; (ถ้ามี env) real mode profile+password persist
- **หลังผ่าน:** อัปเดต `CHANGELOG.md`; พิจารณา `/code-review` ก่อน merge

### ✅ Checkpoint 3 — หน้า Settings ครบ, dual-mode ผ่าน, build เขียว, พร้อม commit/merge

---

## ความเสี่ยง / ข้อควรระวัง
- **mock profile id mismatch** — `getUser()` คืน `u-001`; ต้องมั่นใจ `mockProfiles()` มี row id `u-001` ไม่งั้น fallback ต้องทำงาน (T3 คุมไว้)
- **ThemeProvider state** — topbar กับ Settings ใช้ context เดียวกัน ต้อง sync (T1 ทำให้ทั้งคู่อ่าน/เขียน context+localStorage ตัวเดียว)
- **ห้ามแก้ `dashboard.css`** — สไตล์ใหม่อยู่ใน `settings.css` เท่านั้น
- **dual-mode** — ทุก commit ต้องรันโหมด mock ได้ (เช็คก่อน commit ทุกครั้ง)
