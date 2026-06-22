// app/(app)/accueil.tsx — Accueil (handoff "KADY Home.dc.html")
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Circle, Path } from 'react-native-svg';
import Screen from '../../src/components/Screen';
import { FadeInUp, PressableScale, AnimatedBar } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { useColors, type Palette } from '../../src/theme/theme';
import { useStore } from '../../src/store/app';

const PAD = 22;
const BRAND = ['#ff6aa9', '#e02a73'] as const;

type Slide = { grad: string[]; chip?: string; title: string; sub: string };
const SLIDES: Slide[] = [
    { grad: ['#ff9d5c', '#d34d7e', '#3a1c5e'], chip: 'Communauté', title: 'Les cercles, au cœur de KADY', sub: 'Rejoignez des communautés, partagez et créez des liens authentiques.' },
    { grad: ['#7fe0d0', '#2f9aa8', '#1d3f66'], title: 'Voyagez ensemble, créez des souvenirs', sub: 'Découvrez des cercles de voyageurs près de chez vous.' },
    { grad: ['#7be0a0', '#2f9ac2', '#2a2c66'], title: 'Partagez vos passions sportives', sub: 'Bougez, progressez et rencontrez des partenaires motivés.' },
    { grad: ['#b07bff', '#7a4fd6', '#2a1c5e'], title: 'Une communauté bienveillante', sub: 'Des échanges respectueux, des rencontres qui comptent.' },
];

type Activity = { grad: string[]; icon: keyof typeof Ionicons.glyphMap; text: string; strong: string; time: string; stack?: string[]; extra?: string; single?: string[] };
const ACTIVITIES: Activity[] = [
    { grad: ['#7fe0d0', '#2f9aa8', '#1d3f66'], icon: 'chatbubble', text: 'Nouveau message dans ', strong: 'Voyageurs', time: 'Il y a 5 min', stack: ['#ff9d5c', '#7fe0d0'], extra: '+7' },
    { grad: ['#ff9d5c', '#d34d7e', '#3a1c5e'], icon: 'notifications', text: 'Sophie a rejoint le cercle ', strong: 'Entrepreneurs', time: 'Il y a 1 h', single: ['#b07bff', '#7a4fd6'] },
    { grad: ['#9aa7d6', '#5b6aa8', '#2c2f55'], icon: 'person-add', text: 'Martin a invité 3 membres dans ', strong: 'Amitiés', time: 'Il y a 2 h', stack: ['#7be0a0', '#ff9d5c'], extra: '+3' },
];

const CERCLES = [
    { id: 'c1', nom: 'Voyageurs', membres: 12, grad: ['#ff9d5c', '#c2477e', '#3b1f63'], ring: ['#ff9d5c', '#d34d7e'] },
    { id: 'c2', nom: 'Amitiés', membres: 8, grad: ['#aeb8d8', '#5b6aa8', '#2c2f55'], ring: ['#9aa7d6', '#5b6aa8'] },
    { id: 'c3', nom: 'Évasion', membres: 15, grad: ['#8fe6d6', '#3ba0a8', '#1d5b66'], ring: ['#7fe0d0', '#2f9aa8'] },
    { id: 'c1', nom: 'Sport', membres: 10, grad: ['#86e6aa', '#2fa6c2', '#274a8c'], ring: ['#7be0a0', '#2f9ac2'] },
] as const;

function KadyMark() {
    return (
        <Svg width={36} height={24} viewBox="0 0 132 82">
            <Defs>
                <SvgGradient id="kadyGhm" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor="#ffc2d6" />
                    <Stop offset="0.38" stopColor="#ff5f9e" />
                    <Stop offset="0.78" stopColor="#e22a72" />
                    <Stop offset="1" stopColor="#bb1659" />
                </SvgGradient>
            </Defs>
            <Circle cx={86} cy={41} r={27} stroke="url(#kadyGhm)" strokeWidth={13.5} fill="none" />
            <Circle cx={46} cy={41} r={27} stroke="url(#kadyGhm)" strokeWidth={13.5} fill="none" />
            <Path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#kadyGhm)" strokeWidth={13.5} strokeLinecap="round" fill="none" />
        </Svg>
    );
}

