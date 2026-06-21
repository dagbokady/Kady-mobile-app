// app/(app)/profil/index.tsx — Profil (handoff "KADY Profil.dc.html")
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { FadeInUp, PopIn, PressableScale } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { radius } from '../../../src/theme/spacing';
import { colors, gradients } from '../../../src/theme/colors';

const PAD = 22;

const BADGES = [
    { label: 'Pionnier', icon: 'flag', grad: ['#ffd27a', '#ff9d5c'], tint: '#5a3a12' },
    { label: 'Vérifié+', icon: 'shield-checkmark', grad: ['#8fd0ff', '#5a7fd6'], tint: '#0c2a40' },
    { label: 'Respectueux', icon: 'heart', grad: ['#ff6fa8', '#a463ff'], tint: '#fff' },
] as const;

const PHOTOS = [
    ['#5a7fd6', '#7a4fd6', '#2a1c5e'],
    ['#ff9d5c', '#d34d7e', '#3a1c5e'],
    ['#7be0a0', '#2f9ac2', '#274a8c'],
] as const;

const INTERESTS = [
    { t: '✈️ Voyage', bg: 'rgba(255,157,107,0.12)', bd: 'rgba(255,157,107,0.25)', c: '#c2410c' },
    { t: '🏀 Basket', bg: 'rgba(123,224,160,0.1)', bd: 'rgba(123,224,160,0.25)', c: '#1f9d57' },
    { t: '🎬 Cinéma', bg: 'rgba(143,157,255,0.12)', bd: 'rgba(143,157,255,0.25)', c: '#4f5bd5' },
    { t: '🍲 Cuisine ivoirienne', bg: 'rgba(255,111,168,0.12)', bd: 'rgba(255,111,168,0.25)', c: '#d6336c' },
    { t: '📷 Photographie', bg: 'rgba(199,155,255,0.12)', bd: 'rgba(199,155,255,0.25)', c: '#6d28d9' },
    { t: '💼 Entrepreneuriat', bg: 'rgba(143,208,255,0.12)', bd: 'rgba(143,208,255,0.25)', c: '#1d6fb8' },
] as const;

