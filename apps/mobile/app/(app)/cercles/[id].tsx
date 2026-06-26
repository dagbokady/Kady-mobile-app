// app/(app)/cercles/[id].tsx — Cercle Detail / salle d'accueil (handoff "KADY Cercle Detail.dc.html")
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp, PressableScale, AnimatedBar, Pulse } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { gradients, themeOf } from '../../../src/theme/colors';
import { useColors, type Palette } from '../../../src/theme/theme';
import { mesCercles, cerclesDecouvrir } from '../../../src/data/mock';
import { useStore } from '../../../src/store/app';

type Member = { id?: string; initial: string; grad: readonly string[]; name: string; sub: string; you?: boolean; subColor?: string; tag?: string; tagBg?: string; tagBd?: string; tagColor?: string; online?: boolean; lien?: boolean };
const MEMBERS: Member[] = [
    { initial: 'D', grad: ['#5a7fd6', '#7a4fd6'], name: 'Didier', you: true, sub: 'Fondateur', tag: 'Admin', tagBg: 'rgba(255,210,122,0.16)', tagBd: 'rgba(255,210,122,0.35)', tagColor: '#e0a93a', online: false },
    { id: 'awa', initial: 'A', grad: ['#ff9d5c', '#d34d7e'], name: 'Awa, 26', sub: 'En ligne', subColor: '#1f9d57', online: true, lien: true },
    { id: 'koffi', initial: 'K', grad: ['#7be0a0', '#2f9ac2'], name: 'Koffi, 29', sub: 'En ligne', subColor: '#1f9d57', online: true },
    { id: 'sophie', initial: 'S', grad: ['#b07bff', '#7a4fd6'], name: 'Sophie, 28', sub: 'Vu il y a 1 h', tag: 'Nouvelle', tagBg: 'rgba(123,224,160,0.14)', tagBd: 'rgba(123,224,160,0.3)', tagColor: '#1f9d57', online: false },
];

