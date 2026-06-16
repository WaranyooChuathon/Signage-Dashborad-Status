// ──────────────────────────────────────────────────────────────────────────
// Mock data layer — แทนที่ Supabase RPC/queries สำหรับเวอร์ชัน Live Demo
// ข้อมูลทั้งหมดเป็นข้อมูลสมมติ (deterministic) ไม่เชื่อมต่อฐานข้อมูลจริง
// ──────────────────────────────────────────────────────────────────────────

import type { DeviceLog, Profile } from '@/types/database'

export type Summary = { online_count: number; offline_count: number; total: number }
export type TrendRow = { day: string; online_count: number; offline_count: number }
export type UptimeRow = {
  device_id: string
  device_name: string
  active_status: string
  total_records: number
  online_records: number
  offline_records: number
  uptime_pct: number
}

// ── Seeded PRNG (mulberry32) — ผลลัพธ์คงที่ทุกครั้ง ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ORG = 'Aurora City'
const ZONES = [
  'North Plaza', 'Central Atrium', 'Food Court', 'Skywalk Bridge',
  'Parking B1', 'Cinema Lobby', 'Riverside Wing', 'Garden Court',
  'Station Hall', 'Rooftop Terrace', 'East Gallery', 'Main Entrance',
]
const PLAYLISTS = [
  'Main Loop', 'Promo Q2 2026', 'Brand Showcase', 'Wayfinding',
  'Event Special', 'Holiday Set', 'Lunch Hour', 'Evening Mix',
]
const MODES = ['Scheduled', 'Loop', 'Manual']
const DEPTS = ['Marketing', 'Operations', 'Facilities', 'Tenant Relations']

const DEVICE_COUNT = 34

type DeviceBase = {
  idx: number
  device_id: string
  device_name: string
  signage_id: string
  organize_id: string
  department_id: string
  gps_position: string
  playmode: string
  playlist_name: string
  alert: string | null
  is_online: boolean
  uptime_pct: number
  ts_offset_min: number
}

// สร้างชุดอุปกรณ์ฐาน (คงที่ตลอด — seed เดียว)
const DEVICE_BASE: DeviceBase[] = (() => {
  const rng = mulberry32(20260615)
  const list: DeviceBase[] = []
  for (let i = 0; i < DEVICE_COUNT; i++) {
    const zone = ZONES[Math.floor(rng() * ZONES.length)]
    const is_online = rng() > 0.16 // ~84% online
    const uptime_pct = is_online
      ? Math.round((90 + rng() * 9.8) * 10) / 10 // 90.0 – 99.8
      : Math.round((55 + rng() * 33) * 10) / 10 // 55.0 – 88.0
    const lat = (13.74 + rng() * 0.06).toFixed(5)
    const lng = (100.5 + rng() * 0.06).toFixed(5)
    list.push({
      idx: i,
      device_id: `SG-${String(i + 1).padStart(3, '0')}`,
      device_name: `${zone} ${String(i + 1).padStart(2, '0')}`,
      signage_id: `SGN-${String(2026001 + i)}`,
      organize_id: ORG,
      department_id: DEPTS[Math.floor(rng() * DEPTS.length)],
      gps_position: `${lat}, ${lng}`,
      playmode: MODES[Math.floor(rng() * MODES.length)],
      playlist_name: PLAYLISTS[Math.floor(rng() * PLAYLISTS.length)],
      alert: rng() > 0.85 ? 'Low storage' : null,
      is_online,
      uptime_pct,
      ts_offset_min: is_online
        ? Math.floor(rng() * 15) // online: เห็นล่าสุด 0–15 นาที
        : 60 + Math.floor(rng() * 420), // offline: 1–8 ชม.ที่แล้ว
    })
  }
  return list
})()

const ONLINE_NOW = DEVICE_BASE.filter((d) => d.is_online).length
const OFFLINE_NOW = DEVICE_BASE.length - ONLINE_NOW

// ── get_latest_status ──
export function getDevices(now: number = Date.now()): DeviceLog[] {
  return DEVICE_BASE.map((d) => ({
    id: d.idx + 1,
    device_id: d.device_id,
    device_name: d.device_name,
    signage_id: d.signage_id,
    organize_id: d.organize_id,
    department_id: d.department_id,
    gps_position: d.gps_position,
    playmode: d.playmode,
    playlist_name: d.playlist_name,
    alert: d.alert,
    active_status: d.is_online ? 'Online' : 'Offline',
    action: d.is_online ? 'Playing' : 'No signal',
    scraped_timestamp: new Date(now - d.ts_offset_min * 60_000).toISOString(),
  }))
}

// ── get_online_summary ──
export function getSummary(_period?: string): Summary {
  return {
    online_count: ONLINE_NOW,
    offline_count: OFFLINE_NOW,
    total: DEVICE_BASE.length,
  }
}