export default function Profil() {
    const router = useRouter();
    const [pause, setPause] = useState(false);
    const knob = React.useRef(new Animated.Value(0)).current;
    const togglePause = () => {
        const v = !pause;
        setPause(v);
        Animated.spring(knob, { toValue: v ? 1 : 0, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
    };

    return (
        <Screen padded={false}>
            <FadeInUp>
                <View style={s.header}>
                    <Text style={s.h1}>Profil</Text>
                    <Pressable style={s.iconBtn}><Ionicons name="settings-outline" size={20} color={colors.cream} /></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}>
                {/* hero */}
                <PopIn delay={60} style={s.hero}>
                    <View>
                        <LinearGradient colors={['#8fd0ff', '#a463ff', '#ff6fc2', '#8fd0ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarRing}>
                            <LinearGradient colors={['#5a7fd6', '#7a4fd6', '#2a1c5e']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={s.avatar}>
                                <Text style={s.avatarLetter}>D</Text>
                            </LinearGradient>
                        </LinearGradient>
                        <LinearGradient colors={['#3aa0ff', '#5a7fd6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarCheck}>
                            <Ionicons name="checkmark" size={14} color="#fff" />
                        </LinearGradient>
                    </View>

                    <View style={s.nameRow}>
                        <Text style={s.name}>Didier, 32</Text>
                        <View style={s.verif}>
                            <Ionicons name="shield-checkmark" size={11} color="#1d6fb8" />
                            <Text style={s.verifTxt}>Vérifié+</Text>
                        </View>
                    </View>
                    <View style={s.locRow}>
                        <Ionicons name="location-outline" size={14} color="rgba(33,22,51,0.55)" />
                        <Text style={s.locTxt}>Abidjan · Cocody</Text>
                        <Text style={s.locDot}>·</Text>
                        <Ionicons name="diamond" size={12} color="#8fd0ff" />
                        <Text style={s.gradeTxt}>Diamant</Text>
                    </View>
                    <Text style={s.bio}>Passionné de voyages et de basket. J'aime les vraies conversations et découvrir de nouveaux endroits autour d'Abidjan. 🌍</Text>
                    <PressableScale style={s.editBtn}>
                        <Ionicons name="create-outline" size={15} color="#6d28d9" />
                        <Text style={s.editBtnTxt}>Modifier le profil</Text>
                    </PressableScale>
                </PopIn>

                {/* stats */}
                <FadeInUp delay={130}>
                    <View style={s.stats}>
                        <Stat n="2" l="Cercles" />
                        <View style={s.statDiv} />
                        <Stat n="650" l="XP · Niv. 4" />
                        <View style={s.statDiv} />
                        <Stat n="14" l="Relations" />
                    </View>
                </FadeInUp>

                {/* verification */}
                <FadeInUp delay={170}>
                    <LinearGradient colors={['rgba(67,224,138,0.12)', 'rgba(143,208,255,0.06)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.verifCard}>
                        <LinearGradient colors={['#43e08a', '#2fa8c2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.verifIcon}>
                            <Ionicons name="shield-checkmark" size={22} color="#06281a" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.verifCardTitle}>Identité vérifiée</Text>
                            <Text style={s.verifCardSub}>Selfie vivant confirmé · Photo validée</Text>
                        </View>
                    </LinearGradient>
                </FadeInUp>

                {/* badges */}
                <FadeInUp delay={210}>
                    <Section icon="ribbon" title="Badges" />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD }} contentContainerStyle={s.badgeRail}>
                        {BADGES.map((b) => (
                            <View key={b.label} style={s.badgeItem}>
                                <LinearGradient colors={b.grad as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.badgeIcon}>
                                    <Ionicons name={b.icon as any} size={26} color={b.tint} />
                                </LinearGradient>
                                <Text style={s.badgeLabel}>{b.label}</Text>
                            </View>
                        ))}
                        <View style={[s.badgeItem, { opacity: 0.45 }]}>
                            <View style={s.badgeLocked}><Ionicons name="lock-closed" size={22} color="rgba(33,22,51,0.5)" /></View>
                            <Text style={s.badgeLabel}>Légendaire</Text>
                        </View>
                    </ScrollView>
                </FadeInUp>

                {/* photos */}
                <FadeInUp delay={250}>
                    <View style={s.photoHead}>
                        <Section icon="image" title="Mes photos" noMargin />
                        <Text style={s.photoCount}>3 / 6</Text>
                    </View>
                    <View style={s.photoGrid}>
                        {PHOTOS.map((g, i) => (
                            <LinearGradient key={i} colors={g as any} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={s.photo}>
                                {i === 0 && <View style={s.principal}><Text style={s.principalTxt}>Principale</Text></View>}
                            </LinearGradient>
                        ))}
                        <LockedPhoto label="Niveau 5" />
                        <LockedPhoto label="Réciprocité" />
                        <Pressable style={s.photoAdd}><Ionicons name="add" size={24} color={colors.rose} /></Pressable>
                    </View>
                </FadeInUp>

                {/* interests */}
                <FadeInUp delay={290}>
                    <Section icon="heart" title="Centres d'intérêt" />
                    <View style={s.interests}>
                        {INTERESTS.map((it) => (
                            <View key={it.t} style={[s.interest, { backgroundColor: it.bg, borderColor: it.bd }]}>
                                <Text style={[s.interestTxt, { color: it.c }]}>{it.t}</Text>
                            </View>
                        ))}
                    </View>
                </FadeInUp>

                {/* menu */}
                <FadeInUp delay={330}>
                    <View style={s.menu}>
                        <MenuItem icon="book-outline" color="#7c3aed" bg="rgba(199,155,255,0.14)" title="Carnet personnel" sub="Notes & souvenirs privés" tag="Privé" onPress={() => router.push('/(app)/profil/carnet')} />
                        <MenuItem icon="git-network-outline" color="#4f5bd5" bg="rgba(143,157,255,0.14)" title="Carte des relations" sub="Vos cercles & connexions" />
                        <MenuPause checked={pause} knob={knob} onToggle={togglePause} />
                        <MenuItem icon="heart-outline" color="#c2410c" bg="rgba(255,157,107,0.14)" title="Mode de connexion" sub="Rencontre & Amitié" />
                        <MenuItem icon="shield-outline" color="#1f9d57" bg="rgba(123,224,160,0.14)" title="Confidentialité & sécurité" sub="Blocage, masquage, signalement" onPress={() => router.push('/(app)/profil/parametres')} />
                    </View>
                </FadeInUp>

                {/* premium */}
                <FadeInUp delay={370}>
                    <LinearGradient colors={['rgba(164,99,255,0.22)', 'rgba(255,111,194,0.12)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premium}>
                        <View style={s.premiumGlow} />
                        <View style={s.premiumRow}>
                            <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premiumIcon}>
                                <Ionicons name="diamond" size={22} color="#fff" />
                            </LinearGradient>
                            <View style={{ flex: 1 }}>
                                <Text style={s.premiumTitle}>Passez Premium</Text>
                                <Text style={s.premiumSub}>Cercles & DM illimités, statistiques, rythme personnel.</Text>
                            </View>
                        </View>
                        <PressableScale onPress={() => router.push('/(app)/profil/prenium')}>
                            <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premiumBtn}>
                                <Text style={s.premiumBtnTxt}>Découvrir Premium</Text>
                                <Ionicons name="chevron-forward" size={16} color="#fff" />
                            </LinearGradient>
                        </PressableScale>
                    </LinearGradient>
                </FadeInUp>

                <FadeInUp delay={410}>
                    <Pressable style={s.logout} onPress={() => router.replace('/')}>
                        <Text style={s.logoutTxt}>Se déconnecter</Text>
                    </Pressable>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

function Stat({ n, l }: { n: string; l: string }) {
    return (
        <View style={s.stat}>
            <Text style={s.statN}>{n}</Text>
            <Text style={s.statL}>{l}</Text>
        </View>
    );
}

function Section({ icon, title, noMargin }: { icon: any; title: string; noMargin?: boolean }) {
    return (
        <View style={[s.section, !noMargin && { marginTop: 22 }]}>
            <Ionicons name={icon} size={18} color={colors.rose} />
            <Text style={s.sectionTitle}>{title}</Text>
        </View>
    );
}

function LockedPhoto({ label }: { label: string }) {
    return (
        <View style={[s.photo, s.photoLocked]}>
            <Ionicons name="lock-closed" size={20} color="rgba(33,22,51,0.5)" />
            <Text style={s.photoLockedTxt}>{label}</Text>
        </View>
    );
}

function MenuItem({ icon, color, bg, title, sub, tag, onPress }: { icon: any; color: string; bg: string; title: string; sub: string; tag?: string; onPress?: () => void }) {
    return (
        <PressableScale style={s.menuItem} scaleTo={0.98} onPress={onPress}>
            <View style={[s.menuIcon, { backgroundColor: bg }]}><Ionicons name={icon} size={20} color={color} /></View>
            <View style={{ flex: 1 }}>
                <Text style={s.menuTitle}>{title}</Text>
                <Text style={s.menuSub}>{sub}</Text>
            </View>
            {tag ? (
                <View style={s.menuTag}><Text style={s.menuTagTxt}>{tag}</Text></View>
            ) : (
                <Ionicons name="chevron-forward" size={18} color="rgba(33,22,51,0.35)" />
            )}
        </PressableScale>
    );
}

function MenuPause({ checked, knob, onToggle }: { checked: boolean; knob: Animated.Value; onToggle: () => void }) {
    return (
        <View style={s.menuItem}>
            <View style={[s.menuIcon, { backgroundColor: 'rgba(255,111,168,0.14)' }]}><Ionicons name="pause-circle-outline" size={20} color="#d6336c" /></View>
            <View style={{ flex: 1 }}>
                <Text style={s.menuTitle}>Pause relationnelle</Text>
                <Text style={[s.menuSub, checked && { color: '#d6336c' }]}>{checked ? 'Activée · nouveaux DM en pause' : 'Désactivée'}</Text>
            </View>
            <Pressable onPress={onToggle} hitSlop={8}>
                <View style={s.track}>
                    {checked && <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
                    <Animated.View style={[s.knob, { transform: [{ translateX: knob.interpolate({ inputRange: [0, 1], outputRange: [0, 19] }) }] }]} />
                </View>
            </Pressable>
        </View>
    );
}

const s = StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontFamily: fonts.display, fontSize: 25, color: colors.cream, letterSpacing: -0.3 },
    iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(33,22,51,0.06)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.09)', alignItems: 'center', justifyContent: 'center' },

    hero: { alignItems: 'center', paddingTop: 8 },
    avatarRing: { width: 96, height: 96, borderRadius: 48, padding: 3 },
    avatar: { flex: 1, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontFamily: fonts.display, fontSize: 34, color: '#fff' },
    avatarCheck: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    nameRow: { marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
    name: { fontFamily: fonts.display, fontSize: 22, color: colors.cream },
    verif: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 99, backgroundColor: 'rgba(143,208,255,0.16)', borderWidth: 1, borderColor: 'rgba(143,208,255,0.4)' },
    verifTxt: { fontFamily: fonts.bodyBold, fontSize: 11, color: '#1d6fb8' },
    locRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
    locTxt: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(33,22,51,0.55)' },
    locDot: { color: 'rgba(33,22,51,0.4)' },
    gradeTxt: { fontFamily: fonts.bodySemi, fontSize: 13, color: '#1d6fb8' },
    bio: { marginTop: 11, fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: 'rgba(33,22,51,0.62)', textAlign: 'center', maxWidth: 300 },
    editBtn: { marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 22, borderRadius: 13, backgroundColor: 'rgba(199,155,255,0.1)', borderWidth: 1, borderColor: 'rgba(199,155,255,0.4)' },
    editBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: '#6d28d9' },

    stats: { marginTop: 20, flexDirection: 'row', padding: 4, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)' },
    stat: { flex: 1, alignItems: 'center', paddingVertical: 11 },
    statN: { fontFamily: fonts.display, fontSize: 19, color: colors.cream },
    statL: { marginTop: 2, fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.5)' },
    statDiv: { width: 1, backgroundColor: 'rgba(33,22,51,0.08)', marginVertical: 8 },

    verifCard: { marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(67,224,138,0.25)' },
    verifIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    verifCardTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.cream },
    verifCardSub: { marginTop: 2, fontFamily: fonts.body, fontSize: 12, color: 'rgba(33,22,51,0.55)' },

    section: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    sectionTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.cream },
    badgeRail: { gap: 11, paddingHorizontal: PAD, paddingTop: 13 },
    badgeItem: { width: 84, alignItems: 'center', gap: 8 },
    badgeIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#ffaa50', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 4 },
    badgeLocked: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(33,22,51,0.06)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.2)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
    badgeLabel: { fontFamily: fonts.bodySemi, fontSize: 11, color: 'rgba(33,22,51,0.7)', textAlign: 'center' },

    photoHead: { marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    photoCount: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(33,22,51,0.4)' },
    photoGrid: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    photo: { width: '31.5%', aspectRatio: 3 / 4, borderRadius: 16, overflow: 'hidden' },
    principal: { position: 'absolute', top: 8, left: 8, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.45)' },
    principalTxt: { fontFamily: fonts.bodyBold, fontSize: 9.5, color: '#fff' },
    photoLocked: { backgroundColor: 'rgba(33,22,51,0.04)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)', alignItems: 'center', justifyContent: 'center', gap: 7 },
    photoLockedTxt: { fontFamily: fonts.bodySemi, fontSize: 9.5, color: 'rgba(33,22,51,0.5)', textAlign: 'center' },
    photoAdd: { width: '31.5%', aspectRatio: 3 / 4, borderRadius: 16, backgroundColor: 'rgba(164,99,255,0.08)', borderWidth: 1.5, borderColor: 'rgba(199,155,255,0.4)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },

    interests: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    interest: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1 },
    interestTxt: { fontFamily: fonts.bodySemi, fontSize: 12.5 },

    menu: { marginTop: 24, gap: 10 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)' },
    menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    menuTitle: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.cream },
    menuSub: { marginTop: 2, fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.45)' },
    menuTag: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 99, backgroundColor: 'rgba(199,155,255,0.14)' },
    menuTagTxt: { fontFamily: fonts.bodyBold, fontSize: 10, color: '#7c3aed' },
    track: { width: 46, height: 27, borderRadius: 99, padding: 3, backgroundColor: 'rgba(33,22,51,0.14)', justifyContent: 'center', overflow: 'hidden' },
    knob: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },

    premium: { marginTop: 18, overflow: 'hidden', padding: 18, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(199,155,255,0.28)' },
    premiumGlow: { position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,111,194,0.3)' },
    premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    premiumIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#ff6fc2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 6 },
    premiumTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.cream },
    premiumSub: { marginTop: 3, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: 'rgba(33,22,51,0.62)' },
    premiumBtn: { marginTop: 14, paddingVertical: 13, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, shadowColor: '#ff6fc2', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 6 },
    premiumBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },

    logout: { marginTop: 14, paddingVertical: 13, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(33,22,51,0.08)', alignItems: 'center' },
    logoutTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: 'rgba(220,38,38,0.9)' },
});
