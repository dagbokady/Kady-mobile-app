// src/api/index.ts — fonctions d'appel typées vers l'API KADY.
import { api, setTokens } from './client';

export type Me = {
    id: string; email: string; is_verified: boolean; verification_level: string;
    en_pause: boolean; prenom: string | null; ville: string | null; bio: string | null;
    genre: string | null; centres_interet: string[]; premium: boolean;
};
export type CercleApi = {
    id: string; nom: string; theme: string | null; description: string | null;
    niveau: number; statut: string; capacite_max: number; membres: number;
    expire_le: string | null; rejoint: boolean;
};
export type MembreApi = { user_id: string; prenom: string | null; role: string; grade: string; en_ligne: boolean };
export type RelationApi = {
    id: string; autre_id: string; prenom: string | null; mode: 'rencontre' | 'amitie';
    niveau: number; dm_ouvert: boolean; cercle_origine_id: string;
};
export type ConversationApi = { id: string; autre_id: string; prenom: string | null; niveau: number; relation_id: string };
export type DmApi = { id: string; auteur_id: string; contenu: string; est_filtre: boolean; lu: boolean; created_at: string };
export type CercleMsgApi = { id: string; auteur_id: string; contenu: string; est_filtre: boolean; created_at: string };

type RegisterPayload = {
    email: string; password: string; prenom: string; date_naissance: string;
    genre?: string | null; ville?: string | null; centres_interet?: string[];
};

export const auth = {
    async register(p: RegisterPayload): Promise<void> {
        const { data } = await api.post('/auth/register', p);
        await setTokens(data.access_token, data.refresh_token);
    },
    async login(email: string, password: string): Promise<void> {
        const { data } = await api.post('/auth/login', { email, password });
        await setTokens(data.access_token, data.refresh_token);
    },
    async me(): Promise<Me> {
        return (await api.get('/auth/me')).data;
    },
};

export const meta = {
    villes: async (): Promise<string[]> => {
        try { return (await api.get('/villes')).data; } catch { return []; }
    },
};

export type ChampApi = { champ: string; label: string; revele: boolean; valeur?: string; options?: string[] };
export type DecouverteApi = { points: number; total: number; decouverts: number; champs: ChampApi[] };
export const decouverte = {
    etat: async (cibleId: string): Promise<DecouverteApi> => (await api.get(`/decouverte/${cibleId}`)).data,
    deviner: async (cibleId: string, champ: string, valeur: string): Promise<{ correct: boolean; valeur?: string }> =>
        (await api.post(`/decouverte/${cibleId}/deviner`, null, { params: { champ, valeur } })).data,
};

export const cercles = {
    list: async (q?: string): Promise<CercleApi[]> => (await api.get('/cercles', { params: { q } })).data,
    get: async (id: string): Promise<CercleApi> => (await api.get(`/cercles/${id}`)).data,
    membres: async (id: string): Promise<MembreApi[]> => (await api.get(`/cercles/${id}/membres`)).data,
    join: async (id: string): Promise<void> => { await api.post(`/cercles/${id}/join`); },
    leave: async (id: string): Promise<void> => { await api.post(`/cercles/${id}/leave`); },
    messages: async (id: string): Promise<CercleMsgApi[]> => (await api.get(`/cercles/${id}/messages`)).data,
    envoyer: async (id: string, contenu: string): Promise<CercleMsgApi> =>
        (await api.post(`/cercles/${id}/messages`, { contenu })).data,
    creer: async (p: { nom: string; theme?: string; description?: string; capacite_max?: number }): Promise<CercleApi> =>
        (await api.post('/cercles', p)).data,
};

export const relations = {
    list: async (): Promise<RelationApi[]> => (await api.get('/relations')).data,
    evaluer: async (relation_id: string, moyenne: number): Promise<{ niveau: number; dm_ouvert: boolean; a_evolue: boolean }> =>
        (await api.post('/relations/evaluer', { relation_id, moyenne })).data,
};

export const dm = {
    conversations: async (): Promise<ConversationApi[]> => (await api.get('/dm')).data,
    ouvrir: async (relation_id: string): Promise<ConversationApi> => (await api.post(`/dm/ouvrir/${relation_id}`)).data,
    messages: async (conversation_id: string): Promise<DmApi[]> => (await api.get(`/dm/${conversation_id}/messages`)).data,
    envoyer: async (conversation_id: string, contenu: string): Promise<DmApi> =>
        (await api.post(`/dm/${conversation_id}/messages`, { contenu })).data,
};
