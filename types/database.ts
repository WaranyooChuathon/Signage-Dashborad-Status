export type DeviceLog = {
  id: number
  device_id: string | null
  device_name: string | null
  signage_id: string | null
  organize_id: string | null
  department_id: string | null
  gps_position: string | null
  playmode: string | null
  playlist_name: string | null
  alert: string | null
  active_status: string | null
  action: string | null
  scraped_timestamp: string | null
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'super_admin' | 'admin' | 'viewer'
  organization: string | null
  status: 'active' | 'suspended'
  created_at: string | null
  last_login: string | null
}