export default function CercleDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const cc = useColors();
    const s = makeStyles(cc);
    const c = [...mesCercles, ...cerclesDecouvrir].find((x) => x.id === id) ?? mesCercles[0];
    const t = themeOf(c.theme);
    const niveau = c.niveau ?? 3;
    const openChat = () => router.push({ pathname: '/(app)/cercles/chat', params: { nom: c.nom, theme: c.theme } });
    const going = useStore((st) => st.rsvp['assinie'] ?? false);
    const toggleRsvp = useStore((st) => st.toggleRsvp);
    const leave = useStore((st) => st.leave);
    const onLeave = () => { leave(c.id); router.back(); };
    const onInvite = () => { Share.share({ message: `Rejoins le cercle « ${c.nom} » sur KADY 💫 https://kady.ci` }).catch(() => {}); };
    const onMore = () => {
        Alert.alert(c.nom, undefined, [
            { text: 'Partager le cercle', onPress: onInvite },
            { text: 'Règles du cercle', onPress: () => Alert.alert('Règles du cercle', '· Respect et bienveillance avant tout\n· Pas de coordonnées partagées en public\n· On reste dans le thème') },
            { text: 'Signaler', style: 'destructive', onPress: () => Alert.alert('Signalement envoyé', "Merci, notre équipe de modération va l'examiner.") },
            { text: 'Annuler', style: 'cancel' },
        ]);
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={[s.cover, { paddingTop: insets.top }]}>
                    <LinearGradient colors={[t.from, t.to, '#3a1c5e']} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
                    <LinearGradient colors={['rgba(10,6,20,0.25)', 'transparent', 'rgba(10,6,20,0.55)']} style={StyleSheet.absoluteFill} />

                    <View style={s.coverNav}>
                        <Pressable onPress={() => router.back()} style={s.glassBtn}><Ionicons name="chevron-back" size={20} color="#fff" /></Pressable>
                        <View style={{ flexDirection: 'row', gap: 9 }}>
                            <Pressable style={s.glassBtn} onPress={onInvite}><Ionicons name="share-social-outline" size={18} color="#fff" /></Pressable>
                            <Pressable style={s.glassBtn} onPress={onMore}><Ionicons name="ellipsis-vertical" size={18} color="#fff" /></Pressable>
                        </View>
                    </View>

                    <View style={s.coverTitle}>
                        <View style={s.coverChips}>
                            <View style={[s.coverChip, { backgroundColor: 'rgba(255,210,122,0.22)', borderColor: 'rgba(255,210,122,0.4)' }]}>
                                <Ionicons name="star" size={11} color="#ffd27a" />
                                <Text style={[s.coverChipTxt, { color: '#ffe7b0' }]}>Cercle Étoile</Text>
                            </View>
                            <View style={[s.coverChip, { backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.22)' }]}>
                                <Pulse><View style={s.liveDot} /></Pulse>
                                <Text style={[s.coverChipTxt, { color: '#fff' }]}>Très actif</Text>
                            </View>
                        </View>
                        <Text style={s.coverName}>{c.nom}</Text>
                        <View style={s.coverMeta}>
                            <Text style={s.coverMetaTxt}>{c.theme} · Aventure</Text>
                            <Text style={s.coverDot}>·</Text>
                            <Ionicons name="location" size={12} color="rgba(255,255,255,0.85)" />
                            <Text style={s.coverMetaTxt}>2 km</Text>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
                    <FadeInUp>
                        <View style={s.membersRow}>
                            <View style={{ flexDirection: 'row' }}>
                                {['#ff9d5c', '#7fe0d0', '#b07bff'].map((cl, i) => (
                                    <LinearGradient key={i} colors={[cl, cl]} style={[s.stackAv, i > 0 && { marginLeft: -12 }]} />
                                ))}
                                <View style={[s.stackAv, s.stackExtra]}><Text style={s.stackExtraTxt}>+{Math.max(0, c.membres - 3)}</Text></View>
                            </View>
                            <View>
                                <Text style={s.membersCount}>{c.membres} / {c.max} membres</Text>
                                <Text style={s.membersBalance}>4 femmes · 4 hommes</Text>
                            </View>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={60}>
                        <Text style={s.desc}>{c.description ?? "Un cercle pour les passionnés d'évasion d'Abidjan. On partage nos bons plans, on organise des sorties et on crée des liens avant tout authentiques. 🌍✈️"}</Text>
                    </FadeInUp>

                    <FadeInUp delay={90}>
                        <View style={s.tags}>
                            {[c.theme, 'Sorties', 'Abidjan'].map((tg) => (
                                <View key={tg} style={s.tag}><Text style={s.tagTxt}>#{tg}</Text></View>
                            ))}
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={120}>
                        <LinearGradient colors={['rgba(255,106,169,0.12)', 'rgba(255,111,194,0.06)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.xpCard}>
                            <View style={s.xpTop}>
                                <View style={s.xpTitleRow}>
                                    <Ionicons name="flash" size={15} color={cc.accent} />
                                    <Text style={s.xpTitle}>Niveau du cercle {niveau}</Text>
                                </View>
                                <Text style={s.xpVal}><Text style={s.xpValStrong}>320</Text> / 500 XP</Text>
                            </View>
                            <AnimatedBar progress={0.64} height={8} track={cc.ink(0.12)}>
                                <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                            </AnimatedBar>
                            <Text style={s.xpHint}>Encore 180 XP pour débloquer les <Text style={s.xpHintStrong}>albums photo partagés</Text></Text>
                        </LinearGradient>
                    </FadeInUp>

                    <FadeInUp delay={180}>
                        <View style={s.actions}>
                            <PressableScale onPress={openChat} style={{ flex: 2 }}>
                                <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.chatBtn}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
                                    <Text style={s.chatBtnTxt}>Ouvrir le chat</Text>
                                </LinearGradient>
                            </PressableScale>
                            <Pressable style={s.inviteBtn} onPress={onInvite}>
                                <Ionicons name="person-add-outline" size={17} color={cc.accentDeep} />
                                <Text style={s.inviteBtnTxt}>Inviter</Text>
                            </Pressable>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={240}>
                        <View style={[s.sectionRow, { marginTop: 22 }]}>
                            <Ionicons name="calendar-outline" size={18} color={cc.accent} />
                            <Text style={s.sectionTitle}>Prochaine sortie</Text>
                        </View>
                        <View style={s.event}>
                            <LinearGradient colors={['#7fe0d0', '#2f9aa8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.eventDate}>
                                <Text style={s.eventDay}>28</Text>
                                <Text style={s.eventMonth}>JUIN</Text>
                            </LinearGradient>
                            <View style={{ flex: 1 }}>
                                <Text style={s.eventTitle}>Sortie plage à Assinie</Text>
                                <Text style={s.eventSub}>09:00 · Plage de Marlin · 5 participants</Text>
                            </View>
                            <Pressable onPress={() => toggleRsvp('assinie')} style={[s.eventBtn, going && s.eventBtnOn]}>
                                {going && <Ionicons name="checkmark" size={13} color="#fff" />}
                                <Text style={[s.eventBtnTxt, going && { color: '#fff' }]}>{going ? "J'y serai" : 'Je viens'}</Text>
                            </Pressable>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={300}>
                        <View style={[s.sectionRow, { marginTop: 22, justifyContent: 'space-between' }]}>
                            <View style={s.sectionTitleRow}>
                                <Ionicons name="people-outline" size={18} color={cc.accent} />
                                <Text style={s.sectionTitle}>Membres</Text>
                            </View>
                            <Pressable onPress={openChat}><Text style={s.seeAll}>Voir tous</Text></Pressable>
                        </View>
                        <View style={{ gap: 4 }}>
                            {MEMBERS.map((m, i) => (
                                <Pressable key={i} style={s.member} onPress={() => m.id && router.push(`/(app)/membre/${m.id}`)} disabled={!m.id}>
                                    <View>
                                        <LinearGradient colors={m.grad as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.memberAv}>
                                            <Text style={s.memberAvTxt}>{m.initial}</Text>
                                        </LinearGradient>
                                        {m.online && <View style={s.memberOnline} />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.memberName}>{m.name}{m.you && <Text style={s.memberYou}> · Vous</Text>}</Text>
                                        <Text style={[s.memberSub, m.subColor ? { color: m.subColor } : null]}>{m.sub}</Text>
                                    </View>
                                    {m.lien && (
                                        <View style={[s.memberTag, { backgroundColor: 'rgba(255,111,168,0.14)', borderColor: 'rgba(255,111,168,0.3)' }]}>
                                            <Ionicons name="heart" size={10} color="#ff6fa8" />
                                            <Text style={[s.memberTagTxt, { color: '#ff6fa8' }]}>Lien</Text>
                                        </View>
                                    )}
                                    {m.tag && (
                                        <View style={[s.memberTag, { backgroundColor: m.tagBg, borderColor: m.tagBd }]}>
                                            <Text style={[s.memberTagTxt, { color: m.tagColor }]}>{m.tag}</Text>
                                        </View>
                                    )}
                                    {m.id && <Ionicons name="chevron-forward" size={16} color={cc.ink(0.3)} />}
                                </Pressable>
                            ))}
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={360}>
                        <Pressable style={s.leave} onPress={onLeave}><Text style={s.leaveTxt}>Quitter le cercle</Text></Pressable>
                    </FadeInUp>
                </View>
            </ScrollView>
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg[1] },
    cover: { height: 262, justifyContent: 'flex-start' },
    coverNav: { paddingHorizontal: 18, height: 44, marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    glassBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    coverTitle: { position: 'absolute', left: 20, right: 20, bottom: 18 },
    coverChips: { flexDirection: 'row', gap: 8, marginBottom: 7 },
    coverChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, borderWidth: 1 },
    coverChipTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#43e08a' },
    coverName: { fontFamily: fonts.displayBold, fontSize: 26, color: '#fff', textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 14 },
    coverMeta: { marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 8 },
    coverMetaTxt: { fontFamily: fonts.body, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' },
    coverDot: { color: 'rgba(255,255,255,0.5)' },

    membersRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
    stackAv: { width: 34, height: 34, borderRadius: 17, borderWidth: 2.5, borderColor: c.bg[1] },
    stackExtra: { marginLeft: -12, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' },
    stackExtraTxt: { fontFamily: fonts.bodyBold, fontSize: 11, color: c.accent },
    membersCount: { fontFamily: fonts.bodyBold, fontSize: 14, color: c.text },
    membersBalance: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.45) },

    desc: { marginTop: 16, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 21, color: c.ink(0.7) },
    tags: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
    tag: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    tagTxt: { fontFamily: fonts.bodySemi, fontSize: 12, color: c.ink(0.7) },

    xpCard: { marginTop: 16, padding: 15, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,140,190,0.2)' },
    xpTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
    xpTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    xpTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: c.text },
    xpVal: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.6) },
    xpValStrong: { fontFamily: fonts.bodyBold, color: c.text },
    xpHint: { marginTop: 9, fontFamily: fonts.body, fontSize: 11, color: c.ink(0.5) },
    xpHintStrong: { fontFamily: fonts.bodyBold, color: c.accentDeep },

    actions: { marginTop: 16, flexDirection: 'row', gap: 10 },
    chatBtn: { paddingVertical: 14, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.55, shadowRadius: 18, elevation: 6 },
    chatBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },
    inviteBtn: { flex: 1, paddingVertical: 14, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(255,140,190,0.14)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.35)' },
    inviteBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 13, color: c.accentDeep },

    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    sectionTitle: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    seeAll: { fontFamily: fonts.bodySemi, fontSize: 13, color: c.accent },

    event: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 6 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.1, shadowRadius: 14, elevation: 2 },
    eventDate: { width: 52, paddingVertical: 9, borderRadius: 13, alignItems: 'center' },
    eventDay: { fontFamily: fonts.displayBold, fontSize: 20, color: '#fff' },
    eventMonth: { fontFamily: fonts.bodySemi, fontSize: 10, color: '#fff', marginTop: 2 },
    eventTitle: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: c.text },
    eventSub: { marginTop: 3, fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.5) },
    eventBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 11, backgroundColor: 'rgba(123,224,160,0.16)', borderWidth: 1, borderColor: 'rgba(123,224,160,0.35)' },
    eventBtnOn: { backgroundColor: '#1f9d57', borderColor: '#1f9d57' },
    eventBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#1f9d57' },

    member: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, paddingHorizontal: 4 },
    memberAv: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    memberAvTxt: { fontFamily: fonts.display, fontSize: 16, color: '#fff' },
    memberOnline: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: '#43e08a', borderWidth: 2, borderColor: c.bg[1] },
    memberName: { fontFamily: fonts.bodyBold, fontSize: 14, color: c.text },
    memberYou: { fontFamily: fonts.bodySemi, fontSize: 11, color: c.accent },
    memberSub: { marginTop: 1, fontFamily: fonts.body, fontSize: 11, color: c.ink(0.45) },
    memberTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99, borderWidth: 1 },
    memberTagTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5 },

    leave: { marginTop: 18, paddingVertical: 13, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: 'center' },
    leaveTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: '#ef5350' },
});
