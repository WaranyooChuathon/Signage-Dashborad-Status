'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Shuffle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { useLang } from '@/lib/i18n/language-provider'
import type { Profile } from '@/types/database'

function generatePassword(): string {
  const upper   = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const lower   = 'abcdefghjkmnpqrstuvwxyz'
  const digits  = '23456789'
  const special = '!@#$%'
  const all     = upper + lower + digits + special
  const required = [
    upper  [Math.floor(Math.random() * upper.length)],
    lower  [Math.floor(Math.random() * lower.length)],
    digits [Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ]
  const rest = Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)])
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}

export default function UserModal({
  open, user, onClose, onSave, showToast,
}: {
  open: boolean
  user: Profile | null
  onClose: () => void
  onSave: () => void
  showToast: (msg: string, type: 'success' | 'error') => void
}) {
  const { t } = useLang()
  const isEdit = user !== null

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [org,      setOrg]      = useState('')
  const [role,     setRole]     = useState<string>('admin')
  const [status,   setStatus]   = useState<string>('active')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.full_name ?? '')
      setEmail(user.email ?? '')
      setOrg(user.organization ?? '')
      setRole(user.role ?? 'admin')
      setStatus(user.status ?? 'active')
      setPassword('')
    } else {
      setName(''); setEmail(''); setOrg('')
      setRole('admin'); setStatus('active')
      setPassword(generatePassword())
    }
    setShowPw(false)
  }, [user, open])

  async function handleSubmit() {
    if (!name || !email || !org) {
      showToast(t('um.toast.fillAll'), 'error')
      return
    }
    if (!isEdit && password.length < 8) {
      showToast(t('um.toast.pwShort'), 'error')
      return
    }

    setSaving(true)
    const supabase = createClient()

    if (isEdit && user) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name, email, organization: org, role, status })
        .eq('id', user.id)

      if (error) {
        showToast(error.message, 'error')
      } else {
        showToast(t('um.toast.updated'), 'success')
        onSave()
      }
    } else {
      // real mode: สร้างผ่าน API (service_role สร้าง auth user + profile)
      // mock mode: insert ลง mock store ฝั่ง client
      let errMsg: string | null = null
      if (hasSupabaseEnv) {
        const res = await fetch('/api/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: name, organization: org, role, status }),
        })
        const json = await res.json()
        if (!res.ok || json.error) errMsg = json.error ?? t('um.toast.createErr')
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({ email, full_name: name, organization: org, role, status })
        if (error) errMsg = error.message
      }

      if (errMsg) {
        showToast(errMsg, 'error')
      } else {
        try { await navigator.clipboard.writeText(password) } catch {}
        showToast(t('um.toast.created', { pw: password }), 'success')
        onSave()
      }
    }
    setSaving(false)
  }

  if (!open) return null

  return (
    <div className="um-overlay" onClick={(e) => { if ((e.target as HTMLElement).classList.contains('um-overlay')) onClose() }}>
      <div className="um-modal">
        <button className="um-modal-close" onClick={onClose}>✕</button>
        <div className="um-modal-title">{isEdit ? t('um.modal.editTitle') : t('um.modal.addTitle')}</div>
        <div className="um-modal-sub">
          {isEdit ? t('um.modal.editSub', { name: user?.full_name ?? '' }) : t('um.modal.addSub')}
        </div>

        <div className="um-form-grid">
          <div className="um-field">
            <label className="um-flabel">{t('um.modal.name')}</label>
            <input className="um-finput" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('set.placeholder.name')} />
          </div>
          <div className="um-field">
            <label className="um-flabel">{t('um.modal.org')}</label>
            <input className="um-finput" value={org} onChange={(e) => setOrg(e.target.value)} placeholder={t('set.placeholder.org')} />
          </div>
          <div className="um-field um-span2">
            <label className="um-flabel">{t('um.modal.email')}</label>
            <input className="um-finput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@smartsignage.app" disabled={isEdit} />
          </div>

          {!isEdit && (
            <div className="um-field um-span2">
              <label className="um-flabel">{t('um.modal.pwLabel')}</label>
              <div className="um-pw-wrap">
                <input
                  className="um-finput"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('um.modal.pwPlaceholder')}
                />
                <button
                  type="button"
                  className="um-pw-btn"
                  onClick={() => setShowPw((v) => !v)}
                  title={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  className="um-pw-btn"
                  onClick={() => setPassword(generatePassword())}
                  title="สุ่มรหัสผ่านใหม่"
                >
                  <Shuffle size={14} />
                </button>
              </div>
              <div className="um-pw-hint">
                {t('um.modal.pwHint')}
              </div>
            </div>
          )}

          <div className="um-field">
            <label className="um-flabel">Role</label>
            {/* ไม่ให้เลือก super_admin จาก UI — กันผู้เข้าชม demo ยกระดับเป็น godmode */}
            <select className="um-fselect" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="um-field">
            <label className="um-flabel">{t('um.modal.statusLabel')}</label>
            <select className="um-fselect" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">{t('set.status.active')}</option>
              <option value="suspended">{t('set.status.suspended')}</option>
            </select>
          </div>
        </div>

        <div className="um-modal-actions">
          <button className="um-btn-cancel" onClick={onClose}>{t('set.pw.cancel')}</button>
          <button className="um-btn-submit" onClick={handleSubmit} disabled={saving}>
            {saving ? t('set.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
