'use client'

// Login mount providers เอง — layout ของ login อยู่นอก (dashboard) group
// จึงไม่มี ThemeProvider/LanguageProvider ครอบให้ ต้อง wrap ที่นี่
// theme/lang sync กับ dashboard ผ่าน localStorage keys เดิม ('cc-theme' / 'cc-lang')
import ThemeProvider from '@/components/dashboard/theme-provider'
import LanguageProvider from '@/lib/i18n/language-provider'
import LoginForm from './login-form'

export default function LoginShell() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    </ThemeProvider>
  )
}
