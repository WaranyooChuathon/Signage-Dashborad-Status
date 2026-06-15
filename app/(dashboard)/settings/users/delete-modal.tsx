'use client'

export default function DeleteModal({
  open, userName, onClose, onConfirm,
}: {
  open: boolean; userName: string; onClose: () => void; onConfirm: () => void
}) {
  if (!open) return null

  return (
    <div className="um-overlay" onClick={(e) => { if ((e.target as HTMLElement).classList.contains('um-overlay')) onClose() }}>
      <div className="um-modal um-modal-sm">
        <div className="um-confirm-icon" style={{ fontSize: 32 }}>⚠</div>
        <div className="um-confirm-title">ลบ User นี้?</div>
        <div className="um-confirm-sub">
          ต้องการลบ <strong>{userName}</strong> ออกจากระบบ?
          <br />การกระทำนี้ไม่สามารถย้อนกลับได้
        </div>
        <div className="um-confirm-actions">
          <button className="um-btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="um-btn-delete" onClick={onConfirm}>ลบออกจากระบบ</button>
        </div>
      </div>
    </div>
  )
}