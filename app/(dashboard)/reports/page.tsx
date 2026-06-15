import { createClient } from '@/lib/supabase/server'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: trend } = await supabase.rpc('get_device_trend', { days_back: 7 })
  const { data: uptime } = await supabase.rpc('get_device_uptime', { days_back: 7 })

  return (
    <ReportsClient
      initialTrend={trend ?? []}
      initialUptime={uptime ?? []}
    />
  )
}