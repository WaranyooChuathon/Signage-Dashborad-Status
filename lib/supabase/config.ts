// แหล่งความจริงเดียวสำหรับการตัดสินใจ real vs mock
// มีทั้ง URL และ publishable key = ใช้ Supabase จริง, ไม่งั้น fallback mock
export const hasSupabaseEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
