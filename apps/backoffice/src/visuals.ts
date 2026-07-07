// Helpers visuels dérivés de la maquette KADY Admin.dc.html.

/** [couleur, fond] du chip de statut. */
export function statusColors(status: string): [string, string] {
  const M: Record<string, [string, string]> = {
    Actif: ['#1f9d57', 'rgba(31,157,87,.12)'],
    Premium: ['#b01b5c', 'rgba(214,40,110,.12)'],
    Banni: ['#e02a2a', 'rgba(224,42,42,.12)'],
    Suspendu: ['#c2740d', 'rgba(224,138,27,.14)'],
    'En attente': ['#5a7fd6', 'rgba(90,127,214,.14)'],
    Signalé: ['#e02a2a', 'rgba(224,42,42,.1)'],
    Archivé: ['#8a8496', 'rgba(0,0,0,.08)'],
    Expiré: ['#8a8496', 'rgba(0,0,0,.08)'],
  }
  return M[status] ?? ['#8a8496', 'rgba(0,0,0,.08)']
}

const AVATAR_GRADS = [
  'linear-gradient(135deg,#ff9d5c,#d34d7e)',
  'linear-gradient(135deg,#7be0a0,#2f9ac2)',
  'linear-gradient(135deg,#b07bff,#7a4fd6)',
  'linear-gradient(135deg,#ffb45c,#d3744d)',
  'linear-gradient(135deg,#8fd0ff,#5a7fd6)',
  'linear-gradient(135deg,#9aa7d6,#5b6aa8)',
]

export function avatarGrad(id: string | null | undefined): string {
  if (!id) return AVATAR_GRADS[0]
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_GRADS[h % AVATAR_GRADS.length]
}

const THEME_GRADS: Array<{ match: string; grad: string }> = [
  { match: 'voyag', grad: 'linear-gradient(135deg,#7fe0d0,#2f9aa8,#1d3f66)' },
  { match: 'entrepreneur', grad: 'linear-gradient(135deg,#ff9d5c,#d34d7e,#3a1c5e)' },
  { match: 'business', grad: 'linear-gradient(135deg,#ff9d5c,#d34d7e,#3a1c5e)' },
  { match: 'cin', grad: 'linear-gradient(135deg,#b07bff,#7a4fd6,#2a1c5e)' },
  { match: 'foi', grad: 'linear-gradient(135deg,#7be0a0,#2f9ac2,#2a2c66)' },
  { match: 'sport', grad: 'linear-gradient(135deg,#7be0a0,#2f9ac2,#1d3f66)' },
  { match: 'art', grad: 'linear-gradient(135deg,#ff7ab0,#a463ff,#3a1c5e)' },
  { match: 'cuisin', grad: 'linear-gradient(135deg,#ffb45c,#d3744d,#3a1c5e)' },
  { match: 'food', grad: 'linear-gradient(135deg,#ffb45c,#d3744d,#3a1c5e)' },
  { match: 'music', grad: 'linear-gradient(135deg,#5a7fd6,#7a4fd6,#2a1c5e)' },
]

export function themeGrad(theme: string | null | undefined): string {
  if (theme) {
    const key = theme.toLowerCase()
    const found = THEME_GRADS.find((t) => key.includes(t.match))
    if (found) return found.grad
  }
  return 'linear-gradient(135deg,#ff6aa9,#e02a73)'
}

/** 12 480 → « 12 480 » ; montants FCFA compacts (6,4 M). */
export function fmtNombre(n: number): string {
  return n.toLocaleString('fr-FR')
}

export function fmtFcfa(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M FCFA`
  return `${n.toLocaleString('fr-FR')} FCFA`
}
