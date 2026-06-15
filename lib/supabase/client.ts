import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createMockClient } from '@/lib/mock/client'
import { hasSupabaseEnv } from './config'

// env-toggle: มี Supabase env = ใช้ client จริง / ไม่มี = mock (โหมด demo)
export function createClient(): SupabaseClient {
  if (!hasSupabaseEnv) {
    return createMockClient() as unknown as SupabaseClient
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
