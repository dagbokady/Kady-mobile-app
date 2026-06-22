// src/data/interests.ts — catalogue partagé des centres d'intérêt (libellé + emoji
// + couleur). Utilisé à l'affichage du profil et dans l'écran de modification,
// pour que les pastilles restent cohérentes partout.
export type InterestMeta = { label: string; emoji: string; color: string };

export const INTERESTS_CATALOG: InterestMeta[] = [
    { label: 'Voyage', emoji: '✈️', color: '#ff9d5c' },
    { label: 'Basket', emoji: '🏀', color: '#43e08a' },
    { label: 'Cinéma', emoji: '🎬', color: '#8f9dff' },
    { label: 'Cuisine', emoji: '🍲', color: '#ff6fa8' },
    { label: 'Photographie', emoji: '📷', color: '#ff8cbe' },
    { label: 'Entrepreneuriat', emoji: '💼', color: '#8fd0ff' },
    { label: 'Musique', emoji: '🎵', color: '#a78bfa' },
    { label: 'Sport', emoji: '🏃', color: '#2fb8c0' },
    { label: 'Lecture', emoji: '📚', color: '#5a7fd6' },
    { label: 'Mode', emoji: '👗', color: '#ff6fa8' },
    { label: 'Foi', emoji: '🙏', color: '#ffb45c' },
    { label: 'Danse', emoji: '💃', color: '#b07bff' },
    { label: 'Tech', emoji: '💻', color: '#5a7fd6' },
    { label: 'Jeux vidéo', emoji: '🎮', color: '#7be0a0' },
];

const FALLBACK: InterestMeta = { label: '', emoji: '⭐', color: '#ff6aa9' };

export function interestMeta(label: string): InterestMeta {
    return INTERESTS_CATALOG.find((i) => i.label === label) ?? { ...FALLBACK, label };
}
