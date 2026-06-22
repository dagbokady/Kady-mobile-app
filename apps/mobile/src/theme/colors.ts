// src/theme/colors.ts
// Système de couleurs KADY (handoff Claude Design) :
// violet → rose vif sur fond blanc lavande, encre profonde #211633.

export const colors = {
    // Marque (magenta → rose)
    wine: '#d6286e',
    wineLight: '#ff6aa9',
    wine800: '#b01b5c',
    wine900: '#F4F1FA',
    ink: '#FFFFFF',          // fond principal

    rose: '#d6286e',         // accent principal (magenta)
    roseDeep: '#b01b5c',     // état pressé / texte accent

    // Palette d'accents (dégradés du design)
    coral: '#ff9d5c',
    amber: '#ffb45c',
    gold: '#ffd27a',
    teal: '#2f9aa8',
    sky: '#5a7fd6',
    violet: '#a463ff',
    pink: '#ff4d97',         // notifications / badges
    green: '#1f9d57',

    // Surfaces
    card: '#FFFFFF',
    cardLight: '#F4F1FA',

    // Texte (encre #211633)
    cream: '#211633',        // texte principal
    white: '#FFFFFF',

    textOnDark: '#211633',
    textOnLight: '#211633',
    muted: '#6E6A7D',        // texte secondaire (≈ ink 0.6)
    dim: '#A8A2B4',          // texte tertiaire / placeholder (≈ ink 0.42)

    // Bordures & séparateurs
    border: 'rgba(33,22,51,0.08)',
    borderRose: 'rgba(214,40,110,0.14)',
    overlay: 'rgba(20,12,40,0.50)',

    // Utilitaires
    whatsapp: '#25D366',
    success: '#43e08a',
    danger: '#dc2626',
} as const;

export const gradients = {
    rose: ['#ff6aa9', '#e02a73'] as const,                  // CTA principal
    me: ['#ff6aa9', '#e02a73'] as const,                    // bulle "moi"
    royal: ['#ff6aa9', '#e02a73'] as const,                 // premium
    header: ['#ff6aa9', '#e02a73'] as const,
    sunrise: ['#ff9d5c', '#d34d7e'] as const,               // chaud
    ocean: ['#7be0a0', '#2f9ac2'] as const,                 // frais
    wine: ['#ffffff', '#faf7fe', '#f6f2fb'] as const,       // fond écran (blanc lavande)
    card: ['#ffffff', '#faf7fe'] as const,
    glow: ['rgba(255,106,169,0.18)', 'rgba(255,106,169,0)'] as const,
} as const;

/* ---------- Couleurs par thème de Cercle ---------- */
type ThemeColor = { from: string; to: string; solid: string; soft: string };

export const themeColors: Record<string, ThemeColor> = {
    Cuisine: { from: '#ff9d5c', to: '#d34d7e', solid: '#d34d7e', soft: '#FDEDE7' },
    Musique: { from: '#b07bff', to: '#7a4fd6', solid: '#7a4fd6', soft: '#F1EBFD' },
    Voyage: { from: '#7fe0d0', to: '#2f9aa8', solid: '#2f9aa8', soft: '#E4F6F4' },
    Entrepreneuriat: { from: '#ffd27a', to: '#ff9d5c', solid: '#c2410c', soft: '#FEF3E2' },
    'Cinéma': { from: '#9aa7d6', to: '#5b6aa8', solid: '#5b6aa8', soft: '#EEF0F8' },
    Foi: { from: '#7be0a0', to: '#2f9ac2', solid: '#1f9d57', soft: '#E6F7EE' },
    Sport: { from: '#8fd0ff', to: '#5a7fd6', solid: '#5a7fd6', soft: '#E9F2FE' },
    default: { from: '#ff6aa9', to: '#e02a73', solid: '#d6286e', soft: '#FDE9F1' },
};

export function themeOf(key?: string): ThemeColor {
    return (key && themeColors[key]) || themeColors.default;
}

/* ---------- Couleur dérivée d'un nom (avatars sans photo) ---------- */
const avatarPalette = ['#d34d7e', '#7a4fd6', '#2f9aa8', '#ff9d5c', '#5a7fd6', '#1f9d57', '#a463ff'] as const;

export function colorForName(name = '?'): string {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return avatarPalette[Math.abs(h) % avatarPalette.length];
}

export function gradientForName(name = '?'): readonly [string, string] {
    const base = colorForName(name);
    const i = avatarPalette.indexOf(base as any);
    const next = avatarPalette[(i + 2) % avatarPalette.length];
    return [base, next] as const;
}

export type AppColors = typeof colors;
