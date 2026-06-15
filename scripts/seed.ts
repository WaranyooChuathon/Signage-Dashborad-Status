// ============================================================================
// Seed script — เติมข้อมูลสมมติลง Supabase project ใหม่ของคุณ
//   reuse generator จาก lib/mock/data.ts → time-series 90 วัน + 8 profiles
//
// วิธีรัน (จาก root ของโปรเจกต์):
//   1) ตั้ง .env.local ให้มี NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//      (ของ project ใหม่ — ห้ามใช้ของบริษัท)
//   2) npx tsx scripts/seed.ts
// ============================================================================

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { getDevices, getUptime, mockProfiles } from '../lib/mock/data'

// ── โหลด .env.local แบบง่าย (ไม่ต้องพึ่ง dotenv) ──────────────────────────────
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
try {
  const env = readFileSync(join(root, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  console.warn('⚠️  ไม่พบ .env.local — จะใช้ค่าจาก process.env แทน')
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !SERVICE_KEY) {
  console.error('❌ ต้องมี NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(URL, SERVICE_KEY)

// ── PRNG เล็ก ๆ สำหรับสุ่มสถานะแต่ละ snapshot แบบ deterministic ───────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DAYS = 90
const SNAPSHOTS_PER_DAY = 4 // ทุก 6 ชม.
const STEP_MS = (24 / SNAPSHOTS_PER_DAY) * 3_600_000

async function main() {
  const now = Date.now()
  const devices = getDevices(now)
  const uptimeMap = new Map(getUptime(1).map((u) => [u.device_id, u.uptime_pct]))

  console.log(`📦 เตรียม seed: ${devices.length} devices × ${DAYS} วัน × ${SNAPSHOTS_PER_DAY}/วัน`)

  // ── สร้าง time-series rows ──
  type Row = Record<string, unknown>
  const rows: Row[] = []
  const totalSteps = DAYS * SNAPSHOTS_PER_DAY

  for (const d of devices) {
    const uptime = uptimeMap.get(d.device_id!) ?? 95
    const rng = mulberry32(hashStr(d.device_id ?? '') >>> 0)

    for (let i = totalSteps - 1; i >= 0; i--) {
      const ts = now - i * STEP_MS
      // snapshot ล่าสุด (i === 0) = สถานะปัจจุบันจริง เพื่อให้ dashboard ตรงกัน
      const isOnline = i === 0 ? d.active_status === 'Online' : rng() * 100 < uptime
      rows.push({
        device_id: d.device_id,
        device_name: d.device_name,
        signage_id: d.signage_id,
        organize_id: d.organize_id,
        department_id: d.department_id,
        gps_position: d.gps_position,
        playmode: d.playmode,
        playlist_name: d.playlist_name,
        alert: d.alert,
        active_status: isOnline ? 'Online' : 'Offline',
        action: isOnline ? 'Playing' : 'No signal',
        scraped_timestamp: new Date(ts).toISOString(),
      })
    }
  }

  // ── ล้างของเดิม (re-runnable) ──
  console.log('🧹 ล้าง device_logs เดิม...')
  await supabase.from('device_logs').delete().neq('id', -1)

  // ── insert เป็น chunk ──
  const CHUNK = 2000
  console.log(`⬆️  insert ${rows.length} rows (chunk ละ ${CHUNK})...`)
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK)
    const { error } = await supabase.from('device_logs').insert(slice)
    if (error) {
      console.error('❌ insert device_logs ล้มเหลว:', error.message)
      process.exit(1)
    }
    process.stdout.write(`  ${Math.min(i + CHUNK, rows.length)}/${rows.length}\r`)
  }
  console.log('\n✅ device_logs เสร็จ')

  // ── profiles (ไม่ใส่ id → ให้ DB gen_random_uuid()) ──
  console.log('👤 seed profiles...')
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const profiles = mockProfiles().map((p) => ({
    email: p.email,
    full_name: p.full_name,
    role: p.role,
    organization: p.organization,
    status: p.status,
    created_at: p.created_at,
    last_login: p.last_login,
  }))
  const { error: pErr } = await supabase.from('profiles').insert(profiles)
  if (pErr) {
    console.error('❌ insert profiles ล้มเหลว:', pErr.message)
    process.exit(1)
  }
  console.log(`✅ profiles เสร็จ (${profiles.length} คน)`)
  console.log('\n🎉 Seed สำเร็จ — ลองรัน npm run dev โดยตั้ง .env.local แล้วเปิด dashboard')
}

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
