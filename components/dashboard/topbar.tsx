'use client'

import { usePathname } from 'next/navigation'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { useLang } from '@/lib/i18n/language-provider'
import type { DictKey } from '@/lib/i18n/dict'
import NotificationMenu from './notification-menu'

const titleKeys: Record<string, { title: DictKey; sub: DictKey }> = {
  '/dashboard':         { title: 'top.dashboard.title', sub: 'top.dashboard.sub' },
  '/devices':           { title: 'top.devices.title',   sub: 'top.devices.sub' },
  '/reports':           { title: 'top.reports.title',   sub: 'top.reports.sub' },
  '/settings/users':    { title: 'top.users.title',     sub: 'top.users.sub' },
  '/settings/profile':  { title: 'top.settings.title',  sub: 'top.settings.sub' },
}

export default function Topbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLang()
  const keys = titleKeys[pathname]
  const info = keys
    ? { title: t(keys.title), sub: t(keys.sub) }
    : { title: 'Smart Signage', sub: '' }

  return (
    <header className="topbar">
      <div>
        <div className="tb-title">{info.title}</div>
        <div className="tb-sub">{info.sub}</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={`tb-icon-btn${theme === 'dark' ? ' tb-dark-active' : ''}`}
          onClick={toggleTheme}
          title={theme === 'dark' ? t('top.themeLight') : t('top.themeDark')}
        >
          {theme === 'dark'
            ? <Sun size={16} strokeWidth={1.6} />
            : <Moon size={16} strokeWidth={1.6} />
          }
        </button>
        <NotificationMenu />
      </div>
    </header>
  )
}
