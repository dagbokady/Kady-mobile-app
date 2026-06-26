// app/(app)/membre/[id].tsx — Profil public d'un membre.
// Accessible depuis un Cercle, la Carte des relations ou l'en-tête d'un DM.
// Le bouton « message » respecte l'invariant KADY : il n'apparaît que si un
// Cercle est partagé (ici matérialisé par r.cercle).
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { useColors, type Palette } from '../../../src/theme/theme';
import { relations, NIVEAUX_RENCONTRE, NIVEAUX_AMITIE, DISC_FIELDS, DISC_DATA } from '../../../src/data/mock';
import { useStore, useToast } from '../../../src/store/app';

const INTERETS: Record<string, string[]> = {
    awa: ['Voyage', 'Cuisine', 'Photographie'],
    koffi: ['Basket', 'Musique', 'Streetwear'],
    mariam: ['Cinéma', 'Gospel', 'Lecture'],
    fatou: ['Brunch', 'Mode', 'Danse'],
    yann: ['Entrepreneuriat', 'Tech', 'Running'],
    sophie: ['Art', 'Voyage', 'Yoga'],
};
const PHOTOS = [['#ff9d5c', '#d34d7e'], ['#7be0a0', '#2f9ac2'], ['#b07bff', '#7a4fd6']];

