import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createMockClient } from '@/lib/mock/client'
import { hasSupabaseEnv } from './config'

// env-toggle: มี Supabase env = ใช้ client จริง / ไม่มี = mock (โหมด demo)
export async function createClient(): Promise<SupabaseClient> {
  if (!hasSupabaseEnv) {
    return createMockClient() as unknown as SupabaseClient
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
