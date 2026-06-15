'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Shuffle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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
      showToast('กรุณากรอกข้อมูลให้ครบ', 'error')
      return
    }
    if (!isEdit && password.length < 8) {
      showToast('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'error')
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
        showToast('อัปเดตสำเร็จ', 'success')
        onSave()
      }
    } else {
      // DEMO MODE — เพิ่ม user ลง mock store ฝั่ง client
      const { error } = await supabase
        .from('profiles')
        .insert({ email, full_name: name, organization: org, role, status })

      if (error) {
        showToast(error.message, 'error')
      } else {
        try { await navigator.clipboard.writeText(password) } catch {}
        showToast(`สร้าง User สำเร็จ — รหัสผ่าน: ${password} (คัดลอกแล้ว)`, 'success')
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
        <div className="um-modal-title">{isEdit ? 'แก้ไขข้อมูล User' : 'เพิ่ม User ใหม่'}</div>
        <div className="um-modal-sub">
          {isEdit ? `กำลังแก้ไข: ${user?.full_name}` : 'กรอกข้อมูลให้ครบ — รหัสผ่านจะถูกคัดลอกอัตโนมัติเมื่อสร้างสำเร็จ'}
        </div>

        <div className="um-form-grid">
          <div className="um-field">
            <label className="um-flabel">ชื่อ-นามสกุล</label>
            <input className="um-finput" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมชาย ใจดี" />
          </div>
          <div className="um-field">
            <label className="um-flabel">องค์กร / สาขา</label>
            <input className="um-finput" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="เช่น Aurora City" />
          </div>
          <div className="um-field um-span2">
            <label className="um-flabel">อีเมล</label>
            <input className="um-finput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@smartsignage.app" disabled={isEdit} />
          </div>

          {!isEdit && (
            <div className="um-field um-span2">
              <label className="um-flabel">รหัสผ่านเริ่มต้น</label>
              <div className="um-pw-wrap">
                <input
                  className="um-finput"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
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
                ตั้งรหัสผ่านชั่วคราวให้ User — หลังสร้างสำเร็จรหัสผ่านจะถูกคัดลอกไป clipboard อัตโนมัติ
              </div>
            </div>
          )}

          <div className="um-field">
            <label className="um-flabel">Role</label>
            <select className="um-fselect" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="um-field">
            <label className="um-flabel">สถานะ</label>
            <select className="um-fselect" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="um-modal-actions">
          <button className="um-btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="um-btn-submit" onClick={handleSubmit} disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}
