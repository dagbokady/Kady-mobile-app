// src/store/app.ts — état applicatif client (zustand, persisté via AsyncStorage)
// Donne vie au prototype : messages persistés, cercles rejoints/créés,
// notifications, RSVP, photos, carnet, réglages. (Remplacera plus tard l'API.)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export type Msg = { id: string; text: string; time: string; image?: string };
export type CreatedCercle = {
    id: string; nom: string; theme: string; type: 'rencontre' | 'amitie';
    membres: number; max: number;
};
export type Note = { id: string; type: 'note' | 'souvenir' | 'rappel'; contenu: string; date: string };
export type Prefs = {
    lookingFor: 'femmes' | 'hommes' | 'tout';
    ageMin: number;
    ageMax: number;
    mode: 'rencontre' | 'amitie' | 'les_deux';
};

export const DEFAULT_PREFS: Prefs = { lookingFor: 'tout', ageMin: 24, ageMax: 38, mode: 'rencontre' };
export const AGE_FLOOR = 18;
export const AGE_CEIL = 75;

export type Profile = { prenom: string; age: number; ville: string; quartier: string; bio: string; interets: string[] };
export const DEFAULT_PROFILE: Profile = {
    prenom: 'Didier',
    age: 32,
    ville: 'Abidjan',
    quartier: 'Cocody',
    bio: "Passionné de voyages et de basket. J'aime les vraies conversations et découvrir de nouveaux endroits autour d'Abidjan. 🌍",
    interets: ['Voyage', 'Basket', 'Cinéma', 'Cuisine', 'Photographie', 'Entrepreneuriat'],
};

export function nowTime(): string {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Filtre KADY : masque numéros / e-mails / liens tant que la confiance n'est pas établie.
export function filterCoords(t: string): string {
    return t.replace(/(\+?\d[\d\s]{7,}\d)|(\b\S+@\S+\.\S+\b)|(https?:\/\/\S+)/g, '•••');
}

// Sélecteur d'image (galerie), tolérant aux refus / environnements sans module.
export async function pickImage(): Promise<string | null> {
    try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return null;
        const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
        if (res.canceled || !res.assets?.length) return null;
        return res.assets[0].uri;
    } catch {
        return null;
    }
}

const mkMsg = (text: string, image?: string): Msg => ({ id: String(Date.now()) + Math.random().toString(36).slice(2, 6), text: filterCoords(text), time: nowTime(), image });

const SEED_NOTES: Note[] = [
    { id: '1', type: 'souvenir', contenu: "Koffi adore l'attiéké poisson — penser à proposer le maquis de Cocody.", date: "Aujourd'hui" },
    { id: '2', type: 'note', contenu: 'Mariam connaît plein de gospel ivoirien, lui demander des recommandations.', date: 'Hier' },
];

type State = {
    dm: Record<string, Msg[]>;
    cercle: Record<string, Msg[]>;
    sendDM: (id: string, text: string, image?: string) => void;
    sendCercle: (id: string, text: string, image?: string) => void;

    joined: string[];
    created: CreatedCercle[];
    join: (id: string) => void;
    leave: (id: string) => void;
    createCercle: (c: Omit<CreatedCercle, 'id' | 'membres'>) => void;

    rsvp: Record<string, boolean>;
    toggleRsvp: (id: string) => void;

    notifsRead: string[];
    notifsDismissed: string[];
    request: 'pending' | 'accepted' | 'dismissed';
    markAllNotifsRead: () => void;
    dismissNotif: (id: string) => void;
    setRequest: (s: 'accepted' | 'dismissed') => void;

    photos: string[];
    addPhoto: (uri: string) => void;

    notes: Note[];
    addNote: (contenu: string) => void;

    pause: boolean;
    notifsPush: boolean;
    setPause: (b: boolean) => void;
    setNotifsPush: (b: boolean) => void;

    prefs: Prefs;
    setPrefs: (p: Partial<Prefs>) => void;

    profile: Profile;
    setProfile: (p: Partial<Profile>) => void;

    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (t: 'light' | 'dark') => void;

    reset: () => void;
};

export const useStore = create<State>()(
    persist(
        (set) => ({
            dm: {},
            cercle: {},
            sendDM: (id, text, image) => set((s) => ({ dm: { ...s.dm, [id]: [...(s.dm[id] ?? []), mkMsg(text, image)] } })),
            sendCercle: (id, text, image) => set((s) => ({ cercle: { ...s.cercle, [id]: [...(s.cercle[id] ?? []), mkMsg(text, image)] } })),

            joined: [],
            created: [],
            join: (id) => set((s) => (s.joined.includes(id) ? s : { joined: [...s.joined, id] })),
            leave: (id) => set((s) => ({ joined: s.joined.filter((x) => x !== id), created: s.created.filter((c) => c.id !== id) })),
            createCercle: (c) => set((s) => ({ created: [{ ...c, id: 'new-' + Date.now(), membres: 1 }, ...s.created] })),

            rsvp: {},
            toggleRsvp: (id) => set((s) => ({ rsvp: { ...s.rsvp, [id]: !s.rsvp[id] } })),

            notifsRead: [],
            notifsDismissed: [],
            request: 'pending',
            markAllNotifsRead: () => set({ notifsRead: ['ALL'] }),
            dismissNotif: (id) => set((s) => ({ notifsDismissed: [...s.notifsDismissed, id] })),
            setRequest: (st) => set({ request: st }),

            photos: [],
            addPhoto: (uri) => set((s) => ({ photos: [uri, ...s.photos] })),

            notes: SEED_NOTES,
            addNote: (contenu) => set((s) => ({ notes: [{ id: String(Date.now()), type: 'note', contenu, date: 'Maintenant' }, ...s.notes] })),

            pause: false,
            notifsPush: true,
            setPause: (b) => set({ pause: b }),
            setNotifsPush: (b) => set({ notifsPush: b }),

            prefs: DEFAULT_PREFS,
            setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),

            profile: DEFAULT_PROFILE,
            setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

            theme: 'light',
            toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (t) => set({ theme: t }),

            reset: () => set({ dm: {}, cercle: {}, joined: [], created: [], rsvp: {}, notifsRead: [], notifsDismissed: [], request: 'pending', photos: [], notes: SEED_NOTES, pause: false, notifsPush: true, prefs: DEFAULT_PREFS, profile: DEFAULT_PROFILE }),
        }),
        { name: 'kady-store-v1', storage: createJSONStorage(() => AsyncStorage) },
    ),
);

export const isNotifRead = (s: State, id: string) => s.notifsRead.includes('ALL') || s.notifsRead.includes(id);
