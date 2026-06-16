'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n/language-provider'
import type { DeviceLog } from '@/types/database'
import DeviceSidePanel from './device-side-panel'
import './devices.css'

const PAGE_SIZE = 10

export default function DeviceListClient({ devices }: { devices: DeviceLog[] }) {
  const { t, lang } = useLang()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'Online' | 'Offline'>('all')
  const [page, setPage] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState<DeviceLog | null>(null)

  const onlineCount = devices.filter((d) => d.active_status === 'Online').length
  const offlineCount = devices.filter((d) => d.active_status === 'Offline').length

  const filtered = devices.filter((d) => {
    const matchFilter = filter === 'all' || d.active_status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      (d.device_name ?? '').toLowerCase().includes(q) ||
      (d.device_id ?? '').toLowerCase().includes(q) ||
      (d.playlist_name ?? '').toLowerCase().includes(q) ||
      (d.gps_position ?? '').toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSearch(val: string) {
    setSearch(val)
    setPage(0)
  }

  function handleFilter(f: 'all' | 'Online' | 'Offline') {
    setFilter(f)
    setPage(0)
  }

  function handleSelect(device: DeviceLog) {
    if (selectedDevice?.device_id === device.device_id) {
      setSelectedDevice(null)
    } else {
      setSelectedDevice(device)
    }
  }

  return (
    <div className="dl-layout">
      {/* Main table area */}
      <div className={`dl-table-area ${selectedDevice ? 'shrunk' : ''}`}>

        {/* Summary strip */}
        <div className="dl-summary">
          <div className="dl-sum-item">
            <div className="dl-sum-dot all" />
            <div>
              <div className="dl-sum-val all-text">{devices.length}</div>
              <div className="dl-sum-label">{t('dt.all')}</div>
            </div>
          </div>
          <div className="dl-sum-item">
            <div className="dl-sum-dot on" />
            <div>
              <div className="dl-sum-val on-text">{onlineCount}</div>
              <div className="dl-sum-label">Online</div>
            </div>
          </div>
          <div className="dl-sum-item">
            <div className="dl-sum-dot off" />
            <div>
              <div className="dl-sum-val off-text">{offlineCount}</div>
              <div className="dl-sum-label">Offline</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="dl-toolbar">
          <div className="period-tabs">
            <button
              className={`ptab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              {t('dt.all')} <span className="dl-tab-count">{devices.length}</span>
            </button>
            <button
              className={`ptab ${filter === 'Online' ? 'active' : ''}`}
              onClick={() => handleFilter('Online')}
            >
              Online <span className="dl-tab-count on-text">{onlineCount}</span>
            </button>
            <button
              className={`ptab ${filter === 'Offline' ? 'active' : ''}`}
              onClick={() => handleFilter('Offline')}
            >
              Offline <span className="dl-tab-count off-text">{offlineCount}</span>
            </button>
          </div>

          <input
            className="table-search"
            placeholder={t('dev.search')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {search && (
            <button className="dl-clear-btn" onClick={() => handleSearch('')}>
              ✕ {t('dev.clear')}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="device-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Device Name</th>
                  <th>Device ID</th>
                  <th>Playlist</th>
                  <th>Mode</th>
                  <th>{t('dt.status')}</th>
                  <th>{t('dt.lastSync')}</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: 'var(--t3)' }}>
                      {search || filter !== 'all'
                        ? t('dev.noMatch')
                        : t('common.noData')}
                    </td>
                  </tr>
                ) : (
                  paged.map((d, i) => (
                    <tr
                      key={d.id ?? i}
                      onClick={() => handleSelect(d)}
                      className={selectedDevice?.device_id === d.device_id ? 'dl-row-selected' : ''}
                    >
                      <td className="mono">{page * PAGE_SIZE + i + 1}</td>
                      <td className="td-name">{d.device_name ?? '—'}</td>
                      <td className="td-id">{d.device_id ?? '—'}</td>
                      <td><span className="pl-tag">{d.playlist_name ?? '—'}</span></td>
                      <td className="td-mode">{d.playmode ?? '—'}</td>
                      <td>
                        <span className={`status-badge ${d.active_status === 'Online' ? 'on' : 'off'}`}>
                          <span className="bdot" />
                          {d.active_status ?? '—'}
                        </span>
                      </td>
                      <td className="mono">
                        {d.scraped_timestamp
                          ? new Date(d.scraped_timestamp).toLocaleString(lang === 'en' ? 'en-GB' : 'th-TH', {
                              day: '2-digit', month: '2-digit',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination">
              <button
                className="off-page-btn"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                {t('common.prev')}
              </button>
              <div className="page-numbers">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pn: number
                  if (totalPages <= 7) pn = i
                  else if (page < 3) pn = i
                  else if (page > totalPages - 4) pn = totalPages - 7 + i
                  else pn = page - 3 + i
                  return (
                    <button
                      key={pn}
                      className={`page-num ${pn === page ? 'active' : ''}`}
                      onClick={() => setPage(pn)}
                    >
                      {pn + 1}
                    </button>
                  )
                })}
              </div>
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
      </div>

      {/* Side Panel */}
      <DeviceSidePanel
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  )
}