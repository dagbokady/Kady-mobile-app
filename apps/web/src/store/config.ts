import { create } from 'zustand'
import { site, type SiteMode } from '../api'

interface ConfigState {
  mode: SiteMode
  loaded: boolean
  load: () => Promise<void>
}

export const useConfig = create<ConfigState>((set) => ({
  mode: 'open',
  loaded: false,
  async load() {
    try {
      const { mode } = await site.config()
      set({ mode, loaded: true })
    } catch {
      // Fail-open : ne jamais bloquer le site sur un pépin réseau.
      set({ mode: 'open', loaded: true })
    }
  },
}))
