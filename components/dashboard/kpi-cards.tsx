'use client'

import { Monitor, WifiOff, TrendingUp, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import { useLang } from '@/lib/i18n/language-provider'

export default function KpiCards({
  online, offline, rate, lastSync, total,
}: {
  online: number; offline: number; rate: number;
  lastSync: string | null; total: number;
}) {
  const { t, lang } = useLang()
  const locale = lang === 'en' ? enUS : th
  const syncDisplay = lastSync
    ? format(new Date(lastSync), 'HH:mm', { locale })
    : '—'
  const syncDate = lastSync
    ? format(new Date(lastSync), 'd MMM yyyy', { locale })
    : ''

  return (
    <div className="kpi-grid">
      <div className="kpi kpi-teal">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><Monitor size={18} /></div>
        <div className="kpi-label">{t('dash.kpi.online')}</div>
        <div className="kpi-val">{online}</div>
        <div className="kpi-sub">{t('dash.kpi.onlineSub', { total })}</div>
      </div>

      <div className="kpi kpi-rose">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><WifiOff size={18} /></div>
        <div className="kpi-label">{t('dash.kpi.offline')}</div>
        <div className="kpi-val">{offline}</div>
        <div className="kpi-sub">{t('dash.kpi.offlineSub')}</div>
      </div>

      <div className="kpi kpi-ocean">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><TrendingUp size={18} /></div>
        <div className="kpi-label">{t('dash.kpi.rate')}</div>
        <div className="kpi-val">{rate}%</div>
        <div className="kpi-sub">{t('dash.kpi.rateSub')}</div>
      </div>

      <div className="kpi kpi-indigo">
        <div className="kpi-blob" />
        <div className="kpi-icon-box"><RefreshCw size={18} /></div>
        <div className="kpi-label">{t('dash.kpi.sync')}</div>
        <div className="kpi-val">{syncDisplay}</div>
        <div className="kpi-sub">{syncDate}</div>
      </div>
    </div>
  )
}
