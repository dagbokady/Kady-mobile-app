// src/store/auth.ts — session réelle adossée à l'API (jetons persistés).
import { create } from 'zustand';
import { auth as authApi, type Me } from '../api';
import { clearTokens, loadTokens } from '../api/client';

type Status = 'loading' | 'authed' | 'guest';

type AuthState = {
    status: Status;
    me: Me | null;
    bootstrap: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (p: {
        email: string; password: string; prenom: string; date_naissance: string;
        genre?: string | null; ville?: string | null; centres_interet?: string[];
    }) => Promise<void>;
    refreshMe: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
    status: 'loading',
    me: null,

    // Au démarrage : charge les jetons, valide la session via /auth/me.
    bootstrap: async () => {
        const hasToken = await loadTokens();
        if (!hasToken) return set({ status: 'guest', me: null });
        try {
            const me = await authApi.me();
            set({ status: 'authed', me });
        } catch {
            await clearTokens();
            set({ status: 'guest', me: null });
        }
    },

    login: async (email, password) => {
        await authApi.login(email, password);
        const me = await authApi.me();
        set({ status: 'authed', me });
    },

    register: async (p) => {
        await authApi.register(p);
        const me = await authApi.me();
        set({ status: 'authed', me });
    },

    refreshMe: async () => {
        const me = await authApi.me();
        set({ me });
    },

    logout: async () => {
        await clearTokens();
        set({ status: 'guest', me: null });
    },
}));
