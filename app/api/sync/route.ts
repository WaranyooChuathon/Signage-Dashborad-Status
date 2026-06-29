import { NextResponse } from 'next/server'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { getDevices } from '@/lib/mock/data'

// cron/manual ต้องรันสดทุกครั้ง ห้าม cache ผลลัพธ์
export const dynamic = 'force-dynamic'

// รัน scraper จำลองหนึ่งรอบ — ใช้ร่วมกันทั้งปุ่ม "Sync ตอนนี้" (POST) และ cron รายวัน (GET)
//  • mock (ไม่มี service_role): generator เป็น static → ตอบสำเร็จเฉย ๆ
//  • real (มี service_role): เขียน snapshot ปัจจุบันของทุก device เข้า device_logs
//    → get_latest_status คืนข้อม+ เวลาใหม่จริง (ข้อมูลสมมติล้วน, company-safe)
async function runSync() {
  const now = Date.now()
  const ts = new Date(now).toISOString()

  if (!hasSupabaseEnv || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      success: true,
      message: 'ดึงข้อมูลตัวอย่างสำเร็จ (Demo Mode)',
      lastSync: ts,
    })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const rows = getDevices(now).map((d) => {
    // สุ่มพลิกสถานะเล็กน้อย (~12%) เพื่อให้แต่ละ sync เห็นความเปลี่ยนแปลงจริง
    const flip = Math.random() < 0.12
    const online = flip ? d.active_status !== 'Online' : d.active_status === 'Online'
    return {
      device_id: d.device_id,
      device_name: d.device_name,
      signage_id: d.signage_id,
      organize_id: d.organize_id,
      department_id: d.department_id,
      gps_position: d.gps_position,
      playmode: d.playmode,
      playlist_name: d.playlist_name,
      alert: d.alert,
      active_status: online ? 'Online' : 'Offline',
      action: online ? 'Playing' : 'No signal',
      scraped_timestamp: ts,
    }
  })

  const { error } = await supabase.from('device_logs').insert(rows)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `Sync สำเร็จ — บันทึก snapshot ${rows.length} อุปกรณ์`,
    lastSync: ts,
  })
}

// ปุ่ม "Sync ตอนนี้" บนหน้า dashboard (เรียกจาก client ผ่าน fetch)
export async function POST() {
  return runSync()
}

// Vercel Cron รายวัน (ดู vercel.json) — เรียกผ่าน GET แล้วเขียน snapshot ใหม่ของวันนั้น ๆ
// ป้องกันด้วย CRON_SECRET: ถ้าตั้ง env ไว้ จะรับเฉพาะ request ที่มี Authorization ตรงกัน
// (ถ้าไม่ตั้ง — เช่น dev/mock — ปล่อยผ่าน เพื่อไม่ให้โหมด mock พัง)
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runSync()
}
