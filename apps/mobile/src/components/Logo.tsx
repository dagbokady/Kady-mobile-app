// src/components/Logo.tsx
// Symbole KADY : deux anneaux entrelacés (le lien, l'infini).

import React from 'react';
import { Image, ImageStyle } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

type Props = { size?: number; color?: string };

export default function Logo({ size = 96, color = colors.rose }: Props) {
    const sw = size * 0.11;
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            <Rect
                x={20} y={30} width={40} height={40} rx={13}
                fill="none" stroke={color} strokeWidth={sw}
                transform="rotate(45 40 50)"
            />
            <Rect
                x={40} y={30} width={40} height={40} rx={13}
                fill="none" stroke={color} strokeWidth={sw}
                transform="rotate(45 60 50)"
            />
        </Svg>
    );
}

export function LogoImage({ size = 96, tint, style }: { size?: number; tint?: string; style?: ImageStyle }) {
    return (
        <Image
            source={{ uri: '' }}
            style={[{ width: size, height: size, resizeMode: 'contain' }, tint ? { tintColor: tint } : null, style]}
        />
    );
}
