import { NextResponse } from 'next/server'

// DEMO MODE — การสร้าง user จริงทำฝั่ง client ผ่าน mock store
// route นี้คงไว้เพื่อความเข้ากันได้ และตอบสำเร็จเสมอ (ไม่มี secret/DB)
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (!body.email || !body.full_name) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 })
  }
  return NextResponse.json({
    success: true,
    message: 'สร้าง user สำเร็จ (Demo Mode)',
    userId: `demo-${Date.now()}`,
  })
}
