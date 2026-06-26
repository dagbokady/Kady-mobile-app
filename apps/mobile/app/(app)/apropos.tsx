// app/(app)/apropos.tsx — « Comment ça marche » : le principe KADY expliqué en
// 4 étapes (proto KADY Prototype.dc.html L804-833).
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ui';
import { FadeInUp, PressableScale } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { useColors, type Palette } from '../../src/theme/theme';

type Step = { n: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; t: string; d: string };
const STEPS: Step[] = [
    { n: '01', icon: 'people', color: '#ff9d5c', bg: 'rgba(255,157,92,0.14)', t: 'Rejoins un Cercle', d: 'Trouve une communauté qui partage tes passions et entres-y. C’est le seul point d’entrée.' },
    { n: '02', icon: 'chatbubbles', color: '#2f9aa8', bg: 'rgba(47,154,168,0.14)', t: 'Échange en groupe', d: 'Apprends à connaître les membres dans le chat du Cercle, sans pression ni jugement.' },
    { n: '03', icon: 'trending-up', color: '#a78bfa', bg: 'rgba(167,139,250,0.16)', t: 'Fais grandir le lien', d: 'Au fil des échanges, la confiance monte par niveaux avec les personnes qui comptent.' },
    { n: '04', icon: 'heart', color: '#ff6fa8', bg: 'rgba(255,111,168,0.14)', t: 'Passe en privé', d: 'Quand la confiance est là, ouvre une conversation privée — jamais avant.' },
];

export default function Apropos() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);

    return (
        <Screen>
            <ScreenHeader title="Comment ça marche" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 4, paddingBottom: spacing.xxl }}>
                <FadeInUp>
                    <LinearGradient colors={['#ff9d5c', '#d34d7e', '#3a1c5e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
                        <View style={s.heroGlow} />
                        <View style={s.heroChip}>
                            <Ionicons name="sparkles" size={13} color="#fff" />
                            <Text style={s.heroChipTxt}>Le principe KADY</Text>
                        </View>
                        <Text style={s.heroTitle}>On apprend à se connaître avant de se parler.</Text>
                        <Text style={s.heroSub}>KADY remplace le swipe par des vraies communautés. Les liens se construisent, ils ne se déclenchent pas d’un clic.</Text>
                    </LinearGradient>
                </FadeInUp>

                <View style={{ marginTop: 20, gap: 13 }}>
                    {STEPS.map((st, i) => (
                        <FadeInUp key={st.n} delay={80 + i * 70}>
                            <View style={s.step}>
                                <View style={[s.stepIcon, { backgroundColor: st.bg }]}>
                                    <Ionicons name={st.icon} size={22} color={st.color} />
                                </View>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <View style={s.stepHead}>
                                        <Text style={[s.stepN, { color: st.color }]}>{st.n}</Text>
                                        <Text style={s.stepTitle}>{st.t}</Text>
                                    </View>
                                    <Text style={s.stepDesc}>{st.d}</Text>
                                </View>
                            </View>
                        </FadeInUp>
                    ))}
                </View>

                <FadeInUp delay={400}>
                    <View style={s.cta}>
                        <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ctaIcon}>
                            <Ionicons name="compass" size={20} color="#fff" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.ctaTitle}>Prêt à explorer ?</Text>
                            <Text style={s.ctaSub}>Trouve un Cercle qui te ressemble.</Text>
                        </View>
                    </View>
                    <PressableScale onPress={() => router.replace('/(app)/cercles')}>
                        <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ctaBtn}>
                            <Text style={s.ctaBtnTxt}>Découvrir les cercles</Text>
                            <Ionicons name="arrow-forward" size={17} color="#fff" />
                        </LinearGradient>
                    </PressableScale>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    hero: { overflow: 'hidden', padding: 22, paddingTop: 26, borderRadius: 24, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.32, shadowRadius: 30, elevation: 8 },
    heroGlow: { position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.14)' },
    heroChip: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
    heroChipTxt: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' },
    heroTitle: { fontFamily: fonts.display, fontSize: 24, lineHeight: 31, color: '#fff', marginTop: 14 },
    heroSub: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20, color: 'rgba(255,255,255,0.88)', marginTop: 10 },

    step: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.07, shadowRadius: 14, elevation: 2 },
    stepIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    stepHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepN: { fontFamily: fonts.displayBold, fontSize: 13 },
    stepTitle: { fontFamily: fonts.display, fontSize: 15.5, color: c.text },
    stepDesc: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: c.ink(0.6), marginTop: 5 },

    cta: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: 18, backgroundColor: 'rgba(255,106,169,0.08)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.25)' },
    ctaIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', shadowColor: '#e02a73', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 5 },
    ctaTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: c.text },
    ctaSub: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.55), marginTop: 2 },
    ctaBtn: { marginTop: 14, paddingVertical: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 6 },
    ctaBtnTxt: { fontFamily: fonts.display, fontSize: 15, color: '#fff' },
});
