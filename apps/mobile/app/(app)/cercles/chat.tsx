// app/(app)/cercles/chat.tsx — Chat de cercle / groupe (handoff "KADY Chat Groupe.dc.html")
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated, Easing, StatusBar, useWindowDimensions, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { AnimatedBar } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { themeOf } from '../../../src/theme/colors';
import { useColors, type Palette } from '../../../src/theme/theme';
import { useStore, pickImage } from '../../../src/store/app';

const SEND_GRAD = ['#ff6aa9', '#e02a73'] as const;

export default function ChatGroupe() {
    const { nom, theme } = useLocalSearchParams<{ nom?: string; theme?: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const c = useColors();
    const s = makeStyles(c);
    const t = themeOf(theme);
    const title = nom || 'Voyageurs';

    const [draft, setDraft] = useState('');
    const [going, setGoing] = useState(false);
    const sent = useStore((st) => st.cercle[title] ?? []);
    const sendCercle = useStore((st) => st.sendCercle);
    const scroller = useRef<ScrollView>(null);
    const hasText = draft.trim().length > 0;
    const addEmoji = () => setDraft((d) => d + '😊');
    const groupCall = () => Alert.alert('Appel de groupe', `Lance un appel audio avec les membres en ligne de « ${title} » ?`, [{ text: 'Annuler', style: 'cancel' }, { text: 'Appeler', onPress: () => Alert.alert('Bientôt', "L'appel de groupe arrive très vite 💫") }]);
    const onMore = () => Alert.alert(title, undefined, [
        { text: 'Règles du cercle', onPress: () => Alert.alert('Règles du cercle', '· Respect et bienveillance avant tout\n· Pas de coordonnées partagées en public\n· On reste dans le thème') },
        { text: 'Quitter la conversation', onPress: () => router.back() },
        { text: 'Signaler', style: 'destructive', onPress: () => Alert.alert('Signalement envoyé', "Merci, notre équipe va l'examiner.") },
        { text: 'Annuler', style: 'cancel' },
    ]);

    const send = () => {
        const v = draft.trim();
        if (!v) return;
        sendCercle(title, v);
        setDraft('');
        setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 50);
    };
    const sendImg = async () => {
        const uri = await pickImage();
        if (!uri) return;
        sendCercle(title, '', uri);
        setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 80);
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle={c.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs><Pattern id="dots" width={22} height={22} patternUnits="userSpaceOnUse"><Circle cx={1.4} cy={1.4} r={1.4} fill={c.dot} /></Pattern></Defs>
                <Rect width={width} height={height} fill="url(#dots)" />
            </Svg>
            <View pointerEvents="none" style={s.blob} />

            <View style={[s.topbar, { paddingTop: insets.top }]}>
                <View style={s.headerRow}>
                    <Pressable onPress={() => router.back()} hitSlop={10} style={s.back}><Ionicons name="chevron-back" size={24} color={c.text} /></Pressable>
                    <LinearGradient colors={[t.from, t.to]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={s.cercleTile} />
                    <View style={{ flex: 1 }}>
                        <View style={s.nameRow}>
                            <Text style={s.name} numberOfLines={1}>{title}</Text>
                            <Ionicons name="star" size={11} color="#ffd27a" />
                        </View>
                        <Text style={s.sub}>8 membres · <Text style={s.subOnline}>5 en ligne</Text></Text>
                    </View>
                    <Pressable style={s.callBtn} onPress={groupCall}><Ionicons name="videocam-outline" size={20} color={c.accent} /></Pressable>
                    <Pressable hitSlop={8} style={s.menuBtn} onPress={onMore}><Ionicons name="ellipsis-vertical" size={19} color={c.text} /></Pressable>
                </View>

                <View style={s.strip}>
                    <Ionicons name="flash" size={13} color={c.accent} />
                    <Text style={s.stripLabel}>XP du cercle</Text>
                    <View style={{ flex: 1 }}>
                        <AnimatedBar progress={0.64} height={6} track={c.ink(0.12)}>
                            <LinearGradient colors={SEND_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                        </AnimatedBar>
                    </View>
                    <Text style={s.stripVal}><Text style={s.stripValStrong}>320</Text>/500</Text>
                </View>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={insets.top + 8}>
                <ScrollView ref={scroller} style={{ flex: 1 }} contentContainerStyle={s.chat} showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}>

                    <View style={s.center}><Text style={s.datePill}>Aujourd'hui</Text></View>
                    <View style={s.center}>
                        <View style={s.sysNote}><Text style={s.sysTxt}><Text style={s.sysStrong}>Sophie</Text> a rejoint le cercle 🎉</Text></View>
                    </View>

                    <InMsg avatar={{ initial: 'K', grad: ['#7be0a0', '#2f9ac2'] }} name="Koffi" color="#2bb7cf" time="11:02">
                        Salut la team ! Qui est partant pour Assinie ce week-end ? 🏖️
                    </InMsg>
                    <InMsg name="Mariam" color="#ff6fa8" time="11:05">
                        Moi !! J'amène l'enceinte 🔊
                    </InMsg>
                    <InMsg avatar={{ initial: 'S', grad: ['#b07bff', '#7a4fd6'] }} name="Sophie" color="#a78bfa" time="11:08" gap
                        quote={{ name: 'Koffi', text: 'Qui est partant pour Assinie…' }}>
                        Présente ! On se retrouve où ?
                    </InMsg>

                    <OutBubble time="11:12" gap>Carrément partant 🙌 On peut covoiturer depuis Cocody</OutBubble>

                    <View style={[s.rowIn, { marginBottom: 14 }]}>
                        <View style={s.avatar}><LinearGradient colors={['#7be0a0', '#2f9ac2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><Text style={s.avatarTxt}>K</Text></View>
                        <View style={s.eventWrap}>
                            <LinearGradient colors={['rgba(255,106,169,0.12)', 'rgba(255,111,194,0.07)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.eventCard}>
                                <View style={s.eventHead}>
                                    <Ionicons name="calendar-outline" size={15} color={c.accent} />
                                    <Text style={s.eventTitle}>Sortie Assinie</Text>
                                </View>
                                <Text style={s.eventInfo}>Samedi 28 juin · 09:00 · Plage de Marlin</Text>
                                <View style={s.eventBottom}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {['#ff9d5c', '#7be0a0', '#b07bff'].map((cl, i) => (
                                            <LinearGradient key={i} colors={[cl, cl]} style={[s.eventAv, i > 0 && { marginLeft: -8 }]} />
                                        ))}
                                        <View style={[s.eventAv, s.eventExtra]}><Text style={s.eventExtraTxt}>+2</Text></View>
                                    </View>
                                    <Pressable onPress={() => setGoing((g) => !g)}><LinearGradient colors={SEND_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.eventBtn}><Text style={s.eventBtnTxt}>{going ? "J'y serai ✓" : 'Je viens'}</Text></LinearGradient></Pressable>
                                </View>
                            </LinearGradient>
                            <Text style={s.eventTime}>11:15</Text>
                        </View>
                    </View>

                    {sent.map((m) => <OutBubble key={m.id} time={m.time} image={m.image}>{m.text}</OutBubble>)}

                    <View style={[s.rowIn, { alignItems: 'center' }]}>
                        <View style={s.avatar}><LinearGradient colors={['#ffb45c', '#d3744d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><Text style={s.avatarTxt}>F</Text></View>
                        <View style={s.typing}><Dots /></View>
                        <Text style={s.typingTxt}>Fatou écrit…</Text>
                    </View>
                </ScrollView>

                <View style={[s.inputWrap, { paddingBottom: insets.bottom + 9 }]}>
                    <View style={s.inputPill}>
                        <Pressable hitSlop={6} onPress={addEmoji}><Ionicons name="happy-outline" size={22} color={c.ink(0.45)} /></Pressable>
                        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send" placeholder="Message au cercle" placeholderTextColor={c.ink(0.4)} style={s.input} />
                        <Pressable hitSlop={6} onPress={sendImg}><Ionicons name="attach" size={22} color={c.ink(0.45)} /></Pressable>
                        <Pressable hitSlop={6} onPress={sendImg}><Ionicons name="image-outline" size={21} color={c.ink(0.45)} /></Pressable>
                    </View>
                    <Pressable onPress={send}>
                        <LinearGradient colors={SEND_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.send}>
                            <Ionicons name={hasText ? 'send' : 'mic'} size={hasText ? 19 : 21} color="#fff" />
                        </LinearGradient>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

function InMsg({ avatar, name, color, children, time, gap, quote }:
    { avatar?: { initial: string; grad: readonly string[] }; name: string; color: string; children: React.ReactNode; time: string; gap?: boolean; quote?: { name: string; text: string } }) {
    const c = useColors();
    const s = makeStyles(c);
    return (
        <View style={[s.rowIn, { marginBottom: gap ? 14 : 4 }]}>
            {avatar
                ? <View style={s.avatar}><LinearGradient colors={avatar.grad as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><Text style={s.avatarTxt}>{avatar.initial}</Text></View>
                : <View style={{ width: 30 }} />}
            <View style={s.inBubble}>
                <Text style={[s.sender, { color }]}>{name}</Text>
                {quote && (
                    <View style={s.quote}>
                        <Text style={s.quoteName}>{quote.name}</Text>
                        <Text style={s.quoteTxt} numberOfLines={1}>{quote.text}</Text>
                    </View>
                )}
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
        <View style={[s.rowOut, { marginBottom: gap ? 14 : 4 }]}>
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

function Dots() {
    const s = makeStyles(useColors());
    const a0 = useRef(new Animated.Value(0)).current;
    const a1 = useRef(new Animated.Value(0)).current;
    const a2 = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const mk = (v: Animated.Value, d: number) => Animated.loop(Animated.sequence([
            Animated.delay(d),
            Animated.timing(v, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: 300, easing: Easing.in(Easing.ease), useNativeDriver: true }),
            Animated.delay(400 - d),
        ]));
        const loops = [mk(a0, 0), mk(a1, 150), mk(a2, 300)];
        loops.forEach((l) => l.start());
        return () => loops.forEach((l) => l.stop());
    }, []);
    const dot = (v: Animated.Value, k: number) => (
        <Animated.View key={k} style={[s.dot, { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }], opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }]} />
    );
    return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>{dot(a0, 0)}{dot(a1, 1)}{dot(a2, 2)}</View>;
}

const makeStyles = (c: Palette) => StyleSheet.create({
    root: { flex: 1, backgroundColor: c.chatBg },
    blob: { position: 'absolute', top: 90, left: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: c.auraTop },

    topbar: { backgroundColor: c.glassHeader, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, zIndex: 30 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 11 },
    back: { width: 26, height: 38, alignItems: 'center', justifyContent: 'center' },
    cercleTile: { width: 42, height: 42, borderRadius: 14 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    name: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    sub: { marginTop: 1, fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.5) },
    subOnline: { fontFamily: fonts.bodySemi, color: '#1f9d57' },
    callBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: c.field, alignItems: 'center', justifyContent: 'center' },
    menuBtn: { width: 30, height: 40, alignItems: 'center', justifyContent: 'center' },

    strip: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: 'rgba(255,106,169,0.10)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,106,169,0.16)' },
    stripLabel: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.6) },
    stripVal: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.55) },
    stripValStrong: { fontFamily: fonts.bodyBold, color: c.text },

    chat: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 18 },
    center: { alignItems: 'center', marginBottom: 14 },
    datePill: { paddingVertical: 5, paddingHorizontal: 13, borderRadius: 99, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, fontFamily: fonts.bodySemi, fontSize: 11, color: c.ink(0.5) },
    sysNote: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 12, backgroundColor: 'rgba(214,40,110,0.10)', borderWidth: 1, borderColor: 'rgba(214,40,110,0.18)' },
    sysTxt: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.55) },
    sysStrong: { fontFamily: fonts.bodyBold, color: c.accentDeep },

    rowIn: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8 },
    rowOut: { flexDirection: 'row', justifyContent: 'flex-end' },
    avatar: { width: 30, height: 30, borderRadius: 15, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    avatarTxt: { fontFamily: fonts.display, fontSize: 13, color: '#fff' },
    inBubble: { maxWidth: '74%', paddingVertical: 8, paddingHorizontal: 13, borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.inBubble, shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.14, shadowRadius: 6, elevation: 1 },
    sender: { fontFamily: fonts.bodyBold, fontSize: 12, marginBottom: 2 },
    quote: { paddingVertical: 6, paddingHorizontal: 10, borderLeftWidth: 3, borderLeftColor: c.accent, borderRadius: 7, backgroundColor: 'rgba(214,40,110,0.10)', marginBottom: 5 },
    quoteName: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: c.accent },
    quoteTxt: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.55) },
    inText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.text },
    inTime: { marginTop: 3, textAlign: 'right', fontFamily: fonts.body, fontSize: 10, color: c.ink(0.4) },
    outBubble: { maxWidth: '76%', paddingVertical: 8, paddingHorizontal: 13, borderRadius: 18, borderBottomRightRadius: 5, shadowColor: '#d6286e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 1 },
    outText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.outText },
    msgImage: { width: 200, height: 200, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.05)' },
    outMeta: { marginTop: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
    outTime: { fontFamily: fonts.body, fontSize: 10, color: c.mode === 'dark' ? 'rgba(251,233,244,0.55)' : 'rgba(33,22,51,0.42)' },

    eventWrap: { maxWidth: '80%' },
    eventCard: { padding: 12, borderRadius: 15, borderBottomLeftRadius: 4, backgroundColor: c.inBubble },
    eventHead: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 9 },
    eventTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: c.text },
    eventInfo: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.55), marginBottom: 10 },
    eventBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    eventAv: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: c.inBubble },
    eventExtra: { marginLeft: -8, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' },
    eventExtraTxt: { fontFamily: fonts.bodyBold, fontSize: 9, color: c.accent },
    eventBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10 },
    eventBtnTxt: { fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' },
    eventTime: { marginTop: 4, paddingRight: 4, textAlign: 'right', fontFamily: fonts.body, fontSize: 10, color: c.ink(0.4) },

    typing: { paddingVertical: 11, paddingHorizontal: 15, borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.inBubble, shadowColor: '#281950', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.14, shadowRadius: 6, elevation: 1 },
    typingTxt: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.45) },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6aa9' },

    inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 9, backgroundColor: c.chatBg },
    inputPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingLeft: 14, paddingRight: 8, borderRadius: 24, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, shadowColor: '#281950', shadowOffset: { width: 0, height: 4 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.16, shadowRadius: 12, elevation: 2 },
    input: { flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: 14.5, color: c.text, paddingVertical: 4 },
    send: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', shadowColor: '#e02a73', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 6 },
});
