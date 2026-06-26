// src/components/CoverCard.tsx — carte de Cercle à couverture pleine pour Découvrir :
// dégradé du thème + grande icône estompée + label thème + titre superposé,
// ligne membres + CTA Rejoindre (états : rejoindre / rejoint / complet).
// Dimensions mises à l'échelle de la largeur d'écran (cf. theme/responsive).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { themeOf } from '../theme/colors';
import { useColors } from '../theme/theme';
import { useScale } from '../theme/responsive';

const THEME_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
    Cuisine: 'restaurant', Musique: 'musical-notes', Voyage: 'airplane',
    Entrepreneuriat: 'briefcase', 'Cinéma': 'film', Foi: 'heart', Sport: 'basketball',
};
export function iconForTheme(theme?: string): keyof typeof Ionicons.glyphMap {
    return (theme && THEME_ICON[theme]) || 'people';
}

type Props = {
    nom: string;
    theme: string;
    membres: number;
    max: number;
    joined?: boolean;
    onOpen?: () => void;
    onJoin?: () => void;
};

export default function CoverCard({ nom, theme, membres, max, joined, onOpen, onJoin }: Props) {
    const c = useColors();
    const { s, ms } = useScale();
    const t = themeOf(theme);
    const full = membres >= max && !joined;

    return (
        <View style={[st.card, { borderRadius: s(26), backgroundColor: c.card, borderColor: c.border, shadowColor: t.solid, shadowRadius: s(18) }]}>
            <Pressable onPress={onOpen}>
                <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.cover, { height: s(172) }]}>
                    <Ionicons name={iconForTheme(theme)} size={s(158)} color="rgba(255,255,255,0.14)" style={[st.coverIcon, { right: s(-18), bottom: s(-26) }]} />
                    <LinearGradient colors={['rgba(12,6,24,0.04)', 'rgba(12,6,24,0.72)']} style={StyleSheet.absoluteFill} />
                    <View style={[st.coverText, { paddingHorizontal: s(18), paddingBottom: s(15) }]}>
                        <Text style={[st.theme, { fontSize: ms(11) }]}>{theme.toUpperCase()}</Text>
                        <Text style={[st.nom, { fontSize: ms(21), lineHeight: ms(25) }]} numberOfLines={2}>{nom}</Text>
                    </View>
                </LinearGradient>
            </Pressable>
            <View style={[st.foot, { paddingVertical: s(14), paddingHorizontal: s(16) }]}>
                <View style={st.membres}>
                    <Ionicons name="people" size={s(16)} color={c.ink(0.5)} />
                    <Text style={[st.membresTxt, { color: c.ink(0.68), fontSize: ms(13.5) }]}>{membres}/{max} membres</Text>
                </View>
                {joined ? (
                    <View style={[st.cta, { paddingVertical: s(9), paddingHorizontal: s(14), backgroundColor: t.solid + '1e', borderColor: t.solid + '40' }]}>
                        <Ionicons name="checkmark" size={s(14)} color={t.solid} />
                        <Text style={[st.ctaTxt, { color: t.solid, fontSize: ms(12.5) }]}>Rejoint</Text>
                    </View>
                ) : full ? (
                    <View style={[st.cta, { paddingVertical: s(9), paddingHorizontal: s(14), backgroundColor: c.field, borderColor: c.border }]}>
                        <Ionicons name="lock-closed" size={s(13)} color={c.ink(0.45)} />
                        <Text style={[st.ctaTxt, { color: c.ink(0.45), fontSize: ms(12.5) }]}>Complet</Text>
                    </View>
                ) : (
                    <Pressable onPress={onJoin}>
                        <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.cta, { paddingVertical: s(9), paddingHorizontal: s(14), borderColor: 'transparent' }]}>
                            <Ionicons name="add" size={s(15)} color="#fff" />
                            <Text style={[st.ctaTxt, { color: '#fff', fontSize: ms(12.5) }]}>Rejoindre</Text>
                        </LinearGradient>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const st = StyleSheet.create({
    card: { borderWidth: 1, overflow: 'hidden', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, elevation: 4 },
    cover: { overflow: 'hidden', justifyContent: 'flex-end' },
    coverIcon: { position: 'absolute', transform: [{ rotate: '-10deg' }] },
    coverText: {},
    theme: { fontFamily: fonts.bodyBold, letterSpacing: 0.5, color: 'rgba(255,255,255,0.82)' },
    nom: { fontFamily: fonts.display, color: '#fff', marginTop: 3, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 10 },
    foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    membres: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
    membresTxt: { fontFamily: fonts.bodyBold },
    cta: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, borderWidth: 1 },
    ctaTxt: { fontFamily: fonts.bodyBold },
});
