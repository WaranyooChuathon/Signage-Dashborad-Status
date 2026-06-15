'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextType = { theme: Theme; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('cc-theme') as Theme | null
    if (stored === 'dark') setTheme('dark')
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('cc-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`dash-root${theme === 'dark' ? ' dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
