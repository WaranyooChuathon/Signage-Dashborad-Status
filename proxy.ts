import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { hasSupabaseEnv } from './lib/supabase/config'

export async function proxy(request: NextRequest) {
  // โหมด demo (ไม่มี Supabase env): ไม่มี auth guard — เปิดทุกหน้าได้ทันที
  if (!hasSupabaseEnv) {
    return NextResponse.next()
  }

  // โหมด full-stack จริง: auth guard ด้วย Supabase session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // helper: redirect พร้อม carry cookies ที่ refresh มา (กัน session หลุด)
  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone()
    url.pathname = pathname
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // ยังไม่ล็อกอิน + ไม่ใช่หน้า login → ส่งไป login
  if (!user && !isLoginPage) {
    return redirectTo('/login')
  }

  // ล็อกอินแล้วแต่ยังอยู่หน้า login (เช่น กด back) → ส่งกลับ dashboard
  if (user && isLoginPage) {
    return redirectTo('/dashboard')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
