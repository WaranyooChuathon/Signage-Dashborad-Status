// รูป avatar (สัตว์) — เลือกแบบ deterministic จาก seed (เช่น email)
// → user คนเดิมได้รูปเดิมเสมอ และตรงกันทุกหน้า (sidebar / ตาราง Users)
// ไฟล์อยู่ใน public/icon/profile/2x (ใช้ 2x ให้คมบนจอ retina, แสดงจริง ~32px)

const DIR = '/icon/profile/2x'

const FILES = [
  'set-animals-faces-circles-x2_001.png',
  'set-animals-faces-circles-x2_002.png',
  'set-animals-faces-circles-x2_003.png',
  'set-animals-faces-circles-x2_004.png',
  'set-animals-faces-circles-x2_005.png',
  'set-animals-faces-circles-x2_006.png',
  'set-animals-faces-circles-x2_007.png',
  'set-animals-faces-circles-x2_008.png',
  'set-animals-faces-circles-x2_009.png',
  'fun-pack-lovely-animal-faces-x2_001.png',
  'fun-pack-lovely-animal-faces-x2_002.png',
  'fun-pack-lovely-animal-faces-x2_003.png',
  'fun-pack-lovely-animal-faces-x2_004.png',
  'fun-pack-lovely-animal-faces-x2_005.png',
  'fun-pack-lovely-animal-faces-x2_006.png',
  'fun-pack-lovely-animal-faces-x2_007.png',
  'fun-pack-lovely-animal-faces-x2_008.png',
  'fun-pack-lovely-animal-faces-x2_009.png',
]

// pin รูปเฉพาะให้บาง user (demo admin = แพนด้า ดู neutral)
const PINNED: Record<string, string> = {
  'demo@smartsignage.app': 'set-animals-faces-circles-x2_001.png',
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0
  return h
}

/** คืน path รูป avatar จาก seed (email/id) — ค่าคงที่ต่อ seed เดิม */
export function avatarFor(seed: string | null | undefined): string {
  const key = (seed ?? '').toLowerCase().trim()
  const file = PINNED[key] ?? FILES[hash(key) % FILES.length]
  return `${DIR}/${file}`
}
