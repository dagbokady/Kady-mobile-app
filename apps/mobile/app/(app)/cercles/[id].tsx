// app/(app)/cercles/[id].tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { GradeChip, Avatar } from '../../../src/components/ui';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors, themeOf, colorForName } from '../../../src/theme/colors';
import { mesCercles, cerclesDecouvrir, cercleMessages } from '../../../src/data/mock';

export default function CercleDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const cercle = [...mesCercles, ...cerclesDecouvrir].find((c) => c.id === id) ?? mesCercles[0];
    const t = themeOf(cercle.theme);
    const [msgs, setMsgs] = useState(cercleMessages);
    const [txt, setTxt] = useState('');
    const scroller = useRef<ScrollView>(null);

    const send = () => {
        if (!txt.trim()) return;
        const filtre = txt.replace(/(\+?\d[\d\s]{7,}\d)|(\b\S+@\S+\.\S+\b)|(https?:\/\/\S+)/g, '•••');
        setMsgs([...msgs, { id: String(Date.now()), auteur: 'Awa', moi: true, contenu: filtre, heure: 'maintenant' }]);
        setTxt('');
        setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 80);
    };

    return (
        <Screen padded={false}>
            {/* App-bar dégradée aux couleurs du Cercle */}
            <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={hd.bar}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={hd.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </Pressable>
                <View style={hd.emoji}><Text style={{ fontSize: 22 }}>{cercle.emoji}</Text></View>
                <View style={{ flex: 1 }}>
                    <Text style={hd.title} numberOfLines={1}>{cercle.nom}</Text>
                    <Text style={hd.sub}>Niveau {cercle.niveau} · {cercle.membres} membres</Text>
                </View>
                <Pressable hitSlop={12} style={hd.iconBtn}>
                    <Ionicons name="information-circle-outline" size={22} color={colors.white} />
                </Pressable>
            </LinearGradient>

            <View style={[s.banner, { backgroundColor: t.soft }]}>
                <Ionicons name="shield-checkmark" size={14} color={t.solid} />
                <Text style={[s.bannerTxt, { color: t.solid }]}>Numéros et liens masqués tant que la confiance n'est pas établie.</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    ref={scroller}
                    style={{ flex: 1 }}
                    contentContainerStyle={s.chat}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}
                >
                    {msgs.map((m, i) => (
                        <FadeInUp key={m.id} delay={Math.min(i * 50, 300)} offset={10}>
                            <View style={[s.bubbleRow, m.moi && s.bubbleRowMe]}>
                                {!m.moi && <Avatar name={m.auteur} size={30} />}
                                {m.moi ? (
                                    <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.bubble, s.bubbleMe]}>
                                        <Text style={s.txtMe}>{m.contenu}</Text>
                                        <Text style={[s.heure, s.heureMe]}>{m.heure}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={[s.bubble, s.bubbleOther]}>
                                        <Text style={[s.auteur, { color: colorForName(m.auteur) }]}>{m.auteur}</Text>
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
                        placeholder="Écris un message…" placeholderTextColor={colors.dim} multiline
                    />
                    <PressableScale onPress={send} scaleTo={0.9}>
                        <LinearGradient colors={[t.from, t.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.send}>
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
    emoji: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
    title: { fontFamily: fonts.displayMed, fontSize: 16, color: colors.white },
    sub: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
});

const s = StyleSheet.create({
    banner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: spacing.lg },
    bannerTxt: { flex: 1, fontFamily: fonts.bodyMed, fontSize: 12 },
    chat: { padding: spacing.lg, gap: spacing.md },
    bubbleRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8 },
    bubbleRowMe: { justifyContent: 'flex-end' },
    bubble: { maxWidth: '78%', borderRadius: radius.lg, padding: 12 },
    bubbleOther: { backgroundColor: colors.cardLight, borderBottomLeftRadius: 4 },
    bubbleMe: {
        borderBottomRightRadius: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
    },
    auteur: { fontFamily: fonts.bodySemi, fontSize: 12, marginBottom: 3 },
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
        shadowColor: colors.rose, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    },
});
