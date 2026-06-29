// app/(app)/messages/[id].tsx — Chat privé (handoff "KADY Chat Prive.dc.html")
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated, Easing, StatusBar, useWindowDimensions, Image, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { fonts } from '../../../src/theme/typography';
import { colorForName } from '../../../src/theme/colors';
import { useColors, type Palette } from '../../../src/theme/theme';
import { NIVEAUX_RENCONTRE, DISC_FIELDS } from '../../../src/data/mock';
import { useStore, useToast } from '../../../src/store/app';
import { useAuth } from '../../../src/store/auth';
import { dm as dmApi, relations as relApi, type DmApi } from '../../../src/api';
import { apiError } from '../../../src/api/client';
import QuizSheet from '../../../src/components/QuizSheet';
import LevelUpModal from '../../../src/components/LevelUpModal';

const SEND_GRAD = ['#ff6aa9', '#e02a73'] as const;

// ISO → HH:MM local.
function fmtHeure(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ChatPrive() {
    const params = useLocalSearchParams<{ id: string; name?: string; niveau?: string; relationId?: string; autreId?: string }>();
    const convId = params.id;
    const prenom = params.name ?? 'Conversation';
    const relationId = params.relationId;
    const autreId = params.autreId ?? '';
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const c = useColors();
    const s = makeStyles(c);
    const labels = NIVEAUX_RENCONTRE;
    const grad = [colorForName(prenom), colorForName(prenom)] as const;

    const [draft, setDraft] = useState('');
    const [quizOpen, setQuizOpen] = useState(false);
    const [levelOpen, setLevelOpen] = useState(false);
    const [niveau, setNiveauLocal] = useState(Math.min(Number(params.niveau ?? '1') || 1, 5));
    const [messages, setMessages] = useState<DmApi[]>([]);
    const [loading, setLoading] = useState(true);

    const meId = useAuth((st) => st.me?.id);
    const discRevealed = useStore((st) => st.disc[autreId] ?? []);
    const scroller = useRef<ScrollView>(null);
    const hasText = draft.trim().length > 0;

    const canLevel = niveau < 5;
    const discTotal = DISC_FIELDS.length;
    const discDone = discRevealed.length;

    // Charge l'historique réel de la conversation à l'ouverture / au focus.
    const charger = useCallback(async () => {
        if (!convId) return;
        try {
            setMessages(await dmApi.messages(convId));
        } catch (e) {
            useToast.getState().show(apiError(e));
        } finally {
            setLoading(false);
            setTimeout(() => scroller.current?.scrollToEnd({ animated: false }), 60);
        }
    }, [convId]);
    useFocusEffect(useCallback(() => { charger(); }, [charger]));

    const send = async () => {
        const t = draft.trim();
        if (!t || !convId) return;
        setDraft('');
        try {
            const msg = await dmApi.envoyer(convId, t);
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 50);
        } catch (e) {
            useToast.getState().show(apiError(e));
        }
    };

    const evaluer = async (moyenne: number): Promise<boolean> => {
        if (!relationId) return false;
        try {
            const r = await relApi.evaluer(relationId, moyenne);
            setNiveauLocal(r.niveau);
            return r.a_evolue;
        } catch (e) {
            useToast.getState().show(apiError(e));
            return false;
        }
    };

    const confirmLevelUp = async () => {
        setLevelOpen(false);
        const evolue = await evaluer(5);
        if (evolue) useToast.getState().show(`Votre lien grandit avec ${prenom} 🎉`);
    };

    const lockedCall = (kind: string) =>
        Alert.alert(`${kind} verrouillé`, `Les appels ${kind.toLowerCase()} se débloquent à un niveau plus élevé. Continuez à échanger pour y arriver 💫`);
    const addEmoji = () => setDraft((d) => d + '😊');
    const openProfile = () => autreId && router.push({ pathname: '/(app)/membre/[id]', params: { id: autreId, name: prenom } });

    return (
        <View style={s.root}>
            <StatusBar barStyle={c.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs>
                    <Pattern id="dots" width={22} height={22} patternUnits="userSpaceOnUse">
                        <Circle cx={1.4} cy={1.4} r={1.4} fill={c.dot} />
                    </Pattern>
                </Defs>
                <Rect width={width} height={height} fill="url(#dots)" />
            </Svg>
            <View pointerEvents="none" style={s.blob} />

            <View style={[s.topbar, { paddingTop: insets.top }]}>
                <View style={s.headerRow}>
                    <Pressable onPress={() => router.back()} hitSlop={10} style={s.back}>
                        <Ionicons name="chevron-back" size={24} color={c.text} />
                    </Pressable>
                    <Pressable onPress={openProfile} style={s.headerId}>
                        <LinearGradient colors={grad as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatar}>
                            <Text style={s.avatarLetter}>{prenom.charAt(0).toUpperCase()}</Text>
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                            <Text style={s.name} numberOfLines={1}>{prenom}</Text>
                            <Text style={[s.status, { color: c.ink(0.45) }]}>{labels[niveau - 1]}</Text>
                        </View>
                    </Pressable>
                    <Pressable style={s.callBtn} onPress={() => setQuizOpen(true)}><Ionicons name="star-outline" size={19} color="#ffb43a" /></Pressable>
                    <Pressable style={s.callBtn} onPress={() => lockedCall('Appel vidéo')}><Ionicons name="videocam-outline" size={20} color={c.accent} /></Pressable>
                    <Pressable style={s.callBtn} onPress={() => lockedCall('Appel audio')}><Ionicons name="call-outline" size={19} color={c.accent} /></Pressable>
                </View>

                {/* Barre de relation : niveau, segments, actions évaluer / passer */}
                <View style={s.relationBar}>
                    <View style={s.relationTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="heart" size={12} color={c.accent} />
                            <Text style={s.relationName}>{labels[niveau - 1]}</Text>
                        </View>
                        <Text style={s.relationLevel}>Niveau {niveau}/5</Text>
                    </View>
                    <View style={s.segs}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <View key={n} style={[s.seg, { flex: 1, backgroundColor: n <= niveau ? c.accent : c.ink(0.12) }]} />
                        ))}
                    </View>
                    {canLevel && (
                        <View style={s.relationActions}>
                            <Pressable style={s.evalBtn} onPress={() => setQuizOpen(true)}>
                                <Ionicons name="star-outline" size={14} color="#ffb43a" />
                                <Text style={s.evalTxt}>Évaluer</Text>
                            </Pressable>
                            <Pressable style={s.levelBtn} onPress={() => setLevelOpen(true)}>
                                <Ionicons name="trending-up" size={14} color={c.accentDeep} />
                                <Text style={s.levelTxt}>Passer au niveau {niveau + 1}</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={insets.top + 8}>
                <ScrollView ref={scroller} style={{ flex: 1 }} contentContainerStyle={s.chat} showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}>
                    <View style={s.dateWrap}><Text style={s.datePill}>Aujourd'hui</Text></View>

                    <View style={s.sysWrap}>
                        <View style={s.sysNote}>
                            <Ionicons name="lock-closed" size={12} color={c.accent} />
                            <Text style={s.sysTxt}> Vous discutez en privé car vous partagez un <Text style={s.sysCercle}>Cercle</Text>. Les coordonnées sont masquées.</Text>
                        </View>
                    </View>

                    {/* Bannière « Profil à découvrir » → ouvre le profil membre (jeu de devinettes) */}
                    {!!autreId && (
                        <Pressable style={s.discBanner} onPress={openProfile}>
                            <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.discIcon}>
                                <Ionicons name="sparkles" size={18} color="#fff" />
                            </LinearGradient>
                            <View style={{ flex: 1, minWidth: 0 }}>
                                <Text style={s.discTitle}>{discDone} sur {discTotal} infos découvertes</Text>
                                <Text style={s.discSub}>Devine ce que tu apprends sur {prenom} →</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={17} color={c.accent} />
                        </Pressable>
                    )}

                    {loading && <ActivityIndicator color={c.accent} style={{ marginTop: 24 }} />}

                    {!loading && messages.length === 0 && (
                        <Text style={s.emptyChat}>Démarre la conversation avec {prenom} 👋</Text>
                    )}

                    {messages.map((m) =>
                        m.auteur_id === meId
                            ? <OutBubble key={m.id} time={fmtHeure(m.created_at)}>{m.contenu}</OutBubble>
                            : <InBubble key={m.id} time={fmtHeure(m.created_at)}>{m.contenu}</InBubble>,
                    )}
                </ScrollView>

                <View style={[s.inputWrap, { paddingBottom: insets.bottom + 9 }]}>
                    <View style={s.inputPill}>
                        <Pressable hitSlop={6} onPress={addEmoji}><Ionicons name="happy-outline" size={22} color={c.ink(0.45)} /></Pressable>
                        <TextInput
                            value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send"
                            placeholder="Message" placeholderTextColor={c.ink(0.4)} style={s.input}
                        />
                    </View>
                    <Pressable onPress={send} disabled={!hasText}>
                        <LinearGradient colors={SEND_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.send, !hasText && { opacity: 0.55 }]}>
                            <Ionicons name="send" size={19} color="#fff" />
                        </LinearGradient>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            <QuizSheet
                visible={quizOpen}
                name={prenom}
                grad={grad}
                onClose={() => setQuizOpen(false)}
                onSubmit={async (avg) => {
                    setQuizOpen(false);
                    if (avg >= 4 && canLevel) {
                        useToast.getState().show('Belle évaluation ✨');
                        setTimeout(() => setLevelOpen(true), 350);
                    } else {
                        await evaluer(avg);
                        useToast.getState().show('Merci pour ton évaluation 🙏');
                    }
                }}
            />
            <LevelUpModal
                visible={levelOpen}
                name={prenom}
                fromN={niveau}
                toN={Math.min(niveau + 1, 5)}
                fromNom={labels[niveau - 1]}
                toNom={labels[Math.min(niveau, 4)]}
                onConfirm={confirmLevelUp}
                onClose={() => setLevelOpen(false)}
            />
        </View>
    );
}

