'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { useLang } from '@/lib/i18n/language-provider'
import type { DeviceLog } from '@/types/database'

const PAGE_SIZE = 5

export default function OfflineList({ devices }: { devices: DeviceLog[] }) {
  const { t } = useLang()
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(devices.length / PAGE_SIZE)
  const paged = devices.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="card glass">
      <div className="card-header">
        <div>
          <div className="card-title">
            <AlertTriangle size={14} strokeWidth={2} style={{ color: 'var(--off)', flexShrink: 0 }} />
            {t('dash.offlineCard')}
          </div>
          <div className="card-sub">{t('dash.offlineSub')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="off-badge">{devices.length} {t('common.unit')}</span>
          <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
        </div>
      </div>

      <div className="offline-list">
        {devices.length === 0 ? (
          <div className="off-empty">
            <CheckCircle2 size={22} strokeWidth={1.8} style={{ color: 'var(--on)' }} />
            {t('dash.allOnline')}
          </div>
        ) : (
          paged.map((d, i) => (
            <div key={d.id ?? i} className="off-item">
              <div className="off-dot" />
              <div className="off-info">
                <div className="off-name">{d.device_name ?? d.device_id}</div>
                <div className="off-loc">{d.gps_position ?? '—'}</div>
              </div>
              <div className="off-time">
                {d.scraped_timestamp
                  ? new Date(d.scraped_timestamp).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="off-pagination">
          <button
            className="off-page-btn"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            {t('common.prev')}
          </button>
          <span className="off-page-info">{page + 1} / {totalPages}</span>
          <button
            className="off-page-btn"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  )
}
