'use client'

import '../login/login.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordForm() {
  const [pw, setPw]         = useState('')
  const [pw2, setPw2]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (pw.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      return
    }
    if (pw !== pw2) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updErr } = await supabase.auth.updateUser({ password: pw })
    setLoading(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    setSuccess('ตั้งรหัสผ่านใหม่สำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...')
    setTimeout(() => router.push('/login'), 1400)
  }

  return (
    <div className="login-page" data-theme="dark">
      <div className="bg-canvas">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>

      <div className="page-layout">
        <div className="right-panel" style={{ margin: '0 auto' }}>
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="form-title">ตั้งรหัสผ่านใหม่ 🔐</h2>
            <p className="form-sub">กรอกรหัสผ่านใหม่สำหรับบัญชีของคุณ</p>

            {error && <div className="msg error">❌ {error}</div>}
            {success && <div className="msg success">✅ {success}</div>}

            <div className="field">
              <label className="field-label">รหัสผ่านใหม่</label>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
              />
              <span className="field-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁'}
              </span>
            </div>

            <div className="field">
              <label className="field-label">ยืนยันรหัสผ่านใหม่</label>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className={`btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : 'ตั้งรหัสผ่านใหม่'}
            </button>

            <p
              style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: '#cdd6f4', cursor: 'pointer' }}
              onClick={() => router.push('/login')}
            >
              ← กลับไปเข้าสู่ระบบ
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
