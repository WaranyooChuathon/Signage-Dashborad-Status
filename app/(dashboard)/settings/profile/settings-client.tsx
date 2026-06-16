'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/dashboard/theme-provider'
import { useLang } from '@/lib/i18n/language-provider'
import type { Lang } from '@/lib/i18n/dict'
import {
  User, Lock, Palette, Bell, Eye, EyeOff, Sun, Moon, Save, Shield,
} from 'lucide-react'
import type { Profile } from '@/types/database'
import './settings.css'

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
  const { lang, setLang, t } = useLang()

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

  // ── Notifications (preference, client-only) ──
  const [noti, setNoti] = useState<NotiPrefs>(DEFAULT_NOTI)
  const [mounted, setMounted] = useState(false)

  // ── Toast ──
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // โหลด noti preference จาก localStorage (client เท่านั้น — เลี่ยง SSR mismatch)
  useEffect(() => {
    setMounted(true)
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
      showToast(t('set.toast.nameRequired'), 'error')
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
    else showToast(t('set.toast.profileSaved'), 'success')
  }

  // ── Password change ──
  async function changePassword() {
    if (pw.length < 8) {
      showToast(t('set.pw.tooShort'), 'error')
      return
    }
    if (pw !== pw2) {
      showToast(t('set.pw.mismatch'), 'error')
      return
    }
    setSavingPw(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pw })
    setSavingPw(false)

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(t('set.pw.success'), 'success')
      setPw(''); setPw2(''); setShowPw(false); setPwOpen(false)
    }
  }

  function cancelPassword() {
    setPw(''); setPw2(''); setShowPw(false); setPwOpen(false)
  }

  // ── Appearance / Noti handlers ──
  function changeLang(next: Lang) {
    setLang(next)
    showToast(next === 'th' ? t('set.lang.changedTh') : t('set.lang.changedEn'), 'success')
  }

  function toggleNoti(key: keyof NotiPrefs) {
    const next = { ...noti, [key]: !noti[key] }
    setNoti(next)
    localStorage.setItem('cc-noti', JSON.stringify(next))
  }

  const notiItems = [
    { key: 'deviceOffline', title: t('set.noti.offline'), sub: t('set.noti.offlineSub') },
    { key: 'dailyEmail',    title: t('set.noti.daily'),   sub: t('set.noti.dailySub') },
    { key: 'weeklyReport',  title: t('set.noti.weekly'),  sub: t('set.noti.weeklySub') },
  ] as const

  return (
    <div className="set-wrap">
      {/* ── Profile ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><User size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">{t('set.profile.title')}</div>
            <div className="set-card-sub">{t('set.profile.sub')}</div>
          </div>
        </div>

        <div className="set-form-grid">
          <div className="set-field">
            <label className="set-label">{t('set.field.name')}</label>
            <input
              className="set-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('set.placeholder.name')}
            />
          </div>
          <div className="set-field">
            <label className="set-label">{t('set.field.org')}</label>
            <input
              className="set-input"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder={t('set.placeholder.org')}
            />
          </div>
          <div className="set-field">
            <label className="set-label">{t('set.field.email')}</label>
            <input className="set-input" value={initialProfile.email ?? '—'} disabled readOnly />
          </div>
          <div className="set-field">
            <label className="set-label">{t('set.field.roleStatus')}</label>
            <div className="set-role-row">
              <span className={`set-role-badge ${ri.cls}`}>
                <Shield size={12} /> {ri.label}
              </span>
              <span className={`set-status ${initialProfile.status === 'active' ? 'is-active' : 'is-suspended'}`}>
                {initialProfile.status === 'active' ? t('set.status.active') : t('set.status.suspended')}
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
            {savingProfile ? t('set.saving') : t('set.save')}
          </button>
        </div>
      </section>

      {/* ── Change Password ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><Lock size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">{t('set.pw.title')}</div>
            <div className="set-card-sub">
              {pwOpen ? t('set.pw.subOpen') : t('set.pw.subClosed')}
            </div>
          </div>
        </div>

        {!pwOpen ? (
          <div className="set-actions" style={{ marginTop: 0 }}>
            <button className="set-btn-secondary" onClick={() => setPwOpen(true)}>
              <Lock size={14} strokeWidth={2} />
              {t('set.pw.change')}
            </button>
          </div>
        ) : (
          <>
            <div className="set-form-grid">
              <div className="set-field">
                <label className="set-label">{t('set.pw.new')}</label>
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
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="set-field">
                <label className="set-label">{t('set.pw.confirm')}</label>
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
                {t('set.pw.cancel')}
              </button>
              <button className="set-btn-primary" onClick={changePassword} disabled={savingPw}>
                <Lock size={14} strokeWidth={2} />
                {savingPw ? t('set.pw.changing') : t('set.pw.saveNew')}
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
            <div className="set-card-title">{t('set.appearance.title')}</div>
            <div className="set-card-sub">{t('set.appearance.sub')}</div>
          </div>
        </div>

        <div className="set-row">
          <div>
            <div className="set-row-title">{t('set.theme')}</div>
            <div className="set-row-sub">{t('set.themeSub')}</div>
          </div>
          <div className="set-seg">
            <button
              className={`set-seg-btn${theme === 'light' ? ' active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={14} /> {t('set.theme.light')}
            </button>
            <button
              className={`set-seg-btn${theme === 'dark' ? ' active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={14} /> {t('set.theme.dark')}
            </button>
          </div>
        </div>

        <div className="set-row">
          <div>
            <div className="set-row-title">{t('set.lang')}</div>
            <div className="set-row-sub">{t('set.langSub')}</div>
          </div>
          <select
            className="set-select"
            value={lang}
            onChange={(e) => changeLang(e.target.value as Lang)}
          >
            <option value="th">{t('set.lang.th')}</option>
            <option value="en">{t('set.lang.en')}</option>
          </select>
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="card glass set-card">
        <div className="set-card-head">
          <div className="set-card-icon"><Bell size={18} strokeWidth={1.8} /></div>
          <div>
            <div className="set-card-title">{t('set.noti.title')}</div>
            <div className="set-card-sub">{t('set.noti.sub')}</div>
          </div>
        </div>

        {notiItems.map(({ key, title, sub }) => (
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
