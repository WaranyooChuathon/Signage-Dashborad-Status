'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import { MoreHorizontal, TrendingUp } from 'lucide-react'
import { useLang } from '@/lib/i18n/language-provider'
import { MONTHS } from '@/lib/i18n/dict'

type TrendRow = { day: string; online_count: number; offline_count: number }
type Tooltip = { x: number; y: number; d: TrendRow; label: string } | null

function aggregateMonthly(data: TrendRow[], months: string[]): Array<TrendRow & { label: string }> {
  const currentYear = new Date().getFullYear()
  const map = new Map<string, TrendRow>()
  for (let m = 1; m <= 12; m++) {
    const key = `${currentYear}-${String(m).padStart(2, '0')}`
    map.set(key, { day: key, online_count: 0, offline_count: 0 })
  }
  for (const d of data) {
    const key = d.day.substring(0, 7)
    const e = map.get(key)
    if (e) { e.online_count += d.online_count; e.offline_count += d.offline_count }
  }
  return Array.from(map.values()).map((d) => ({
    ...d,
    label: months[parseInt(d.day.substring(5, 7)) - 1] ?? d.day,
  }))
}

type ArcItem = { label: string; count: number; pct: number; color: string; start: number; end: number }

function DonutChart({ data }: { data: TrendRow[] }) {
  const [hover, setHover] = useState<number>(0)

  const totalOnline  = data.reduce((s, d) => s + d.online_count,  0)
  const totalOffline = data.reduce((s, d) => s + d.offline_count, 0)
  const total = totalOnline + totalOffline

  const R = 64, r = 44, cx = 100, cy = 100

  const segs = [
    { label: 'Online',  count: totalOnline,  pct: total > 0 ? Math.round(totalOnline  / total * 100) : 0, color: '#14B8A6' },
    { label: 'Offline', count: totalOffline, pct: total > 0 ? Math.round(totalOffline / total * 100) : 0, color: '#F43F5E' },
  ]

  let acc = -Math.PI / 2
  const arcs: ArcItem[] = segs.map((s) => {
    const start = acc
    const angle = total > 0 ? (s.count / total) * Math.PI * 2 : 0
    acc += angle
    return { ...s, start, end: start + angle }
  })

  function arcPath(a: ArcItem, expand = 0): string {
    if (a.end <= a.start) return ''
    const RR = R + expand
    const x1 = cx + RR * Math.cos(a.start), y1 = cy + RR * Math.sin(a.start)
    const x2 = cx + RR * Math.cos(a.end),   y2 = cy + RR * Math.sin(a.end)
    const x3 = cx + r  * Math.cos(a.end),   y3 = cy + r  * Math.sin(a.end)
    const x4 = cx + r  * Math.cos(a.start), y4 = cy + r  * Math.sin(a.start)
    const large = (a.end - a.start) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${RR} ${RR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
  }

  const active = arcs[hover] ?? arcs[0]

  return (
    <div className="donut-wrap">
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={(R + r) / 2} fill="none" stroke="var(--line)" strokeWidth={R - r} />
          ) : (
            arcs.map((a, i) => {
              const d = arcPath(a, hover === i ? 4 : 0)
              if (!d) return null
              return (
                <path
                  key={i}
                  d={d}
                  fill={a.color}
                  opacity={hover === i ? 1 : 0.45}
                  style={{ transition: 'opacity .15s', cursor: 'pointer' }}
                  onMouseEnter={() => setHover(i)}
                />
              )
            })
          )}
          <circle cx={cx} cy={cy} r={r - 1} style={{ fill: 'var(--glass)' }} />
        </svg>
        <div className="donut-center">
          <div style={{ textAlign: 'center' }}>
            <div className="donut-center-val" style={{ color: active.color }}>
              {active.pct}<span className="donut-center-unit">%</span>
            </div>
            <div className="donut-center-label" style={{ color: active.color }}>{active.label}</div>
          </div>
        </div>
      </div>

      <div className="donut-legend">
        {segs.map((s, i) => (
          <button
            key={i}
            className={`donut-leg-btn ${hover === i ? 'active' : ''}`}
            onMouseEnter={() => setHover(i)}
          >
            <div className="donut-leg-dot" style={{ background: s.color }} />
            <div>
              <div className="donut-leg-val">{s.count.toLocaleString()}</div>
              <div className="donut-leg-name">{s.label}</div>
            </div>
          </button>
        ))}
        <button className="donut-leg-btn">
          <div className="donut-leg-dot" style={{ background: 'var(--muted-2)' }} />
          <div>
            <div className="donut-leg-val">{total.toLocaleString()}</div>
            <div className="donut-leg-name">Total</div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default function TrendChart({ data, period }: { data: TrendRow[]; period: string }) {
  const { t, lang } = useLang()
  const [tooltip, setTooltip]        = useState<Tooltip>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  if (data.length === 0 && period !== 'year') {
    return (
      <div className="card glass trend-card">
        <div className="card-header">
          <div>
            <div className="card-title">{t('trend.title')}</div>
            <div className="card-sub">{t('common.noData')}</div>
          </div>
          <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
        </div>
        <div className="chart-empty">{t('common.noData')}</div>
      </div>
    )
  }

  if (period === 'today') {
    return (
      <div className="card glass trend-card">
        <div className="card-header">
          <div>
            <div className="card-title">{t('trend.today.title')}</div>
            <div className="card-sub">{t('trend.today.sub')}</div>
          </div>
          <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
        </div>
        <DonutChart data={data} />
      </div>
    )
  }

  const barData  = period === 'year' ? aggregateMonthly(data, MONTHS[lang]) : data
  const maxVal   = Math.max(...barData.map((d) => Math.max(d.online_count, d.offline_count)), 1)
  const n        = barData.length
  const subLabel = period === 'year' ? t('trend.monthly') : t('trend.daily')

  const rates = barData.map((d) => {
    const t = d.online_count + d.offline_count
    return t > 0 ? d.online_count / t : 0
  })
  const overlayPoints = rates.map((rate, i) => ({
    x: ((i + 0.5) / n) * 100,
    y: (1 - rate) * 90 + 5,
  }))
  const polylinePoints = overlayPoints.map((p) => `${p.x},${p.y}`).join(' ')
  const fillPath =
    `M ${overlayPoints[0].x},${overlayPoints[0].y} ` +
    overlayPoints.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ') +
    ` L 100,100 L 0,100 Z`

  function getLabel(d: TrendRow & { label?: string }): string {
    if ('label' in d && d.label) return d.label
    try { return format(new Date(d.day), 'd/M', { locale: lang === 'en' ? enUS : th }) }
    catch { return d.day }
  }

  return (
    <div className="card glass trend-card">
      <div className="card-header">
        <div>
          <div className="card-title">Trend Online / Offline</div>
          <div className="card-sub">{subLabel}</div>
        </div>
        <button className="card-menu-btn"><MoreHorizontal size={14} /></button>
      </div>

      <div className="chart-area">
        <div className="chart-scroll">
          <div className="chart-bars">
          {barData.map((d, i) => {
            const onH  = (d.online_count  / maxVal) * 100
            const offH = (d.offline_count / maxVal) * 100
            return (
              <div key={i} className="bar-col">
                <div
                  className="bar-group"
                  onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, d, label: getLabel(d as any) })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="bar on"  style={{ height: `${Math.max(onH,  2)}%` }} />
                  <div className="bar off" style={{ height: `${Math.max(offH, 2)}%` }} />
                </div>
                <div className="bar-day">{getLabel(d as any)}</div>
              </div>
            )
          })}

          {showOverlay && n > 0 && (
            <svg className="chart-overlay-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="overlay-fill-tc" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B6CFF" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3B6CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={fillPath} fill="url(#overlay-fill-tc)" />
              <polyline points={polylinePoints} fill="none" stroke="#3B6CFF"
                strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              {overlayPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="1.8"
                  fill="#3B6CFF" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
          )}
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <div className="leg"><div className="leg-dot green-bg" />Online</div>
        <div className="leg"><div className="leg-dot red-bg" />Offline</div>
        <span className="chart-peak">{t('trend.peak')} {maxVal}</span>
        <button
          className={`chart-overlay-btn ${showOverlay ? 'on' : ''}`}
          onClick={() => setShowOverlay((v) => !v)}
        >
          <TrendingUp size={10} strokeWidth={2.5} />
          {showOverlay ? t('trend.hideOverlay') : t('trend.showOverlay')}
        </button>
      </div>

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
            <span className="ct-label">{t('trend.onlineRate')}</span>
            <span className="ct-val">
              {(() => {
                const t = tooltip.d.online_count + tooltip.d.offline_count
                return t > 0 ? `${Math.round((tooltip.d.online_count / t) * 100)}%` : '—'
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
