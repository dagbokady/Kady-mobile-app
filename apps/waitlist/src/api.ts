// src/api.ts — appels à l'API KADY (même backend que l'app mobile).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export type WaitlistInput = {
    prenom: string;
    email: string;
    genre: string | null;
    ville: string | null;
    centres_interet: string[];
    fonctionnalite_preferee: string | null;
    parraine_par: string | null;
};

export type WaitlistResult = {
    code_parrainage: string;
    rang: number | null;
    nb_parrainages: number;
};

export async function getVilles(): Promise<string[]> {
    try {
        const res = await fetch(`${API_URL}/villes`);
        if (!res.ok) return [];
        return (await res.json()) as string[];
    } catch {
        return [];
    }
}

// --- Auth web (même backend que l'app mobile) ---
const TKEY = 'kady.web.tokens';
export const tokens = {
    get: () => { try { return JSON.parse(localStorage.getItem(TKEY) || 'null'); } catch { return null; } },
    set: (a: string, r: string) => localStorage.setItem(TKEY, JSON.stringify({ a, r })),
    clear: () => localStorage.removeItem(TKEY),
};

async function post(path: string, body: unknown) {
    const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? 'Erreur. Réessaie.');
    return data;
}

export type Me = { prenom: string | null; email: string; premium: boolean };

export const auth = {
    async login(email: string, password: string): Promise<void> {
        const d = await post('/auth/login', { email, password });
        tokens.set(d.access_token, d.refresh_token);
    },
    async register(p: { email: string; password: string; prenom: string; date_naissance: string; genre: string | null; ville: string | null; centres_interet: string[] }): Promise<void> {
        const d = await post('/auth/register', p);
        tokens.set(d.access_token, d.refresh_token);
    },
    async me(): Promise<Me> {
        const t = tokens.get();
        const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${t?.a}` } });
        if (!res.ok) throw new Error('Session expirée');
        return res.json();
    },
};

export async function inscrireWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
    const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.detail ?? 'Inscription impossible. Réessaie.');
    }
    return data as WaitlistResult;
}
