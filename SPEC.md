# SPEC.md — หน้า Settings (`/settings/profile`)

> Spec-driven development · Smart Signage Dashboard (Live Demo)
> สร้างเมื่อ 2026-06-16 · งานค้างข้อแรกจาก `CLAUDE.md` (Future work)

---

## 1. Objective (เป้าหมาย)

ปัจจุบัน sidebar (`/settings/profile`) และ topbar มีลิงก์ไปหน้า **Settings** แล้ว แต่ยัง
**ไม่มีไฟล์ page → 404** ต้องสร้างหน้านี้ให้ใช้งานได้จริง

**ผู้ใช้เป้าหมาย:** ผู้ดูแลระบบ/operator ที่ login เข้ามา (รวม demo user) อยากแก้โปรไฟล์
ตัวเอง เปลี่ยนรหัสผ่าน และปรับการตั้งค่าส่วนตัว (ธีม/ภาษา/แจ้งเตือน)

**Definition of done:** เข้าหน้า `/settings/profile` ได้ (ไม่ 404), แก้ข้อมูลแล้ว persist/มีผลจริง
ตามแต่ละ section, และ**ทั้งโหมด mock และ real Supabase ทำงานได้ทั้งคู่** (กฎเหล็กของโปรเจกต์)

---

## 2. Core Features & Acceptance Criteria

หน้าแบ่งเป็น 4 การ์ด (sections) ตาม DESIGN.md (card 18px radius, shadow-sm, ภาษาไทย):

### 2.1 Profile (ข้อมูลโปรไฟล์)
- แก้ได้: **`full_name`**, **`organization`**
- แสดงแบบ **read-only**: `email`, `role` (badge), `status`
- ปุ่ม **บันทึก** → `supabase.from('profiles').update({ full_name, organization }).eq('id', userId)`
- **AC:**
  - โหลดหน้า → form prefill ด้วยข้อมูล profile ของ user ปัจจุบัน
  - กดบันทึก → toast สำเร็จ; (real) reload แล้วค่าใหม่ยังอยู่; (mock) อัปเดต in-memory + sidebar รีเฟรชชื่อได้
  - ปุ่มบันทึก disabled ระหว่างกำลังบันทึก และเมื่อไม่มีการเปลี่ยนแปลง
  - `full_name` ห้ามว่าง (validation)

### 2.2 Change Password (เปลี่ยนรหัสผ่าน)
- ฟิลด์: รหัสผ่านใหม่ + ยืนยันรหัสผ่านใหม่ (toggle eye/eyeoff ตาม pattern `user-modal.tsx`)
- ปุ่ม **เปลี่ยนรหัสผ่าน** → `supabase.auth.updateUser({ password })`
- **AC:**
  - validation: ≥ 8 ตัวอักษร, สองช่องต้องตรงกัน
  - real mode → เปลี่ยนรหัสจริงผ่าน Supabase Auth, toast สำเร็จ
  - mock mode → จำลองสำเร็จ (mock client เพิ่ม `auth.updateUser` stub คืน `{ error: null }`), toast สำเร็จ
  - หลังสำเร็จ เคลียร์ทั้งสองช่อง

### 2.3 Appearance (ธีม + ภาษา)
- **ธีม:** เลือก Light / Dark — ขับ `ThemeProvider` เดิม (`localStorage 'cc-theme'`) ให้ตรงกับปุ่มใน topbar
- **ภาษา:** dropdown TH / EN — **preference อย่างเดียว** เก็บ `localStorage 'cc-lang'` (ยังไม่มี i18n จริง; ค่าคงอยู่ข้ามรีเฟรช แต่ UI ยังเป็นไทย)
- **AC:**
  - เลือกธีมในหน้านี้ → เปลี่ยนทันที + ปุ่ม topbar sync ค่าตรงกัน + persist ข้าม refresh
  - เลือกภาษา → ค่าถูกบันทึกและคงอยู่ข้าม refresh (ไม่ throw, ไม่แปล UI)

### 2.4 Notifications (การแจ้งเตือน) — preference
- toggle switches (ตาม DESIGN.md toggle component): เช่น "แจ้งเตือนเมื่อ device offline", "สรุปรายวันทางอีเมล"
- เก็บ **`localStorage 'cc-noti'`** (JSON) — ไม่แตะ schema/DB
- **AC:** toggle แล้วค่าถูกบันทึก + คงอยู่ข้าม refresh; default มีค่าเริ่มต้นที่สมเหตุผล

### 2.5 ทั่วทั้งหน้า
- **AC (สำคัญสุด):** รันโดย**ไม่มี `.env.local`** (mock) → ทุก section render + ใช้งานได้ ไม่ crash
- responsive: การ์ดเรียงตัวได้บนจอแคบ (≤ 860px stack เดียว)
- รองรับ dark mode ครบทุก section (ใช้ CSS variables)

---

## 3. Tech Stack & Constraints

- **Stack เดิม:** Next.js 16 (App Router) + React 19 + TypeScript; CSS ธรรมดา (**ไม่ใช้ Tailwind**)
- **Dual-mode (env-toggle):** หน้า/ฟอร์มเรียก `createClient()` เหมือนกันทั้งสองโหมด — ห้าม branch ในหน้า
  ความต่าง real/mock อยู่ใน data layer เท่านั้น
