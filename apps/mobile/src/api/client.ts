// src/api/client.ts — client axios KADY : base URL, jetons persistés, refresh auto.
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// EXPO_PUBLIC_API_URL est injecté au build par Expo. Sur appareil physique,
// remplace localhost par l'IP LAN de ta machine (ex. http://192.168.1.20:8000).
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

const ACCESS_KEY = 'kady.access';
const REFRESH_KEY = 'kady.refresh';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function loadTokens(): Promise<boolean> {
    const [a, r] = await Promise.all([AsyncStorage.getItem(ACCESS_KEY), AsyncStorage.getItem(REFRESH_KEY)]);
    accessToken = a;
    refreshToken = r;
    return !!a;
}

export async function setTokens(access: string, refresh: string): Promise<void> {
    accessToken = access;
    refreshToken = refresh;
    await AsyncStorage.multiSet([[ACCESS_KEY, access], [REFRESH_KEY, refresh]]);
}

export async function clearTokens(): Promise<void> {
    accessToken = null;
    refreshToken = null;
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
    if (!refreshToken) return false;
    try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
        await setTokens(data.access_token, data.refresh_token);
        return true;
    } catch {
        await clearTokens();
        return false;
    }
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const code = (error.response?.data as any)?.code;
        if (error.response?.status === 401 && code === 'TOKEN_EXPIRE' && original && !original._retry) {
            original._retry = true;
            refreshing = refreshing ?? doRefresh();
            const ok = await refreshing;
            refreshing = null;
            if (ok) {
                original.headers.Authorization = `Bearer ${accessToken}`;
                return api(original);
            }
        }
        return Promise.reject(error);
    },
);

// Extrait un message lisible d'une erreur API ({detail, code}).
export function apiError(e: unknown): string {
    const ax = e as AxiosError<{ detail?: string }>;
    return ax?.response?.data?.detail ?? 'Une erreur est survenue. Réessaie.';
}
