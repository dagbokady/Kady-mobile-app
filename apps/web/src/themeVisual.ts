const MAP: Array<{ match: string; gradient: string; icon: string }> = [
  { match: 'voyag', gradient: 'linear-gradient(135deg,#7fe0d0,#2f9aa8,#1d3f66)', icon: 'airplane' },
  { match: 'entrepreneur', gradient: 'linear-gradient(135deg,#ff9d5c,#d34d7e,#3a1c5e)', icon: 'briefcase' },
  { match: 'cin', gradient: 'linear-gradient(135deg,#7a4fd6,#2a1c5e)', icon: 'film' },
  { match: 'foi', gradient: 'linear-gradient(135deg,#b07bff,#7a4fd6,#2a1c5e)', icon: 'sparkles' },
  { match: 'sport', gradient: 'linear-gradient(135deg,#7be0a0,#2f9ac2,#2a2c66)', icon: 'barbell' },
  { match: 'art', gradient: 'linear-gradient(135deg,#ff6aa9,#e02a73,#3a1c5e)', icon: 'color-palette' },
  { match: 'cuisin', gradient: 'linear-gradient(135deg,#ffb35c,#e0642a,#5e2a1c)', icon: 'restaurant' },
  { match: 'music', gradient: 'linear-gradient(135deg,#5a7fd6,#7a4fd6,#2a1c5e)', icon: 'musical-notes' },
]

const DEFAULT = { gradient: 'linear-gradient(135deg,#ff6aa9,#e02a73)', icon: 'people' }

export function themeVisual(theme: string | null | undefined) {
  if (!theme) return DEFAULT
  const key = theme.toLowerCase()
  const found = MAP.find((m) => key.includes(m.match))
  return found ?? DEFAULT
}
