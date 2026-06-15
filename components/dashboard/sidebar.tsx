'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Monitor, BarChart2,
  Users, Settings, LogOut, Search, Tv,
} from 'lucide-react'

const navItems = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',        Icon: LayoutDashboard, text: 'Dashboard' },
      { href: '/devices',          Icon: Monitor,         text: 'Device List' },
      { href: '/reports',          Icon: BarChart2,       text: 'Reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings/users',   Icon: Users,    text: 'User Management' },
      { href: '/settings/profile', Icon: Settings, text: 'Settings' },
    ],
  },
]

const allItems = navItems.flatMap((s) => s.items)

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
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

        {allItems.map(({ href, Icon, text }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`sb-rail-btn${active ? ' active' : ''}`}
              title={text}
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

        <div className="sb-search">
          <Search size={14} strokeWidth={1.8} />
          <input className="sb-search-input" placeholder="Quick find…" readOnly />
          <span className="sb-search-kbd">⌘K</span>
        </div>

        <nav className="sb-nav">
          {navItems.map((section) => (
            <div key={section.label} className="sb-section">
              <div className="sb-label">{section.label}</div>
              {section.items.map(({ href, Icon, text }) => {
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
                    {text}
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
              <div className="sb-urole">Operator</div>
            </div>
          </div>
          <button className="sb-logout" onClick={handleSignOut}>
            <LogOut size={13} strokeWidth={1.6} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
