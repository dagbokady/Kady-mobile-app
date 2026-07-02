import { create } from 'zustand'

type Theme = 'light' | 'dark'

const KEY = 'kady.theme'

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

const initial: Theme = (localStorage.getItem(KEY) as Theme) ?? 'light'
apply(initial)

export const useTheme = create<{ theme: Theme; toggle: () => void }>((set, get) => ({
  theme: initial,
  toggle() {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem(KEY, next)
    apply(next)
    set({ theme: next })
  },
}))
