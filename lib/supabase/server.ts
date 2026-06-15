// DEMO MODE — คืน mock client แทน Supabase จริง (ไม่ต่อฐานข้อมูล)
import { createMockClient } from '@/lib/mock/client'

export async function createClient() {
  return createMockClient()
}
