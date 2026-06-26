// src/components/CoverCard.tsx — carte de Cercle pour Découvrir.
// Parti pris design : un Cercle est un cercle de personnes (cf. les deux anneaux du
// logo KADY). La disponibilité se LIT comme des sièges — avatars occupés + sièges
// vides en pointillés — plutôt qu'un « 7/10 » abstrait. La cover porte le grade du
// Cercle et son compte à rebours (règle des Cercles à durée limitée).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { themeOf, colorForName } from '../theme/colors';
import { useColors } from '../theme/theme';
import { useScale } from '../theme/responsive';

const THEME_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
    Cuisine: 'restaurant', Musique: 'musical-notes', Voyage: 'airplane',
    Entrepreneuriat: 'briefcase', 'Cinéma': 'film', Foi: 'heart', Sport: 'basketball',
};
export function iconForTheme(theme?: string): keyof typeof Ionicons.glyphMap {
    return (theme && THEME_ICON[theme]) || 'people';
}

const GRADE: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
    graine: { label: 'Graine', icon: 'leaf' },
    flamme: { label: 'Flamme', icon: 'flame' },
    etoile: { label: 'Étoile', icon: 'star' },
    diamant: { label: 'Diamant', icon: 'diamond' },
    legendaire: { label: 'Légendaire', icon: 'sparkles' },
};

type Props = {
    nom: string;
    theme: string;
    membres: number;
    max: number;
    grade?: keyof typeof GRADE;
    expireDans?: number;
    apercu?: string[];
    joined?: boolean;
    onOpen?: () => void;
    onJoin?: () => void;
};

export default function CoverCard({
    nom, theme, membres, max, grade, expireDans, apercu = [], joined, onOpen, onJoin,
}: Props) {
    const c = useColors();
    const { s, ms } = useScale();
    const t = themeOf(theme);
    const full = membres >= max && !joined;
    const places = Math.max(0, max - membres);
    const g = grade ? GRADE[grade] : null;
    const urgent = typeof expireDans === 'number' && expireDans <= 20;

    // Sièges : on montre jusqu'à 6 places (avatars occupés puis sièges vides).
    const SEATS = Math.min(max, 6);
    const seatSize = s(26);

    return (
        <View style={[st.card, { borderRadius: s(26), backgroundColor: c.card, borderColor: c.border, shadowColor: t.solid, shadowRadius: s(18) }]}>
            <Pressable onPress={onOpen}>
                <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.cover, { height: s(176) }]}>
                    <Ionicons name={iconForTheme(theme)} size={s(150)} color="rgba(255,255,255,0.13)" style={[st.coverIcon, { right: s(-16), bottom: s(-22) }]} />
                    <LinearGradient colors={['rgba(12,6,24,0.02)', 'rgba(12,6,24,0.74)']} style={StyleSheet.absoluteFill} />

                    {/* Bandeau haut : grade + compte à rebours */}
                    <View style={[st.coverTop, { paddingHorizontal: s(14), paddingTop: s(13) }]}>
                        {g && (
                            <View style={st.gradeChip}>
                                <Ionicons name={g.icon} size={ms(12)} color="#fff" />
                                <Text style={[st.gradeTxt, { fontSize: ms(11) }]}>{g.label}</Text>
                            </View>
                        )}
                        {typeof expireDans === 'number' && (
                            <View style={[st.timeChip, urgent && st.timeChipUrgent]}>
                                <Ionicons name="time-outline" size={ms(11)} color={urgent ? '#fff' : 'rgba(255,255,255,0.92)'} />
                                <Text style={[st.timeTxt, { fontSize: ms(10.5) }]}>{expireDans} j</Text>
                            </View>
                        )}
                    </View>

                    <View style={[st.coverText, { paddingHorizontal: s(16), paddingBottom: s(15) }]}>
                        <Text style={[st.theme, { fontSize: ms(11) }]}>{theme.toUpperCase()}</Text>
                        <Text style={[st.nom, { fontSize: ms(21), lineHeight: ms(25) }]} numberOfLines={2}>{nom}</Text>
                    </View>
                </LinearGradient>
            </Pressable>

            <View style={[st.foot, { paddingVertical: s(13), paddingHorizontal: s(15) }]}>
                {/* Signature : les sièges du Cercle */}
                <View style={st.seatsWrap}>
                    <View style={[st.seats, { height: seatSize, width: (SEATS - 1) * (seatSize * 0.66) + seatSize }]}>
                        {Array.from({ length: SEATS }).map((_, i) => {
                            const name = apercu[i];
                            const occupied = i < membres;
                            const left = i * (seatSize * 0.66);
                            if (occupied) {
                                const tint = name ? colorForName(name) : t.solid;
                                return (
                                    <View key={i} style={[st.seat, { width: seatSize, height: seatSize, borderRadius: seatSize / 2, left, backgroundColor: tint, borderColor: c.card, zIndex: SEATS - i }]}>
                                        <Text style={[st.seatLetter, { fontSize: seatSize * 0.42 }]}>{name ? name.charAt(0).toUpperCase() : '•'}</Text>
                                    </View>
                                );
                            }
                            return (
                                <View key={i} style={[st.seatEmpty, { width: seatSize, height: seatSize, borderRadius: seatSize / 2, left, borderColor: c.ink(0.22), backgroundColor: c.card }]} />
                            );
                        })}
                    </View>
                    <Text style={[st.seatsLabel, { color: c.ink(0.6), fontSize: ms(12) }]}>
                        {full ? 'Cercle complet' : `${places} ${places > 1 ? 'places' : 'place'}`}
                    </Text>
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
                        <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.cta, { paddingVertical: s(9), paddingHorizontal: s(15), borderColor: 'transparent' }]}>
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
    cover: { overflow: 'hidden', justifyContent: 'space-between' },
    coverIcon: { position: 'absolute', transform: [{ rotate: '-10deg' }] },
    coverTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    gradeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.28)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.3)' },
    gradeTxt: { fontFamily: fonts.bodyBold, color: '#fff', letterSpacing: 0.2 },
    timeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.28)' },
    timeChipUrgent: { backgroundColor: 'rgba(224,42,73,0.85)' },
    timeTxt: { fontFamily: fonts.bodyBold, color: '#fff' },
    coverText: {},
    theme: { fontFamily: fonts.bodyBold, letterSpacing: 0.5, color: 'rgba(255,255,255,0.82)' },
    nom: { fontFamily: fonts.display, color: '#fff', marginTop: 3, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 10 },

    foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    seatsWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0, flexShrink: 1 },
    seats: { position: 'relative', alignSelf: 'center' },
    seat: { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    seatLetter: { fontFamily: fonts.bodyBold, color: '#fff' },
    seatEmpty: { position: 'absolute', top: 0, borderWidth: 1.5, borderStyle: 'dashed' },
    seatsLabel: { fontFamily: fonts.bodyBold },

    cta: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, borderWidth: 1 },
    ctaTxt: { fontFamily: fonts.bodyBold },
});
