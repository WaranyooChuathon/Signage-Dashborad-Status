'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from './theme-provider'
import {
  LayoutDashboard, Monitor, BarChart2, Users, Settings,
  Sun, Moon, LogOut, Search, CornerDownLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './command-palette.css'

type Cmd = {
  id: string
  label: string
  hint?: string
  Icon: LucideIcon
  keywords?: string
  run: () => void | Promise<void>
}

// เปิด palette จากที่อื่น (เช่น Quick find ใน sidebar) ผ่าน window event
export const OPEN_PALETTE_EVENT = 'cc:open-palette'

export default function CommandPalette() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Cmd[]>(() => [
    { id: 'dash', label: 'Dashboard',       hint: 'ภาพรวม',   Icon: LayoutDashboard, keywords: 'dashboard home แดชบอร์ด ภาพรวม', run: () => router.push('/dashboard') },
    { id: 'dev',  label: 'Device List',     hint: 'อุปกรณ์',  Icon: Monitor,         keywords: 'device อุปกรณ์ จอ list', run: () => router.push('/devices') },
    { id: 'rep',  label: 'Reports',         hint: 'รายงาน',   Icon: BarChart2,       keywords: 'report รายงาน สถิติ uptime', run: () => router.push('/reports') },
    { id: 'usr',  label: 'User Management', hint: 'ผู้ใช้',    Icon: Users,           keywords: 'user ผู้ใช้ สิทธิ์ role จัดการ', run: () => router.push('/settings/users') },
    { id: 'set',  label: 'Settings',        hint: 'ตั้งค่า',   Icon: Settings,        keywords: 'settings ตั้งค่า โปรไฟล์ profile รหัสผ่าน', run: () => router.push('/settings/profile') },
    { id: 'theme', label: theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด', hint: 'ธีม', Icon: theme === 'dark' ? Sun : Moon, keywords: 'theme dark light ธีม สลับ', run: toggleTheme },
    { id: 'out',  label: 'ออกจากระบบ',      hint: 'Sign out', Icon: LogOut,          keywords: 'logout sign out ออกจากระบบ', run: async () => { const s = createClient(); await s.auth.signOut(); router.push('/login') } },
  ], [router, theme, toggleTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase().includes(q)
    )
  }, [query, commands])

  // global ⌘K / Ctrl+K + รับ event เปิดจาก sidebar
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    function onOpen() { setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  if (!open) return null

  function exec(c?: Cmd) {
    if (!c) return
    setOpen(false)
    c.run()
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown')      { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter')     { e.preventDefault(); exec(filtered[active]) }
    else if (e.key === 'Escape')    { setOpen(false) }
  }

  return (
    <div
      className="cmd-overlay"
      onMouseDown={(e) => { if ((e.target as HTMLElement).classList.contains('cmd-overlay')) setOpen(false) }}
    >
      <div className="cmd-box" role="dialog" aria-label="Command palette">
        <div className="cmd-input-row">
          <Search size={16} strokeWidth={1.8} />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="ค้นหาหน้า / คำสั่ง..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
          />
          <span className="cmd-esc">ESC</span>
        </div>

        <div className="cmd-list">
          {filtered.length === 0 ? (
            <div className="cmd-empty">ไม่พบคำสั่งสำหรับ “{query}”</div>
          ) : (
            filtered.map((c, i) => {
              const Icon = c.Icon
              return (
                <button
                  key={c.id}
                  className={`cmd-item${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => exec(c)}
                >
                  <span className="cmd-ico"><Icon size={15} strokeWidth={1.8} /></span>
                  <span className="cmd-label">{c.label}</span>
                  {c.hint && <span className="cmd-hint">{c.hint}</span>}
                  {i === active && <CornerDownLeft size={13} className="cmd-enter" />}
                </button>
              )
            })
          )}
        </div>

        <div className="cmd-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> เลือก</span>
          <span><kbd>↵</kbd> เปิด</span>
          <span><kbd>esc</kbd> ปิด</span>
        </div>
      </div>
    </div>
  )
}
