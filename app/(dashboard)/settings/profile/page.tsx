import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'
import SettingsClient from './settings-client'

export const dynamic = 'force-dynamic' // ปิด cache — ข้อมูล user ต้องสดเสมอ

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ดึง profile ของ user ปัจจุบัน
  // หมายเหตุ: mock .eq() คืน profiles ทั้งหมด → ใช้ .find() กรองเองให้ทำงานได้ทั้ง 2 โหมด
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id ?? '')

  const found = (profiles as Profile[] | null)?.find((p) => p.id === user?.id)

  // fallback จาก auth user ถ้าไม่พบ row ใน profiles (กัน null)
  const profile: Profile =
    found ?? {
      id: user?.id ?? 'unknown',
      email: user?.email ?? null,
      full_name:
        (user?.user_metadata?.full_name as string | undefined) ?? null,
      role: 'admin',
      organization: null,
      status: 'active',
      created_at: null,
      last_login: null,
    }

  return <SettingsClient initialProfile={profile} />
}
