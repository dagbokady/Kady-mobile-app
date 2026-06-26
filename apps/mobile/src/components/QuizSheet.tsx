// src/components/QuizSheet.tsx — feuille d'évaluation d'un lien (bottom sheet).
// Étape 1 : noter 5 critères (étoiles). Étape 2 : ressenti + commentaire + moyenne.
// Une moyenne ≥ 4 propose de passer au niveau supérieur (callback onHighRating).
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { useColors, type Palette } from '../theme/theme';
import { useScale } from '../theme/responsive';
import { QUIZ_CRITERIA, QUIZ_MOODS } from '../data/mock';

type Props = {
    visible: boolean;
    name: string;
    grad: readonly [string, string];
    onClose: () => void;
    onSubmit: (avg: number) => void;
};

export default function QuizSheet({ visible, name, grad, onClose, onSubmit }: Props) {
    const c = useColors();
    const { s, ms } = useScale();
    const st = makeStyles(c, s, ms);
    const [step, setStep] = useState(0);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [mood, setMood] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const filled = Object.keys(ratings).length;
    const total = QUIZ_CRITERIA.length;
    const values = Object.values(ratings);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    const reset = () => { setStep(0); setRatings({}); setMood(null); setComment(''); };
    const close = () => { reset(); onClose(); };
    const next = () => {
        if (step === 0) { if (filled < total) return; setStep(1); }
        else { onSubmit(avg); reset(); }
    };
    const back = () => { if (step === 1) setStep(0); else close(); };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
            <View style={st.root}>
                <Pressable style={StyleSheet.absoluteFill} onPress={close} />
                <View style={st.sheet}>
                    <View style={st.handle} />

                    <View style={st.header}>
                        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.headAvatar}>
                            <Text style={st.headInitial}>{name.charAt(0).toUpperCase()}</Text>
                        </LinearGradient>
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={st.headTitle}>Évaluer {name}</Text>
                            <Text style={st.headSub}>Ton avis fait progresser votre lien — en toute confidentialité.</Text>
                        </View>
                        <Pressable style={st.closeBtn} onPress={close}><Ionicons name="close" size={ms(19)} color={c.text} /></Pressable>
                    </View>

                    {step === 0 && (
                        <View style={st.progressWrap}>
                            <View style={st.progressTop}>
                                <Text style={st.progressLabel}>Étape 1 · Critères</Text>
                                <Text style={st.progressCount}>{filled}/{total} notés</Text>
                            </View>
                            <View style={st.progressTrack}>
                                <View style={[st.progressFill, { width: `${(filled / total) * 100}%` as any }]} />
                            </View>
                        </View>
                    )}

                    <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: s(20), paddingBottom: s(4) }} showsVerticalScrollIndicator={false}>
                        {step === 0 ? (
                            QUIZ_CRITERIA.map((crit) => {
                                const rating = ratings[crit.key] ?? 0;
                                return (
                                    <View key={crit.key} style={st.critRow}>
                                        <View style={st.critHead}>
                                            <View style={[st.critIcon, { backgroundColor: crit.tint + '24' }]}>
                                                <Ionicons name={crit.icon as any} size={ms(18)} color={crit.tint} />
                                            </View>
                                            <View style={{ flex: 1, minWidth: 0 }}>
                                                <Text style={st.critLabel}>{crit.label}</Text>
                                                <Text style={st.critDesc}>{crit.desc}</Text>
                                            </View>
                                        </View>
                                        <View style={st.stars}>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <Pressable key={n} onPress={() => setRatings((r) => ({ ...r, [crit.key]: n }))} hitSlop={4} style={{ padding: 2 }}>
                                                    <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={ms(27)} color={n <= rating ? crit.tint : c.ink(0.25)} />
                                                </Pressable>
                                            ))}
                                            {rating > 0 && <Text style={[st.ratingTxt, { color: crit.tint }]}>{rating}/5</Text>}
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={{ paddingVertical: 8 }}>
                                <Text style={st.sectionLabel}>Ton ressenti général</Text>
                                <View style={st.moods}>
                                    {QUIZ_MOODS.map((m, i) => {
                                        const on = mood === i;
                                        return (
                                            <Pressable key={i} onPress={() => setMood(i)} style={[st.mood, on && st.moodOn]}>
                                                <Text style={{ fontSize: ms(24) }}>{m.e}</Text>
                                                <Text style={[st.moodLabel, { color: on ? c.accentDeep : c.ink(0.5) }]}>{m.l}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                <Text style={[st.sectionLabel, { marginTop: 20 }]}>Un mot pour {name} <Text style={{ fontFamily: fonts.body, color: c.ink(0.4) }}>· optionnel</Text></Text>
                                <TextInput
                                    value={comment} onChangeText={setComment} multiline
                                    placeholder="Ce que tu as apprécié, un conseil bienveillant…"
                                    placeholderTextColor={c.ink(0.4)}
                                    style={st.textarea}
                                />

                                <View style={st.avgBox}>
                                    <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.avgBadge}>
                                        <Text style={st.avgNum}>{avg.toFixed(1)}</Text>
                                        <Text style={st.avgUnit}>/ 5</Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1, minWidth: 0 }}>
                                        <Text style={st.avgTitle}>Note moyenne</Text>
                                        <Text style={st.avgSub}>Une note ≥ 4 propose de passer au niveau supérieur ✨</Text>
                                    </View>
                                </View>
                                <View style={st.anon}>
                                    <Ionicons name="lock-closed" size={ms(12)} color={c.ink(0.4)} />
                                    <Text style={st.anonTxt}>Évaluation anonyme · jamais visible telle quelle</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={st.footer}>
                        <Pressable style={st.backBtn} onPress={back}>
                            <Text style={st.backTxt}>{step === 0 ? 'Annuler' : 'Retour'}</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1 }} onPress={next} disabled={step === 0 && filled < total}>
                            <LinearGradient
                                colors={step === 0 && filled < total ? [c.ink(0.18) as any, c.ink(0.18) as any] : ['#ff6aa9', '#e02a73']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.nextBtn}
                            >
                                <Text style={st.nextTxt}>{step === 0 ? 'Continuer' : 'Envoyer mon avis'}</Text>
                                <Ionicons name="arrow-forward" size={ms(17)} color="#fff" />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const makeStyles = (c: Palette, s: (n: number) => number, ms: (n: number, f?: number) => number) => StyleSheet.create({
    root: { flex: 1, backgroundColor: 'rgba(10,6,20,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: c.bg[0], borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '92%', paddingBottom: s(8) },
    handle: { alignSelf: 'center', width: 38, height: 5, borderRadius: 99, backgroundColor: c.ink(0.18), marginTop: 11, marginBottom: 2 },

    header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: s(20), paddingVertical: s(10) },
    headAvatar: { width: s(46), height: s(46), borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    headInitial: { fontFamily: fonts.display, fontSize: ms(18), color: '#fff' },
    headTitle: { fontFamily: fonts.display, fontSize: ms(17), color: c.text },
    headSub: { marginTop: 2, fontFamily: fonts.body, fontSize: ms(11.5), lineHeight: ms(16), color: c.ink(0.55) },
    closeBtn: { width: s(34), height: s(34), borderRadius: 12, backgroundColor: c.field, alignItems: 'center', justifyContent: 'center' },

    progressWrap: { paddingHorizontal: s(20), paddingBottom: 10 },
    progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    progressLabel: { fontFamily: fonts.bodyBold, fontSize: ms(11), color: c.accent },
    progressCount: { fontFamily: fonts.bodySemi, fontSize: ms(11), color: c.ink(0.45) },
    progressTrack: { height: 6, borderRadius: 99, backgroundColor: c.ink(0.1), overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 99, backgroundColor: c.accent },

    critRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: c.border },
    critHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
    critIcon: { width: s(38), height: s(38), borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    critLabel: { fontFamily: fonts.bodyBold, fontSize: ms(14.5), color: c.text },
    critDesc: { marginTop: 1, fontFamily: fonts.body, fontSize: ms(11.5), color: c.ink(0.5) },
    stars: { marginTop: 11, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 49 },
    ratingTxt: { marginLeft: 4, fontFamily: fonts.bodyBold, fontSize: ms(11) },

    sectionLabel: { fontFamily: fonts.bodyBold, fontSize: ms(13.5), color: c.text },
    moods: { marginTop: 11, flexDirection: 'row', gap: 8 },
    mood: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, borderRadius: 14, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    moodOn: { backgroundColor: 'rgba(255,106,169,0.12)', borderColor: 'rgba(255,140,190,0.5)' },
    moodLabel: { fontFamily: fonts.bodyBold, fontSize: ms(11) },
    textarea: { marginTop: 10, height: 84, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.field, padding: 13, fontFamily: fonts.body, fontSize: ms(13.5), lineHeight: ms(19), color: c.text, textAlignVertical: 'top' },

    avgBox: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, borderRadius: 18, backgroundColor: 'rgba(255,106,169,0.1)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.28)' },
    avgBadge: { width: s(54), height: s(54), borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
    avgNum: { fontFamily: fonts.displayBold, fontSize: ms(19), color: '#fff', lineHeight: ms(20) },
    avgUnit: { fontFamily: fonts.bodyBold, fontSize: ms(8), color: 'rgba(255,255,255,0.85)' },
    avgTitle: { fontFamily: fonts.bodyBold, fontSize: ms(13), color: c.text },
    avgSub: { marginTop: 2, fontFamily: fonts.body, fontSize: ms(11.5), lineHeight: ms(16), color: c.ink(0.55) },
    anon: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 7, justifyContent: 'center' },
    anonTxt: { fontFamily: fonts.body, fontSize: ms(11), color: c.ink(0.45) },

    footer: { flexDirection: 'row', gap: 10, paddingHorizontal: s(20), paddingTop: 13, paddingBottom: s(22), borderTopWidth: 1, borderTopColor: c.border },
    backBtn: { paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    backTxt: { fontFamily: fonts.bodyBold, fontSize: ms(14), color: c.text },
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 15, borderRadius: 15 },
    nextTxt: { fontFamily: fonts.bodyBold, fontSize: ms(14), color: '#fff' },
});
