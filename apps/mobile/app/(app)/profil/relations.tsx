// app/(app)/profil/relations.tsx — Carte des relations.
// Vue d'ensemble de tes liens (Mode Rencontre / Amitié), leur niveau et le Cercle
// d'origine. Chaque lien ouvre le profil du membre ; le bouton ouvre le DM.
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, SectionTitle } from '../../../src/components/ui';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { useColors, type Palette } from '../../../src/theme/theme';
import { relations, NIVEAUX_RENCONTRE, NIVEAUX_AMITIE } from '../../../src/data/mock';

const REN = '#ff6fa8';
const AMI = '#8f9dff';

export default function Relations() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const nbRen = relations.filter((r) => r.mode === 'rencontre').length;
    const nbAmi = relations.filter((r) => r.mode === 'amitie').length;

    return (
        <Screen>
            <ScreenHeader title="Carte des relations" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.lg }}>
                <FadeInUp>
                    <View style={s.stats}>
                        <Stat n={relations.length} l="Liens" tint={c.accent} c={c} />
                        <View style={s.div} />
                        <Stat n={nbRen} l="Rencontre" tint={REN} c={c} />
                        <View style={s.div} />
                        <Stat n={nbAmi} l="Amitié" tint={AMI} c={c} />
                    </View>
                </FadeInUp>

                <View>
                    <SectionTitle>Tes liens</SectionTitle>
                    <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
                        {relations.map((r, i) => {
                            const labels = r.mode === 'rencontre' ? NIVEAUX_RENCONTRE : NIVEAUX_AMITIE;
                            const tint = r.mode === 'rencontre' ? REN : AMI;
                            return (
                                <FadeInUp key={r.id} delay={60 + i * 60}>
                                    <PressableScale scaleTo={0.98} onPress={() => router.push(`/(app)/membre/${r.id}`)}>
                                        <View style={s.card}>
                                            <View style={s.cardTop}>
                                                <View>
                                                    <LinearGradient colors={r.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatar}>
                                                        <Text style={s.avatarTxt}>{r.prenom.charAt(0)}</Text>
                                                    </LinearGradient>
                                                    {r.enLigne && <View style={s.online} />}
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View style={s.nameRow}>
                                                        <Text style={s.name}>{r.prenom}, {r.age}</Text>
                                                        <View style={[s.modeChip, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
                                                            <View style={[s.modeDot, { backgroundColor: tint }]} />
                                                            <Text style={[s.modeTxt, { color: tint }]}>{r.mode === 'rencontre' ? 'Rencontre' : 'Amitié'}</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={s.via}>via <Text style={s.viaStrong}>{r.cercle}</Text></Text>
                                                </View>
                                            </View>

                                            <View style={s.levelRow}>
                                                <Text style={[s.levelLabel, { color: tint }]}>{labels[r.niveau - 1]}</Text>
                                                <Text style={s.levelNiv}>Niveau {r.niveau}/5</Text>
                                            </View>
                                            <View style={s.segs}>
                                                {[0, 1, 2, 3, 4].map((j) => (
                                                    j < r.niveau
                                                        ? <LinearGradient key={j} colors={[tint, tint]} style={s.seg} />
                                                        : <View key={j} style={[s.seg, { backgroundColor: c.ink(0.12) }]} />
                                                ))}
                                            </View>

                                            <Pressable style={[s.msgBtn, { borderColor: tint + '55', backgroundColor: tint + '14' }]} onPress={() => router.push(`/(app)/messages/${r.id}`)}>
                                                <Ionicons name="chatbubble-ellipses-outline" size={15} color={tint} />
                                                <Text style={[s.msgBtnTxt, { color: tint }]}>Ouvrir la conversation</Text>
                                            </Pressable>
                                        </View>
                                    </PressableScale>
                                </FadeInUp>
                            );
                        })}
                    </View>
                </View>

                <FadeInUp delay={420}>
                    <SectionTitle>Comment on progresse</SectionTitle>
                    <Ladder title="Mode Rencontre" tint={REN} steps={NIVEAUX_RENCONTRE} c={c} />
                    <View style={{ height: spacing.md }} />
                    <Ladder title="Mode Amitié" tint={AMI} steps={NIVEAUX_AMITIE} c={c} />
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

function Stat({ n, l, tint, c }: { n: number; l: string; tint: string; c: Palette }) {
    const s = makeStyles(c);
    return (
        <View style={s.stat}>
            <Text style={[s.statN, { color: tint }]}>{n}</Text>
            <Text style={s.statL}>{l}</Text>
        </View>
    );
}

function Ladder({ title, tint, steps, c }: { title: string; tint: string; steps: string[]; c: Palette }) {
    const s = makeStyles(c);
    return (
        <View style={s.ladder}>
            <View style={s.ladderHead}>
                <View style={[s.ladderDot, { backgroundColor: tint }]} />
                <Text style={s.ladderTitle}>{title}</Text>
            </View>
            {steps.map((st, i) => (
                <View key={st} style={s.ladderRow}>
                    <View style={[s.ladderNum, { borderColor: tint + '66' }]}><Text style={[s.ladderNumTxt, { color: tint }]}>{i + 1}</Text></View>
                    <Text style={s.ladderStep}>{st}</Text>
                    {i < steps.length - 1 && <Ionicons name="arrow-down" size={12} color={c.ink(0.25)} style={s.ladderArrow} />}
                </View>
            ))}
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    stats: { flexDirection: 'row', padding: 4, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    stat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    statN: { fontFamily: fonts.display, fontSize: 22 },
    statL: { marginTop: 3, fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.5) },
    div: { width: 1, backgroundColor: c.border, marginVertical: 9 },

    card: { padding: 15, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, gap: 11 },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    avatarTxt: { fontFamily: fonts.display, fontSize: 18, color: '#fff' },
    online: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#43e08a', borderWidth: 2.5, borderColor: c.card },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    name: { fontFamily: fonts.bodyBold, fontSize: 15, color: c.text },
    modeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, borderWidth: 1 },
    modeDot: { width: 5, height: 5, borderRadius: 3 },
    modeTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5 },
    via: { marginTop: 3, fontFamily: fonts.body, fontSize: 12, color: c.ink(0.5) },
    viaStrong: { fontFamily: fonts.bodyBold, color: c.ink(0.75) },

    levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    levelLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
    levelNiv: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.45) },
    segs: { flexDirection: 'row', gap: 5 },
    seg: { flex: 1, height: 6, borderRadius: 99 },
    msgBtn: { marginTop: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
    msgBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 13 },

    ladder: { padding: 15, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, marginTop: spacing.sm },
    ladderHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    ladderDot: { width: 9, height: 9, borderRadius: 5 },
    ladderTitle: { fontFamily: fonts.display, fontSize: 15, color: c.text },
    ladderRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 5 },
    ladderNum: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    ladderNumTxt: { fontFamily: fonts.bodyBold, fontSize: 12 },
    ladderStep: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: c.text },
    ladderArrow: { position: 'absolute', left: 6, top: 30 },
});
