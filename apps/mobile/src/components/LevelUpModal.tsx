// src/components/LevelUpModal.tsx — célébration de passage de niveau d'un lien.
// Badge animé, niveau avant → après, segments, déblocages, confettis.
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { useColors, type Palette } from '../theme/theme';
import { useScale } from '../theme/responsive';
import { UNLOCKS } from '../data/mock';

const CONFETTI_COLORS = ['#ff6aa9', '#ffb43a', '#8f9dff', '#43e08a', '#a463ff', '#2fb8c0'];

type Props = {
    visible: boolean;
    name: string;
    fromN: number;
    toN: number;
    fromNom: string;
    toNom: string;
    onConfirm: () => void;
    onClose: () => void;
};

export default function LevelUpModal({ visible, name, fromN, toN, fromNom, toNom, onConfirm, onClose }: Props) {
    const c = useColors();
    const { s, ms } = useScale();
    const st = makeStyles(c, s, ms);
    const pop = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            pop.setValue(0);
            Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }).start();
        }
    }, [visible]);

    const unlocks = UNLOCKS[toN] ?? [];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={st.backdrop} onPress={onClose}>
                <Confetti />
                <Animated.View style={[st.card, { transform: [{ scale: pop }], opacity: pop }]}>
                    <Pressable onPress={() => {}}>
                        <View style={st.glow} pointerEvents="none" />

                        <BadgeRings>
                            <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.badge}>
                                <Ionicons name="trophy" size={ms(30)} color="#fff" />
                                <Text style={st.badgeTxt}>NIV. {toN}</Text>
                            </LinearGradient>
                        </BadgeRings>

                        <View style={st.eyebrow}>
                            <Ionicons name="sparkles" size={ms(12)} color={c.accentDeep} />
                            <Text style={st.eyebrowTxt}>NIVEAU SUPÉRIEUR</Text>
                        </View>
                        <Text style={st.title}>Votre lien grandit !</Text>
                        <Text style={st.sub}>Avec <Text style={{ color: c.text, fontFamily: fonts.bodyBold }}>{name}</Text>, vous passez de</Text>

                        <View style={st.transition}>
                            <View style={st.fromPill}><Text style={st.fromPillTxt}>{fromNom}</Text></View>
                            <Ionicons name="arrow-forward" size={ms(18)} color={c.accent} />
                            <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.toPill}>
                                <Text style={st.toPillTxt}>{toNom}</Text>
                            </LinearGradient>
                        </View>

                        <View style={st.segs}>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <View key={n} style={[st.seg, { backgroundColor: n <= toN ? c.accent : c.ink(0.12) }]} />
                            ))}
                        </View>

                        {unlocks.length > 0 && (
                            <View style={st.unlockBox}>
                                <View style={st.unlockHead}>
                                    <Ionicons name="gift" size={ms(15)} color={c.accent} />
                                    <Text style={st.unlockHeadTxt}>Ce qui se débloque</Text>
                                </View>
                                <View style={{ gap: s(10) }}>
                                    {unlocks.map((u) => (
                                        <View key={u.t} style={st.unlockRow}>
                                            <View style={st.unlockIcon}><Ionicons name={u.icon as any} size={ms(16)} color={c.accentDeep} /></View>
                                            <Text style={st.unlockTxt}>{u.t}</Text>
                                            <Ionicons name="checkmark-circle" size={ms(18)} color="#43e08a" />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <Pressable onPress={onConfirm}>
                            <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.cta}>
                                <Ionicons name="heart" size={ms(18)} color="#fff" />
                                <Text style={st.ctaTxt}>Faire évoluer le lien</Text>
                            </LinearGradient>
                        </Pressable>
                        <Pressable onPress={onClose} style={st.later}>
                            <Text style={st.laterTxt}>Plus tard</Text>
                        </Pressable>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}

function BadgeRings({ children }: { children: React.ReactNode }) {
    const c = useColors();
    const { s } = useScale();
    const r1 = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(Animated.timing(r1, { toValue: 1, duration: 1700, easing: Easing.out(Easing.ease), useNativeDriver: true })).start();
    }, []);
    const ringStyle = {
        position: 'absolute' as const, width: s(98), height: s(98), borderRadius: s(30),
        borderWidth: 2, borderColor: c.accent,
        transform: [{ scale: r1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.9] }) }],
        opacity: r1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
    };
    return (
        <View style={{ width: s(98), height: s(98), alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={ringStyle} />
            {children}
        </View>
    );
}

function Confetti() {
    const pieces = useRef(
        Array.from({ length: 14 }).map((_, i) => ({
            x: `${Math.random() * 100}%`,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            delay: Math.random() * 400,
            anim: new Animated.Value(0),
        })),
    ).current;
    useEffect(() => {
        pieces.forEach((p) => {
            Animated.loop(Animated.sequence([
                Animated.delay(p.delay),
                Animated.timing(p.anim, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true }),
            ])).start();
        });
    }, []);
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {pieces.map((p, i) => (
                <Animated.View
                    key={i}
                    style={{
                        position: 'absolute', top: -20, left: p.x as any, width: 8, height: 12, borderRadius: 2, backgroundColor: p.color,
                        transform: [
                            { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }) },
                            { rotate: p.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '560deg'] }) },
                        ],
                        opacity: p.anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
                    }}
                />
            ))}
        </View>
    );
}

