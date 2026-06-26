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

    // Découverte de profil : infos révélées (par membre → set de champs) + points gagnés.
    disc: Record<string, string[]>;
    discPoints: Record<string, number>;
    revealDisc: (memberId: string, field: string) => void;

    // Niveau de relation par membre (override sur la valeur seed du mock).
    niveaux: Record<string, number>;
    setNiveau: (memberId: string, n: number) => void;

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

            disc: { awa: ['ville', 'musique'], koffi: ['ville', 'sport', 'film'], mariam: ['musique'], fatou: [], yann: ['job'], sophie: [] },
            discPoints: { awa: 20, koffi: 30, mariam: 10, fatou: 0, yann: 10, sophie: 0 },
            revealDisc: (memberId, field) => set((s) => {
                const cur = s.disc[memberId] ?? [];
                if (cur.includes(field)) return s;
                return {
                    disc: { ...s.disc, [memberId]: [...cur, field] },
                    discPoints: { ...s.discPoints, [memberId]: (s.discPoints[memberId] ?? 0) + 10 },
                };
            }),

            niveaux: {},
            setNiveau: (memberId, n) => set((s) => ({ niveaux: { ...s.niveaux, [memberId]: n } })),

            prefs: DEFAULT_PREFS,
            setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),

            profile: DEFAULT_PROFILE,
            setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

            theme: 'light',
            toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (t) => set({ theme: t }),

            reset: () => set({ dm: {}, cercle: {}, joined: [], created: [], rsvp: {}, notifsRead: [], notifsDismissed: [], request: 'pending', photos: [], notes: SEED_NOTES, pause: false, notifsPush: true, niveaux: {}, prefs: DEFAULT_PREFS, profile: DEFAULT_PROFILE }),
        }),
        { name: 'kady-store-v1', storage: createJSONStorage(() => AsyncStorage) },
    ),
);

export const isNotifRead = (s: State, id: string) => s.notifsRead.includes('ALL') || s.notifsRead.includes(id);

// Toast léger, non persisté (transitoire). Piloté par n'importe quel écran via
// useToast.getState().show('…') ; auto-effacement après ~2,2 s.
type ToastState = { msg: string | null; show: (m: string) => void; hide: () => void };
let toastTimer: ReturnType<typeof setTimeout> | undefined;
export const useToast = create<ToastState>((set) => ({
    msg: null,
    show: (m) => {
        set({ msg: m });
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ msg: null }), 2200);
    },
    hide: () => set({ msg: null }),
}));
