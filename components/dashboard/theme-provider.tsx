'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextType = { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void }

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('cc-theme') as Theme | null
    if (stored === 'dark') setThemeState('dark')
  }, [])

  // ตั้งธีมแบบระบุค่าชัดเจน (ใช้โดยหน้า Settings) + persist
  function setTheme(next: Theme) {
    setThemeState(next)
    localStorage.setItem('cc-theme', next)
  }

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={`dash-root${theme === 'dark' ? ' dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
