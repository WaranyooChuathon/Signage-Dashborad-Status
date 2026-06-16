'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/i18n/language-provider'
import KpiCards from '@/components/dashboard/kpi-cards'
import TrendChart from '@/components/dashboard/trend-chart'
import OfflineList from '@/components/dashboard/offline-list'
import OnlineList from '@/components/dashboard/online-list'
import DeviceTable from '@/components/dashboard/device-table'
import type { DeviceLog } from '@/types/database'

const AUTO_REFRESH_MS = 15 * 60 * 1000 // 15 นาที

type Summary = { online_count: number; offline_count: number; total: number }
type TrendRow = { day: string; online_count: number; offline_count: number }

export default function DashboardClient({
  initialSummary,
  initialTrend,
  initialAllDevices,
}: {
  initialSummary: Summary
  initialTrend: TrendRow[]
  initialAllDevices: DeviceLog[]
}) {
  const { t } = useLang()
  const [summary, setSummary]     = useState(initialSummary)
  const [trend, setTrend]         = useState(initialTrend)
  const [allDevices, setAllDevices] = useState(initialAllDevices)
  const [period, setPeriod]       = useState('today')
  const [syncing, setSyncing]     = useState(false)
  const [syncTime, setSyncTime]   = useState(() => new Date().toISOString())

  const periodRef = useRef(period)
  periodRef.current = period

  const offlineDevices = allDevices.filter((d) => d.active_status === 'Offline')
  const onlineDevices  = allDevices.filter((d) => d.active_status === 'Online')

  async function fetchData(p: string) {
    const supabase = createClient()
    const days = p === 'today' ? 1 : p === 'week' ? 7 : p === 'month' ? 30 : 365

    const [{ data: s }, { data: t }, { data: devices }] = await Promise.all([
      supabase.rpc('get_online_summary', { period: p }),
      supabase.rpc('get_device_trend', { days_back: days }),
      supabase.rpc('get_latest_status'),
    ])

    if (s?.[0])  setSummary(s[0])
    if (t)       setTrend(t)
    if (devices) setAllDevices(devices)
  }

  async function changePeriod(p: string) {
    setPeriod(p)
    setTrend([])
    await fetchData(p)
  }

  // Auto-refresh ทุก 15 นาที
  useEffect(() => {
    const timer = setInterval(async () => {
      await fetchData(periodRef.current)
      setSyncTime(new Date().toISOString())
    }, AUTO_REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  async function handleSync() {
    setSyncing(true)
    try {
      const res  = await fetch('/api/sync', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        await fetchData(period)
        setSyncTime(new Date().toISOString())
      }
    } catch (e) {
      console.error('Sync failed', e)
    }
    setSyncing(false)
  }

  const rate = summary.total > 0
    ? Math.round((summary.online_count / summary.total) * 100)
    : 0

  return (
    <>
      {syncing && (
        <div className="sync-banner">
          <div className="sync-spinner" />
          {t('dash.syncBanner')}
        </div>
      )}

      <div className="period-row">
        <div className="period-tabs">
          {(['today', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              className={`ptab ${period === p ? 'active' : ''}`}
              onClick={() => changePeriod(p)}
            >
              {t(`dash.period.${p}`)}
            </button>
          ))}
        </div>
        <button
          className={`btn-sync ${syncing ? 'syncing' : ''}`}
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw size={14} strokeWidth={2} className={syncing ? 'spin-icon' : ''} />
          {syncing ? t('dash.syncing') : t('dash.sync')}
        </button>
      </div>

      <KpiCards
        online={summary.online_count}
        offline={summary.offline_count}
        rate={rate}
        lastSync={syncTime}
        total={summary.total}
      />

      <div className="section-grid">
        <TrendChart data={trend} period={period} />
        <OfflineList devices={offlineDevices} />
        <OnlineList  devices={onlineDevices} />
      </div>

      <DeviceTable devices={allDevices} />
    </>
  )
}
