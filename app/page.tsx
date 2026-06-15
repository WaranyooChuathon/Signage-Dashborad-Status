import { redirect } from 'next/navigation'

// DEMO MODE — เริ่มที่หน้า login showcase แล้วกด "เข้าชม Live Demo" เข้าสู่ dashboard
export default function Home() {
  redirect('/login')
}
