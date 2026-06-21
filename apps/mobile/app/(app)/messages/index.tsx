// app/(app)/messages/index.tsx — Messages (handoff "KADY Messages.dc.html")
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { radius } from '../../../src/theme/spacing';
import { colors, gradients } from '../../../src/theme/colors';

const PAD = 22;
const CHIPS = ['Tous', 'Rencontre', 'Amitié'];

const REN = { dot: '#ff6fa8', color: '#d6336c', label: 'Rencontre' };
const AMI = { dot: '#5b6ad6', color: '#4f5bd5', label: 'Amitié' };

type Mode = { dot: string; color: string; label: string };
type Conv = { id: string; initial: string; grad: string[]; name: string; mode: Mode; niveau: string; time: string; last?: string; photo?: boolean; unread?: number; online?: boolean; dim?: boolean };
const CONVS: Conv[] = [
    { id: 'r1', initial: 'K', grad: ['#7be0a0', '#2f9ac2'], name: 'Koffi, 29', mode: AMI, last: 'On se capte ce week-end ? 🏀', niveau: 'Le Camarade · via Basket du dimanche', time: '11:20', online: true },
    { id: 'r2', initial: 'M', grad: ['#b07bff', '#7a4fd6'], name: 'Mariam, 24', mode: REN, last: "J'ai adoré ta sélection de films 🎬", niveau: "L'Ami(e) · via Cinéphiles d'Abidjan", time: 'Hier', unread: 1 },
    { id: 'r1', initial: 'F', grad: ['#ffb45c', '#d3744d'], name: 'Fatou, 31', mode: AMI, photo: true, niveau: "L'Ami Proche · via Brunch & bonnes adresses", time: 'Hier' },
    { id: 'r3', initial: 'Y', grad: ['#8fd0ff', '#5a7fd6'], name: 'Yann, 27', mode: REN, last: 'Salut ! On partage le cercle business 👋', niveau: "L'Inconnu · via Entrepreneurs 225", time: 'Lun', unread: 1 },
    { id: 'r2', initial: 'S', grad: ['#9aa7d6', '#5b6aa8'], name: 'Sophie, 28', mode: AMI, last: 'Merci pour la recommandation 🙏', niveau: 'La Connaissance · via Entrepreneurs 225', time: 'Dim', dim: true },
];

