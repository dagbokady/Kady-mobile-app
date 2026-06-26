// src/theme/responsive.ts — mise à l'échelle proportionnelle à la largeur de l'écran.
// La maquette KADY est dessinée sur une largeur de référence de 375px (cadre iPhone).
// Sur un appareil plus large (iPhone 12 Pro = 390, Plus/Max = 428+), on agrandit
// chaque dimension dans la même proportion pour « respecter le format de la maquette »
// au lieu de laisser le contenu paraître petit.
import { Dimensions, PixelRatio } from 'react-native';

// Largeur de référence de la maquette (cadre du prototype).
export const BASE_WIDTH = 375;

// Largeur courante de la fenêtre (recalculée à l'import ; suffisant pour le
// dimensionnement de styles statiques, complétée par useScale() pour le runtime).
const { width: SCREEN_W } = Dimensions.get('window');

// Facteur d'échelle brut, borné pour éviter des tailles extrêmes sur tablette.
function factor(width: number): number {
    return Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.35);
}

// `s(n)` — mise à l'échelle pleine (largeurs, hauteurs, paddings, rayons).
export function s(size: number, width: number = SCREEN_W): number {
    return Math.round(PixelRatio.roundToNearestPixel(size * factor(width)));
}

// `ms(n, f)` — mise à l'échelle modérée (typographie) : on n'applique qu'une
// fraction `f` du facteur pour que le texte grandisse en douceur (défaut 0.5).
export function ms(size: number, factorWeight = 0.5, width: number = SCREEN_W): number {
    const f = factor(width);
    return Math.round(PixelRatio.roundToNearestPixel(size + (size * f - size) * factorWeight));
}

// Hook runtime : suit les changements (rotation, fold). Renvoie des fonctions
// liées à la largeur courante pour les composants qui se re-rendent.
import { useWindowDimensions } from 'react-native';
export function useScale() {
    const { width } = useWindowDimensions();
    return {
        width,
        scale: factor(width),
        s: (n: number) => s(n, width),
        ms: (n: number, fw = 0.5) => ms(n, fw, width),
    };
}
