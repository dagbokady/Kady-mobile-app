// src/theme/spacing.ts

export const spacing = {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
} as const;

export const radius = {
    sm: 10, md: 16, lg: 22, pill: 100, round: 999,
} as const;

export const shadow = {
    // Halo rose pour les CTA
    glow: {
        shadowColor: '#B8304A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
        elevation: 10,
    },
    // Ombre douce pour les cartes (thème light)
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
        elevation: 3,
    },
    // Ombre plus marquée pour éléments flottants
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.10,
        shadowRadius: 24,
        elevation: 6,
    },
} as const;