export default function Messages() {
    const router = useRouter();
    const [filter, setFilter] = useState(0);

    return (
        <Screen padded={false}>
            <FadeInUp>
                <View style={s.header}>
                    <View>
                        <Text style={s.h1}>Messages</Text>
                        <View style={s.h1subRow}>
                            <Ionicons name="shield-checkmark" size={13} color={colors.green} />
                            <Text style={s.h1sub}>Nées de vos cercles partagés</Text>
                        </View>
                    </View>
                    <Pressable style={s.iconBtn}><Ionicons name="create-outline" size={20} color={colors.cream} /></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}>
                {/* chips */}
                <FadeInUp delay={50}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD }} contentContainerStyle={s.chipsRow}>
                        {CHIPS.map((c, i) => {
                            const on = i === filter;
                            return (
                                <Pressable key={c} onPress={() => setFilter(i)} style={[s.chip, on ? s.chipOn : s.chipOff]}>
                                    <Text style={[s.chipTxt, { color: on ? '#6d28d9' : 'rgba(33,22,51,0.6)' }]}>{c}</Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </FadeInUp>

                {/* assistant */}
                <FadeInUp delay={90}>
                    <PressableScale style={s.assistant} scaleTo={0.98}>
                        <LinearGradient colors={['#5b6ad6', '#a463ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.assistantIcon}>
                            <Ionicons name="sparkles" size={20} color="#fff" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.assistantTitle}>Assistant KADY</Text>
                            <Text style={s.assistantTxt} numberOfLines={2}>Relancez Awa : « Quel est ton plus beau souvenir de voyage ? »</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="rgba(33,22,51,0.4)" />
                    </PressableScale>
                </FadeInUp>

                {/* featured conversation */}
                <FadeInUp delay={130}>
                    <PressableScale onPress={() => router.push('/(app)/messages/r1')}>
                        <LinearGradient colors={['rgba(255,111,168,0.08)', '#ffffff']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.featured}>
                            <View style={s.featuredHead}>
                                <View>
                                    <LinearGradient colors={['#ff6fa8', '#ff9d5c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.featuredRing}>
                                        <LinearGradient colors={['#ff9d5c', '#d34d7e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.featuredAvatar}>
                                            <Text style={s.avatarLetter}>A</Text>
                                        </LinearGradient>
                                    </LinearGradient>
                                    <View style={s.onlineDot} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={s.featuredNameRow}>
                                        <Text style={s.featuredName}>Awa, 26</Text>
                                        <View style={[s.modeChip, { backgroundColor: 'rgba(255,111,168,0.16)', borderColor: 'rgba(255,111,168,0.35)' }]}>
                                            <View style={[s.modeChipDot, { backgroundColor: REN.dot }]} />
                                            <Text style={[s.modeChipTxt, { color: REN.color }]}>Rencontre</Text>
                                        </View>
                                    </View>
                                    <Text style={s.featuredLast} numberOfLines={1}>Tu as déjà visité Assinie ? 🌴</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={s.time}>12:45</Text>
                                    <View style={s.unread}><Text style={s.unreadTxt}>2</Text></View>
                                </View>
                            </View>

                            <View style={s.tracker}>
                                <View style={s.trackerTop}>
                                    <View style={s.trackerLevelRow}>
                                        <Text style={s.trackerLevel}>La Connaissance</Text>
                                        <Text style={s.trackerNiv}>Niveau 2 / 5</Text>
                                    </View>
                                    <Text style={s.trackerVia}>via <Text style={s.trackerViaStrong}>Voyageurs</Text></Text>
                                </View>
                                <View style={s.trackerBars}>
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        i < 2
                                            ? <LinearGradient key={i} colors={['#ff6fa8', '#ff9d5c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.trackerBar} />
                                            : <View key={i} style={[s.trackerBar, { backgroundColor: 'rgba(33,22,51,0.1)' }]} />
                                    ))}
                                </View>
                                <View style={s.trackerNext}>
                                    <Ionicons name="lock-closed" size={13} color="#c2410c" />
                                    <Text style={s.trackerNextTxt}>Prochaine étape : <Text style={s.trackerNextStrong}>L'Ami(e)</Text> — débloque les messages audio</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </PressableScale>
                </FadeInUp>

                {/* list header */}
                <FadeInUp delay={170}>
                    <View style={s.listHead}>
                        <Text style={s.listHeadTitle}>Toutes les conversations</Text>
                        <Text style={s.listHeadCount}> · 5</Text>
                    </View>
                </FadeInUp>

                <View style={{ marginTop: 12 }}>
                    {CONVS.map((c, i) => (
                        <FadeInUp key={i} delay={190 + i * 55}>
                            <PressableScale style={[s.conv, c.dim && { opacity: 0.75 }]} scaleTo={0.98} onPress={() => router.push(`/(app)/messages/${c.id}`)}>
                                <View>
                                    <LinearGradient colors={c.grad as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.convAvatar}>
                                        <Text style={s.convLetter}>{c.initial}</Text>
                                    </LinearGradient>
                                    {c.online && <View style={s.convOnline} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={s.convNameRow}>
                                        <Text style={s.convName}>{c.name}</Text>
                                        <View style={s.convModeRow}>
                                            <View style={[s.convModeDot, { backgroundColor: c.mode.dot }]} />
                                            <Text style={[s.convModeTxt, { color: c.mode.color }]}>{c.mode.label}</Text>
                                        </View>
                                    </View>
                                    {c.photo ? (
                                        <View style={s.convPhotoRow}>
                                            <Ionicons name="image-outline" size={14} color="rgba(33,22,51,0.55)" />
                                            <Text style={s.convLast}>Photo envoyée</Text>
                                        </View>
                                    ) : (
                                        <Text style={s.convLast} numberOfLines={1}>{c.last}</Text>
                                    )}
                                    <Text style={s.convNiveau}>{c.niveau}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={s.time}>{c.time}</Text>
                                    {!!c.unread && <View style={s.unread}><Text style={s.unreadTxt}>{c.unread}</Text></View>}
                                </View>
                            </PressableScale>
                        </FadeInUp>
                    ))}
                </View>

                {/* privacy note */}
                <FadeInUp delay={480}>
                    <View style={s.privacy}>
                        <Ionicons name="lock-closed" size={14} color="rgba(124,58,237,0.75)" />
                        <Text style={s.privacyTxt}>Aucun message privé sans cercle partagé</Text>
                    </View>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontFamily: fonts.display, fontSize: 25, color: colors.cream, letterSpacing: -0.3 },
    h1subRow: { marginTop: 2, flexDirection: 'row', alignItems: 'center', gap: 6 },
    h1sub: { fontFamily: fonts.body, fontSize: 12.5, color: 'rgba(33,22,51,0.5)' },
    iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(33,22,51,0.06)', borderWidth: 1, borderColor: 'rgba(33,22,51,0.09)', alignItems: 'center', justifyContent: 'center' },

    chipsRow: { gap: 9, paddingHorizontal: PAD, paddingTop: 6 },
    chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1 },
    chipOn: { backgroundColor: 'rgba(164,99,255,0.18)', borderColor: 'rgba(199,155,255,0.5)' },
    chipOff: { backgroundColor: 'rgba(33,22,51,0.04)', borderColor: 'rgba(33,22,51,0.08)' },
    chipTxt: { fontFamily: fonts.bodySemi, fontSize: 13 },

    assistant: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 16, backgroundColor: 'rgba(143,157,255,0.1)', borderWidth: 1, borderColor: 'rgba(143,157,255,0.22)' },
    assistantIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#8f9dff', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 4 },
    assistantTitle: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#4f5bd5' },
    assistantTxt: { marginTop: 2, fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: 'rgba(33,22,51,0.6)' },

    featured: { marginTop: 16, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,111,168,0.22)' },
    featuredHead: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, paddingBottom: 13 },
    featuredRing: { width: 54, height: 54, borderRadius: 27, padding: 2.5 },
    featuredAvatar: { flex: 1, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontFamily: fonts.display, fontSize: 19, color: '#fff' },
    onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#43e08a', borderWidth: 2.5, borderColor: '#fff' },
    featuredNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    featuredName: { fontFamily: fonts.display, fontSize: 16, color: colors.cream },
    modeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, borderWidth: 1 },
    modeChipDot: { width: 6, height: 6, borderRadius: 3 },
    modeChipTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5 },
    featuredLast: { marginTop: 4, fontFamily: fonts.body, fontSize: 13, color: 'rgba(33,22,51,0.65)' },
    time: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.4)' },
    unread: { marginTop: 6, minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
    unreadTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: '#fff' },

    tracker: { paddingHorizontal: 15, paddingBottom: 14 },
    trackerInner: {},
    trackerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    trackerLevelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    trackerLevel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.cream },
    trackerNiv: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.45)' },
    trackerVia: { fontFamily: fonts.body, fontSize: 11, color: '#4f5bd5' },
    trackerViaStrong: { fontFamily: fonts.bodyBold, color: colors.cream },
    trackerBars: { flexDirection: 'row', gap: 5 },
    trackerBar: { flex: 1, height: 6, borderRadius: 99 },
    trackerNext: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
    trackerNextTxt: { flex: 1, fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.55)' },
    trackerNextStrong: { fontFamily: fonts.bodySemi, color: colors.cream },

    listHead: { marginTop: 18, flexDirection: 'row', alignItems: 'center' },
    listHeadTitle: { fontFamily: fonts.display, fontSize: 14, color: 'rgba(33,22,51,0.7)' },
    listHeadCount: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(33,22,51,0.35)' },

    conv: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11, paddingHorizontal: 8, borderRadius: 16 },
    convAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    convLetter: { fontFamily: fonts.display, fontSize: 18, color: '#fff' },
    convOnline: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#43e08a', borderWidth: 2.5, borderColor: '#fff' },
    convNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    convName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.cream },
    convModeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    convModeDot: { width: 5, height: 5, borderRadius: 3 },
    convModeTxt: { fontFamily: fonts.bodySemi, fontSize: 10 },
    convLast: { marginTop: 3, fontFamily: fonts.body, fontSize: 13, color: 'rgba(33,22,51,0.55)' },
    convPhotoRow: { marginTop: 3, flexDirection: 'row', alignItems: 'center', gap: 6 },
    convNiveau: { marginTop: 3, fontFamily: fonts.body, fontSize: 11, color: 'rgba(33,22,51,0.38)' },

    privacy: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(33,22,51,0.06)' },
    privacyTxt: { fontFamily: fonts.body, fontSize: 11.5, color: 'rgba(33,22,51,0.45)' },
});
