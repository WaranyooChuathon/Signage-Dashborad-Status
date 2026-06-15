import { NextResponse } from 'next/server'

// DEMO MODE — ไม่ต่อฐานข้อมูลจริง: จำลองการ sync สำเร็จด้วยเวลาปัจจุบัน
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'ดึงข้อมูลตัวอย่างสำเร็จ (Demo Mode)',
    lastSync: new Date().toISOString(),
  })
}