function InBubble({ children, time, gap }: { children: React.ReactNode; time: string; gap?: boolean }) {
    const s = makeStyles(useColors());
    return (
        <View style={[s.rowIn, { marginBottom: gap ? 14 : 5 }]}>
            <View style={s.inBubble}>
                <Text style={s.inText}>{children}</Text>
                <Text style={s.inTime}>{time}</Text>
            </View>
        </View>
    );
}

function OutBubble({ children, time, gap, image }: { children?: React.ReactNode; time: string; gap?: boolean; image?: string }) {
    const c = useColors();
    const s = makeStyles(c);
    const hasText = typeof children === 'string' ? children.length > 0 : !!children;
    return (
        <View style={[s.rowOut, { marginBottom: gap ? 14 : 5 }]}>
            <LinearGradient colors={c.outBubble} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.outBubble, image && { padding: 4 }]}>
                {image && <Image source={{ uri: image }} style={s.msgImage} />}
                {hasText && <Text style={[s.outText, image && { paddingHorizontal: 9, paddingTop: 6 }]}>{children}</Text>}
                <View style={[s.outMeta, image && !hasText && { position: 'absolute', right: 10, bottom: 8 }]}>
                    <Text style={s.outTime}>{time}</Text>
                    <Ionicons name="checkmark-done" size={14} color={c.accent} />
                </View>
            </LinearGradient>
        </View>
    );
}

