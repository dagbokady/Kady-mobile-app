// src/theme/theme.ts — palettes claire/sombre + hooks de thème.
// La marque (magenta) et les dégradés de catégorie restent identiques dans les
// deux modes ; seules les surfaces / textes / bordures changent.
import { useStore } from '../store/app';

export type Palette = {
    mode: 'light' | 'dark';
    bg: readonly [string, string, string];   // fond d'écran (Screen)
    auraTop: string;
    auraBottom: string;
    card: string;        // surface principale
    card2: string;       // surface secondaire (cardLight)
    field: string;       // fond des champs / pastilles neutres
    text: string;        // texte principal
    border: string;      // filets / séparateurs
    chatBg: string;      // fond des conversations
    dot: string;         // motif pointillé du chat
    outBubble: readonly [string, string]; // bulle "moi"
    outText: string;
    inBubble: string;    // bulle entrante
    glassHeader: string; // app-bar translucide claire
    ink: (a?: number) => string; // gris thématique (texte/bordures atténués)
    white: string;       // blanc pur (texte/icône sur dégradé — inchangé)
    brand: readonly [string, string]; // dégradé magenta
    accent: string;
    accentDeep: string;
};

const inkLight = (a = 1) => `rgba(33,22,51,${a})`;
const inkDark = (a = 1) => `rgba(244,238,248,${a})`;

export const lightPalette: Palette = {
    mode: 'light',
    bg: ['#ffffff', '#faf7fe', '#f6f2fb'],
    auraTop: 'rgba(255,120,175,0.16)',
    auraBottom: 'rgba(255,130,190,0.12)',
    card: '#FFFFFF',
    card2: '#F4F1FA',
    field: 'rgba(33,22,51,0.04)',
    text: '#211633',
    border: 'rgba(33,22,51,0.08)',
    chatBg: '#f4eefb',
    dot: 'rgba(214,40,110,0.05)',
    outBubble: ['#efe3ff', '#f7e6f3'],
    outText: '#2a1840',
    inBubble: '#ffffff',
    glassHeader: 'rgba(255,255,255,0.97)',
    ink: inkLight,
    white: '#ffffff',
    brand: ['#ff6aa9', '#e02a73'],
    accent: '#d6286e',
    accentDeep: '#b01b5c',
};

export const darkPalette: Palette = {
    mode: 'dark',
    bg: ['#140f1e', '#171122', '#1b1428'],
    auraTop: 'rgba(224,42,115,0.20)',
    auraBottom: 'rgba(164,99,255,0.14)',
    card: '#221a31',
    card2: '#2b2140',
    field: 'rgba(255,255,255,0.06)',
    text: '#f4eef8',
    border: 'rgba(255,255,255,0.10)',
    chatBg: '#15101f',
    dot: 'rgba(255,255,255,0.05)',
    outBubble: ['#52306a', '#5e3350'],
    outText: '#fbe9f4',
    inBubble: '#251b34',
    glassHeader: 'rgba(30,22,44,0.96)',
    ink: inkDark,
    white: '#ffffff',
    brand: ['#ff6aa9', '#e02a73'],
    accent: '#ff7ab0',
    accentDeep: '#ff9dc4',
};

export function useColors(): Palette {
    return useStore((s) => s.theme) === 'dark' ? darkPalette : lightPalette;
}

export function useTheme() {
    const mode = useStore((s) => s.theme);
    const toggle = useStore((s) => s.toggleTheme);
    return { mode, dark: mode === 'dark', toggle };
}
