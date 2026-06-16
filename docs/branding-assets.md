# Branding Assets — ขนาดอ้างอิง (logo / icon / avatar)

> เอกสารอ้างอิงขนาดของ asset แบรนด์ทุกจุดในแอป สำหรับตอนเปลี่ยน logo/icon/avatar
> ดึงจากโค้ดจริง · อัปเดตล่าสุด 2026-06-16
> หมายเหตุ: สี/โทเคนอ้างอิง [DESIGN.md](../DESIGN.md) (Coralcove) — ไฟล์นี้เก็บเฉพาะ "ขนาด asset" ของแอปนี้

---

## 1. Avatar (โปรไฟล์ผู้ใช้)

ปัจจุบันแสดงเป็น **ตัวอักษรย่อ (initial)** ไม่ใช่รูป — ถ้าจะใส่รูปจริง ให้ครอบใน container ขนาดเดิม

| จุด | กล่อง | รูปทรง | ขอบ | font (initial) | gradient | ไฟล์ |
| --- | --- | --- | --- | --- | --- | --- |
| Sidebar rail avatar | **32×32** | วงกลม | 2px `rgba(255,255,255,.25)` | 11px / 700 | `135deg, #22D3EE → #3B6CFF` | [dashboard.css:137](../app/(dashboard)/dashboard.css#L137) · [sidebar.tsx:85](../components/dashboard/sidebar.tsx#L85) |
| ↳ status dot | **10×10** | วงกลม | 2px `#1F3FA8` (dark `#0B1330`) | — | `#14B8A6` | [dashboard.css:145](../app/(dashboard)/dashboard.css#L145) |
| Sidebar panel avatar (footer) | **32×32** | วงกลม | — | 11px / 700 | `135deg, #1F3FA8 → #22D3EE` | [dashboard.css:225](../app/(dashboard)/dashboard.css#L225) · [sidebar.tsx:138](../components/dashboard/sidebar.tsx#L138) |

> **ใส่รูป raster:** source ควร **64–96px** (retina @2x/@3x) แล้วย่อแสดงที่ 32px · ครอบเป็นวงกลมด้วย `border-radius:50%; object-fit:cover`

---

## 2. Brand logo

มี **3 จุด** — ใช้ไอคอน `Tv` (lucide) ยกเว้นหน้า login ที่เป็น inline SVG รูปจอภาพ

| จุด | กล่อง | radius | ไอคอนข้างใน | พื้นหลัง | ไฟล์ |
| --- | --- | --- | --- | --- | --- |
| Login (พาเนลซ้าย) | **38×38** | 11px | SVG ~20px (viewBox 24), stroke 1.8 | `135deg, #3B6CFF → #1F3FA8` + glow | [login.css:104](../app/login/login.css#L104) · [login-form.tsx](../app/login/login-form.tsx) |
| Sidebar slim rail | **36×36** | 10px | `Tv` 18px, stroke 1.6 | `rgba(255,255,255,.10)`, border `.18` | [dashboard.css:115](../app/(dashboard)/dashboard.css#L115) · [sidebar.tsx:66](../components/dashboard/sidebar.tsx#L66) |
| Sidebar panel | **34×34** | 10px | `Tv` 16px, stroke 2 | `135deg, #3B6CFF → #22D3EE` + glow | [dashboard.css:164](../app/(dashboard)/dashboard.css#L164) · [sidebar.tsx:95](../components/dashboard/sidebar.tsx#L95) |

**ข้อความแบรนด์ติดกับ logo**

| จุด | ชื่อ | คำบรรยายย่อย |
| --- | --- | --- |
| Login | 15px / 700 (`.lv-brand-name`) | 11px (`.lv-brand-sub`) |
| Sidebar | 14px / 700 (`.sb-name`) | 11px (`.sb-sub`) |

> ทั้งหมดเป็น `Tv` ตัวเดียวกัน → ถ้าเปลี่ยนเป็นโลโก้จริง แก้ที่ 3 จุดให้ตรงกัน
> หน้า login ใช้ inline SVG (ไม่ใช่ `Tv`) — แก้แยกใน [login-form.tsx](../app/login/login-form.tsx)

---

## 3. Icon ทั่วไป (lucide-react)

**stroke width:** 1.6 ปกติ · 2 ตอน active (ตาม DESIGN.md "Don't fill icons")

| บริบท | size (px) | กล่องรอบ (ถ้ามี) | ไฟล์ |
| --- | --- | --- | --- |
| Nav icon — slim rail | **18** | `.sb-rail-btn` | [sidebar.tsx:78](../components/dashboard/sidebar.tsx#L78) |
| Nav icon — panel | **16** | `.sb-item-icon` | [sidebar.tsx:126](../components/dashboard/sidebar.tsx#L126) |
| KPI icon | **18** | `.kpi-icon-box` 36×36 r10, frosted | [kpi-cards.tsx](../components/dashboard/kpi-cards.tsx) · [dashboard.css:393](../app/(dashboard)/dashboard.css#L393) |
| Topbar theme (Sun/Moon) | **16** | — | [topbar.tsx:40](../components/dashboard/topbar.tsx#L40) |
| Notification bell | **16** | — | [notification-menu.tsx:70](../components/dashboard/notification-menu.tsx#L70) |
| Notification item (WifiOff) | **14** | `.noti-ico` 30×30 r8 | [notification.css:97](../components/dashboard/notification.css#L97) |
| Search — sidebar / palette | 14 / 16 | — | [sidebar.tsx:108](../components/dashboard/sidebar.tsx#L108) |
| Command palette item | **15** | `.cmd-ico` 30×30 r8 | [command-palette.css:73](../components/dashboard/command-palette.css#L73) |
| List status (online/offline) | **14** | — | [online-list.tsx](../components/dashboard/online-list.tsx) · [offline-list.tsx](../components/dashboard/offline-list.tsx) |
| Card menu (`⋯` MoreHorizontal) | **14** | `.card-menu-btn` | ทั่วไปในการ์ด |
| Login — password eye | 16 | `.lc-eye` 30×30 | [login.css:321](../app/login/login.css#L321) |
| Login — theme toggle | 16 | `.login-themebtn` 32×32 r9 | [login.css:231](../app/login/login.css#L231) |
| LogOut (sidebar footer) | **13** | — | [sidebar.tsx:145](../components/dashboard/sidebar.tsx#L145) |
| Trend pill (TrendingUp) | **10** | — | [trend-chart.tsx:248](../components/dashboard/trend-chart.tsx#L248) |
| Empty state — noti / list | 20 / 22 | — | [notification-menu.tsx](../components/dashboard/notification-menu.tsx) · list |

---

## 4. Favicon / App icon / Social (ไฟล์ระดับเว็บ)

| asset | สถานะ | ขนาดแนะนำ | ที่ตั้ง (Next.js App Router) |
| --- | --- | --- | --- |
| `favicon.ico` | ✅ มีแล้ว (16+32) | 16×16 + 32×32 | [app/favicon.ico](../app/favicon.ico) |
| `app/icon.png` | ❌ ยังไม่มี | **512×512** | `app/icon.png` (Next ใส่ `<head>` ให้อัตโนมัติ) |
| `app/apple-icon.png` | ❌ ยังไม่มี | **180×180** | `app/apple-icon.png` |
| `app/opengraph-image.png` | ❌ ยังไม่มี | **1200×630** | `app/opengraph-image.png` (ตอนแชร์ลิงก์) |
| `<title>` / metadata | ✅ มีแล้ว | — | [app/layout.tsx:22](../app/layout.tsx#L22) |

> วาง `icon.png` / `apple-icon.png` / `opengraph-image.png` ในโฟลเดอร์ `app/` แล้ว Next.js generate meta tags ให้เอง ไม่ต้องแก้ `layout.tsx`

---

## 5. จุดอื่นที่ควรพิจารณาตอน rebrand

- **Avatar รูปจริง** — ปัจจุบันเป็นตัวย่อ; ถ้าจะรองรับรูปโปรไฟล์ เพิ่ม `<img>` 32×32 (source ≥64px) ทั้ง rail + panel
- **public/*.svg ที่ไม่ได้ใช้** — `file / globe / next / vercel / window.svg` เป็น default ของ Next.js ลบได้ถ้าไม่ใช้
- **ภาพ login** — light: [Signage-Status-Login_Long.png](../public/Image/Signage-Status-Login_Long.png) · dark: [Signage-Status-Login_Long-Dark.png](../public/Image/Signage-Status-Login_Long-Dark.png) (แนวนอน, แสดงแบบ `cover`)
- **Empty-state illustration** — ถ้าจะทำ custom แทนไอคอน lucide (noti ว่าง / list ว่าง)

---

## สรุป Checklist เปลี่ยน logo ทั้งแอป

- [ ] หน้า login — inline SVG ใน [login-form.tsx](../app/login/login-form.tsx) (กล่อง 38×38)
- [ ] sidebar rail — `Tv` 18px ใน [sidebar.tsx:66](../components/dashboard/sidebar.tsx#L66) (กล่อง 36×36)
- [ ] sidebar panel — `Tv` 16px ใน [sidebar.tsx:95](../components/dashboard/sidebar.tsx#L95) (กล่อง 34×34)
- [ ] favicon + `app/icon.png` (512) + `app/apple-icon.png` (180)
- [ ] (ถ้าต้องการ) `app/opengraph-image.png` (1200×630)
- [ ] ตรวจทั้ง light + dark ทุกจุด