- **โครงหน้า:** ทำตาม pattern เดิม — `page.tsx` (server, ดึง profile) + `*-client.tsx` (`'use client'`, form/state)
- **CSS:** ไฟล์ใหม่ `settings.css` (import ในหน้า) — ห้ามแก้ `dashboard.css` (MASTER) เว้นแต่จำเป็น
- **ธีม/ภาษา/noti:** ใช้ `localStorage` keys: `cc-theme` (มีอยู่แล้ว), `cc-lang`, `cc-noti`
- **ไอคอน:** `lucide-react` (stroke 1.6/2 ตาม DESIGN.md) — ห้าม fill ไอคอน
- **ภาษา UI:** ไทย (ตาม topbar/sidebar เดิม)

---

## 4. Project Structure (ไฟล์ที่จะเพิ่ม/แก้)

```
app/(dashboard)/settings/
  profile/
    page.tsx              # ใหม่ — server component: ดึง user + profile, force-dynamic
    settings-client.tsx   # ใหม่ — 'use client': 4 sections, form state, toast
    settings.css          # ใหม่ — สไตล์เฉพาะหน้า (light + dark)

components/dashboard/
  theme-provider.tsx      # แก้ — เพิ่ม setTheme(t) (explicit) คู่กับ toggleTheme เดิม (backward-compatible)

lib/mock/
  client.ts               # แก้ — เพิ่ม auth.updateUser() stub (mock password change)
```

**หมายเหตุการดึง profile:** `page.tsx` ใช้ `supabase.auth.getUser()` หา id แล้ว query
`profiles` ของ user นั้น (mock: id `u-001` = `Demo Admin`). ถ้าไม่พบ profile → ส่ง fallback จาก
auth user (`email`, `user_metadata.full_name`) เพื่อกัน null

---

## 5. Code Style & Testing Strategy

### Code style
- ตาม convention เดิม: comment ภาษาไทยสั้น ๆ, `showToast(msg, type)` แบบ `user-management-client.tsx`
- ใช้ class จาก DESIGN.md tokens; ปุ่ม `primary`/`secondary`, badge, toggle, input ตาม spec
- ปุ่มบันทึกมี state `saving` (disabled + ข้อความระหว่างรอ)

### Testing / Verify (manual — ตาม CLAUDE.md checklist)
1. `npm run build` ผ่าน (บังคับก่อน commit)
2. **mock mode** (ไม่มี `.env.local`): `npm run dev` → `/settings/profile` ทุก section render + กดได้ครบ ไม่ crash
3. ธีม: เลือก dark ในหน้า → topbar เป็น sun + ทั้งหน้าเป็น dark + refresh ค้าง
4. profile: แก้ชื่อ → บันทึก → toast; (mock) sidebar/ค่าตามที่แก้
5. password: ใส่ < 8 ตัว → error; ตรงกัน ≥ 8 → toast สำเร็จ + เคลียร์ช่อง
6. noti/lang: toggle/เลือก → refresh → ค่าคงอยู่
7. responsive: ย่อจอ ≤ 860px → การ์ด stack ไม่ล้น
8. (ถ้ามี Supabase env) real mode: profile + password persist จริงหลัง reload

---

## 6. Boundaries (ขอบเขต)

### ✅ Always
- รักษา **dual-mode**: ทุกการแก้ต้องไม่ทำให้โหมด mock พัง (รันได้โดยไม่มี env เสมอ)
- ใช้ `createClient()` เดียวกันทั้งสองโหมด
- ทำตาม DESIGN.md (สี, การ์ด, ปุ่ม, toggle, dark mode) และ pattern ไฟล์เดิม
- `npm run build` ต้องผ่านก่อน commit; commit ลงท้าย `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

### ⚠️ Ask first
- การเพิ่ม dependency ใหม่ (เลี่ยง; ใช้ของที่มี)
- การแก้ `dashboard.css` (MASTER) — กระทบทุกหน้า
- การเปลี่ยน schema/DB (เช่น เพิ่มคอลัมน์ profiles) — spec นี้ตั้งใจเลี่ยงไว้แล้ว

### ❌ Never
- ห้ามทำ i18n เต็มรูปแบบในรอบนี้ (ภาษา = preference เก็บค่าเท่านั้น)
- ห้ามเพิ่มคอลัมน์ DB สำหรับ noti/lang (ใช้ localStorage)
- ห้ามให้ผู้ใช้แก้ `role`/`status` ตัวเอง (read-only)
- ห้าม commit `.env.local`/service_role key; ห้ามแตะ repo บริษัท; ห้ามใส่ข้อมูลจริงของบริษัท

---

## Out of scope (รอบถัดไป)
- i18n จริง (แปล UI ทั้งระบบ)
- Notification dropdown จริงในปุ่ม Bell ที่ topbar
- Command palette (`⌘K`) จริง
- ลิงก์ "ลืมรหัสผ่าน?" หน้า login