// ── get_device_trend ──
// คืนค่ารายวัน `days` แถว สิ้นสุดวันนี้ — แต่ละวันแกว่งรอบจำนวนปัจจุบันเล็กน้อย
export function getTrend(days: number = 7, now: number = Date.now()): TrendRow[] {
  const rows: TrendRow[] = []
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const epochDay = Math.floor(d.getTime() / 86_400_000)
    const rng = mulberry32(epochDay + 777)

    const online = Math.max(0, Math.round(ONLINE_NOW + (rng() - 0.5) * 6))
    const offline = Math.max(0, Math.round(OFFLINE_NOW + (rng() - 0.5) * 4))

    rows.push({
      day: d.toISOString().slice(0, 10),
      online_count: online,
      offline_count: offline,
    })
  }
  return rows
}

// ── get_device_uptime ──
export function getUptime(days: number = 7): UptimeRow[] {
  const samplesPerDay = 24
  return DEVICE_BASE.map((d) => {
    const total = days * samplesPerDay
    const online = Math.round((d.uptime_pct / 100) * total)
    return {
      device_id: d.device_id,
      device_name: d.device_name,
      active_status: d.is_online ? 'Online' : 'Offline',
      total_records: total,
      online_records: online,
      offline_records: total - online,
      uptime_pct: d.uptime_pct,
    }
  })
}

// ── Profiles (User Management) ──
// store ระดับ module — mutate ได้ในระหว่าง session (รีเซ็ตเมื่อ reload เต็มหน้า)
const SEED_PROFILES: Profile[] = [
  { id: 'u-001', email: 'demo@smartsignage.app',  full_name: 'Demo Admin',     role: 'admin',       organization: ORG, status: 'active',    created_at: '2025-09-01T08:00:00Z', last_login: '2026-06-15T07:45:00Z' },
  { id: 'u-002', email: 'nida.k@smartsignage.app', full_name: 'Nida Kittisak',  role: 'admin',       organization: ORG, status: 'active',    created_at: '2025-10-12T09:30:00Z', last_login: '2026-06-14T18:20:00Z' },
  { id: 'u-003', email: 'arthit.p@smartsignage.app', full_name: 'Arthit Pongsai', role: 'admin',     organization: ORG, status: 'active',    created_at: '2025-11-03T10:15:00Z', last_login: '2026-06-13T11:05:00Z' },
  { id: 'u-004', email: 'ploy.s@smartsignage.app', full_name: 'Ploy Suwanna',   role: 'viewer',      organization: ORG, status: 'active',    created_at: '2026-01-20T14:00:00Z', last_login: '2026-06-12T09:40:00Z' },
  { id: 'u-005', email: 'kevin.t@smartsignage.app', full_name: 'Kevin Tan',     role: 'viewer',      organization: 'Tenant Partners', status: 'active', created_at: '2026-02-08T13:25:00Z', last_login: '2026-06-10T16:10:00Z' },
  { id: 'u-006', email: 'mali.j@smartsignage.app', full_name: 'Mali Jindarat',  role: 'viewer',      organization: ORG, status: 'suspended', created_at: '2026-03-15T11:00:00Z', last_login: '2026-05-28T08:55:00Z' },
  { id: 'u-007', email: 'somchai.w@smartsignage.app', full_name: 'Somchai Wong', role: 'super_admin', organization: ORG, status: 'active',    created_at: '2026-04-02T15:45:00Z', last_login: '2026-06-15T06:30:00Z' },
  { id: 'u-008', email: 'rina.m@smartsignage.app', full_name: 'Rina Maneerat',  role: 'viewer',      organization: 'Tenant Partners', status: 'suspended', created_at: '2026-04-22T09:10:00Z', last_login: '2026-05-19T12:00:00Z' },
]

let PROFILES: Profile[] = SEED_PROFILES.map((p) => ({ ...p }))

export function mockProfiles(): Profile[] {
  return PROFILES.map((p) => ({ ...p }))
}

export function mutateProfile(id: string, patch: Partial<Profile>) {
  PROFILES = PROFILES.map((p) => (p.id === id ? { ...p, ...patch } : p))
}

export function deleteProfile(id: string) {
  PROFILES = PROFILES.filter((p) => p.id !== id)
}

export function addProfile(input: Partial<Profile>) {
  const profile: Profile = {
    id: `u-${Date.now().toString(36)}`,
    email: input.email ?? null,
    full_name: input.full_name ?? null,
    role: (input.role as Profile['role']) ?? 'viewer',
    organization: input.organization ?? null,
    status: (input.status as Profile['status']) ?? 'active',
    created_at: new Date().toISOString(),
    last_login: null,
  }
  PROFILES = [...PROFILES, profile]
  return profile
}
