'use client'

import { useLang } from '@/lib/i18n/language-provider'
import { hasSupabaseEnv } from '@/lib/supabase/config'

// โลโก้ Supabase (official logomark) — โชว์เฉพาะโหมด real ที่เชื่อม DB จริง
function SupabaseLogo() {
  return (
    <svg width="13" height="13" viewBox="0 0 109 113" fill="none" aria-hidden="true">
      <path d="M63.708 110.284c-2.86 3.601-8.658 1.629-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="#3ECF8E"/>
      <path d="M63.708 110.284c-2.86 3.601-8.658 1.629-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#sb-a)" fillOpacity="0.5"/>
      <path d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.071z" fill="#3ECF8E"/>
      <defs>
        <linearGradient id="sb-a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361"/>
          <stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── แก้ลิงก์เหล่านี้เป็นของคุณ ──────────────────────────────
const PORTFOLIO = {
  name: 'Waranyoo Chuathon',
  github: 'https://github.com/WaranyooChuathon', // ← เปลี่ยนเป็น repo จริงของคุณ
  // เพิ่ม resume / linkedin ได้ตามต้องการ
}
// ───────────────────────────────────────────────────────────

export default function DemoBanner() {
  const { t } = useLang()
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '7px 16px',
        background: 'linear-gradient(90deg, rgba(84,97,200,.22), rgba(126,148,216,.10))',
        borderBottom: '1px solid rgba(126,148,216,.22)',
        fontSize: 12, lineHeight: 1.4,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600 }}>
        <span
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#34d399', boxShadow: '0 0 0 3px rgba(52,211,153,.2)',
          }}
        />
        Live Demo
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.8 }}>
        {hasSupabaseEnv && <SupabaseLogo />}
        {hasSupabaseEnv ? t('banner.noteReal') : t('banner.note')}
      </span>

      <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <span style={{ opacity: 0.85 }}>{t('banner.by')} <strong>{PORTFOLIO.name}</strong></span>
        <a
          href={PORTFOLIO.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            color: 'inherit', textDecoration: 'none', opacity: 0.9,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub ↗
        </a>
      </span>
    </div>
  )
}
