import { useEffect, useState } from 'react'

const KEY = 'kady.admin_theme'

function apply(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}

apply(localStorage.getItem(KEY) ?? 'light')

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem(KEY) ?? 'light')

  useEffect(() => {
    apply(theme)
    localStorage.setItem(KEY, theme)
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}
