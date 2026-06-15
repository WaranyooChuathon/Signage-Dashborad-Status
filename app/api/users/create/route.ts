import { NextResponse } from 'next/server'
import { hasSupabaseEnv } from '@/lib/supabase/config'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { email, password, full_name, organization, role, status } = body

  if (!email || !full_name) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 })
  }

  // โหมด demo (ไม่มี backend จริง) — ตอบสำเร็จเฉย ๆ
  if (!hasSupabaseEnv || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      success: true,
      message: 'สร้าง user สำเร็จ (Demo Mode)',
      userId: `demo-${Date.now()}`,
    })
  }

  // โหมด full-stack จริง — สร้าง auth user + profile ด้วย service_role
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: password || 'Temp1234!',
    email_confirm: true,
  })
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }
  if (!authData.user) {
    return NextResponse.json({ error: 'ไม่สามารถสร้าง user ได้' }, { status: 500 })
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name,
    organization,
    role: role || 'viewer',
    status: status || 'active',
  })
  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: 'สร้าง user สำเร็จ',
    userId: authData.user.id,
  })
}
