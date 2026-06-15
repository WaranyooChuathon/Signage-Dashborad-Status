import { createClient } from '@/lib/supabase/server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { data: summary },
    { data: trend },
    { data: allDevices },
  ] = await Promise.all([
    supabase.rpc('get_online_summary', { period: 'today' }),
    supabase.rpc('get_device_trend',   { days_back: 1 }),
    supabase.rpc('get_latest_status'),
  ])

  return (
    <DashboardClient
      initialSummary={summary?.[0] ?? { online_count: 0, offline_count: 0, total: 0 }}
      initialTrend={trend ?? []}
      initialAllDevices={allDevices ?? []}
    />
  )
}
