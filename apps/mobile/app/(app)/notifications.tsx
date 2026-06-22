// app/(app)/notifications.tsx — Notifications (handoff "KADY Notifications.dc.html")
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../src/components/Screen';
import { FadeInUp, PressableScale } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { gradients } from '../../src/theme/colors';
import { useColors, type Palette } from '../../src/theme/theme';
import { useStore } from '../../src/store/app';

const PAD = 22;

export default function Notifications() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const read = useStore((st) => st.notifsRead.includes('ALL'));
    const request = useStore((st) => st.request);
    const markAllRead = useStore((st) => st.markAllNotifsRead);
    const setRequest = useStore((st) => st.setRequest);
    return (
        <Screen padded={false}>
            <FadeInUp>
                <View style={s.header}>
                    <Pressable onPress={() => router.back()} style={s.back}><Ionicons name="chevron-back" size={20} color={c.text} /></Pressable>
                    <Text style={s.h1}>Notifications</Text>
                    <Pressable hitSlop={8} onPress={markAllRead}><Text style={s.allRead}>Tout lire</Text></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 40 }}>
                <FadeInUp delay={50}><Text style={s.sectionLabel}>NOUVEAU</Text></FadeInUp>

                {request === 'pending' ? (
                    <FadeInUp delay={90}>
                        <View style={s.requestCard}>
                            <View>
                                <LinearGradient colors={['#ff9d5c', '#d34d7e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarCircle}><Text style={s.avatarTxt}>A</Text></LinearGradient>
                                <View style={s.heartBadge}><Ionicons name="heart" size={11} color="#fff" /></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.reqTxt}><Text style={s.bold}>Awa</Text> souhaite passer au niveau <Text style={s.reqLevel}>L'Ami(e)</Text> avec vous</Text>
                                <View style={s.reqActions}>
                                    <PressableScale onPress={() => { setRequest('accepted'); router.push('/(app)/messages/awa'); }}>
                                        <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.accept}><Text style={s.acceptTxt}>Accepter</Text></LinearGradient>
                                    </PressableScale>
                                    <Pressable style={s.later} onPress={() => setRequest('dismissed')}><Text style={s.laterTxt}>Plus tard</Text></Pressable>
                                </View>
                                <Text style={s.time}>Il y a 5 min</Text>
                            </View>
                            {!read && <View style={[s.unreadDot, { top: 16, right: 14 }]} />}
                        </View>
                    </FadeInUp>
                ) : (
                    <FadeInUp delay={90}>
                        <View style={s.handledCard}>
                            <Ionicons name={request === 'accepted' ? 'checkmark-circle' : 'time-outline'} size={18} color={request === 'accepted' ? '#1f9d57' : c.ink(0.45)} />
                            <Text style={s.handledTxt}>{request === 'accepted' ? "Demande acceptée — vous êtes désormais L'Ami(e) avec Awa" : 'Demande reportée'}</Text>
                        </View>
                    </FadeInUp>
                )}

                <FadeInUp delay={130}>
                    <PressableScale style={s.card} scaleTo={0.98} onPress={() => router.push({ pathname: '/(app)/cercles/chat', params: { nom: 'Voyageurs', theme: 'Voyage' } })}>
                        <View>
                            <LinearGradient colors={['#ff9d5c', '#c2477e', '#3b1f63']} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={s.tile} />
                            <View style={s.tileBadge}><Ionicons name="chatbubble-outline" size={12} color={c.accent} /></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.cardTxt}>3 nouveaux messages dans <Text style={s.bold}>Voyageurs</Text></Text>
                            <Text style={s.time}>Il y a 18 min</Text>
                        </View>
                        {!read && <View style={s.unreadDotInline} />}
                    </PressableScale>
                </FadeInUp>

                <FadeInUp delay={170}>
                    <View style={s.card}>
                        <LinearGradient colors={['#ffd27a', '#ff9d5c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tile}>
                            <Ionicons name="star" size={22} color="#5a3a12" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.cardTxt}>Vous avez gagné <Text style={[s.bold, { color: '#e8893a' }]}>+50 XP</Text> · plus que 350 pour le niveau 5 !</Text>
                            <Text style={s.time}>Il y a 1 h</Text>
                        </View>
                        {!read && <View style={s.unreadDotInline} />}
                    </View>
                </FadeInUp>

                <FadeInUp delay={210}><Text style={[s.sectionLabel, { marginTop: 22 }]}>PLUS TÔT</Text></FadeInUp>

                <FadeInUp delay={250}>
                    <View style={s.cardMuted}>
                        <View>
                            <LinearGradient colors={['#b07bff', '#7a4fd6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarCircle}><Text style={s.avatarTxt}>S</Text></LinearGradient>
                            <View style={s.tileBadge}><Ionicons name="person-add" size={12} color={c.accent} /></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.cardTxtMuted}><Text style={s.bold}>Sophie</Text> a rejoint le cercle <Text style={s.cercle}>Entrepreneurs 225</Text></Text>
                            <Text style={s.time}>Hier</Text>
                        </View>
                    </View>
                </FadeInUp>

                <FadeInUp delay={290}>
                    <View style={s.cardMuted}>
                        <LinearGradient colors={['#43e08a', '#2fa8c2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tile}>
                            <Ionicons name="shield-checkmark" size={22} color="#06281a" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.cardTxtMuted}>Votre identité a été <Text style={[s.bold, { color: '#1f9d57' }]}>vérifiée</Text>. Badge Vérifié+ débloqué !</Text>
                            <Text style={s.time}>Hier</Text>
                        </View>
                    </View>
                </FadeInUp>

                <FadeInUp delay={330}>
                    <PressableScale style={s.cardMuted} scaleTo={0.98} onPress={() => router.push('/(app)/profil/premium')}>
                        <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tile}>
                            <Ionicons name="diamond" size={20} color="#fff" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.cardTxtMuted}>Découvrez <Text style={s.cercle}>KADY Premium</Text> · 7 jours offerts</Text>
                            <Text style={s.time}>Il y a 2 j</Text>
                        </View>
                    </PressableScale>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
    back: { width: 42, height: 42, borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    h1: { flex: 1, fontFamily: fonts.display, fontSize: 23, color: c.text, letterSpacing: -0.3 },
    allRead: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: c.accent },

    sectionLabel: { marginTop: 8, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.5, color: c.ink(0.4) },

    requestCard: { marginTop: 11, flexDirection: 'row', alignItems: 'flex-start', gap: 13, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,111,168,0.10)', borderWidth: 1, borderColor: 'rgba(255,111,168,0.22)' },
    handledCard: { marginTop: 11, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, backgroundColor: c.card2, borderWidth: 1, borderColor: c.border },
    handledTxt: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, color: c.ink(0.6) },
    avatarCircle: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
    avatarTxt: { fontFamily: fonts.display, fontSize: 17, color: '#fff' },
    heartBadge: { position: 'absolute', bottom: -3, right: -3, width: 22, height: 22, borderRadius: 11, backgroundColor: '#ff6fa8', borderWidth: 2, borderColor: c.bg[1], alignItems: 'center', justifyContent: 'center' },
    reqTxt: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: c.ink(0.78) },
    bold: { fontFamily: fonts.bodyBold, color: c.text },
    reqLevel: { fontFamily: fonts.bodyBold, color: '#ff6fa8' },
    reqActions: { marginTop: 8, flexDirection: 'row', gap: 8 },
    accept: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 10, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 4 },
    acceptTxt: { fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' },
    later: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    laterTxt: { fontFamily: fonts.bodyBold, fontSize: 12, color: c.ink(0.6) },
    time: { marginTop: 7, fontFamily: fonts.body, fontSize: 11, color: c.ink(0.42) },
    unreadDot: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#ff4d97' },

    card: { marginTop: 9, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 6 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.1, shadowRadius: 14, elevation: 2 },
    cardMuted: { marginTop: 9, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 18, backgroundColor: c.card2, borderWidth: 1, borderColor: c.border },
    tile: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    tileBadge: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: c.card2, borderWidth: 2, borderColor: c.card, alignItems: 'center', justifyContent: 'center' },
    cardTxt: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: c.ink(0.78) },
    cardTxtMuted: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: c.ink(0.7) },
    cercle: { fontFamily: fonts.bodyBold, color: c.accentDeep },
    unreadDotInline: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#ff4d97' },
});
