export interface Me {
  id: string
  email: string
  is_verified: boolean
  verification_level: string
  en_pause: boolean
  prenom: string | null
  ville: string | null
  bio: string | null
  genre: string | null
  centres_interet: string[]
  premium: boolean
}

export interface Cercle {
  id: string
  nom: string
  theme: string | null
  description: string | null
  niveau: number
  statut: string
  capacite_max: number
  membres: number
  expire_le: string | null
  rejoint: boolean
}

export interface Membre {
  user_id: string
  prenom: string | null
  role: string
  grade: string
  en_ligne: boolean
}

export interface CercleMessage {
  id: string
  auteur_id: string
  contenu: string
  est_filtre: boolean
  created_at: string
}

export interface Relation {
  id: string
  autre_id: string
  prenom: string | null
  mode: string
  niveau: number
  dm_ouvert: boolean
  cercle_origine_id: string
}

export interface Conversation {
  id: string
  autre_id: string
  prenom: string | null
  niveau: number
  relation_id: string
}

export interface DmMessage {
  id: string
  auteur_id: string
  contenu: string
  est_filtre: boolean
  lu: boolean
  created_at: string
}

export interface Photo {
  id: string
  is_principale: boolean
  ordre: number
  url: string | null
}

export interface CarnetEntree {
  id: string
  contenu: string
  type: string
  cible_id: string | null
  created_at: string
}

export interface Notif {
  id: string
  titre: string
  corps: string | null
  type: string
  lu: boolean
  created_at: string
}

export interface Abonnement {
  plan: string
  statut: string
  actif: boolean
}

export interface ChampDecouverte {
  champ: string
  label: string
  revele: boolean
  valeur?: string
  options?: string[]
}

export interface DecouverteEtat {
  points: number
  total: number
  decouverts: number
  champs: ChampDecouverte[]
}
