// app/(app)/cercles/index.tsx — Cercles (handoff "KADY Cercles.dc.html")
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { FadeInUp, PressableScale, AnimatedBar, animateLayout } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors, gradients } from '../../../src/theme/colors';

const PAD = 22;
const CHIPS = ['Pour vous', 'Proches', 'Actifs', 'Populaires'];

type Grade = { label: string; bg: string; border: string; color: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string };
const GRADES: Record<string, Grade> = {
    etoile: { label: 'Étoile', bg: 'rgba(255,210,122,0.16)', border: 'rgba(255,210,122,0.35)', color: '#b45309', icon: 'star', iconColor: '#ffb300' },
    flamme: { label: 'Flamme', bg: 'rgba(255,157,107,0.16)', border: 'rgba(255,157,107,0.35)', color: '#c2410c', icon: 'flame', iconColor: '#ff7a3c' },
};

const NEARBY = [
    { id: 'c1', nom: 'Brunch & bonnes adresses', grad: ['#ffb45c', '#d3744d', '#5e2c3a'], badge: 'flame', info: '8/10 membres', dist: '1,2 km', state: 'Actif', dot: true, full: false },
    { id: 'c2', nom: 'Basket du dimanche', grad: ['#7be0a0', '#2f9ac2', '#274a8c'], badge: 'star', info: '9/10 membres', dist: '3 km', state: 'Très actif', dot: true, full: false },
    { id: 'c3', nom: "Cinéphiles d'Abidjan", grad: ['#9aa7d6', '#5b6aa8', '#2c2f55'], badge: 'leaf', info: '5/10 membres', dist: '4 km', state: 'Nouveau', dot: false, full: false },
    { id: 'c1', nom: 'Entrepreneurs 225', grad: ['#8fd0ff', '#5a7fd6', '#2a2c66'], badge: 'diamond', info: '10/10 membres', dist: '5 km', state: '', dot: false, full: true },
] as const;

const MINE = [
    { id: 'c1', nom: 'Voyageurs', grade: 'etoile', tile: ['#ff9d5c', '#c2477e', '#3b1f63'], membres: '8/10', mode: 'Amitié', unread: 3, xp: 320, xpMax: 500, jour: 34 },
    { id: 'c2', nom: 'Amitiés sincères', grade: 'flamme', tile: ['#ffb45c', '#d3744d', '#5e2c3a'], membres: '7/10', mode: 'Amitié', unread: 1, xp: 140, xpMax: 300, jour: 12 },
] as const;

