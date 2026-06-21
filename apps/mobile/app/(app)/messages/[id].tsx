// app/(app)/messages/[id].tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { Avatar, LevelDots } from '../../../src/components/ui';
import { FadeInUp, PopIn, PressableScale, Pulse, Ripple } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors } from '../../../src/theme/colors';
import { relations, dmMessages, NIVEAUX_RENCONTRE, NIVEAUX_AMITIE } from '../../../src/data/mock';

export default function Conversation() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const r = relations.find((x) => x.id === id) ?? relations[0];
    const labels = r.mode === 'rencontre' ? NIVEAUX_RENCONTRE : NIVEAUX_AMITIE;
    const grad = r.mode === 'rencontre' ? (['#ff6fa8', '#d34d7e'] as const) : (['#5b6ad6', '#a463ff'] as const);
    const accent = r.mode === 'rencontre' ? '#d6336c' : '#4f5bd5';
    const [msgs, setMsgs] = useState(dmMessages);
    const [txt, setTxt] = useState('');
    const scroller = useRef<ScrollView>(null);

    const send = () => {
        if (!txt.trim()) return;
        const filtre = txt.replace(/(\+?\d[\d\s]{7,}\d)|(\b\S+@\S+\.\S+\b)|(https?:\/\/\S+)/g, '•••');
        setMsgs([...msgs, { id: String(Date.now()), moi: true, contenu: filtre, heure: 'maintenant' }]);
        setTxt('');
        setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 80);
    };

    const Header = (
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={hd.bar}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={hd.iconBtn}>
                <Ionicons name="chevron-back" size={24} color={colors.white} />
            </Pressable>
            <Avatar uri={r.avatar} name={r.prenom} size={38} />
            <View style={{ flex: 1 }}>
                <Text style={hd.title} numberOfLines={1}>{r.prenom}</Text>
                <Text style={hd.sub}>{r.enLigne ? 'En ligne' : labels[r.niveau - 1]} · via {r.cercle}</Text>
            </View>
            <Pressable hitSlop={12} style={hd.iconBtn}>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.white} />
            </Pressable>
        </LinearGradient>
    );

    if (!r.dmOuvert) {
        return (
            <Screen padded={false}>
                {Header}
                <View style={s.locked}>
                    <PopIn>
                        <View style={s.lockHalo}>
                            <Ripple color={accent} size={120} />
                            <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.lockCircle}>
                                <Ionicons name="lock-closed" size={40} color={colors.white} />
                            </LinearGradient>
                        </View>
                    </PopIn>
                    <FadeInUp delay={120}><Text style={s.lockTitle}>Conversation pas encore débloquée</Text></FadeInUp>
                    <FadeInUp delay={200}>
                        <Text style={s.lockSub}>
                            Vous êtes au niveau « {labels[r.niveau - 1]} ». Le message privé s'ouvre à « {labels[2]} ». Continuez à échanger dans le Cercle {r.cercle}.
                        </Text>
                    </FadeInUp>
                    <FadeInUp delay={280}><View style={s.lockDots}><LevelDots level={r.niveau} labels={labels} color={accent} /></View></FadeInUp>
                    <FadeInUp delay={360}>
                        <PressableScale onPress={() => router.back()}>
                            <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.lockBtn}>
                                <Ionicons name="people" size={16} color={colors.white} />
                                <Text style={s.lockBtnTxt}>Retourner au Cercle</Text>
                            </LinearGradient>
                        </PressableScale>
                    </FadeInUp>
                </View>
            </Screen>
        );
    }

    return (
        <Screen padded={false}>
            {Header}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    ref={scroller}
                    style={{ flex: 1 }}
                    contentContainerStyle={s.chat}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}
                >
                    <View style={s.dayTag}><Text style={s.dayTagTxt}>Aujourd'hui</Text></View>
                    {msgs.map((m, i) => (
                        <FadeInUp key={m.id} delay={Math.min(i * 50, 300)} offset={10}>
                            <View style={[s.bubbleRow, m.moi && { justifyContent: 'flex-end' }]}>
                                {m.moi ? (
                                    <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.bubble, s.bubbleMe]}>
                                        <Text style={s.txtMe}>{m.contenu}</Text>
                                        <Text style={[s.heure, s.heureMe]}>{m.heure}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={[s.bubble, s.bubbleOther]}>
                                        <Text style={s.txtOther}>{m.contenu}</Text>
                                        <Text style={s.heure}>{m.heure}</Text>
                                    </View>
                                )}
                            </View>
                        </FadeInUp>
                    ))}
                </ScrollView>
                <View style={s.inputBar}>
                    <TextInput
                        style={s.input} value={txt} onChangeText={setTxt}
                        placeholder="Message privé…" placeholderTextColor={colors.dim} multiline
                    />
                    <PressableScale onPress={send} scaleTo={0.9}>
                        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.send, { shadowColor: accent }]}>
                            <Ionicons name="arrow-up" size={20} color={colors.white} />
                        </LinearGradient>
                    </PressableScale>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const hd = StyleSheet.create({
    bar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: spacing.md, paddingVertical: 12,
        borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
    },
    iconBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
    title: { fontFamily: fonts.displayMed, fontSize: 16, color: colors.white },
    sub: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
});

const s = StyleSheet.create({
    locked: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
    lockHalo: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
    lockCircle: {
        width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center',
        shadowColor: colors.rose, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 8,
    },
    lockTitle: { fontFamily: fonts.display, fontSize: 23, color: colors.cream, textAlign: 'center' },
    lockSub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
    lockDots: { marginTop: spacing.sm, alignItems: 'center' },
    lockBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.sm,
        borderRadius: radius.pill, paddingVertical: 13, paddingHorizontal: 22,
    },
    lockBtnTxt: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.white },

    chat: { padding: spacing.lg, gap: spacing.sm },
    dayTag: { alignSelf: 'center', backgroundColor: colors.cardLight, borderRadius: radius.pill, paddingVertical: 4, paddingHorizontal: 12, marginBottom: spacing.sm },
    dayTagTxt: { fontFamily: fonts.bodyMed, fontSize: 11, color: colors.muted },
    bubbleRow: { flexDirection: 'row', justifyContent: 'flex-start' },
    bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: 12 },
    bubbleOther: { backgroundColor: colors.cardLight, borderBottomLeftRadius: 4 },
    bubbleMe: {
        borderBottomRightRadius: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
    },
    txtOther: { fontFamily: fonts.body, fontSize: 15, color: colors.cream, lineHeight: 21 },
    txtMe: { fontFamily: fonts.body, fontSize: 15, color: colors.white, lineHeight: 21 },
    heure: { fontFamily: fonts.body, fontSize: 10, color: colors.dim, marginTop: 4, alignSelf: 'flex-end' },
    heureMe: { color: 'rgba(255,255,255,0.75)' },
    inputBar: {
        flexDirection: 'row', alignItems: 'flex-end', gap: 10,
        padding: spacing.md, borderTopWidth: 0.5, borderTopColor: colors.border,
        backgroundColor: colors.card,
    },
    input: {
        flex: 1, maxHeight: 110,
        backgroundColor: colors.cardLight,
        borderRadius: radius.lg,
        borderWidth: 1, borderColor: colors.border,
        color: colors.cream, fontFamily: fonts.body, fontSize: 15,
        paddingHorizontal: 14, paddingVertical: 10,
    },
    send: {
        width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    },
});