const makeStyles = (c: Palette, s: (n: number) => number, ms: (n: number, f?: number) => number) => StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(10,6,20,0.64)', alignItems: 'center', justifyContent: 'center', padding: 22 },
    card: { width: '100%', maxWidth: 340, backgroundColor: c.card, borderRadius: s(30), padding: s(24), alignItems: 'center', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 34 }, shadowOpacity: 0.48, shadowRadius: 64, elevation: 24 },
    glow: { position: 'absolute', top: -70, alignSelf: 'center', width: 220, height: 220, borderRadius: 110, backgroundColor: c.auraTop },
    badge: { width: s(98), height: s(98), borderRadius: s(30), alignItems: 'center', justifyContent: 'center', shadowColor: '#e02a73', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.5, shadowRadius: 32, elevation: 12 },
    badgeTxt: { marginTop: 1, fontFamily: fonts.displayBold, fontSize: ms(15), color: '#fff', letterSpacing: 0.5 },
    eyebrow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,106,169,0.14)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.4)' },
    eyebrowTxt: { fontFamily: fonts.displayBold, fontSize: ms(11), letterSpacing: 0.6, color: c.accentDeep },
    title: { marginTop: 13, fontFamily: fonts.displayBold, fontSize: ms(23), lineHeight: ms(28), color: c.text, textAlign: 'center' },
    sub: { marginTop: 6, fontFamily: fonts.body, fontSize: ms(13), lineHeight: ms(19), color: c.ink(0.58), textAlign: 'center' },
    transition: { marginTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    fromPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    fromPillTxt: { fontFamily: fonts.bodyBold, fontSize: ms(12.5), color: c.ink(0.55) },
    toPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 13 },
    toPillTxt: { fontFamily: fonts.bodyBold, fontSize: ms(12.5), color: '#fff' },
    segs: { marginTop: 16, flexDirection: 'row', gap: 5 },
    seg: { flex: 1, height: 6, borderRadius: 99 },
    unlockBox: { marginTop: 18, alignSelf: 'stretch', borderRadius: 18, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, padding: 15 },
    unlockHead: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 11 },
    unlockHeadTxt: { fontFamily: fonts.displayBold, fontSize: ms(12.5), color: c.text },
    unlockRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
    unlockIcon: { width: s(32), height: s(32), borderRadius: 10, backgroundColor: 'rgba(255,106,169,0.14)', alignItems: 'center', justifyContent: 'center' },
    unlockTxt: { flex: 1, fontFamily: fonts.bodySemi, fontSize: ms(13), color: c.text },
    cta: { marginTop: 18, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: s(16), borderRadius: 16, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 8 },
    ctaTxt: { fontFamily: fonts.display, fontSize: ms(15), color: '#fff' },
    later: { marginTop: 9, alignSelf: 'stretch', paddingVertical: 11, alignItems: 'center' },
    laterTxt: { fontFamily: fonts.bodySemi, fontSize: ms(13.5), color: c.ink(0.5) },
});
