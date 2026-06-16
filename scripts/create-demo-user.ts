// ============================================================================
// สร้าง demo auth user + ผูก profile — ให้ปุ่ม "เข้าชม Live Demo" + login ใช้ได้จริง
//   วิธีรัน:  npx tsx scripts/create-demo-user.ts
//   ต้องมี .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
// ============================================================================

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
try {
  const env = readFileSync(join(root, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  console.warn('⚠️  ไม่พบ .env.local')
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !SERVICE_KEY) {
  console.error('❌ ต้องมี NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// ⚠️ credentials นี้โชว์ได้ในหน้า login (เป็น demo) — ไม่ใช่ข้อมูลจริง
const DEMO_EMAIL = 'demo@smartsignage.app'
const DEMO_PASSWORD = 'demo1234'

const supabase = createClient(URL, SERVICE_KEY)

async function main() {
  // 1) หา user เดิม (ถ้าเคยสร้าง) หรือสร้างใหม่
  let userId: string | undefined

  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  })

  if (createErr) {
    // น่าจะมีอยู่แล้ว → หา id จาก list
    console.log('ℹ️  demo user อาจมีอยู่แล้ว — กำลังค้นหา...')
    const { data: list } = await supabase.auth.admin.listUsers()
    userId = list?.users.find((u) => u.email === DEMO_EMAIL)?.id
    if (userId) {
      await supabase.auth.admin.updateUserById(userId, { password: DEMO_PASSWORD })
    }
  } else {
    userId = created.user?.id
  }

  if (!userId) {
    console.error('❌ สร้าง/หา demo user ไม่สำเร็จ')
    process.exit(1)
  }

  // 2) ผูก profile: ลบ row email เดิมที่ seed ไว้ แล้ว insert ใหม่ด้วย id = auth uid
  await supabase.from('profiles').delete().eq('email', DEMO_EMAIL)
  const { error: pErr } = await supabase.from('profiles').insert({
    id: userId,
    email: DEMO_EMAIL,
    full_name: 'Demo Admin',
    // role = admin (ไม่ใช่ super_admin) — demo เปิดให้คนนอก login ได้
    // จึงให้สิทธิ์พอโชว์งานแต่ไม่ใช่ godmode + ล็อกบัญชีนี้ใน User Management
    role: 'admin',
    organization: 'Aurora City',
    status: 'active',
    last_login: new Date().toISOString(),
  })
  if (pErr) {
    console.error('❌ ผูก profile ไม่สำเร็จ:', pErr.message)
    process.exit(1)
  }

  console.log('✅ demo user พร้อมใช้')
  console.log(`   email:    ${DEMO_EMAIL}`)
  console.log(`   password: ${DEMO_PASSWORD}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
