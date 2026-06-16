'use client'

import './login.css'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n/language-provider'
import { useTheme } from '@/components/dashboard/theme-provider'

export default function LoginForm() {
  const { t, lang, setLang } = useLang()
  const { theme, toggleTheme } = useTheme()
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
      setError(t('login.errEmpty'))
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(t('login.errAuth'))
      setPassword('')
      setLoading(false)
      return
    }

    setSuccess(t('login.success'))
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  async function handleDemo() {
    setError('')
    setSuccess('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@smartsignage.app',
      password: 'demo1234',
    })
    if (authError) {
      setError(t('login.errNoDemo'))
      setLoading(false)
      return
    }
    setSuccess(t('login.successDemo'))
    setTimeout(() => router.push('/dashboard'), 800)
  }

  return (
    <div className={`login-page${theme === 'dark' ? ' dark' : ''}`}>
      {/* ── LEFT — visual panel (รูป isometric เต็มพาเนล) ── */}
      <aside className="login-visual">
        <div className="lv-image" role="img" aria-label="Smart Signage devices" />
        <div className="lv-scrim" />

        <div className="lv-brand">
          <span className="lv-brand-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4" width="19" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </span>
          <span className="lv-brand-text">
            <span className="lv-brand-name">{t('login.brandName')}</span>
            <span className="lv-brand-sub">{t('login.brandSub')}</span>
          </span>
        </div>

        <div className="lv-copy">
          <h1 className="lv-headline">
            {t('login.headline')}<br />
            <em>{t('login.headlineEm')}</em>
          </h1>
          <p className="lv-desc">{t('login.desc')}</p>
        </div>
      </aside>

      {/* ── RIGHT — form panel ── */}
      <main className="login-form-wrap">
        <div className="login-bg" aria-hidden="true" />

        {/* Toggles: ภาษา + ธีม */}
        <div className="login-toolbar">
          <div className="login-langseg" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'th' ? 'active' : ''}
              onClick={() => setLang('th')}
            >TH</button>
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >EN</button>
          </div>
          <button
            type="button"
            className="login-themebtn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('login.toLight') : t('login.toDark')}
            title={theme === 'dark' ? t('login.toLight') : t('login.toDark')}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </div>

        <form className="login-card" onSubmit={handleLogin}>
          <h2 className="lc-title">{t('login.welcome')}</h2>
          <p className="lc-sub">{t('login.formSub')}</p>

          {error && <div className="lc-msg err">{error}</div>}
          {success && <div className="lc-msg ok">{success}</div>}

          {/* Email */}
          <label className="lc-field">
            <span className="lc-label">{t('login.emailLabel')}</span>
            <input
              className="lc-input"
              type="email"
              placeholder="demo@smartsignage.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          {/* Password */}
          <label className="lc-field">
            <span className="lc-label">{t('login.passwordLabel')}</span>
            <div className="lc-input-wrap">
              <input
                className="lc-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lc-eye"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? t('login.hidePw') : t('login.showPw')}
                title={showPass ? t('login.hidePw') : t('login.showPw')}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.9 4.6A9.8 9.8 0 0 1 12 4.5c5 0 9 4.5 9 7.5a11 11 0 0 1-2.2 3.2M6.1 6.1C3.7 7.6 2 10 2 12c0 3 4 7.5 9 7.5 1.4 0 2.7-.3 3.9-.9M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s4-7.5 10-7.5S22 12 22 12s-4 7.5-10 7.5S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* Remember */}
          <div className="lc-row">
            <label className="lc-remember">
              <input type="checkbox" defaultChecked /> {t('login.remember')}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`lc-btn primary${loading ? ' loading' : ''}`}
            disabled={loading}
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>

          {/* Demo bypass */}
          <button
            type="button"
            className="lc-btn demo"
            onClick={handleDemo}
            disabled={loading}
          >
            {t('login.demoBtn')}
          </button>

          <p className="lc-notice">{t('login.demoNotice')}</p>
        </form>

        <div className="login-foot">
          <span className="login-ver">v2.6.0 — 2026</span>
          <div className="login-foot-links">
            <span>{t('login.terms')}</span>
            <span>{t('login.privacy')}</span>
            <span>{t('login.contact')}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
