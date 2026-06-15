import { NextResponse, type NextRequest } from 'next/server'

// DEMO MODE — ไม่มี auth guard: เปิดทุกหน้าได้ทันที ไม่ต้อง login
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
