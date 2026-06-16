'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/i18n/language-provider'
import type { DictKey } from '@/lib/i18n/dict'
import {
  LayoutDashboard, Monitor, BarChart2,
  Users, Settings, LogOut, Search, Tv,
} from 'lucide-react'

const navItems: {
  labelKey: DictKey
  items: { href: string; Icon: typeof LayoutDashboard; key: DictKey }[]
}[] = [
  {
    labelKey: 'nav.overview',
    items: [
      { href: '/dashboard',        Icon: LayoutDashboard, key: 'nav.dashboard' },
      { href: '/devices',          Icon: Monitor,         key: 'nav.devices' },
      { href: '/reports',          Icon: BarChart2,       key: 'nav.reports' },
    ],
  },
  {
    labelKey: 'nav.system',
    items: [
      { href: '/settings/users',   Icon: Users,    key: 'nav.users' },
      { href: '/settings/profile', Icon: Settings, key: 'nav.settings' },
    ],
  },
]

const allItems = navItems.flatMap((s) => s.items)

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { t }    = useLang()
  const [userEmail,   setUserEmail]   = useState<string | null>(null)
  const [userInitial, setUserInitial] = useState('A')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email)
        setUserInitial(data.user.email[0].toUpperCase())
      }
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      {/* ── Slim rail ── */}
      <div className="sb-rail">
        <div className="sb-rail-mark">
          <Tv size={18} strokeWidth={1.6} color="#fff" />
        </div>

        {allItems.map(({ href, Icon, key }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`sb-rail-btn${active ? ' active' : ''}`}
              title={t(key)}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.6} />
            </Link>
          )
        })}

        <div className="sb-rail-spacer" />

        <div className="sb-rail-avatar">
          {userInitial}
          <div className="sb-rail-avatar-dot" />
        </div>
      </div>

      {/* ── Panel ── */}
      <div className="sb-panel">
        <div className="sb-brand">
          <div className="sb-icon">
            <Tv size={16} strokeWidth={2} color="#fff" />
          </div>
          <div>
            <div className="sb-name">Smart Signage</div>
            <div className="sb-sub">Aurora City — Live Demo</div>
          </div>
        </div>

        <button
          type="button"
          className="sb-search"
          onClick={() => window.dispatchEvent(new CustomEvent('cc:open-palette'))}
        >
          <Search size={14} strokeWidth={1.8} />
          <span className="sb-search-input sb-search-placeholder">{t('sb.quickFind')}</span>
          <span className="sb-search-kbd">⌘K</span>
        </button>

        <nav className="sb-nav">
          {navItems.map((section) => (
            <div key={section.labelKey} className="sb-section">
              <div className="sb-label">{t(section.labelKey)}</div>
              {section.items.map(({ href, Icon, key }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`sb-item${active ? ' active' : ''}`}
                  >
                    <span className="sb-item-icon">
                      <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                    </span>
                    {t(key)}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{userInitial}</div>
            <div className="sb-user-info">
              <div className="sb-uname">{userEmail ?? '—'}</div>
              <div className="sb-urole">{t('sb.role')}</div>
            </div>
          </div>
          <button className="sb-logout" onClick={handleSignOut}>
            <LogOut size={13} strokeWidth={1.6} />
            {t('sb.signOut')}
          </button>
        </div>
      </div>
    </aside>
  )
}
