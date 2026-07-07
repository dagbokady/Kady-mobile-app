import { api, clearTokens, setTokens } from './client'
import type {
  Abonnement,
  CarnetEntree,
  Cercle,
  CercleMessage,
  Conversation,
  DecouverteEtat,
  DmMessage,
  Me,
  Membre,
  Notif,
  Photo,
  Relation,
} from './types'

export const auth = {
  async register(payload: {
    email: string
    telephone: string
    password: string
    prenom: string
    date_naissance: string
    genre?: string
    ville?: string
    centres_interet?: string[]
  }) {
    const { data } = await api.post('/auth/register', payload)
    setTokens(data.access_token, data.refresh_token)
  },
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    setTokens(data.access_token, data.refresh_token)
  },
  async me(): Promise<Me> {
    const { data } = await api.get('/auth/me')
    return data
  },
  logout: clearTokens,
}

export const meta = {
  async villes(): Promise<string[]> {
    const { data } = await api.get('/villes')
    return data
  },
}

export const profils = {
  async update(payload: Partial<{ prenom: string; ville: string; bio: string; genre: string; centres_interet: string[] }>) {
    await api.patch('/profils/me', payload)
  },
  async photos(): Promise<Photo[]> {
    const { data } = await api.get('/profils/me/photos')
    return data
  },
  async uploadPhoto(fichier: File, is_principale = false): Promise<Photo> {
    const form = new FormData()
    form.append('fichier', fichier)
    const { data } = await api.post('/profils/me/photos/upload', form, { params: { is_principale } })
    return data
  },
  async supprimerPhoto(photoId: string) {
    await api.delete(`/profils/me/photos/${photoId}`)
  },
}

export const cercles = {
  async list(q?: string): Promise<Cercle[]> {
    const { data } = await api.get('/cercles', { params: q ? { q } : {} })
    return data
  },
  async get(id: string): Promise<Cercle> {
    const { data } = await api.get(`/cercles/${id}`)
    return data
  },
  async membres(id: string): Promise<Membre[]> {
    const { data } = await api.get(`/cercles/${id}/membres`)
    return data
  },
  async join(id: string) {
    await api.post(`/cercles/${id}/join`)
  },
  async leave(id: string) {
    await api.post(`/cercles/${id}/leave`)
  },
  async messages(id: string, before?: string): Promise<CercleMessage[]> {
    const { data } = await api.get(`/cercles/${id}/messages`, { params: before ? { before } : {} })
    return data
  },
  async envoyer(id: string, contenu: string): Promise<CercleMessage> {
    const { data } = await api.post(`/cercles/${id}/messages`, { contenu })
    return data
  },
  async creer(payload: { nom: string; theme?: string; description?: string; capacite_max?: number }): Promise<Cercle> {
    const { data } = await api.post('/cercles', payload)
    return data
  },
}

export const relations = {
  async list(): Promise<Relation[]> {
    const { data } = await api.get('/relations')
    return data
  },
  async evaluer(relation_id: string, moyenne: number, commentaire?: string) {
    const { data } = await api.post('/relations/evaluer', { relation_id, moyenne, commentaire: commentaire || undefined })
    return data as { relation_id: string; niveau: number; dm_ouvert: boolean; a_evolue: boolean }
  },
}

export const dm = {
  async conversations(): Promise<Conversation[]> {
    const { data } = await api.get('/dm')
    return data
  },
  async ouvrir(relationId: string): Promise<Conversation> {
    const { data } = await api.post(`/dm/ouvrir/${relationId}`)
    return data
  },
  async messages(conversationId: string, before?: string): Promise<DmMessage[]> {
    const { data } = await api.get(`/dm/${conversationId}/messages`, { params: before ? { before } : {} })
    return data
  },
  async envoyer(conversationId: string, contenu: string): Promise<DmMessage> {
    const { data } = await api.post(`/dm/${conversationId}/messages`, { contenu })
    return data
  },
}

export const securite = {
  async bloquer(cibleId: string) {
    await api.post(`/securite/bloquer/${cibleId}`)
  },
  async debloquer(cibleId: string) {
    await api.delete(`/securite/bloquer/${cibleId}`)
  },
  async masquer(cibleId: string) {
    await api.post(`/securite/masquer/${cibleId}`)
  },
  async signaler(payload: { signale_id: string; contexte: 'cercle' | 'dm'; cercle_id?: string; conversation_id?: string; motif?: string }) {
    await api.post('/securite/signaler', payload)
  },
  async pause(actif: boolean) {
    await api.post('/securite/pause', null, { params: { actif } })
  },
}

export const carnet = {
  async list(): Promise<CarnetEntree[]> {
    const { data } = await api.get('/carnet')
    return data
  },
  async ajouter(payload: { contenu: string; type?: string; cible_id?: string }): Promise<CarnetEntree> {
    const { data } = await api.post('/carnet', payload)
    return data
  },
  async supprimer(id: string) {
    await api.delete(`/carnet/${id}`)
  },
}

export const notifications = {
  async list(): Promise<Notif[]> {
    const { data } = await api.get('/notifications')
    return data
  },
  async marquerLues() {
    await api.post('/notifications/lues')
  },
}

export const premium = {
  async statut(): Promise<Abonnement> {
    const { data } = await api.get('/premium/statut')
    return data
  },
  async init(): Promise<{ payment_url: string; transaction_id: string }> {
    const { data } = await api.post('/premium/init')
    return data
  },
}

export const decouverte = {
  async etat(cibleId: string): Promise<DecouverteEtat> {
    const { data } = await api.get(`/decouverte/${cibleId}`)
    return data
  },
  async deviner(cibleId: string, champ: string, valeur: string): Promise<{ correct: boolean; valeur?: string }> {
    const { data } = await api.post(`/decouverte/${cibleId}/deviner`, null, { params: { champ, valeur } })
    return data
  },
}

export type SiteMode = 'open' | 'waitlist' | 'maintenance'

export interface WaitlistStatut {
  code_parrainage: string
  rang: number | null
  nb_parrainages: number
  prenom: string | null
  genre: string | null
}

export const site = {
  async config(): Promise<{ mode: SiteMode; waitlist_mode: boolean; maintenance: boolean }> {
    const { data } = await api.get('/config')
    return data
  },
  async rejoindreWaitlist(payload: {
    prenom: string
    email: string
    genre?: string
    centres_interet?: string[]
    parraine_par?: string
  }): Promise<WaitlistStatut> {
    const { data } = await api.post('/waitlist', payload)
    return data
  },
  async statutWaitlist(email: string): Promise<WaitlistStatut> {
    const { data } = await api.get('/waitlist/statut', { params: { email } })
    return data
  },
}
