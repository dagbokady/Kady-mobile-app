// app/(app)/decouvrir.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../src/components/Screen';
import { GradeChip, Pill, AvatarStack } from '../../src/components/ui';
import GradientButton from '../../src/components/GradientButton';
import { FadeInUp, PressableScale, animateLayout } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { colors, themeOf } from '../../src/theme/colors';
import { useColors, type Palette } from '../../src/theme/theme';
import { cerclesDecouvrir } from '../../src/data/mock';

const FILTRES = ['Populaires', 'Proches', 'Actifs', 'Nouveaux'];

export default function Decouvrir() {
    const router = useRouter();
    const pal = useColors();
    const s = makeStyles(pal);
    const [filtre, setFiltre] = useState('Populaires');
    const [ouvert, setOuvert] = useState<string | null>(null);

    const toggle = (id: string) => {
        animateLayout();
        setOuvert(ouvert === id ? null : id);
    };

    const Reason = ({ icon, txt, color }: { icon: any; txt: string; color: string }) => (
        <View style={[s.reason, { backgroundColor: color + '16' }]}>
            <Ionicons name={icon} size={13} color={color} />
            <Text style={[s.reasonTxt, { color }]}>{txt}</Text>
        </View>
    );

    return (
        <Screen>
            <FadeInUp>
                <Text style={s.h1}>Découvrir</Text>
                <Text style={s.intro}>Trouve un Cercle qui te ressemble. Lis la salle d'accueil avant de rejoindre.</Text>
            </FadeInUp>

            <FadeInUp delay={60}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtres}>
                    {FILTRES.map((f) => <Pill key={f} label={f} active={filtre === f} onPress={() => setFiltre(f)} />)}
                </ScrollView>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.md }}>
                {cerclesDecouvrir.map((c, idx) => {
                    const open = ouvert === c.id;
                    const t = themeOf(c.theme);
                    return (
                        <FadeInUp key={c.id} delay={100 + idx * 70}>
                            <View style={[s.card, { shadowColor: t.solid }]}>
                                <View style={[s.accent, { backgroundColor: t.solid }]} />
                                <PressableScale onPress={() => toggle(c.id)} style={s.row} scaleTo={0.99}>
                                    <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.emoji}>
                                        <Text style={{ fontSize: 26 }}>{c.emoji}</Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.nom} numberOfLines={1}>{c.nom}</Text>
                                        <View style={s.meta}>
                                            <GradeChip grade={c.grade} />
                                            <Text style={[s.theme, { color: t.solid }]}>{c.theme}</Text>
                                        </View>
                                    </View>
                                    <View style={[s.chevron, open && { backgroundColor: t.soft }]}>
                                        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={open ? t.solid : pal.ink(0.42)} />
                                    </View>
                                </PressableScale>

                                <View style={s.previewRow}>
                                    <AvatarStack names={c.apercu} extra={Math.max(0, c.membres - c.apercu.length)} size={24} />
                                    <Text style={s.previewTxt}>{c.membres}/{c.max} membres</Text>
                                </View>

                                {open && (
                                    <View style={s.salle}>
                                        <Text style={s.desc}>{c.description}</Text>

                                        <Text style={s.why}>Pourquoi ce Cercle ?</Text>
                                        <View style={s.whyRow}>
                                            <Reason icon="heart" txt="2 intérêts en commun" color={colors.pink} />
                                            <Reason icon="location" txt="Proche de toi" color={colors.teal} />
                                            <Reason icon="flash" txt="Très actif" color={colors.amber} />
                                        </View>

                                        <View style={[s.rules, { backgroundColor: t.soft }]}>
                                            <Text style={[s.ruleTitle, { color: t.solid }]}>Règles du Cercle</Text>
                                            <Text style={s.rule}>· Respect et bienveillance avant tout</Text>
                                            <Text style={s.rule}>· Pas de coordonnées partagées en public</Text>
                                            <Text style={s.rule}>· On reste dans le thème</Text>
                                        </View>

                                        <GradientButton label="Rejoindre ce Cercle" onPress={() => router.push(`/(app)/cercles/${c.id}`)} />
                                    </View>
                                )}
                            </View>
                        </FadeInUp>
                    );
                })}
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    h1: { fontFamily: fonts.display, fontSize: 32, color: c.text, marginTop: spacing.md },
    intro: { fontFamily: fonts.body, fontSize: 14, color: c.ink(0.6), marginTop: 4, marginBottom: spacing.md },
    filtres: { gap: 9, paddingBottom: spacing.md },
    card: {
        backgroundColor: c.card, borderRadius: radius.lg, padding: spacing.md, overflow: 'hidden',
        borderWidth: 0.5, borderColor: c.border,
        shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 4,
    },
    accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    emoji: {
        width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
    },
    nom: { fontFamily: fonts.displayMed, fontSize: 17, color: c.text, marginBottom: 7 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    theme: { fontFamily: fonts.bodySemi, fontSize: 12 },
    chevron: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    previewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
    previewTxt: { fontFamily: fonts.bodyMed, fontSize: 12, color: c.ink(0.6) },
    salle: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 0.5, borderTopColor: c.border, gap: spacing.md },
    desc: { fontFamily: fonts.body, fontSize: 14, color: c.text, lineHeight: 21 },
    why: { fontFamily: fonts.bodySemi, fontSize: 12, color: c.ink(0.6), letterSpacing: 1, textTransform: 'uppercase' },
    whyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    reason: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 11 },
    reasonTxt: { fontFamily: fonts.bodyMed, fontSize: 12 },
    rules: { borderRadius: radius.md, padding: spacing.md, gap: 4 },
    ruleTitle: { fontFamily: fonts.bodySemi, fontSize: 13, marginBottom: 4 },
    rule: { fontFamily: fonts.body, fontSize: 13, color: c.ink(0.6), lineHeight: 20 },
});
