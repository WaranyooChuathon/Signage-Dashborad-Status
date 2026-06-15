'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Activity, WifiOff, RefreshCw, Download, MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react'

import './reports.css'

type TrendRow = { day: string; online_count: number; offline_count: number }
type UptimeRow = {
  device_id: string; device_name: string; active_status: string;
  total_records: number; online_records: number; offline_records: number;
  uptime_pct: number;
}
type Tooltip = { x: number; y: number; d: TrendRow; label: string } | null

const UPTIME_PAGE = 10

export default function ReportsClient({
  initialTrend,
  initialUptime,
}: {
  initialTrend: TrendRow[]
  initialUptime: UptimeRow[]
}) {
  const [range, setRange]           = useState('7d')
  const [trend, setTrend]           = useState(initialTrend)
  const [uptime, setUptime]         = useState(initialUptime)
  const [loading, setLoading]       = useState(false)
  const [tooltip, setTooltip]       = useState<Tooltip>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [uptimePage, setUptimePage] = useState(0)
  const [uptimeSortAsc, setUptimeSortAsc] = useState(false)

  const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

  async function changeRange(key: string) {
    setRange(key)
    setUptimePage(0)
    setUptimeSortAsc(false)
    setLoading(true)
    const supabase = createClient()
    const days = daysMap[key] ?? 7

    const [{ data: t }, { data: u }] = await Promise.all([
      supabase.rpc('get_device_trend', { days_back: days }),
      supabase.rpc('get_device_uptime', { days_back: days }),
    ])

    if (t) setTrend(t)
    if (u) setUptime(u)
    setLoading(false)
  }

  const sortedUptime = [...uptime].sort((a, b) =>
    uptimeSortAsc ? a.uptime_pct - b.uptime_pct : b.uptime_pct - a.uptime_pct
  )
  const uptimeTotalPages = Math.max(1, Math.ceil(sortedUptime.length / UPTIME_PAGE))
  const uptimePaged      = sortedUptime.slice(uptimePage * UPTIME_PAGE, (uptimePage + 1) * UPTIME_PAGE)
  const uptimeEmptyRows  = UPTIME_PAGE - uptimePaged.length

  const avgOnline = trend.length > 0
    ? (trend.reduce((s, r) => s + r.online_count, 0) / trend.length).toFixed(1)
    : '0'
  const avgUptime = uptime.length > 0
    ? (uptime.reduce((s, r) => s + Number(r.uptime_pct), 0) / uptime.length).toFixed(1)
    : '0'
  const totalOfflineEvents = trend.reduce((s, r) => s + r.offline_count, 0)
  const totalSyncs = trend.length * (uptime.length || 1)

  const maxVal = Math.max(...trend.map((d) => Math.max(d.online_count, d.offline_count)), 1)

  const ratesRp = trend.map((d) => {
    const total = d.online_count + d.offline_count
    return total > 0 ? d.online_count / total : 0
  })
  const overlayPtsRp = ratesRp.map((rate, i) => ({
    x: ((i + 0.5) / Math.max(trend.length, 1)) * 100,
    y: (1 - rate) * 90 + 5,
  }))
  const polylineRp = overlayPtsRp.map((p) => `${p.x},${p.y}`).join(' ')
  const fillPathRp = overlayPtsRp.length > 0
    ? `M ${overlayPtsRp[0].x},${overlayPtsRp[0].y} ` +
      overlayPtsRp.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ') +
      ' L 100,100 L 0,100 Z'
    : ''

  function exportCSV() {
    const header = 'Device Name,Device ID,Uptime %,Online Records,Offline Records,Total Records,Current Status\n'
    const rows = uptime.map((d) =>
      `"${d.device_name}","${d.device_id}",${d.uptime_pct},${d.online_records},${d.offline_records},${d.total_records},${d.active_status}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signage-report-${range}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function formatDay(day: string) {
    try {
      const d = new Date(day)
      return `${d.getDate()}/${d.getMonth() + 1}`
    } catch { return day }
  }

  return (
    <>
      {/* Range Tabs */}
      <div className="rp-range-bar">
        <div className="period-tabs">
          {['7d', '30d', '90d'].map((k) => (
            <button
              key={k}
              className={`ptab ${range === k ? 'active' : ''}`}
              onClick={() => changeRange(k)}
            >
              {k === '7d' ? '7 วัน' : k === '30d' ? '30 วัน' : '90 วัน'}
            </button>
          ))}
        </div>
        <button className="rp-export-btn" onClick={exportCSV}>
          <Download size={13} strokeWidth={2} />
          Export CSV
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="sync-banner">
          <div className="sync-spinner" />
          กำลังโหลดข้อมูล...
        </div>
      )}

      {/* KPI */}
      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <div className="kpi kpi-teal">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><TrendingUp size={18} /></div>
          <div className="kpi-label">Avg Online / วัน</div>
          <div className="kpi-val">{avgOnline}</div>
          <div className="kpi-sub">จาก {uptime.length} เครื่องทั้งหมด</div>
        </div>
        <div className="kpi kpi-ocean">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><Activity size={18} /></div>
          <div className="kpi-label">Avg Uptime %</div>
          <div className="kpi-val">{avgUptime}%</div>
          <div className="kpi-sub">เป้าหมาย ≥ 95%</div>
        </div>
        <div className="kpi kpi-rose">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><WifiOff size={18} /></div>
          <div className="kpi-label">Offline Events</div>
          <div className="kpi-val">{totalOfflineEvents}</div>
          <div className="kpi-sub">ครั้งในช่วงที่เลือก</div>
        </div>
        <div className="kpi kpi-indigo">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><RefreshCw size={18} /></div>
          <div className="kpi-label">จำนวน Syncs</div>
          <div className="kpi-val">{totalSyncs}</div>
          <div className="kpi-sub">Sync ทั้งหมด</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="rp-charts-row">

        {/* Trend Chart */}
        <div className="card glass rp-trend-card">
          <div className="card-header">
            <div>
              <div className="card-title">Online / Offline Trend</div>
              <div className="card-sub">รายวัน — hover เพื่อดูตัวเลข</div>
            </div>
            <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
          </div>
          <div className="chart-area">
            {trend.length === 0 ? (
              <div className="chart-empty">ยังไม่มีข้อมูล</div>
            ) : (
              <div className="chart-scroll">
                <div className="chart-bars">
                  {trend.map((d, i) => {
                    const onH  = (d.online_count  / maxVal) * 100
                    const offH = (d.offline_count / maxVal) * 100
                    const label = formatDay(d.day)
                    return (
                      <div key={i} className="bar-col">
                        <div
                          className="bar-group"
                          onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, d, label })}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          <div className="bar on"  style={{ height: `${Math.max(onH,  5)}%` }} />
                          <div className="bar off" style={{ height: `${Math.max(offH, 5)}%` }} />
                        </div>
                        <div className="bar-day">{label}</div>
                      </div>
                    )
                  })}
                  {showOverlay && fillPathRp && (
                    <svg className="chart-overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="overlay-fill-rp" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3B6CFF" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#3B6CFF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={fillPathRp} fill="url(#overlay-fill-rp)" />
                      <polyline points={polylineRp} fill="none" stroke="#3B6CFF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                      {overlayPtsRp.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="#3B6CFF" vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="chart-legend">
            <div className="leg"><div className="leg-dot green-bg" />Online (max {maxVal})</div>
            <div className="leg"><div className="leg-dot red-bg" />Offline</div>
            <button
              className={`chart-overlay-btn ${showOverlay ? 'on' : ''}`}
              onClick={() => setShowOverlay((v) => !v)}
            >
              <TrendingUp size={10} strokeWidth={2.5} />
              {showOverlay ? 'Hide overlay' : 'Show overlay'}
            </button>
          </div>
        </div>

        {/* Uptime Bar Chart */}
        <div className="card glass rp-uptime-card">
          <div className="card-header">
            <div>
              <div className="card-title">Uptime % แต่ละเครื่อง</div>
              <div className="card-sub">
                {uptimeSortAsc ? 'เรียงจากต่ำสุด' : 'เรียงจากสูงสุด'} — {sortedUptime.length} เครื่องทั้งหมด
              </div>
            </div>
            <button
              className="rp-sort-btn"
              onClick={() => { setUptimeSortAsc((v) => !v); setUptimePage(0) }}
              title={uptimeSortAsc ? 'เรียงจากสูงสุด' : 'เรียงจากต่ำสุด'}
            >
              {uptimeSortAsc ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              {uptimeSortAsc ? 'ต่ำ→สูง' : 'สูง→ต่ำ'}
            </button>
            <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
          </div>

          <div className="rp-uptime-list">
            {uptimePaged.map((d, i) => {
              const cls   = d.uptime_pct >= 95 ? 'hi' : d.uptime_pct >= 80 ? 'mid' : 'lo'
              const color = d.uptime_pct >= 95 ? 'var(--on)' : d.uptime_pct >= 80 ? 'var(--warn)' : 'var(--off)'
              return (
                <div key={i} className="rp-uptime-row">
                  <div className="rp-up-rank">{uptimePage * UPTIME_PAGE + i + 1}</div>
                  <div className="rp-up-name">{d.device_name ?? d.device_id}</div>
                  <div className="rp-up-track">
                    <div className="rp-up-fill" style={{ width: `${d.uptime_pct}%`, background: color }} />
                  </div>
                  <div className={`rp-up-pct ${cls}`}>{d.uptime_pct}%</div>
                </div>
              )
            })}
            {/* Pad with empty rows so card height stays fixed */}
            {Array.from({ length: uptimeEmptyRows }, (_, i) => (
              <div key={`empty-${i}`} className="rp-uptime-row rp-uptime-row-empty" />
            ))}
          </div>

          {uptimeTotalPages > 1 && (
            <div className="off-pagination">
              <button
                className="off-page-btn"
                onClick={() => setUptimePage(Math.max(0, uptimePage - 1))}
                disabled={uptimePage === 0}
              >← ก่อนหน้า</button>
              <span className="off-page-info">{uptimePage + 1} / {uptimeTotalPages}</span>
              <button
                className="off-page-btn"
                onClick={() => setUptimePage(Math.min(uptimeTotalPages - 1, uptimePage + 1))}
                disabled={uptimePage >= uptimeTotalPages - 1}
              >ถัดไป →</button>
            </div>
          )}
        </div>
      </div>

      {/* Device Stats Table */}
      <DeviceStatsTable uptime={uptime} />

      {/* Tooltip */}
      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y - 28 }}>
          <div className="ct-title">{tooltip.label}</div>
          <div className="ct-row">
            <div className="ct-dot" style={{ background: '#14B8A6' }} />
            <span className="ct-label">Online</span>
            <span className="ct-val">{tooltip.d.online_count}</span>
          </div>
          <div className="ct-row">
            <div className="ct-dot" style={{ background: '#F43F5E' }} />
            <span className="ct-label">Offline</span>
            <span className="ct-val">{tooltip.d.offline_count}</span>
          </div>
          <div className="ct-row">
            <div className="ct-dot" style={{ background: '#3B6CFF' }} />
            <span className="ct-label">Online rate</span>
            <span className="ct-val">
              {(() => {
                const total = tooltip.d.online_count + tooltip.d.offline_count
                return total > 0 ? `${Math.round((tooltip.d.online_count / total) * 100)}%` : '—'
              })()}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Device Stats Table ── */
function DeviceStatsTable({ uptime }: { uptime: UptimeRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortAsc, setSortAsc] = useState(false)
  const PAGE_SIZE = 15

  const filtered = uptime.filter((d) => {
    const q = search.toLowerCase()
    return !q ||
      (d.device_name ?? '').toLowerCase().includes(q) ||
      (d.device_id ?? '').toLowerCase().includes(q)
  })

  const sorted = [...filtered].sort((a, b) =>
    sortAsc ? a.uptime_pct - b.uptime_pct : b.uptime_pct - a.uptime_pct
  )
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="device-table-card">
      <div className="device-table-header">
        <div>
          <div className="card-title">สรุปสถิติแต่ละ Device</div>
          <div className="card-sub">แสดง {sorted.length} เครื่อง — {sortAsc ? 'เรียงจากต่ำสุด' : 'เรียงจากสูงสุด'}</div>
        </div>
        <input
          className="table-search"
          placeholder="ค้นหา Device..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Device Name</th>
              <th
                className="rp-th-sort"
                onClick={() => { setSortAsc((v) => !v); setPage(0) }}
                title={sortAsc ? 'เรียงจากสูงสุด' : 'เรียงจากต่ำสุด'}
              >
                Uptime % {sortAsc ? <ArrowUp size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <ArrowDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
              </th>
              <th>Online</th>
              <th>Offline</th>
              <th>Total Records</th>
              <th>สถานะปัจจุบัน</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              paged.map((d, i) => {
                const cls = d.uptime_pct >= 95 ? 'on' : d.uptime_pct >= 80 ? 'warn' : 'off'
                return (
                  <tr key={i}>
                    <td className="mono">{page * PAGE_SIZE + i + 1}</td>
                    <td className="td-name">{d.device_name ?? d.device_id}</td>
                    <td><span className={`rp-pct-cell ${cls}`}>{d.uptime_pct}%</span></td>
                    <td className="mono">{d.online_records} ครั้ง</td>
                    <td className="mono">{d.offline_records} ครั้ง</td>
                    <td className="mono">{d.total_records}</td>
                    <td>
                      <span className={`status-badge ${d.active_status === 'Online' ? 'on' : 'off'}`}>
                        <span className="bdot" />
                        {d.active_status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <button className="off-page-btn" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            ← ก่อนหน้า
          </button>
          <div className="page-numbers">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
              let pn = idx
              if (totalPages > 7) {
                if (page < 3) pn = idx
                else if (page > totalPages - 4) pn = totalPages - 7 + idx
                else pn = page - 3 + idx
              }
              return (
                <button key={pn} className={`page-num ${pn === page ? 'active' : ''}`} onClick={() => setPage(pn)}>
                  {pn + 1}
                </button>
              )

            })}
          </div>
          <button className="off-page-btn" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  )
}
