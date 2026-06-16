'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/dashboard/theme-provider'
import {
  User, Lock, Palette, Bell, Eye, EyeOff, Sun, Moon, Save, Shield,
} from 'lucide-react'
import type { Profile } from '@/types/database'
import './settings.css'

type Lang = 'th' | 'en'
type NotiPrefs = {
  deviceOffline: boolean
  dailyEmail: boolean
  weeklyReport: boolean
}

const DEFAULT_NOTI: NotiPrefs = {
  deviceOffline: true,
  dailyEmail: false,
  weeklyReport: true,
}

const roleInfo: Record<string, { cls: string; label: string }> = {
  super_admin: { cls: 'role-sa', label: 'Super Admin' },
  admin:       { cls: 'role-a',  label: 'Admin' },
  viewer:      { cls: 'role-v',  label: 'Viewer' },
}

export default function SettingsClient({ initialProfile }: { initialProfile: Profile }) {
  const { theme, setTheme } = useTheme()

  // ── Profile ──
  const [fullName, setFullName] = useState(initialProfile.full_name ?? '')
  const [org, setOrg]           = useState(initialProfile.organization ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  // ── Password ── (ซ่อนช่องไว้ก่อน ต้องกดปุ่มเปิด เพราะเป็นข้อมูลอ่อนไหว)
  const [pwOpen, setPwOpen] = useState(false)
  const [pw, setPw]         = useState('')
  const [pw2, setPw2]       = useState('')
  const [showPw, setShowPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  // ── Appearance / Notifications (preference, client-only) ──
  const [lang, setLang] = useState<Lang>('th')
  const [noti, setNoti] = useState<NotiPrefs>(DEFAULT_NOTI)
  const [mounted, setMounted] = useState(false)

  // ── Toast ──
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // โหลด preference จาก localStorage (client เท่านั้น — เลี่ยง SSR mismatch)
  useEffect(() => {
    setMounted(true)
    const storedLang = localStorage.getItem('cc-lang') as Lang | null
    if (storedLang === 'th' || storedLang === 'en') setLang(storedLang)
    try {
      const storedNoti = localStorage.getItem('cc-noti')
      if (storedNoti) setNoti({ ...DEFAULT_NOTI, ...JSON.parse(storedNoti) })
    } catch {
      /* ค่าเสีย → ใช้ default */
    }
  }, [])

  const ri = roleInfo[initialProfile.role] ?? roleInfo.viewer
  const profileDirty =
    fullName.trim() !== (initialProfile.full_name ?? '') ||
    org.trim() !== (initialProfile.organization ?? '')

  // ── Profile save ──
  async function saveProfile() {
    if (!fullName.trim()) {
      showToast('กรุณากรอกชื่อ-นามสกุล', 'error')
      return
    }
    setSavingProfile(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), organization: org.trim() || null })
      .eq('id', initialProfile.id)
    setSavingProfile(false)

    if (error) showToast(error.message, 'error')
    else showToast('บันทึกโปรไฟล์สำเร็จ', 'success')
  }

  // ── Password change ──
  async function changePassword() {
    if (pw.length < 8) {
      showToast('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'error')
      return
    }
    if (pw !== pw2) {
      showToast('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'error')
      return
    }
    setSavingPw(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pw })
    setSavingPw(false)

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('เปลี่ยนรหัสผ่านสำเร็จ', 'success')
      setPw(''); setPw2(''); setShowPw(false); setPwOpen(false)
    }
  }

  function cancelPassword() {
    setPw(''); setPw2(''); setShowPw(false); setPwOpen(false)
  }

  // ── Appearance / Noti handlers ──
  function changeLang(next: Lang) {
    setLang(next)
    localStorage.setItem('cc-lang', next)
    showToast(next === 'th' ? 'เปลี่ยนภาษาเป็นไทย' : 'Language set to English', 'success')
  }

  function toggleNoti(key: keyof NotiPrefs) {
    const next = { ...noti, [key]: !noti[key] }
    setNoti(next)
    localStorage.setItem('cc-noti', JSON.stringify(next))
  }

  return (
    <div className="set-wrap">
      {/* ── Profile ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><User size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">ข้อมูลโปรไฟล์</div>
            <div className="set-card-sub">แก้ไขชื่อและองค์กรของคุณ</div>
          </div>
        </div>

        <div className="set-form-grid">
          <div className="set-field">
            <label className="set-label">ชื่อ-นามสกุล</label>
            <input
              className="set-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
            />
          </div>
          <div className="set-field">
            <label className="set-label">องค์กร / สาขา</label>
            <input
              className="set-input"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="เช่น Aurora City"
            />
          </div>
          <div className="set-field">
            <label className="set-label">อีเมล</label>
            <input className="set-input" value={initialProfile.email ?? '—'} disabled readOnly />
          </div>
          <div className="set-field">
            <label className="set-label">สิทธิ์ / สถานะ</label>
            <div className="set-role-row">
              <span className={`set-role-badge ${ri.cls}`}>
                <Shield size={12} /> {ri.label}
              </span>
              <span className={`set-status ${initialProfile.status === 'active' ? 'is-active' : 'is-suspended'}`}>
                {initialProfile.status === 'active' ? 'Active' : 'Suspended'}
              </span>
            </div>
          </div>
        </div>

        <div className="set-actions">
          <button
            className="set-btn-primary"
            onClick={saveProfile}
            disabled={savingProfile || !profileDirty}
          >
            <Save size={14} strokeWidth={2} />
            {savingProfile ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
          </button>
        </div>
      </section>

      {/* ── Change Password ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><Lock size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">เปลี่ยนรหัสผ่าน</div>
            <div className="set-card-sub">
              {pwOpen ? 'อย่างน้อย 8 ตัวอักษร' : 'ปกป้องบัญชีของคุณด้วยรหัสผ่านที่รัดกุม'}
            </div>
          </div>
        </div>

        {!pwOpen ? (
          <div className="set-actions" style={{ marginTop: 0 }}>
            <button className="set-btn-secondary" onClick={() => setPwOpen(true)}>
              <Lock size={14} strokeWidth={2} />
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        ) : (
          <>
            <div className="set-form-grid">
              <div className="set-field">
                <label className="set-label">รหัสผ่านใหม่</label>
                <div className="set-pw-wrap">
                  <input
                    className="set-input"
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="set-pw-btn"
                    onClick={() => setShowPw((v) => !v)}
                    title={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="set-field">
                <label className="set-label">ยืนยันรหัสผ่านใหม่</label>
                <input
                  className="set-input"
                  type={showPw ? 'text' : 'password'}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="set-actions" style={{ gap: 8 }}>
              <button className="set-btn-secondary" onClick={cancelPassword} disabled={savingPw}>
                ยกเลิก
              </button>
              <button className="set-btn-primary" onClick={changePassword} disabled={savingPw}>
                <Lock size={14} strokeWidth={2} />
                {savingPw ? 'กำลังเปลี่ยน...' : 'บันทึกรหัสผ่านใหม่'}
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── Appearance ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><Palette size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">การแสดงผล</div>
            <div className="set-card-sub">ธีมและภาษา</div>
          </div>
        </div>

        <div className="set-row">
          <div>
            <div className="set-row-title">ธีม</div>
            <div className="set-row-sub">เลือกโหมดสว่างหรือมืด</div>
          </div>
          <div className="set-seg">
            <button
              className={`set-seg-btn${theme === 'light' ? ' active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={14} /> Light
            </button>
            <button
              className={`set-seg-btn${theme === 'dark' ? ' active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>

        <div className="set-row">
          <div>
            <div className="set-row-title">ภาษา</div>
            <div className="set-row-sub">ภาษาที่ต้องการใช้งาน</div>
          </div>
          <select
            className="set-select"
            value={lang}
            onChange={(e) => changeLang(e.target.value as Lang)}
            suppressHydrationWarning
          >
            <option value="th">ไทย</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><Bell size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">การแจ้งเตือน</div>
            <div className="set-card-sub">ตั้งค่าการรับแจ้งเตือน</div>
          </div>
        </div>

        {([
          { key: 'deviceOffline', title: 'แจ้งเตือนเมื่อ device offline', sub: 'รับแจ้งเตือนทันทีเมื่ออุปกรณ์ขาดการเชื่อมต่อ' },
          { key: 'dailyEmail',    title: 'สรุปรายวันทางอีเมล',          sub: 'รับอีเมลสรุปสถานะทุกเช้า' },
          { key: 'weeklyReport',  title: 'รายงานประจำสัปดาห์',          sub: 'สรุป uptime และเหตุการณ์รายสัปดาห์' },
        ] as const).map(({ key, title, sub }) => (
          <div className="set-row" key={key}>
            <div>
              <div className="set-row-title">{title}</div>
              <div className="set-row-sub">{sub}</div>
            </div>
            <button
              className={`set-toggle${mounted && noti[key] ? ' on' : ''}`}
              role="switch"
              aria-checked={mounted ? noti[key] : false}
              onClick={() => toggleNoti(key)}
              suppressHydrationWarning
            >
              <span className="set-toggle-thumb" />
            </button>
          </div>
        ))}
      </section>

      {toast && <div className={`set-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