function TypingDots() {
    const s = makeStyles(useColors());
    const a0 = useRef(new Animated.Value(0)).current;
    const a1 = useRef(new Animated.Value(0)).current;
    const a2 = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const mk = (v: Animated.Value, delay: number) =>
            Animated.loop(Animated.sequence([
                Animated.delay(delay),
                Animated.timing(v, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                Animated.timing(v, { toValue: 0, duration: 300, easing: Easing.in(Easing.ease), useNativeDriver: true }),
                Animated.delay(400 - delay),
            ]));
        const loops = [mk(a0, 0), mk(a1, 150), mk(a2, 300)];
        loops.forEach((l) => l.start());
        return () => loops.forEach((l) => l.stop());
    }, []);
    const dot = (v: Animated.Value, key: number) => (
        <Animated.View key={key} style={[s.typingDot, {
            transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
            opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
        }]} />
    );
    return <View style={[s.rowIn, { marginBottom: 4 }]}><View style={s.typing}>{dot(a0, 0)}{dot(a1, 1)}{dot(a2, 2)}</View></View>;
}

const makeStyles = (c: Palette) => StyleSheet.create({
    root: { flex: 1, backgroundColor: c.chatBg },
    blob: { position: 'absolute', top: 90, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: c.auraBottom },

    topbar: {
        backgroundColor: c.glassHeader,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border,
        shadowColor: '#281950', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, zIndex: 30,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 11 },
    headerId: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    back: { width: 30, height: 38, alignItems: 'center', justifyContent: 'center' },
    avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontFamily: fonts.display, fontSize: 17, color: '#fff' },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: '#43e08a', borderWidth: 2.5, borderColor: c.glassHeader },
    name: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    status: { marginTop: 1, fontFamily: fonts.bodySemi, fontSize: 11.5, color: '#1f9d57' },
    callBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: c.field, alignItems: 'center', justifyContent: 'center' },

    strip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: 'rgba(255,111,168,0.10)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,111,168,0.16)' },
    stripTxt: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.6) },
    stripStrong: { fontFamily: fonts.bodyBold, color: c.text },
    stripCercle: { fontFamily: fonts.bodyBold, color: c.accentDeep },
    segs: { flexDirection: 'row', gap: 5 },
    seg: { height: 4, borderRadius: 99 },

    relationBar: { paddingHorizontal: 16, paddingBottom: 11 },
    relationTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    relationName: { fontFamily: fonts.bodyBold, fontSize: 11, color: c.accent },
    relationLevel: { fontFamily: fonts.bodySemi, fontSize: 10.5, color: c.ink(0.45) },
    relationActions: { marginTop: 9, flexDirection: 'row', gap: 7 },
    evalBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 11, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    evalTxt: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: c.text },
    levelBtn: { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 11, backgroundColor: 'rgba(255,106,169,0.14)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.4)' },
    levelTxt: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: c.accentDeep },

    discBanner: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, marginBottom: 16, borderRadius: 16, backgroundColor: 'rgba(255,106,169,0.1)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.28)' },
    discIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#e02a73', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 4 },
    discTitle: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: c.text },
    discSub: { marginTop: 1, fontFamily: fonts.body, fontSize: 11, color: c.ink(0.55) },

    chat: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 18 },
    dateWrap: { alignItems: 'center', marginBottom: 16 },
    datePill: { paddingVertical: 5, paddingHorizontal: 13, borderRadius: 99, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, fontFamily: fonts.bodySemi, fontSize: 11, color: c.ink(0.5) },
    sysWrap: { alignItems: 'center', marginBottom: 16 },
    sysNote: { maxWidth: 290, flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 14, backgroundColor: 'rgba(214,40,110,0.10)', borderWidth: 1, borderColor: 'rgba(214,40,110,0.18)' },
    sysTxt: { flexShrink: 1, fontFamily: fonts.body, fontSize: 11, lineHeight: 16, color: c.ink(0.6), textAlign: 'center' },
    sysCercle: { fontFamily: fonts.bodyBold, color: c.accentDeep },
    emptyChat: { textAlign: 'center', marginTop: 30, fontFamily: fonts.body, fontSize: 14, color: c.ink(0.45) },

    rowIn: { flexDirection: 'row', justifyContent: 'flex-start' },
    rowOut: { flexDirection: 'row', justifyContent: 'flex-end' },
    inBubble: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.inBubble, shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.14, shadowRadius: 6, elevation: 1 },
    inText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.text },
    inTime: { marginTop: 3, textAlign: 'right', fontFamily: fonts.body, fontSize: 10, color: c.ink(0.4) },
    outBubble: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 18, borderBottomRightRadius: 5, shadowColor: '#d6286e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 1 },
    outText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.outText },
    msgImage: { width: 200, height: 200, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.05)' },
    outMeta: { marginTop: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
    outTime: { fontFamily: fonts.body, fontSize: 10, color: c.mode === 'dark' ? 'rgba(251,233,244,0.55)' : 'rgba(33,22,51,0.42)' },

    imageBubble: { maxWidth: '72%', padding: 4, borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.inBubble, shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.14, shadowRadius: 6, elevation: 1 },
    imageInner: { height: 180, borderRadius: 15, borderBottomLeftRadius: 4, overflow: 'hidden' },
    imageTag: { position: 'absolute', bottom: 8, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.3)' },
    imageTagTxt: { fontFamily: fonts.bodyMed, fontSize: 9.5, color: 'rgba(255,255,255,0.9)' },
    imageCaption: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 3, fontFamily: fonts.body, fontSize: 13.5, color: c.text },

    voice: { maxWidth: '80%', flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, paddingHorizontal: 13, borderRadius: 18, borderBottomRightRadius: 5, shadowColor: '#d6286e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 1 },
    voicePlay: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff6aa9', shadowColor: '#ff6aa9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 8, elevation: 4 },
    wave: { flexDirection: 'row', alignItems: 'center', gap: 2.5, height: 24 },
    waveBar: { width: 3, borderRadius: 9 },
    voiceDur: { fontFamily: fonts.body, fontSize: 11, color: c.mode === 'dark' ? 'rgba(251,233,244,0.6)' : 'rgba(33,22,51,0.5)' },
    voiceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },

    typing: { paddingVertical: 11, paddingHorizontal: 15, borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.inBubble, flexDirection: 'row', alignItems: 'center', gap: 5, shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.14, shadowRadius: 6, elevation: 1 },
    typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6aa9' },

    inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 9, backgroundColor: c.chatBg },
    inputPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingLeft: 14, paddingRight: 8, borderRadius: 24, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 4 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.16, shadowRadius: 12, elevation: 2 },
    input: { flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: 14.5, color: c.text, paddingVertical: 4 },
    send: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', shadowColor: '#e02a73', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 6 },
});
