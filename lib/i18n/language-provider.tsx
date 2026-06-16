'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { dict, type Lang, type DictKey } from './dict'

type Vars = Record<string, string | number>
type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey, vars?: Vars) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'th',
  setLang: () => {},
  t: (key) => key,
})

export function useLang() {
  return useContext(LanguageContext)
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  // default 'th' ทั้ง server + client → hydration ตรงกัน; อ่าน localStorage ใน effect
  const [lang, setLangState] = useState<Lang>('th')

  useEffect(() => {
    const stored = localStorage.getItem('cc-lang') as Lang | null
    if (stored === 'en' || stored === 'th') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('cc-lang', l)
  }

  function t(key: DictKey, vars?: Vars): string {
    let s = dict[lang][key] ?? dict.th[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(`{${k}}`, String(v))
      }
    }
    return s
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