export default function Membre() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const c = useColors();
    const s = makeStyles(c);
    const r = relations.find((x) => x.id === id) ?? relations[0];
    const labels = r.mode === 'rencontre' ? NIVEAUX_RENCONTRE : NIVEAUX_AMITIE;
    const tint = r.mode === 'rencontre' ? '#ff6fa8' : '#8f9dff';
    const interets = INTERETS[r.id] ?? ['Voyage', 'Musique', 'Cuisine'];

    // Niveau effectif (override store sinon seed du mock).
    const niveauOverride = useStore((st) => st.niveaux[r.id]);
    const niveau = Math.min(niveauOverride ?? r.niveau, 5);

    // Jeu de découverte : infos révélées + points (persistés dans le store).
    const revealed = useStore((st) => st.disc[r.id] ?? []);
    const points = useStore((st) => st.discPoints[r.id] ?? 0);
    const revealDisc = useStore((st) => st.revealDisc);
    const discData = DISC_DATA[r.id] ?? {};
    const discTotal = DISC_FIELDS.length;
    const discDone = revealed.length;
    const discPct = Math.round((discDone / discTotal) * 100);
    const [openField, setOpenField] = useState<string | null>(null);

    const guess = (field: string, option: string) => {
        const correct = discData[field]?.[0];
        setOpenField(null);
        if (option === correct) {
            revealDisc(r.id, field);
            useToast.getState().show('Bien vu ! +10 points de découverte 🎉');
        } else {
            useToast.getState().show('Pas encore… continue la conversation 💬');
        }
    };

    const overflow = () => {
        Alert.alert(r.prenom, undefined, [
            { text: 'Masquer ce profil', onPress: () => { Alert.alert('Profil masqué', `${r.prenom} n'apparaîtra plus dans tes suggestions.`); } },
            { text: 'Signaler', style: 'destructive', onPress: () => Alert.alert('Signalement envoyé', "Merci, notre équipe de modération va l'examiner.") },
            { text: 'Annuler', style: 'cancel' },
        ]);
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={[s.cover, { paddingTop: insets.top }]}>
                    <LinearGradient colors={[r.grad[0], r.grad[1], '#2a1c5e']} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
                    <LinearGradient colors={['rgba(10,6,20,0.25)', 'transparent', 'rgba(10,6,20,0.35)']} style={StyleSheet.absoluteFill} />
                    <View style={s.coverNav}>
                        <Pressable onPress={() => router.back()} style={s.glassBtn}><Ionicons name="chevron-back" size={20} color="#fff" /></Pressable>
                        <Pressable onPress={overflow} style={s.glassBtn}><Ionicons name="ellipsis-vertical" size={18} color="#fff" /></Pressable>
                    </View>
                </View>

                <View style={s.body}>
                    <FadeInUp>
                        <View style={s.avatarWrap}>
                            <LinearGradient colors={r.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarRing}>
                                <View style={[s.avatar, { backgroundColor: c.card }]}>
                                    <Text style={[s.avatarLetter, { color: tint }]}>{r.prenom.charAt(0)}</Text>
                                </View>
                            </LinearGradient>
                            {r.enLigne && <View style={s.online} />}
                        </View>

                        <View style={s.nameRow}>
                            <Text style={s.name}>{r.prenom}, {r.age}</Text>
                            <View style={[s.modeChip, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
                                <View style={[s.modeDot, { backgroundColor: tint }]} />
                                <Text style={[s.modeTxt, { color: tint }]}>{r.mode === 'rencontre' ? 'Rencontre' : 'Amitié'}</Text>
                            </View>
                        </View>
                        <View style={s.locRow}>
                            <Ionicons name="location-outline" size={13} color={c.ink(0.5)} />
                            <Text style={s.loc}>Abidjan</Text>
                            <Text style={s.dot}>·</Text>
                            <Text style={[s.status, { color: r.enLigne ? '#1f9d57' : c.ink(0.5) }]}>{r.enLigne ? 'En ligne' : 'Hors ligne'}</Text>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={70}>
                        <View style={s.levelCard}>
                            <View style={s.levelTop}>
                                <Text style={[s.levelLabel, { color: tint }]}>{labels[niveau - 1]}</Text>
                                <Text style={s.levelNiv}>Niveau {niveau}/5</Text>
                            </View>
                            <View style={s.segs}>
                                {[0, 1, 2, 3, 4].map((j) => (
                                    j < niveau
                                        ? <LinearGradient key={j} colors={[tint, tint]} style={s.seg} />
                                        : <View key={j} style={[s.seg, { backgroundColor: c.ink(0.12) }]} />
                                ))}
                            </View>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={120}>
                        <View style={s.sharedCard}>
                            <View style={s.sharedIcon}><Ionicons name="people" size={18} color={c.accent} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.sharedTitle}>Cercle partagé</Text>
                                <Text style={s.sharedSub}>Vous vous êtes rencontrés dans <Text style={s.sharedStrong}>{r.cercle}</Text></Text>
                            </View>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={170}>
                        <Text style={s.bio}>Membre de la communauté KADY. {r.prenom} aime les vraies conversations et les rencontres qui naissent dans un Cercle. 💫</Text>
                    </FadeInUp>

                    <FadeInUp delay={200}>
                        <View style={s.discHead}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="sparkles" size={17} color={tint} />
                                <Text style={s.discHeadTitle}>Profil à découvrir</Text>
                            </View>
                            <View style={[s.discPts, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
                                <Ionicons name="diamond" size={11} color={tint} />
                                <Text style={[s.discPtsTxt, { color: tint }]}>{points} pts</Text>
                            </View>
                        </View>

                        <View style={s.discProgress}>
                            <View style={[s.discRing, { borderColor: tint }]}>
                                <Text style={[s.discPctTxt, { color: tint }]}>{discPct}%</Text>
                            </View>
                            <View style={{ flex: 1, minWidth: 0 }}>
                                <Text style={s.discProgTitle}>{discDone} sur {discTotal} infos découvertes</Text>
                                <Text style={s.discProgSub}>Devine ce que tu as appris au fil de vos échanges. Bonne réponse = info révélée, rien que pour vous deux.</Text>
                            </View>
                        </View>

                        <View style={s.discGrid}>
                            {DISC_FIELDS.map((f) => {
                                const isRevealed = revealed.includes(f.key);
                                const isOpen = openField === f.key;
                                const value = discData[f.key]?.[0] ?? '???';
                                const options = discData[f.key]?.[1] ?? [];
                                return (
                                    <View key={f.key} style={[s.discCase, isOpen && { borderColor: tint }]}>
                                        <Pressable
                                            style={s.discCaseHead}
                                            onPress={() => !isRevealed && setOpenField(isOpen ? null : f.key)}
                                        >
                                            <View style={[s.discCaseIcon, { backgroundColor: isRevealed ? tint + '22' : c.field }]}>
                                                <Ionicons name={isRevealed ? (f.icon as any) : 'help'} size={17} color={isRevealed ? tint : c.ink(0.4)} />
                                            </View>
                                            <View style={{ flex: 1, minWidth: 0 }}>
                                                <Text style={s.discCaseLabel}>{f.label}</Text>
                                                <Text style={[s.discCaseValue, { color: isRevealed ? c.text : c.ink(0.4) }]} numberOfLines={1}>
                                                    {isRevealed ? value : 'À deviner'}
                                                </Text>
                                            </View>
                                            {!isRevealed && <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} color={c.ink(0.4)} />}
                                        </Pressable>
                                        {isOpen && !isRevealed && (
                                            <View style={s.discOptions}>
                                                <Text style={s.discIntuition}>Ton intuition ?</Text>
                                                {options.map((opt) => (
                                                    <Pressable key={opt} style={s.discOption} onPress={() => guess(f.key, opt)}>
                                                        <Text style={s.discOptionTxt}>{opt}</Text>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                        <View style={s.discTip}>
                            <Ionicons name="chatbubbles-outline" size={15} color={c.accent} />
                            <Text style={s.discTipTxt}>Plus vous discutez, plus tu en apprends. La curiosité est récompensée.</Text>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={240}>
                        <Text style={s.sectionTitle}>Centres d'intérêt</Text>
                        <View style={s.interests}>
                            {interets.map((it) => (
                                <View key={it} style={s.interest}><Text style={s.interestTxt}>{it}</Text></View>
                            ))}
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={270}>
                        <Text style={s.sectionTitle}>Photos</Text>
                        <View style={s.photoGrid}>
                            {PHOTOS.map((g, i) => {
                                const requis = i + 2; // photo 1 visible dès niv.1 ; photo i déverrouillée à niv. i+2
                                const locked = i > 0 && niveau < requis;
                                return (
                                    <LinearGradient key={i} colors={g as any} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={s.photo}>
                                        {locked && (
                                            <View style={s.photoLock}>
                                                <Ionicons name="lock-closed" size={16} color="#fff" />
                                                <Text style={s.photoLockTxt}>Niveau {requis}</Text>
                                            </View>
                                        )}
                                    </LinearGradient>
                                );
                            })}
                        </View>
                        <Text style={s.photoHint}>Les photos se débloquent au fil des niveaux de votre lien.</Text>
                    </FadeInUp>
                </View>
            </ScrollView>

            <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
                <PressableScale onPress={() => router.push(`/(app)/messages/${r.id}`)} style={{ flex: 1 }}>
                    <LinearGradient colors={c.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.msgBtn}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
                        <Text style={s.msgBtnTxt}>Envoyer un message</Text>
                    </LinearGradient>
                </PressableScale>
            </View>
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg[1] },
    cover: { height: 180 },
    coverNav: { paddingHorizontal: 18, height: 44, marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    glassBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },

    body: { paddingHorizontal: 22, marginTop: -44, alignItems: 'stretch' },
    avatarWrap: { alignItems: 'center' },
    avatarRing: { width: 96, height: 96, borderRadius: 48, padding: 3, alignSelf: 'center' },
    avatar: { flex: 1, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontFamily: fonts.display, fontSize: 36 },
    online: { position: 'absolute', bottom: 4, right: '36%', width: 18, height: 18, borderRadius: 9, backgroundColor: '#43e08a', borderWidth: 3, borderColor: c.bg[1] },

    nameRow: { marginTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
    name: { fontFamily: fonts.display, fontSize: 22, color: c.text },
    modeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 99, borderWidth: 1 },
    modeDot: { width: 6, height: 6, borderRadius: 3 },
    modeTxt: { fontFamily: fonts.bodyBold, fontSize: 11 },
    locRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    loc: { fontFamily: fonts.body, fontSize: 13, color: c.ink(0.55) },
    dot: { color: c.ink(0.4) },
    status: { fontFamily: fonts.bodySemi, fontSize: 13 },

    levelCard: { marginTop: 18, padding: 15, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, gap: 10 },
    levelTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    levelLabel: { fontFamily: fonts.bodyBold, fontSize: 14 },
    levelNiv: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.45) },
    segs: { flexDirection: 'row', gap: 5 },
    seg: { flex: 1, height: 6, borderRadius: 99 },

    sharedCard: { marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,106,169,0.08)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.25)' },
    sharedIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,140,190,0.16)', alignItems: 'center', justifyContent: 'center' },
    sharedTitle: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: c.text },
    sharedSub: { marginTop: 2, fontFamily: fonts.body, fontSize: 12, color: c.ink(0.6) },
    sharedStrong: { fontFamily: fonts.bodyBold, color: c.accentDeep },

    bio: { marginTop: 16, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: c.ink(0.72), textAlign: 'center' },

    discHead: { marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    discHeadTitle: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    discPts: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99, borderWidth: 1 },
    discPtsTxt: { fontFamily: fonts.bodyBold, fontSize: 11 },
    discProgress: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.07, shadowRadius: 14, elevation: 3 },
    discRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
    discPctTxt: { fontFamily: fonts.displayBold, fontSize: 15 },
    discProgTitle: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: c.text },
    discProgSub: { marginTop: 3, fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: c.ink(0.55) },
    discGrid: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    discCase: { width: '47.5%', padding: 11, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    discCaseHead: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    discCaseIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    discCaseLabel: { fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase', color: c.ink(0.45) },
    discCaseValue: { marginTop: 2, fontFamily: fonts.bodyBold, fontSize: 13.5 },
    discOptions: { marginTop: 11, gap: 7 },
    discIntuition: { fontFamily: fonts.bodySemi, fontSize: 11, color: c.ink(0.5) },
    discOption: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 11, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    discOptionTxt: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: c.text },
    discTip: { marginTop: 11, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 11, borderRadius: 12, backgroundColor: 'rgba(255,106,169,0.07)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.2)' },
    discTipTxt: { flex: 1, fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16, color: c.ink(0.55) },

    sectionTitle: { marginTop: 22, marginBottom: 11, fontFamily: fonts.display, fontSize: 16, color: c.text },
    interests: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    interest: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    interestTxt: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: c.ink(0.75) },

    photoGrid: { flexDirection: 'row', gap: 10 },
    photo: { flex: 1, aspectRatio: 3 / 4, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    photoLock: { alignItems: 'center', gap: 5, backgroundColor: 'rgba(10,6,20,0.35)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
    photoLockTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: '#fff' },
    photoHint: { marginTop: 10, fontFamily: fonts.body, fontSize: 12, color: c.ink(0.45), textAlign: 'center' },

    footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', paddingHorizontal: 22, paddingTop: 12, backgroundColor: c.glassHeader, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border },
    msgBtn: { paddingVertical: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 6 },
    msgBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff' },
});
