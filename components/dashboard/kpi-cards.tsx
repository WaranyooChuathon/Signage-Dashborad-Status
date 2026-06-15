'use client'

import { Monitor, WifiOff, TrendingUp, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function KpiCards({
  online, offline, rate, lastSync, total,
}: {
  online: number; offline: number; rate: number;
  lastSync: string | null; total: number;
}) {
  const syncDisplay = lastSync
    ? format(new Date(lastSync), 'HH:mm', { locale: th })
    : '—'
  const syncDate = lastSync
    ? format(new Date(lastSync), 'd MMM yyyy', { locale: th })
    : ''

  return (
    <div className="kpi-grid">
      <div className="kpi kpi-teal">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><Monitor size={18} /></div>
        <div className="kpi-label">Online ตอนนี้</div>
        <div className="kpi-val">{online}</div>
        <div className="kpi-sub">จาก {total} อุปกรณ์ทั้งหมด</div>
      </div>

      <div className="kpi kpi-rose">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><WifiOff size={18} /></div>
        <div className="kpi-label">Offline ตอนนี้</div>
        <div className="kpi-val">{offline}</div>
        <div className="kpi-sub">ต้องตรวจสอบ</div>
      </div>

      <div className="kpi kpi-ocean">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><TrendingUp size={18} /></div>
        <div className="kpi-label">อัตรา Online</div>
        <div className="kpi-val">{rate}%</div>
        <div className="kpi-sub">เป้าหมาย ≥ 95%</div>
      </div>

      <div className="kpi kpi-indigo">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><RefreshCw size={18} /></div>
        <div className="kpi-label">Sync ล่าสุด</div>
        <div className="kpi-val">{syncDisplay}</div>
        <div className="kpi-sub">{syncDate}</div>
      </div>
    </div>
  )
}
