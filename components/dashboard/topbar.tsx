'use client'

import { usePathname } from 'next/navigation'
import { Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'

const titles: Record<string, { title: string; sub: string }> = {
  '/dashboard':         { title: 'Dashboard',       sub: 'ภาพรวมสถานะอุปกรณ์ทั้งหมด' },
  '/devices':           { title: 'Device List',     sub: 'รายการอุปกรณ์ทั้งหมด — คลิกเพื่อดูรายละเอียด' },
  '/reports':           { title: 'Reports',         sub: 'วิเคราะห์สถิติและประสิทธิภาพอุปกรณ์' },
  '/settings/users':    { title: 'User Management', sub: 'จัดการสิทธิ์และบัญชีผู้ใช้งานระบบ' },
  '/settings/profile':  { title: 'Settings',        sub: 'ตั้งค่าโปรไฟล์' },
}

export default function Topbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const info = titles[pathname] ?? { title: 'Smart Signage', sub: '' }

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
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark'
            ? <Sun size={16} strokeWidth={1.6} />
            : <Moon size={16} strokeWidth={1.6} />
          }
        </button>
        <button className="tb-icon-btn" title="Notifications">
          <Bell size={16} strokeWidth={1.6} />
        </button>
      </div>
    </header>
  )
}
