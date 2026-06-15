'use client'

import './login.css' 
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('demo@smartsignage.app')
  const [password, setPassword] = useState('demo1234')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      setPassword('')
      setLoading(false)
      return
    }

    setSuccess('เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้า Dashboard...')
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  return (
    <div className="login-page" data-theme="dark">
      {/* Background orbs */}
      <div className="bg-canvas">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>

      <div className="page-layout">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">📺</div>
            <div>
              <div className="brand-name">Smart Signage</div>
              <div className="brand-sub">Aurora City — Live Demo</div>
            </div>
          </div>

          {/* Center content */}
          <div className="illus-block">
            <div>
              <h1 className="illus-headline">
                ระบบจัดการ<br />
                <em>จอโฆษณาดิจิทัล</em><br />
                อัจฉริยะ
              </h1>
              <p className="illus-desc">
                ติดตามสถานะอุปกรณ์ Signage ทั่วเมืองแบบ Real-time<br />
                บริหารเนื้อหาและวิเคราะห์ผู้ชมด้วย AI ในที่เดียว
              </p>
            </div>

            {/* SVG Illustration */}
            <SignageIllustration />
          </div>

          {/* Footer */}
          <div className="left-footer">
            <span className="version-tag">v2.6.0 — 2026</span>
            <div className="footer-links">
              <span>เงื่อนไขการใช้งาน</span>
              <span>ความเป็นส่วนตัว</span>
              <span>ติดต่อ</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <form className="form-card" onSubmit={handleLogin}>
            <h2 className="form-title">ยินดีต้อนรับ 👋</h2>
            <p className="form-sub">เข้าสู่ระบบเพื่อจัดการ Smart Signage</p>

            {/* Error */}
            {error && <div className="msg error">❌ {error}</div>}
            {success && <div className="msg success">✅ {success}</div>}

            {/* Email */}
            <div className="field">
              <label className="field-label">อีเมล</label>
              <input
                className="field-input"
                type="email"
                placeholder="demo@smartsignage.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">รหัสผ่าน</label>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="field-eye"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁'}
              </span>
            </div>

            {/* Remember + Forgot */}
            <div className="field-row">
              <label className="remember">
                <input type="checkbox" defaultChecked /> จดจำฉันไว้
              </label>
              <span className="forgot-link">ลืมรหัสผ่าน?</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>

            {/* Demo bypass */}
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{
                marginTop: 12, width: '100%', padding: '13px',
                borderRadius: 12, border: '1px solid rgba(126,148,216,.5)',
                background: 'rgba(126,148,216,.12)', color: '#cdd6f4',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              🚀 เข้าชม Live Demo (ไม่ต้องล็อกอิน)
            </button>
            <p style={{
              marginTop: 12, fontSize: 11, textAlign: 'center',
              color: 'rgba(205,214,244,.55)', lineHeight: 1.6,
            }}>
              โหมดสาธิต · ข้อมูลทั้งหมดเป็นตัวอย่าง — ใส่อีเมล/รหัสผ่านอะไรก็เข้าได้
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

function SignageIllustration() {
  return (
    <svg className="mockup-svg" viewBox="0 0 440 230" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scrDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2d56" stopOpacity=".9" />
          <stop offset="100%" stopColor="#0c1a3a" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id="barG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#34d399" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="barR" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#f87171" stopOpacity=".4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Device A — ONLINE */}
      <g transform="translate(30,10)">
        <rect x="0" y="0" width="130" height="210" rx="12" fill="#0a0e1c" stroke="rgba(30,58,110,0.7)" strokeWidth="1.5" />
        <rect x="0" y="0" width="130" height="210" rx="12" fill="none" stroke="rgba(52,211,153,0.15)" strokeWidth="1" />
        <rect x="8" y="8" width="114" height="160" rx="8" fill="url(#scrDark)" />
        <rect x="14" y="14" width="102" height="7" rx="3" fill="rgba(84,97,200,.5)" />
        <rect x="14" y="28" width="48" height="50" rx="7" fill="rgba(52,211,153,.08)" stroke="rgba(52,211,153,.25)" strokeWidth=".8" />
        <text x="38" y="48" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="18" fill="#34d399" filter="url(#glow)">24</text>
        <text x="38" y="63" textAnchor="middle" fontSize="7" fill="rgba(52,211,153,.7)">Online</text>
        <rect x="68" y="28" width="48" height="50" rx="7" fill="rgba(248,113,113,.07)" stroke="rgba(248,113,113,.22)" strokeWidth=".8" />
        <text x="92" y="48" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="18" fill="#f87171">3</text>
        <text x="92" y="63" textAnchor="middle" fontSize="7" fill="rgba(248,113,113,.7)">Offline</text>
        <rect x="14" y="86" width="102" height="72" rx="7" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.07)" strokeWidth=".7" />
        {[22,35,48,61,74,87,100].map((x, i) => (
          <rect key={i} x={x} y={155 - [20,28,24,30,26,29,27][i]} width="9" height={[20,28,24,30,26,29,27][i]} rx="2" fill="url(#barG)" opacity=".75" />
        ))}
        <rect x="48" y="152" width="9" height="3" rx="1" fill="url(#barR)" opacity=".8" />
        <rect x="74" y="150" width="9" height="4" rx="1" fill="url(#barR)" opacity=".8" />
        <rect x="8" y="174" width="114" height="26" rx="0" fill="rgba(84,97,200,.12)" stroke="rgba(84,97,200,.2)" strokeWidth=".7" />
        <text x="65" y="184" textAnchor="middle" fontSize="7" fill="rgba(126,148,216,.8)">▶ Main Playlist</text>
        <text x="65" y="194" textAnchor="middle" fontSize="7" fill="rgba(84,97,200,.5)">Program Sequence</text>
        <rect x="50" y="212" width="30" height="8" rx="3" fill="rgba(255,255,255,.07)" />
        <rect x="38" y="218" width="54" height="5" rx="2" fill="rgba(255,255,255,.05)" />
        <circle cx="122" cy="16" r="5" fill="#34d399" filter="url(#glow)" />
        <circle cx="122" cy="16" r="9" fill="#34d399" fillOpacity=".15" />
      </g>

      {/* Device B — OFFLINE */}
      <g transform="translate(220,30)" opacity=".42">
        <rect x="0" y="0" width="100" height="155" rx="10" fill="#06080f" stroke="rgba(248,113,113,.30)" strokeWidth="1.5" />
        <rect x="7" y="7" width="86" height="118" rx="7" fill="rgba(20,20,36,.8)" />
        <text x="50" y="54" textAnchor="middle" fontSize="22" fill="rgba(248,113,113,.25)">⚠</text>
        <text x="50" y="74" textAnchor="middle" fontSize="8" fill="rgba(248,113,113,.45)">CONNECTION LOST</text>
        <rect x="20" y="82" width="60" height="4" rx="2" fill="rgba(100,100,130,.15)" />
        <rect x="28" y="91" width="44" height="4" rx="2" fill="rgba(100,100,130,.10)" />
        <rect x="7" y="131" width="86" height="18" rx="0" fill="rgba(248,113,113,.06)" stroke="rgba(248,113,113,.15)" strokeWidth=".6" />
        <text x="50" y="143" textAnchor="middle" fontSize="7" fill="rgba(248,113,113,.5)">Last seen 06:00 น.</text>
        <rect x="35" y="157" width="30" height="6" rx="2" fill="rgba(255,255,255,.06)" />
        <circle cx="92" cy="12" r="4" fill="#f87171" />
      </g>

      {/* Device C — hint */}
      <g transform="translate(360,60)" opacity=".25">
        <rect x="0" y="0" width="72" height="110" rx="8" fill="#08090f" stroke="rgba(84,97,200,.25)" strokeWidth="1" />
        <rect x="5" y="5" width="62" height="82" rx="6" fill="rgba(15,22,50,.8)" />
        <rect x="12" y="14" width="48" height="6" rx="2" fill="rgba(84,97,200,.25)" />
        <rect x="12" y="25" width="48" height="30" rx="5" fill="rgba(84,97,200,.08)" />
        <circle cx="64" cy="10" r="3" fill="#34d399" fillOpacity=".5" />
      </g>

      <text x="95" y="224" textAnchor="middle" fontSize="8" fill="rgba(52,211,153,.55)" fontFamily="'JetBrains Mono',monospace">● SG-032 ONLINE</text>
      <text x="270" y="200" textAnchor="middle" fontSize="8" fill="rgba(248,113,113,.45)" fontFamily="'JetBrains Mono',monospace">● SG-016 OFFLINE</text>
    </svg>
  )
}