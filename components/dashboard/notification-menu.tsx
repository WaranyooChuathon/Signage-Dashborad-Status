'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, WifiOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/i18n/language-provider'
import type { DeviceLog } from '@/types/database'
import './notification.css'

// แจ้งเตือน derive จาก device ที่ offline (RPC get_latest_status — ใช้ได้ทั้ง 2 โหมด)
// "อ่านแล้ว" = เก็บ device_id ที่ acknowledge ไว้ใน localStorage
const ACK_KEY = 'cc-noti-read'

export default function NotificationMenu() {
  const { t } = useLang()
  const [offline, setOffline] = useState<DeviceLog[]>([])
  const [acked, setAcked]     = useState<string[]>([])
  const [open, setOpen]       = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem(ACK_KEY)
      if (s) setAcked(JSON.parse(s))
    } catch {
      /* ค่าเสีย → เริ่มใหม่ */
    }
    const supabase = createClient()
    supabase.rpc('get_latest_status').then(({ data }) => {
      if (Array.isArray(data)) {
        setOffline((data as DeviceLog[]).filter((d) => d.active_status === 'Offline'))
      }
    })
  }, [])

  // ปิดเมื่อคลิกนอก / กด Esc
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const unreadCount = offline.filter((d) => d.device_id && !acked.includes(d.device_id)).length

  function markAllRead() {
    const ids = offline.map((d) => d.device_id).filter(Boolean) as string[]
    const next = Array.from(new Set([...acked, ...ids]))
    setAcked(next)
    localStorage.setItem(ACK_KEY, JSON.stringify(next))
  }

  return (
    <div className="noti-wrap" ref={ref}>
      <button
        className={`tb-icon-btn noti-btn${open ? ' tb-dark-active' : ''}`}
        title={t('noti.title')}
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t('noti.aria')} ${unreadCount}`}
      >
        <Bell size={16} strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span className="noti-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="noti-panel" role="menu">
          <div className="noti-head">
            <span className="noti-title">
              {t('noti.title')}
              {unreadCount > 0 && <span className="noti-count">{unreadCount}</span>}
            </span>
            {unreadCount > 0 && (
              <button className="noti-mark" onClick={markAllRead}>
                <Check size={12} strokeWidth={2.2} /> {t('noti.markAll')}
              </button>
            )}
          </div>

          <div className="noti-list">
            {offline.length === 0 ? (
              <div className="noti-empty">
                <Check size={20} strokeWidth={1.8} />
                <span>{t('noti.empty')}</span>
                <span className="noti-empty-sub">{t('noti.emptySub')}</span>
              </div>
            ) : (
              offline.map((d) => {
                const isUnread = !!d.device_id && !acked.includes(d.device_id)
                return (
                  <div key={d.device_id ?? Math.random()} className={`noti-item${isUnread ? ' unread' : ''}`}>
                    <div className="noti-ico"><WifiOff size={14} strokeWidth={1.8} /></div>
                    <div className="noti-body">
                      <div className="noti-dev">{d.device_name ?? d.device_id ?? 'ไม่ทราบชื่อ'}</div>
                      <div className="noti-meta">{d.device_id} · {t('noti.offline')}</div>
                    </div>
                    <div className="noti-time">{fmtTime(d.scraped_timestamp)}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function fmtTime(ts: string | null): string {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