export default function Cercles() {
    const router = useRouter();
    const [view, setView] = useState<'decouvrir' | 'mes'>('decouvrir');
    const [filter, setFilter] = useState(0);
    const isDec = view === 'decouvrir';

    const setSeg = (v: 'decouvrir' | 'mes') => { animateLayout(); setView(v); };

    return (
        <Screen padded={false}>
            <FadeInUp>
                <View style={s.header}>
                    <View>
                        <Text style={s.h1}>Cercles</Text>
                        <Text style={s.h1sub}>Là où tout commence</Text>
                    </View>
                    <Pressable style={s.iconBtn}><Ionicons name="options-outline" size={20} color={colors.cream} /></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}>
                {/* search */}
                <FadeInUp delay={50}>
                    <View style={s.search}>
                        <Ionicons name="search" size={19} color="rgba(33,22,51,0.45)" />
                        <Text style={s.searchTxt}>Rechercher un cercle, une passion…</Text>
                    </View>
                </FadeInUp>

                {/* segmented */}
                <FadeInUp delay={90}>
                    <View style={s.segment}>
                        <Seg label="Découvrir" active={isDec} onPress={() => setSeg('decouvrir')} />
                        <Seg label="Mes cercles" count="2" active={!isDec} onPress={() => setSeg('mes')} />
                    </View>
                </FadeInUp>

                {isDec ? (
                    <View>
                        {/* chips */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD, marginTop: 18 }} contentContainerStyle={s.chipsRow}>
                            {CHIPS.map((c, i) => {
                                const on = i === filter;
                                return (
                                    <Pressable key={c} onPress={() => setFilter(i)} style={[s.chip, on ? s.chipOn : s.chipOff]}>
                                        <Text style={[s.chipTxt, { color: on ? '#6d28d9' : 'rgba(33,22,51,0.6)' }]}>{c}</Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        {/* featured */}
                        <FadeInUp delay={120}>
                            <View style={s.featured}>
                                <View style={s.featuredTop}>
                                    <LinearGradient colors={['#ff9d5c', '#d34d7e', '#3a1c5e']} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
                                    <LinearGradient colors={['rgba(10,6,20,0)', 'rgba(10,6,20,0.55)']} style={StyleSheet.absoluteFill} />
                                    <View style={[s.glassChip, { left: 14, top: 14, backgroundColor: 'rgba(255,210,122,0.2)', borderColor: 'rgba(255,210,122,0.4)' }]}>
                                        <Ionicons name="star" size={12} color="#ffd27a" />
                                        <Text style={[s.glassChipTxt, { color: '#ffe2a0' }]}>Étoile</Text>
                                    </View>
                                    <View style={[s.glassChip, { right: 14, top: 14, backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.22)' }]}>
                                        <Ionicons name="location" size={12} color="#fff" />
                                        <Text style={[s.glassChipTxt, { color: '#fff' }]}>À 2 km</Text>
                                    </View>
                                    <View style={s.featuredTitleWrap}>
                                        <Text style={s.featuredTitle}>Globe-trotters d'Abidjan</Text>
                                        <Text style={s.featuredTheme}>Voyage · Aventure</Text>
                                    </View>
                                </View>
                                <View style={{ padding: 16 }}>
                                    <View style={s.whyRow}>
                                        <Ionicons name="information-circle-outline" size={15} color={colors.rose} />
                                        <Text style={s.whyTxt}>Pourquoi ce cercle ?</Text>
                                    </View>
                                    <View style={s.reasonWrap}>
                                        <Reason icon="people" txt="3 passions communes" color="#6d28d9" bg="rgba(199,155,255,0.12)" bd="rgba(199,155,255,0.2)" />
                                        <Reason icon="checkmark" txt="92% compatible" color="#1f9d57" bg="rgba(134,230,170,0.1)" bd="rgba(134,230,170,0.22)" />
                                        <Reason icon="flame" txt="Très actif" color="#c2410c" bg="rgba(255,157,107,0.1)" bd="rgba(255,157,107,0.22)" />
                                    </View>
                                    <View style={s.membersRow}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <LinearGradient colors={['#ff9d5c', '#d34d7e']} style={[s.av, { marginLeft: 0 }]} />
                                            <LinearGradient colors={['#7fe0d0', '#2f9aa8']} style={s.av} />
                                            <LinearGradient colors={['#b07bff', '#7a4fd6']} style={s.av} />
                                            <View style={[s.av, s.avExtra]}><Text style={s.avExtraTxt}>+4</Text></View>
                                        </View>
                                        <View>
                                            <Text style={s.membersCount}>7 / 10 membres</Text>
                                            <Text style={s.membersBalance}>4 femmes · 3 hommes</Text>
                                        </View>
                                    </View>
                                    <PressableScale onPress={() => router.push('/(app)/cercles/c1')}>
                                        <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cta}>
                                            <Text style={s.ctaTxt}>Voir la salle d'accueil</Text>
                                            <Ionicons name="chevron-forward" size={16} color="#fff" />
                                        </LinearGradient>
                                    </PressableScale>
                                </View>
                            </View>
                        </FadeInUp>

                        {/* near you */}
                        <FadeInUp delay={160}>
                            <View style={[s.listHead, { marginTop: 24 }]}>
                                <Text style={s.listHeadTitle}>Près de vous</Text>
                                <Pressable style={s.seeAll}><Text style={s.seeAllTxt}>Tout voir</Text><Ionicons name="chevron-forward" size={14} color={colors.rose} /></Pressable>
                            </View>
                        </FadeInUp>

                        <View style={{ marginTop: 13, gap: 11 }}>
                            {NEARBY.map((c, i) => (
                                <FadeInUp key={i} delay={180 + i * 60}>
                                    <PressableScale style={s.nearCard} scaleTo={0.98} onPress={() => !c.full && router.push(`/(app)/cercles/${c.id}`)}>
                                        <View>
                                            <LinearGradient colors={c.grad as any} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={[s.nearTile, c.full && { opacity: 0.7 }]} />
                                            <View style={s.nearBadge}><GradeMini code={c.badge} /></View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[s.nearName, c.full && { color: 'rgba(33,22,51,0.75)' }]}>{c.nom}</Text>
                                            <View style={s.nearMeta}>
                                                <Text style={s.nearMetaTxt}>{c.info}</Text>
                                                <Text style={s.nearDot}>·</Text>
                                                <Text style={s.nearMetaTxt}>{c.dist}</Text>
                                                {!!c.state && <Text style={s.nearDot}>·</Text>}
                                                {!!c.state && (c.dot ? (
                                                    <View style={s.stateLive}><View style={s.liveDot} /><Text style={s.nearMetaTxt}>{c.state}</Text></View>
                                                ) : <Text style={s.stateNew}>{c.state}</Text>)}
                                            </View>
                                        </View>
                                        {c.full ? (
                                            <View style={s.fullBtn}><Text style={s.fullBtnTxt}>Complet</Text></View>
                                        ) : (
                                            <View style={s.joinBtn}><Text style={s.joinBtnTxt}>Rejoindre</Text></View>
                                        )}
                                    </PressableScale>
                                </FadeInUp>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View>
                        {/* free limit */}
                        <FadeInUp delay={120}>
                            <LinearGradient colors={['rgba(164,99,255,0.16)', 'rgba(255,111,194,0.08)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.limit}>
                                <View style={s.limitTop}>
                                    <Text style={s.limitTitle}>2 / 3 cercles utilisés</Text>
                                    <Text style={s.limitFree}>Offre gratuite</Text>
                                </View>
                                <View style={s.limitBars}>
                                    <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.limitBar} />
                                    <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.limitBar} />
                                    <View style={[s.limitBar, { backgroundColor: 'rgba(33,22,51,0.1)' }]} />
                                </View>
                                <View style={s.limitBottom}>
                                    <Text style={s.limitNote}>Cercles illimités avec Premium</Text>
                                    <PressableScale onPress={() => router.push('/(app)/profil/premium')}>
                                        <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.limitBtn}>
                                            <Ionicons name="diamond" size={13} color="#fff" />
                                            <Text style={s.limitBtnTxt}>Passer Premium</Text>
                                        </LinearGradient>
                                    </PressableScale>
                                </View>
                            </LinearGradient>
                        </FadeInUp>

                        {MINE.map((c, i) => {
                            const g = GRADES[c.grade];
                            return (
                                <FadeInUp key={i} delay={160 + i * 70}>
                                    <View style={s.myCard}>
                                        <View style={s.myTop}>
                                            <LinearGradient colors={c.tile as any} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={s.myTile} />
                                            <View style={{ flex: 1 }}>
                                                <View style={s.myNameRow}>
                                                    <Text style={s.myName}>{c.nom}</Text>
                                                    <View style={[s.gradeChip, { backgroundColor: g.bg, borderColor: g.border }]}>
                                                        <Ionicons name={g.icon} size={10} color={g.iconColor} />
                                                        <Text style={[s.gradeChipTxt, { color: g.color }]}>{g.label}</Text>
                                                    </View>
                                                </View>
                                                <View style={s.myMeta}>
                                                    <View style={s.myMetaItem}><Ionicons name="person" size={11} color="rgba(33,22,51,0.5)" /><Text style={s.myMetaTxt}>{c.membres}</Text></View>
                                                    <Text style={s.nearDot}>·</Text>
                                                    <View style={s.modePill}><Text style={s.modePillTxt}>{c.mode}</Text></View>
                                                </View>
                                            </View>
                                            <View style={s.unread}><Text style={s.unreadTxt}>{c.unread}</Text></View>
                                        </View>
                                        <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
                                            <View style={s.xpTop}>
                                                <Text style={s.xpLabel}>XP du cercle</Text>
                                                <Text style={s.xpVal}><Text style={s.xpValStrong}>{c.xp}</Text> / {c.xpMax}</Text>
                                            </View>
                                            <AnimatedBar progress={c.xp / c.xpMax} height={7} track="rgba(33,22,51,0.1)">
                                                <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                                            </AnimatedBar>
                                        </View>
                                        <View style={s.myFoot}>
                                            <View style={s.myFootItem}><Ionicons name="time-outline" size={13} color="rgba(33,22,51,0.55)" /><Text style={s.myFootTxt}>Jour {c.jour} / 60</Text></View>
                                            <PressableScale onPress={() => router.push(`/(app)/cercles/${c.id}`)}>
                                                <View style={s.openBtn}><Text style={s.openBtnTxt}>Ouvrir</Text><Ionicons name="chevron-forward" size={13} color="#6d28d9" /></View>
                                            </PressableScale>
                                        </View>
                                    </View>
                                </FadeInUp>
                            );
                        })}

                        <FadeInUp delay={320}>
                            <Pressable style={s.createBtn}>
                                <Ionicons name="add" size={20} color={colors.rose} />
                                <Text style={s.createBtnTxt}>Créer un cercle</Text>
                            </Pressable>
                        </FadeInUp>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

function Seg({ label, count, active, onPress }: { label: string; count?: string; active?: boolean; onPress: () => void }) {
    const inner = (
        <>
            <Text style={[s.segTxt, { color: active ? '#fff' : 'rgba(33,22,51,0.55)' }]}>{label}</Text>
            {count && <Text style={[s.segCount, { color: active ? 'rgba(255,255,255,0.7)' : 'rgba(33,22,51,0.4)' }]}> {count}</Text>}
        </>
    );
    if (active) {
        return (
            <Pressable style={{ flex: 1 }} onPress={onPress}>
                <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.segBtn}>{inner}</LinearGradient>
            </Pressable>
        );
    }
    return <Pressable style={[s.segBtn, { flex: 1 }]} onPress={onPress}>{inner}</Pressable>;
}

function Reason({ icon, txt, color, bg, bd }: { icon: any; txt: string; color: string; bg: string; bd: string }) {
    return (
        <View style={[s.reason, { backgroundColor: bg, borderColor: bd }]}>
            <Ionicons name={icon} size={13} color={color} />
            <Text style={[s.reasonTxt, { color }]}>{txt}</Text>
        </View>
    );
}

function GradeMini({ code }: { code: string }) {
    const map: Record<string, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
        flame: { icon: 'flame', bg: 'rgba(255,157,107,0.95)', color: '#3a1c0e' },
        star: { icon: 'star', bg: 'rgba(255,210,122,0.95)', color: '#5a3a12' },
        leaf: { icon: 'leaf', bg: 'rgba(134,230,170,0.95)', color: '#14401f' },
        diamond: { icon: 'diamond', bg: 'rgba(143,208,255,0.95)', color: '#103040' },
    };
    const g = map[code] ?? map.star;
    return <View style={[s.gradeMini, { backgroundColor: g.bg }]}><Ionicons name={g.icon} size={10} color={g.color} /></View>;
}

const s = StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontFamily: fonts.display, fontSize: 25, color: colors.cream, letterSpacing: -0.3 },
    h1sub: { marginTop: 2, fontFamily: fonts.body, fontSize: 13, color: 'rgba(33,22,51,0.5)' },
    iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(33,22,51,0.06)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.09)', alignItems: 'center', justifyContent: 'center' },

    search: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 16, backgroundColor: 'rgba(33,22,51,0.04)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.09)' },
    searchTxt: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(33,22,51,0.42)' },

    segment: { marginTop: 16, flexDirection: 'row', padding: 5, borderRadius: 16, backgroundColor: 'rgba(33,22,51,0.04)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)', gap: 0 },
    segBtn: { paddingVertical: 11, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    segTxt: { fontFamily: fonts.bodyBold, fontSize: 13.5 },
    segCount: { fontFamily: fonts.bodySemi, fontSize: 13.5 },

    chipsRow: { gap: 9, paddingHorizontal: PAD },
    chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1 },
    chipOn: { backgroundColor: 'rgba(164,99,255,0.18)', borderColor: 'rgba(199,155,255,0.5)' },
    chipOff: { backgroundColor: 'rgba(33,22,51,0.04)', borderColor: 'rgba(33,22,51,0.08)' },
    chipTxt: { fontFamily: fonts.bodySemi, fontSize: 13 },

    featured: { marginTop: 18, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(33,22,51,0.1)', backgroundColor: '#fff', shadowColor: '#281950', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.18, shadowRadius: 28, elevation: 4 },
    featuredTop: { height: 138 },
    glassChip: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 11, borderRadius: 99, borderWidth: 1 },
    glassChipTxt: { fontFamily: fonts.bodyBold, fontSize: 11.5 },
    featuredTitleWrap: { position: 'absolute', left: 16, right: 16, bottom: 13 },
    featuredTitle: { fontFamily: fonts.display, fontSize: 19, color: '#fff' },
    featuredTheme: { marginTop: 3, fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
    whyRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 11 },
    whyTxt: { fontFamily: fonts.bodyBold, fontSize: 13, color: '#6d28d9' },
    reasonWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    reason: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 11, borderWidth: 1 },
    reasonTxt: { fontFamily: fonts.bodySemi, fontSize: 12 },
    membersRow: { marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 10 },
    av: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff', marginLeft: -10 },
    avExtra: { backgroundColor: '#efe7fb', alignItems: 'center', justifyContent: 'center' },
    avExtraTxt: { fontFamily: fonts.bodyBold, fontSize: 10, color: '#7c3aed' },
    membersCount: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.cream },
    membersBalance: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.45)', marginTop: 1 },
    cta: { marginTop: 16, paddingVertical: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#ff6fc2', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 18, elevation: 5 },
    ctaTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },

    listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    listHeadTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.cream },
    seeAll: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    seeAllTxt: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.rose },

    nearCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 12, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)' },
    nearTile: { width: 58, height: 58, borderRadius: 15 },
    nearBadge: { position: 'absolute', top: -4, right: -4 },
    gradeMini: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    nearName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.cream },
    nearMeta: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    nearMetaTxt: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.5)' },
    nearDot: { color: 'rgba(33,22,51,0.3)', fontSize: 11 },
    stateLive: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1f9d57' },
    stateNew: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: '#1f9d57' },
    joinBtn: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 11, backgroundColor: 'rgba(199,155,255,0.16)', borderWidth: 1, borderColor: 'rgba(199,155,255,0.35)' },
    joinBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#6d28d9' },
    fullBtn: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 11, backgroundColor: 'rgba(33,22,51,0.04)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.1)' },
    fullBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: 'rgba(33,22,51,0.45)' },

    limit: { marginTop: 18, padding: 15, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(199,155,255,0.25)' },
    limitTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    limitTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.cream },
    limitFree: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.55)' },
    limitBars: { flexDirection: 'row', gap: 6 },
    limitBar: { flex: 1, height: 7, borderRadius: 99 },
    limitBottom: { marginTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    limitNote: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.6)', flex: 1 },
    limitBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 13, borderRadius: 10, shadowColor: '#ff6fc2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 4 },
    limitBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' },

    myCard: { marginTop: 14, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(33,22,51,0.1)', backgroundColor: '#fff' },
    myTop: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
    myTile: { width: 56, height: 56, borderRadius: 16 },
    myNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    myName: { fontFamily: fonts.display, fontSize: 16, color: colors.cream },
    gradeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, borderWidth: 1 },
    gradeChipTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5 },
    myMeta: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 7 },
    myMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    myMetaTxt: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.5)' },
    modePill: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 99, backgroundColor: 'rgba(199,155,255,0.14)' },
    modePillTxt: { fontFamily: fonts.bodySemi, fontSize: 11, color: '#6d28d9' },
    unread: { minWidth: 24, height: 24, paddingHorizontal: 7, borderRadius: 12, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
    unreadTxt: { fontFamily: fonts.bodyBold, fontSize: 11, color: '#fff' },
    xpTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    xpLabel: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.5)' },
    xpVal: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.6)' },
    xpValStrong: { fontFamily: fonts.bodyBold, color: colors.cream },
    myFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: 'rgba(33,22,51,0.07)', backgroundColor: 'rgba(33,22,51,0.025)' },
    myFootItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    myFootTxt: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.55)' },
    openBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: 'rgba(199,155,255,0.16)', borderWidth: 1, borderColor: 'rgba(199,155,255,0.3)' },
    openBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#6d28d9' },

    createBtn: { marginTop: 14, paddingVertical: 18, borderRadius: 20, backgroundColor: 'rgba(164,99,255,0.07)', borderWidth: 1.5, borderColor: 'rgba(199,155,255,0.45)', borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    createBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.rose },
});
