'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, UserCheck, UserX, Shield, Pencil, Ban, CheckCircle2, Trash2, Plus } from 'lucide-react'
import type { Profile } from '@/types/database'
import UserModal from './user-modal'
import DeleteModal from './delete-modal'
import './users.css'

export default function UserManagementClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all')
  const [filterRole, setFilterRole] = useState<'all' | 'super_admin' | 'admin' | 'viewer'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<Profile | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<Profile | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // รู้ว่าตอนนี้ใคร login อยู่ → ล็อก row ของตัวเองไม่ให้ลบ/ระงับ/แก้ (กัน demo พังตัวเอง)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null))
  }, [])

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const activeCount    = users.filter((u) => u.status === 'active').length
  const suspendedCount = users.filter((u) => u.status === 'suspended').length
  const saCount        = users.filter((u) => u.role === 'super_admin').length

  const filtered = users.filter((u) => {
    const ms = filterStatus === 'all' || u.status === filterStatus
    const mr = filterRole   === 'all' || u.role   === filterRole
    const q  = search.toLowerCase()
    const mq = !q ||
      (u.full_name    ?? '').toLowerCase().includes(q) ||
      (u.email        ?? '').toLowerCase().includes(q) ||
      (u.organization ?? '').toLowerCase().includes(q)
    return ms && mr && mq
  })

  async function refreshUsers() {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setUsers(data)
  }

  async function toggleStatus(user: Profile) {
    const supabase = createClient()
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', user.id)

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(
        newStatus === 'active'
          ? `เปิดใช้งาน ${user.full_name} แล้ว`
          : `ระงับ ${user.full_name} แล้ว`,
        newStatus === 'active' ? 'success' : 'error'
      )
      await refreshUsers()
    }
  }

  async function confirmDelete() {
    if (!deleteUser) return
    const supabase = createClient()
    const { error } = await supabase.from('profiles').delete().eq('id', deleteUser.id)
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(`ลบ ${deleteUser.full_name} แล้ว`, 'error')
      await refreshUsers()
    }
    setDeleteOpen(false)
    setDeleteUser(null)
  }

  async function onModalSave() {
    setModalOpen(false)
    setEditUser(null)
    await refreshUsers()
  }

  const roleInfo: Record<string, { cls: string; label: string; gradient: string }> = {
    super_admin: { cls: 'role-sa', label: 'Super Admin', gradient: 'linear-gradient(135deg,#4338CA,#6366F1)' },
    admin:       { cls: 'role-a',  label: 'Admin',       gradient: 'linear-gradient(135deg,#1F3FA8,#3B6CFF)' },
    viewer:      { cls: 'role-v',  label: 'Viewer',      gradient: 'linear-gradient(135deg,#6B7799,#98A2BD)' },
  }

  function getInitials(name: string) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <>
      {/* KPI */}
      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <div className="kpi kpi-ocean">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><Users size={18} /></div>
          <div className="kpi-label">Users ทั้งหมด</div>
          <div className="kpi-val">{users.length}</div>
          <div className="kpi-sub">บัญชีในระบบ</div>
        </div>
        <div className="kpi kpi-teal">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><UserCheck size={18} /></div>
          <div className="kpi-label">Active</div>
          <div className="kpi-val">{activeCount}</div>
          <div className="kpi-sub">ใช้งานอยู่</div>
        </div>
        <div className="kpi kpi-rose">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><UserX size={18} /></div>
          <div className="kpi-label">Suspended</div>
          <div className="kpi-val">{suspendedCount}</div>
          <div className="kpi-sub">ระงับการใช้งาน</div>
        </div>
        <div className="kpi kpi-indigo">
          <div className="kpi-blob" />
          <div className="kpi-icon-box"><Shield size={18} /></div>
          <div className="kpi-label">Super Admin</div>
          <div className="kpi-val">{saCount}</div>
          <div className="kpi-sub">สิทธิ์สูงสุด</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="um-toolbar">
        <div className="period-tabs">
          {(['all', 'active', 'suspended'] as const).map((f) => (
            <button
              key={f}
              className={`ptab ${filterStatus === f ? 'active' : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'active' ? 'Active' : 'Suspended'}
            </button>
          ))}
        </div>

        <select
          className="um-role-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
        >
          <option value="all">ทุก Role</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        <input
          className="table-search"
          placeholder="ค้นหาชื่อ / อีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="um-add-btn"
          onClick={() => { setEditUser(null); setModalOpen(true); }}
        >
          <Plus size={14} strokeWidth={2.5} />
          เพิ่ม User
        </button>
      </div>

      {/* Table */}
      <div className="device-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Organization</th>
                <th>สถานะ</th>
                <th>Last Login</th>
                <th>เข้าร่วม</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: 'var(--muted)' }}>
                    ไม่พบ User
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const ri = roleInfo[u.role] ?? roleInfo.viewer
                  const isActive = u.status === 'active'
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-avatar" style={{ background: ri.gradient }}>
                            {getInitials(u.full_name ?? u.email ?? '?')}
                          </div>
                          <div>
                            <div className="um-uname">{u.full_name ?? '—'}</div>
                            <div className="um-uemail">{u.email ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`um-role-badge ${ri.cls}`}>{ri.label}</span></td>
                      <td style={{ fontSize: '11px', color: 'var(--muted)' }}>{u.organization ?? '—'}</td>
                      <td>
                        <span className={`um-status ${isActive ? 'um-active' : 'um-suspended'}`}>
                          <span className={`um-st-dot ${isActive ? 'um-st-on' : ''}`} />
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="mono">
                        {u.last_login
                          ? new Date(u.last_login).toLocaleString('th-TH', {
                              day: '2-digit', month: '2-digit',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </td>
                      <td className="mono">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString('th-TH', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td>
                        {u.role === 'super_admin' || u.id === currentUserId ? (
                          <span style={{ fontSize: '10px', color: 'var(--muted-2)' }}>
                            {u.id === currentUserId ? 'บัญชีของคุณ' : 'แก้ไขไม่ได้'}
                          </span>
                        ) : (
                          <div className="um-actions">
                            <button className="um-act um-act-edit" onClick={() => { setEditUser(u); setModalOpen(true); }}>
                              <Pencil size={11} /> แก้ไข
                            </button>
                            <button
                              className={`um-act ${isActive ? 'um-act-suspend' : 'um-act-activate'}`}
                              onClick={() => toggleStatus(u)}
                            >
                              {isActive
                                ? <><Ban size={11} /> ระงับ</>
                                : <><CheckCircle2 size={11} /> เปิด</>
                              }
                            </button>
                            <button className="um-act um-act-del" onClick={() => { setDeleteUser(u); setDeleteOpen(true); }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        open={modalOpen}
        user={editUser}
        onClose={() => { setModalOpen(false); setEditUser(null); }}
        onSave={onModalSave}
        showToast={showToast}
      />

      <DeleteModal
        open={deleteOpen}
        userName={deleteUser?.full_name ?? ''}
        onClose={() => { setDeleteOpen(false); setDeleteUser(null); }}
        onConfirm={confirmDelete}
      />

      {toast && (
        <div className={`um-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </>
  )
}
