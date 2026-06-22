// src/data/mock.ts
// Données fictives pour développer le front sans backend.
// À remplacer plus tard par les appels à l'API FastAPI.

export const me = {
    prenom: 'Awa',
    age: 24,
    ville: 'Abidjan',
    bio: "Passionnée de cuisine et de musique. Je cherche des connexions vraies, pas du swipe.",
    genre: 'femme',
    verifie: true,
    grade: 'etoile',
    badges: ['pionnier', 'verifie', 'membre_respectueux'] as const,
    interets: ['Cuisine', 'Musique', 'Voyage', 'Foi'],
    photos: [
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    ],
};

export type Cercle = {
    id: string; nom: string; theme: string; emoji: string;
    membres: number; max: number; niveau: number;
    grade: 'graine' | 'flamme' | 'etoile' | 'diamant' | 'legendaire';
    expireDans: number; actif: boolean; description: string;
    apercu: string[]; // prénoms pour la pile d'avatars
};

export const mesCercles: Cercle[] = [
    { id: 'c1', nom: 'Les Gourmets d\'Abidjan', theme: 'Cuisine', emoji: '🍲', membres: 8, max: 10, niveau: 3, grade: 'etoile', expireDans: 42, actif: true, description: 'On partage nos meilleures adresses et recettes ivoiriennes.', apercu: ['Koffi', 'Mariam', 'Yao', 'Aïcha'] },
    { id: 'c2', nom: 'Mélomanes 225', theme: 'Musique', emoji: '🎵', membres: 6, max: 10, niveau: 2, grade: 'flamme', expireDans: 51, actif: true, description: 'Coupé-décalé, afrobeats, gospel — on vibre ensemble.', apercu: ['Sékou', 'Fatou', 'Ben'] },
    { id: 'c3', nom: 'Globe-trotters CI', theme: 'Voyage', emoji: '✈️', membres: 9, max: 10, niveau: 4, grade: 'diamant', expireDans: 18, actif: true, description: 'Récits de voyage et bons plans pour découvrir le pays.', apercu: ['Inès', 'Marc', 'Lou', 'Awa'] },
];

export const cerclesDecouvrir: Cercle[] = [
    { id: 'd1', nom: 'Entrepreneurs du Plateau', theme: 'Entrepreneuriat', emoji: '💼', membres: 7, max: 10, niveau: 5, grade: 'legendaire', expireDans: 30, actif: true, description: 'Porteurs de projets qui s\'entraident et avancent.', apercu: ['Serge', 'Nadia', 'Kévin'] },
    { id: 'd2', nom: 'Ciné-club Treichville', theme: 'Cinéma', emoji: '🎬', membres: 5, max: 10, niveau: 1, grade: 'graine', expireDans: 58, actif: true, description: 'On débriefe les films, du Nollywood au cinéma d\'auteur.', apercu: ['Léa', 'Dré'] },
    { id: 'd3', nom: 'Foi & Partage', theme: 'Foi', emoji: '🙏', membres: 10, max: 10, niveau: 3, grade: 'etoile', expireDans: 22, actif: true, description: 'Un espace bienveillant pour échanger sur la foi.', apercu: ['Esther', 'Paul', 'Ruth', 'Jean'] },
    { id: 'd4', nom: 'Sport & Bien-être', theme: 'Sport', emoji: '🏃🏾', membres: 8, max: 10, niveau: 2, grade: 'flamme', expireDans: 47, actif: true, description: 'Running, fitness, motivation collective.', apercu: ['Max', 'Bintou', 'Eli'] },
];

export const cercleMessages = [
    { id: 'm1', auteur: 'Koffi', moi: false, contenu: 'Quelqu\'un a déjà testé le maquis vers Cocody ?', heure: '09:12' },
    { id: 'm2', auteur: 'Awa', moi: true, contenu: 'Oui ! L\'attiéké poisson y est excellent 😋', heure: '09:15' },
    { id: 'm3', auteur: 'Mariam', moi: false, contenu: 'Faut qu\'on y aille en groupe un de ces jours', heure: '09:20' },
    { id: 'm4', auteur: 'Yao', moi: false, contenu: 'Je propose samedi prochain, qui est chaud ?', heure: '09:22' },
];

export type Relation = {
    id: string; prenom: string; age: number; mode: 'rencontre' | 'amitie';
    niveau: number; cercle: string; dmOuvert: boolean;
    enLigne?: boolean; grad: readonly [string, string];
};

export const relations: Relation[] = [
    { id: 'awa', prenom: 'Awa', age: 26, mode: 'rencontre', niveau: 2, cercle: 'Voyageurs', dmOuvert: true, enLigne: true, grad: ['#ff9d5c', '#d34d7e'] },
    { id: 'koffi', prenom: 'Koffi', age: 29, mode: 'amitie', niveau: 3, cercle: 'Basket du dimanche', dmOuvert: true, enLigne: true, grad: ['#7be0a0', '#2f9ac2'] },
    { id: 'mariam', prenom: 'Mariam', age: 24, mode: 'rencontre', niveau: 3, cercle: "Cinéphiles d'Abidjan", dmOuvert: true, enLigne: false, grad: ['#b07bff', '#7a4fd6'] },
    { id: 'fatou', prenom: 'Fatou', age: 31, mode: 'amitie', niveau: 4, cercle: 'Brunch & bonnes adresses', dmOuvert: true, enLigne: false, grad: ['#ffb45c', '#d3744d'] },
    { id: 'yann', prenom: 'Yann', age: 27, mode: 'rencontre', niveau: 1, cercle: 'Entrepreneurs 225', dmOuvert: true, enLigne: false, grad: ['#8fd0ff', '#5a7fd6'] },
    { id: 'sophie', prenom: 'Sophie', age: 28, mode: 'amitie', niveau: 2, cercle: 'Entrepreneurs 225', dmOuvert: true, enLigne: false, grad: ['#9aa7d6', '#5b6aa8'] },
];

export const dmMessages = [
    { id: 'd1', moi: false, contenu: 'Salut Awa ! J\'ai adoré ton message dans le Cercle 😊', heure: '10:30' },
    { id: 'd2', moi: true, contenu: 'Merci Koffi ! Toi aussi tu connais bien la cuisine 👀', heure: '10:35' },
    { id: 'd3', moi: false, contenu: 'On se fait ce maquis ce week-end alors ?', heure: '10:40' },
    { id: 'd4', moi: true, contenu: 'Avec plaisir, à très vite !', heure: '10:42' }
];

export const NIVEAUX_RENCONTRE = ['L\'Inconnu', 'La Connaissance', 'L\'Ami(e)', 'La Confiance', 'L\'Intimité'];
export const NIVEAUX_AMITIE = ['L\'Inconnu', 'La Connaissance', 'Le Camarade', 'L\'Ami Proche', 'Les Complices'];