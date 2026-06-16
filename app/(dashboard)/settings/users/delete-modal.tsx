'use client'

import { useLang } from '@/lib/i18n/language-provider'

export default function DeleteModal({
  open, userName, onClose, onConfirm,
}: {
  open: boolean; userName: string; onClose: () => void; onConfirm: () => void
}) {
  const { t } = useLang()
  if (!open) return null

  return (
    <div className="um-overlay" onClick={(e) => { if ((e.target as HTMLElement).classList.contains('um-overlay')) onClose() }}>
      <div className="um-modal um-modal-sm">
        <div className="um-confirm-icon" style={{ fontSize: 32 }}>⚠</div>
        <div className="um-confirm-title">{t('um.del.title')}</div>
        <div className="um-confirm-sub">
          {t('um.del.q1')} <strong>{userName}</strong> {t('um.del.q2')}
          <br />{t('um.del.irreversible')}
        </div>
        <div className="um-confirm-actions">
          <button className="um-btn-cancel" onClick={onClose}>{t('set.pw.cancel')}</button>
          <button className="um-btn-delete" onClick={onConfirm}>{t('um.del.delete')}</button>
        </div>
      </div>
    </div>
  )
}