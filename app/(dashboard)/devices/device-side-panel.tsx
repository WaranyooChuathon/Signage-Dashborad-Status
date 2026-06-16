'use client'

import { X, FileText, MapPin } from 'lucide-react'
import { useLang } from '@/lib/i18n/language-provider'
import type { DeviceLog } from '@/types/database'

export default function DeviceSidePanel({
  device,
  onClose,
}: {
  device: DeviceLog | null
  onClose: () => void
}) {
  const { t, lang } = useLang()
  const isOpen = device !== null
  const isOn = device?.active_status === 'Online'

  return (
    <div className={`sp ${isOpen ? 'sp-open' : ''}`}>
      {device && (
        <div className="sp-inner">
          {/* Header */}
          <div className="sp-header">
            <div>
              <div className="sp-device-name">{device.device_name ?? device.device_id}</div>
              <div className="sp-device-id">{device.signage_id ?? device.device_id}</div>
            </div>
            <button className="sp-close" onClick={onClose}><X size={14} /></button>
          </div>

          {/* Status */}
          <div className={`sp-status ${isOn ? 'sp-on' : 'sp-off'}`}>
            <span className={`sp-dot ${isOn ? 'sp-dot-on' : ''}`} />
            {isOn ? t('dev.sp.online') : t('dev.sp.offline')}
          </div>

          {/* Info Grid */}
          <div className="sp-grid">
            <div className="sp-row">
              <span className="sp-key">Device ID</span>
              <span className="sp-val sp-mono">{device.device_id ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Signage ID</span>
              <span className="sp-val sp-mono" style={{ fontSize: '9px' }}>{device.signage_id ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Organization</span>
              <span className="sp-val">{device.organize_id ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Department</span>
              <span className="sp-val">{device.department_id ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">GPS</span>
              <span className="sp-val sp-mono" style={{ fontSize: '9px' }}>{device.gps_position ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Playlist</span>
              <span className="sp-val">{device.playlist_name ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Mode</span>
              <span className="sp-val">{device.playmode ?? '—'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">Alert</span>
              <span className="sp-val">{device.alert ?? '0'}</span>
            </div>
            <div className="sp-row">
              <span className="sp-key">{t('dt.lastSync')}</span>
              <span className="sp-val sp-mono">
                {device.scraped_timestamp
                  ? new Date(device.scraped_timestamp).toLocaleString(lang === 'en' ? 'en-GB' : 'th-TH', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })
                  : '—'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="sp-section-title">{t('dev.sp.actions')}</div>
          <div className="sp-actions">
            <button
              className="sp-action-btn sp-btn-primary"
              onClick={() => alert(t('dev.sp.historyAlert') + device.device_name)}
            >
              <FileText size={14} strokeWidth={1.8} />
              {t('dev.sp.viewHistory')}
            </button>
            <button
              className="sp-action-btn sp-btn-ghost"
              onClick={() => {
                if (device.gps_position) {
                  window.open(`https://www.google.com/maps?q=${device.gps_position}`, '_blank')
                } else {
                  alert(t('dev.sp.noGps'))
                }
              }}
            >
              <MapPin size={14} strokeWidth={1.8} />
              {t('dev.sp.viewMap')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