export default function Accueil() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const allRead = useStore((st) => st.notifsRead.includes('ALL'));
    return (
        <Screen padded={false}>
            <FadeInUp>
                <View style={s.header}>
                    <Pressable style={s.iconBtn} onPress={() => router.push('/(app)/decouvrir')}><Ionicons name="compass-outline" size={20} color={c.text} /></Pressable>
                    <View style={s.brand}>
                        <KadyMark />
                        <Text style={s.wordmark}>KADY</Text>
                    </View>
                    <Pressable style={s.iconBtn} onPress={() => router.push('/(app)/notifications')}>
                        <Ionicons name="notifications-outline" size={20} color={c.text} />
                        {!allRead && <View style={s.bellDot} />}
                    </Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}>
                <FadeInUp delay={60}>
                    <Text style={s.greet}>Bonjour Didier 👋</Text>
                    <Text style={s.greetSub}>Prêt à créer de belles connexions aujourd'hui ?</Text>
                </FadeInUp>

                <FadeInUp delay={120}>
                    <LinearGradient colors={['rgba(255,106,169,0.13)', 'rgba(255,106,169,0.06)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.levelCard}>
                        <LinearGradient colors={['#ffd27a', '#ff9d5c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.levelBadge}>
                            <Ionicons name="star" size={22} color="#5a3a12" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <View style={s.levelTop}>
                                <Text style={s.levelTitle}>Niveau 4</Text>
                                <Text style={s.levelXp}><Text style={s.levelXpStrong}>650</Text> / 1000 XP</Text>
                            </View>
                            <AnimatedBar progress={0.65} height={9} track={c.ink(0.12)}>
                                <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                            </AnimatedBar>
                        </View>
                    </LinearGradient>
                </FadeInUp>

                <FadeInUp delay={180}>
                    <HeroCarousel onPress={() => router.push('/(app)/cercles')} />
                </FadeInUp>

                <FadeInUp delay={220}>
                    <View style={s.sectionRow}>
                        <View style={s.sectionTitleRow}>
                            <Ionicons name="people" size={19} color={c.accent} />
                            <Text style={s.sectionTitle}>Mes cercles</Text>
                        </View>
                        <Pressable style={s.seeAll} onPress={() => router.push('/(app)/cercles')}>
                            <Text style={s.seeAllTxt}>Voir tous</Text>
                            <Ionicons name="chevron-forward" size={15} color={c.accent} />
                        </Pressable>
                    </View>
                </FadeInUp>

                <FadeInUp delay={260}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD }} contentContainerStyle={s.rail}>
                        <PressableScale style={s.cercleItem} onPress={() => router.push('/(app)/creer')}>
                            <View style={s.createCircle}><Ionicons name="add" size={26} color={c.accent} /></View>
                            <Text style={s.cercleName}>Créer</Text>
                            <Text style={s.cercleSub}>un cercle</Text>
                        </PressableScale>
                        {CERCLES.map((cc, i) => (
                            <PressableScale key={i} style={s.cercleItem} onPress={() => router.push(`/(app)/cercles/${cc.id}`)}>
                                <LinearGradient colors={cc.ring as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cercleRing}>
                                    <LinearGradient colors={cc.grad as any} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={s.cercleInner} />
                                    <View style={s.cercleCount}><Text style={s.cercleCountTxt}>{cc.membres}</Text></View>
                                </LinearGradient>
                                <Text style={s.cercleName}>{cc.nom}</Text>
                                <Text style={s.cercleSub}>{cc.membres} membres</Text>
                            </PressableScale>
                        ))}
                    </ScrollView>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <View style={[s.sectionRow, { marginTop: 26 }]}>
                        <View style={s.sectionTitleRow}>
                            <Ionicons name="flash" size={18} color={c.accent} />
                            <Text style={s.sectionTitle}>Activité dans vos cercles</Text>
                        </View>
                    </View>
                </FadeInUp>

                <View style={{ marginTop: 14, gap: 11 }}>
                    {ACTIVITIES.map((a, i) => (
                        <FadeInUp key={i} delay={320 + i * 70}>
                            <PressableScale style={s.activity} scaleTo={0.98} onPress={() => router.push('/(app)/messages')}>
                                <View>
                                    <LinearGradient colors={a.grad as any} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={s.activityTile} />
                                    <View style={s.activityIcon}><Ionicons name={a.icon} size={12} color={c.accent} /></View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.activityText}>{a.text}<Text style={s.activityStrong}>{a.strong}</Text></Text>
                                    <Text style={s.activityTime}>{a.time}</Text>
                                </View>
                                <View style={s.activityRight}>
                                    {a.stack && (
                                        <View style={{ flexDirection: 'row' }}>
                                            <LinearGradient colors={[a.stack[0], a.stack[0]]} style={[s.miniAv, { marginLeft: 0 }]} />
                                            <LinearGradient colors={[a.stack[1], a.stack[1]]} style={s.miniAv} />
                                            <View style={[s.miniAv, s.miniExtra]}><Text style={s.miniExtraTxt}>{a.extra}</Text></View>
                                        </View>
                                    )}
                                    {a.single && <LinearGradient colors={a.single as any} style={[s.miniAv, { marginLeft: 0 }]} />}
                                    <Ionicons name="chevron-forward" size={17} color={c.ink(0.3)} />
                                </View>
                            </PressableScale>
                        </FadeInUp>
                    ))}
                </View>

                <FadeInUp delay={560}>
                    <LinearGradient colors={['rgba(255,106,169,0.15)', 'rgba(255,106,169,0.08)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premium}>
                        <View style={s.premiumGlow} />
                        <View style={s.premiumRow}>
                            <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premiumIcon}>
                                <Ionicons name="diamond" size={22} color="#fff" />
                            </LinearGradient>
                            <View style={{ flex: 1 }}>
                                <Text style={s.premiumTitle}>Passez Premium</Text>
                                <Text style={s.premiumSub}>Plus de cercles, plus de contenu, sans limites.</Text>
                            </View>
                        </View>
                        <PressableScale onPress={() => router.push('/(app)/profil/premium')}>
                            <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premiumBtn}>
                                <Text style={s.premiumBtnTxt}>Découvrir Premium</Text>
                                <Ionicons name="chevron-forward" size={16} color="#fff" />
                            </LinearGradient>
                        </PressableScale>
                    </LinearGradient>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

function HeroCarousel({ onPress }: { onPress: () => void }) {
    const c = useColors();
    const s = makeStyles(c);
    const { width } = useWindowDimensions();
    const HERO_W = width - PAD * 2;
    const [i, setI] = useState(0);
    const tx = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(tx, { toValue: -i * HERO_W, duration: 600, easing: Easing.bezier(0.65, 0, 0.2, 1), useNativeDriver: true }).start();
    }, [i]);
    useEffect(() => {
        const iv = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
        return () => clearInterval(iv);
    }, []);

    return (
        <View style={{ marginTop: 22 }}>
            <View style={s.hero}>
                <Animated.View style={{ flexDirection: 'row', width: HERO_W * SLIDES.length, height: '100%', transform: [{ translateX: tx }] }}>
                    {SLIDES.map((sl, idx) => (
                        <View key={idx} style={{ width: HERO_W, height: '100%' }}>
                            <LinearGradient colors={sl.grad as any} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
                            <LinearGradient colors={['rgba(10,6,20,0.05)', 'rgba(10,6,20,0.78)']} style={StyleSheet.absoluteFill} />
                            <View style={s.heroContent}>
                                {sl.chip ? (
                                    <View style={s.heroChip}>
                                        <Ionicons name="people-outline" size={14} color="#fff" />
                                        <Text style={s.heroChipTxt}>{sl.chip}</Text>
                                    </View>
                                ) : <View />}
                                <View>
                                    <Text style={s.heroTitle}>{sl.title}</Text>
                                    <Text style={s.heroSub}>{sl.sub}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </Animated.View>
                <PressableScale onPress={onPress} scaleTo={0.94} style={s.heroCta}>
                    <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.heroCtaInner}>
                        <Text style={s.heroCtaTxt}>Découvrir</Text>
                        <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </LinearGradient>
                </PressableScale>
            </View>
            <View style={s.dots}>
                {SLIDES.map((_, d) => (
                    <Pressable key={d} onPress={() => setI(d)}>
                        {d === i ? (
                            <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.dot, { width: 22 }]} />
                        ) : (
                            <View style={[s.dot, { width: 7, backgroundColor: c.ink(0.18) }]} />
                        )}
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    header: { height: 50, paddingHorizontal: PAD, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    wordmark: { fontFamily: fonts.display, fontSize: 21, letterSpacing: 5, color: c.text, paddingLeft: 3 },
    bellDot: { position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4d97', borderWidth: 2, borderColor: c.bg[1] },

    greet: { fontFamily: fonts.display, fontSize: 27, lineHeight: 30, color: c.text, letterSpacing: -0.3, marginTop: 6 },
    greetSub: { marginTop: 8, fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.ink(0.55), maxWidth: 240 },

    levelCard: { marginTop: 18, padding: 16, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,106,169,0.22)', flexDirection: 'row', alignItems: 'center', gap: 15 },
    levelBadge: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: '#ffaa50', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5 },
    levelTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 },
    levelTitle: { fontFamily: fonts.display, fontSize: 15, color: c.text },
    levelXp: { fontFamily: fonts.body, fontSize: 12.5, color: c.ink(0.55) },
    levelXpStrong: { fontFamily: fonts.bodyBold, color: c.text },

    hero: { borderRadius: 26, overflow: 'hidden', height: 218, borderWidth: 1, borderColor: c.border },
    heroContent: { flex: 1, padding: 22, justifyContent: 'space-between' },
    heroChip: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    heroChipTxt: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: '#fff' },
    heroTitle: { fontFamily: fonts.display, fontSize: 23, lineHeight: 28, color: '#fff', maxWidth: 250 },
    heroSub: { marginTop: 8, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.85)', maxWidth: 220 },
    heroCta: { position: 'absolute', right: 18, bottom: 18 },
    heroCtaInner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 17, borderRadius: 99, shadowColor: '#ff6aa9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 8 },
    heroCtaTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: '#fff' },
    dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
    dot: { height: 7, borderRadius: 99 },

    sectionRow: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    sectionTitle: { fontFamily: fonts.display, fontSize: 17, color: c.text },
    seeAll: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    seeAllTxt: { fontFamily: fonts.bodySemi, fontSize: 13, color: c.accent },

    rail: { gap: 16, paddingHorizontal: PAD, paddingTop: 16, paddingBottom: 6 },
    cercleItem: { width: 74, alignItems: 'center', gap: 9 },
    createCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: 'rgba(255,106,169,0.5)', borderStyle: 'dashed', backgroundColor: 'rgba(255,106,169,0.08)', alignItems: 'center', justifyContent: 'center' },
    cercleRing: { width: 70, height: 70, borderRadius: 35, padding: 2.5 },
    cercleInner: { flex: 1, borderRadius: 33 },
    cercleCount: { position: 'absolute', bottom: -2, right: -2, minWidth: 22, height: 22, paddingHorizontal: 5, borderRadius: 11, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center', shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 7, elevation: 3 },
    cercleCountTxt: { fontFamily: fonts.bodyBold, fontSize: 11, color: c.accentDeep },
    cercleName: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: c.text },
    cercleSub: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.45), marginTop: -6 },

    activity: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 6 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.1, shadowRadius: 14, elevation: 2 },
    activityTile: { width: 46, height: 46, borderRadius: 14 },
    activityIcon: { position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, borderRadius: 12, backgroundColor: c.card2, borderWidth: 2, borderColor: c.card, alignItems: 'center', justifyContent: 'center' },
    activityText: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: c.ink(0.72) },
    activityStrong: { fontFamily: fonts.bodyBold, color: c.text },
    activityTime: { marginTop: 3, fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.42) },
    activityRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    miniAv: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: c.card, marginLeft: -9 },
    miniExtra: { backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' },
    miniExtraTxt: { fontFamily: fonts.bodyBold, fontSize: 9.5, color: c.accent },

    premium: { marginTop: 22, overflow: 'hidden', padding: 18, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,106,169,0.28)' },
    premiumGlow: { position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,106,169,0.28)' },
    premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    premiumIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#ff6aa9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 6 },
    premiumTitle: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    premiumSub: { marginTop: 3, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: c.ink(0.58) },
    premiumBtn: { marginTop: 14, paddingVertical: 13, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, shadowColor: '#ff6aa9', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 6 },
    premiumBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },
});
