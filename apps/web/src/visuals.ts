// Palette d'avatars et helpers visuels dérivés de la maquette KADY Web.dc.html.

const AVATAR_GRADS = [
  'linear-gradient(135deg,#ff9d5c,#d34d7e)',
  'linear-gradient(135deg,#7be0a0,#2f9ac2)',
  'linear-gradient(135deg,#b07bff,#7a4fd6)',
  'linear-gradient(135deg,#ffb45c,#d3744d)',
  'linear-gradient(135deg,#8fd0ff,#5a7fd6)',
  'linear-gradient(135deg,#9aa7d6,#5b6aa8)',
]

/** Dégradé d'avatar stable pour un id donné (pas de photo → initiale sur dégradé). */
export function avatarGrad(id: string | null | undefined): string {
  if (!id) return AVATAR_GRADS[0]
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_GRADS[h % AVATAR_GRADS.length]
}

/** Grades de Cercle (XP) : Graine → Flamme → Étoile → Diamant → Légendaire. */
export const GRADES: Record<number, { label: string; color: string; icon: string }> = {
  1: { label: 'Graine', color: '#22B36B', icon: 'leaf' },
  2: { label: 'Flamme', color: '#FF6B4A', icon: 'flame' },
  3: { label: 'Étoile', color: '#F5A623', icon: 'star' },
  4: { label: 'Diamant', color: '#2BB7CF', icon: 'diamond' },
  5: { label: 'Légendaire', color: '#8B5CF6', icon: 'sparkles' },
}

export function gradeOf(niveau: number) {
  return GRADES[Math.min(5, Math.max(1, niveau))] ?? GRADES[1]
}

/** Grade membre renvoyé par l'API sous forme de texte (graine…legendaire). */
const GRADE_INDEX: Record<string, number> = { graine: 1, flamme: 2, etoile: 3, diamant: 4, legendaire: 5 }

export function gradeByName(nom: string | null | undefined) {
  return GRADES[GRADE_INDEX[nom ?? ''] ?? 1]
}

/** Ce que chaque niveau de relation débloque (maquette). */
export const UNLOCKS: Record<number, Array<{ icon: string; t: string }>> = {
  2: [
    { icon: 'image', t: 'Une nouvelle photo se dévoile' },
    { icon: 'happy', t: 'Surnoms autorisés' },
  ],
  3: [
    { icon: 'images', t: '2ᵉ photo du profil révélée' },
    { icon: 'mic', t: 'Notes vocales illimitées' },
    { icon: 'location', t: 'Partage de localisation' },
  ],
  4: [
    { icon: 'albums', t: 'Album photo partagé' },
    { icon: 'call', t: 'Appels audio débloqués' },
  ],
  5: [
    { icon: 'videocam', t: 'Appels vidéo débloqués' },
    { icon: 'lock-open', t: 'Toutes les photos visibles' },
    { icon: 'ribbon', t: 'Badge « Complices » obtenu' },
  ],
}

export function modeLabel(mode: string | null | undefined): string {
  return mode === 'amitie' ? 'Amitié' : 'Rencontre'
}

export function modeColor(mode: string | null | undefined): string {
  return mode === 'amitie' ? '#5a7fd6' : '#ff6fa8'
}

/** Format d'heure HH:MM pour les messages. */
export function heure(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Libellé de jour pour les séparateurs de chat. */
export function jourLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

/** Temps relatif court pour notifications / activité. */
export function tempsRelatif(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.floor(ms / 60000)
  if (min < 1) return "À l'instant"
  if (min < 60) return `Il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Il y a ${h} h`
  const j = Math.floor(h / 24)
  if (j === 1) return 'Hier'
  return `Il y a ${j} j`
}

/** Icône + teinte des notifications selon leur type. */
export function notifVisual(type: string): { icon: string; tint: string } {
  if (type.includes('message') || type.includes('dm')) return { icon: 'chatbubble-ellipses', tint: '#ff6fa8' }
  if (type.includes('niveau') || type.includes('relation')) return { icon: 'sparkles', tint: '#a463ff' }
  if (type.includes('cercle') || type.includes('membre')) return { icon: 'person-add', tint: '#5a7fd6' }
  if (type.includes('eval')) return { icon: 'heart', tint: '#ff9d5c' }
  if (type.includes('premium')) return { icon: 'diamond', tint: '#2fb8c0' }
  return { icon: 'notifications', tint: '#5a7fd6' }
}
