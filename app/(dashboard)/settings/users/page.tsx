import { createClient } from '@/lib/supabase/server'
import UserManagementClient from './user-management-client'

export const dynamic = 'force-dynamic'  // ← เพิ่มบรรทัดนี้ ปิด cache

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  console.log('🟡 Users:', users?.length, 'Error:', error)

  return <UserManagementClient initialUsers={users ?? []} />
}