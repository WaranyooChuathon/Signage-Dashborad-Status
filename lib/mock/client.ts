// ──────────────────────────────────────────────────────────────────────────
// Mock Supabase client — มี interface เหมือน supabase-js เท่าที่โปรเจกต์ใช้
// (rpc / from().select().order() / update / delete / insert / auth)
// ทำให้หน้าเดิมเรียก createClient() ได้โดยไม่ต้องแก้ logic
// ──────────────────────────────────────────────────────────────────────────

import {
  getSummary, getTrend, getUptime, getDevices,
  mockProfiles, mutateProfile, deleteProfile, addProfile,
} from './data'

const DEMO_USER = {
  id: 'u-001',
  email: 'demo@smartsignage.app',
  user_metadata: { full_name: 'Demo Admin' },
}

type RpcArgs = { period?: string; days_back?: number }
type MockError = { message: string } | null

function fromBuilder(table: string) {
  return {
    select(_cols?: string) {
      const data = table === 'profiles' ? mockProfiles() : []
      const result = { data, error: null as MockError }
      return {
        order: async (..._args: unknown[]) => result,
        eq: async (..._args: unknown[]) => result,
        then: (resolve: (v: typeof result) => void) => resolve(result), // await ได้ตรง ๆ
      }
    },
    update(patch: Record<string, unknown>) {
      return {
        eq: async (_col: string, val: string) => {
          if (table === 'profiles') mutateProfile(val, patch)
          return { error: null as MockError }
        },
      }
    },
    delete() {
      return {
        eq: async (_col: string, val: string) => {
          if (table === 'profiles') deleteProfile(val)
          return { error: null as MockError }
        },
      }
    },
    insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
      if (table === 'profiles') {
        const arr = Array.isArray(rows) ? rows : [rows]
        arr.forEach((r) => addProfile(r))
      }
      return Promise.resolve({ error: null as MockError })
    },
  }
}

export function createMockClient() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async rpc(name: string, args: RpcArgs = {}): Promise<{ data: any; error: null }> {
      switch (name) {
        case 'get_online_summary':
          return { data: [getSummary(args.period)], error: null }
        case 'get_device_trend':
          return { data: getTrend(args.days_back ?? 7), error: null }
        case 'get_latest_status':
          return { data: getDevices(), error: null }
        case 'get_device_uptime':
          return { data: getUptime(args.days_back ?? 7), error: null }
        default:
          return { data: null, error: null }
      }
    },
    from(table: string) {
      return fromBuilder(table)
    },
    auth: {
      async getUser() {
        return { data: { user: DEMO_USER }, error: null }
      },
      async signInWithPassword(_creds?: { email: string; password: string }) {
        return { data: { user: DEMO_USER, session: {} }, error: null }
      },
      // โหมด mock: จำลองอัปเดต user (เช่น เปลี่ยนรหัสผ่าน) ให้สำเร็จเสมอ
      async updateUser(_attrs?: Record<string, unknown>) {
        return { data: { user: DEMO_USER }, error: null as MockError }
      },
      async signOut() {
        return { error: null }
      },
    },
  }
}
