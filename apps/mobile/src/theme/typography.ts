// src/theme/typography.ts
// Système typographique du design KADY (handoff Claude Design) :
//   Sora            → titres, wordmark, chiffres (géométrique, fort)
//   Plus Jakarta Sans → corps de texte (humaniste, lisible)
// Familles = noms exposés par @expo-google-fonts (chargés dans app/_layout.tsx).

export const fonts = {
    display: 'Sora_700Bold',          // titres
    displayMed: 'Sora_600SemiBold',
    displayBold: 'Sora_800ExtraBold',
    body: 'PlusJakartaSans_400Regular',
    bodyMed: 'PlusJakartaSans_500Medium',
    bodySemi: 'PlusJakartaSans_600SemiBold',
    bodyBold: 'PlusJakartaSans_700Bold',
} as const;

// Échelle typographique
export const type = {
    hero: { fontFamily: fonts.display, fontSize: 27, letterSpacing: -0.3, lineHeight: 30 },
    wordmark: { fontFamily: fonts.display, fontSize: 21, letterSpacing: 5 },
    h1: { fontFamily: fonts.display, fontSize: 25, letterSpacing: -0.3, lineHeight: 30 },
    h2: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22 },
    body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
    bodyLg: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
    label: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.3 },
    caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
} as const;
