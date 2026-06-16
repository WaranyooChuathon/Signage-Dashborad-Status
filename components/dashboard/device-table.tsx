'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n/language-provider'
import type { DeviceLog } from '@/types/database'

const PAGE_SIZE = 10

export default function DeviceTable({ devices }: { devices: DeviceLog[] }) {
  const { t, lang } = useLang()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'Online' | 'Offline'>('all')
  const [page, setPage] = useState(0)

  const filtered = devices.filter((d) => {
    const matchFilter = filter === 'all' || d.active_status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      (d.device_name ?? '').toLowerCase().includes(q) ||
      (d.device_id ?? '').toLowerCase().includes(q) ||
      (d.playlist_name ?? '').toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const onlineCount = devices.filter((d) => d.active_status === 'Online').length
  const offlineCount = devices.filter((d) => d.active_status === 'Offline').length
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

  return (
    <div className="device-table-card">
      {/* Header + Filter + Search */}
      <div className="device-table-header">
        <div>
          <div className="card-title">{t('dt.title')}</div>
          <div className="card-sub">
            {t('dt.showing', { n: filtered.length, m: devices.length })}
            {search && ` · ${t('dt.searchTag')}: "${search}"`}
            {filter !== 'all' && ` · ${t('dt.filterTag')}: ${filter}`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Filter tabs */}
          <div className="period-tabs">
            <button
              className={`ptab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              {t('dt.all')}
              <span style={{ marginLeft: '4px', opacity: 0.6, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                {devices.length}
              </span>
            </button>
            <button
              className={`ptab ${filter === 'Online' ? 'active' : ''}`}
              onClick={() => handleFilter('Online')}
            >
              Online
              <span style={{ marginLeft: '4px', opacity: 0.6, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--on)' }}>
                {onlineCount}
              </span>
            </button>
            <button
              className={`ptab ${filter === 'Offline' ? 'active' : ''}`}
              onClick={() => handleFilter('Offline')}
            >
              Offline
              <span style={{ marginLeft: '4px', opacity: 0.6, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--off)' }}>
                {offlineCount}
              </span>
            </button>
          </div>

          {/* Search */}
          <input
            className="table-search"
            placeholder={t('dt.search')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
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
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', padding: '40px', color: 'var(--t3)' }}
                >
                  {search || filter !== 'all'
                    ? t('dt.noMatch')
                    : t('common.noData')}
                </td>
              </tr>
            ) : (
              paged.map((d, i) => (
                <tr key={d.id ?? i}>
                  <td className="mono">{page * PAGE_SIZE + i + 1}</td>
                  <td className="td-name">{d.device_name ?? '—'}</td>
                  <td className="td-id">{d.device_id ?? '—'}</td>
                  <td>
                    <span className="pl-tag">{d.playlist_name ?? '—'}</span>
                  </td>
                  <td className="td-mode">{d.playmode ?? '—'}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        d.active_status === 'Online' ? 'on' : 'off'
                      }`}
                    >
                      <span className="bdot" />
                      {d.active_status ?? '—'}
                    </span>
                  </td>
                  <td className="mono">
                    {d.scraped_timestamp
                      ? new Date(d.scraped_timestamp).toLocaleString(lang === 'en' ? 'en-GB' : 'th-TH', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
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
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i
              } else if (page < 3) {
                pageNum = i
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 7 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`page-num ${pageNum === page ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
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
  )
}