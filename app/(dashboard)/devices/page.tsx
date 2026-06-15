import { createClient } from '@/lib/supabase/server'
import DeviceListClient from './device-list-client'

export default async function DevicesPage() {
  const supabase = await createClient()

  const { data: devices } = await supabase.rpc('get_latest_status')

  return <DeviceListClient devices={devices ?? []} />
}