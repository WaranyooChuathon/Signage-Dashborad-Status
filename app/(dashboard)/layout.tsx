import './dashboard.css'
import Sidebar from '@/components/dashboard/sidebar'
import Topbar from '@/components/dashboard/topbar'
import ThemeProvider from '@/components/dashboard/theme-provider'
import DemoBanner from '@/components/dashboard/demo-banner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="dash-bg" />
      <Sidebar />
      <div className="dash-main">
        <DemoBanner />
        <Topbar />
        <div className="dash-content">{children}</div>
      </div>
    </ThemeProvider>
  )
}