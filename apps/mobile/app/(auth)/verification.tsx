// app/(auth)/verification.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import GradientButton from '../../src/components/GradientButton';
import { FadeInUp, PopIn, Ripple } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { useColors, type Palette } from '../../src/theme/theme';

const DEFIS = ['Tourne lentement la tête vers la gauche', 'Souris à la caméra', 'Cligne des deux yeux'];

export default function Verification() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const [defi] = useState(DEFIS[Math.floor(Math.random() * DEFIS.length)]);

    return (
        <Screen>
            <View style={s.root}>
                <FadeInUp>
                    <View style={s.top}>
                        <Text style={s.title}>Vérifions que c'est bien toi</Text>
                        <Text style={s.sub}>Un selfie vivant prouve que tu es une vraie personne. C'est ce qui rend KADY sûr.</Text>
                    </View>
                </FadeInUp>

                <View style={s.frame}>
                    <PopIn delay={120}>
                        <View style={s.ringWrap}>
                            <Ripple color={c.accent} size={236} />
                            <View style={s.ring}>
                                <Ionicons name="person" size={84} color={c.ink(0.42)} />
                            </View>
                        </View>
                    </PopIn>
                    <FadeInUp delay={260}>
                        <View style={s.defi}>
                            <Ionicons name="sparkles" size={16} color={c.accent} />
                            <Text style={s.defiTxt}>{defi}</Text>
                        </View>
                    </FadeInUp>
                </View>

                <FadeInUp delay={360}>
                    <View style={s.bottom}>
                        <View style={s.row}>
                            <Ionicons name="lock-closed" size={14} color={c.ink(0.6)} />
                            <Text style={s.note}>Ton selfie n'est jamais publié. Il sert uniquement à la vérification.</Text>
                        </View>
                        <GradientButton label="Lancer la vérification" onPress={() => router.replace('/(app)/accueil')} />
                        <Text style={s.skip} onPress={() => router.replace('/(app)/accueil')}>Plus tard</Text>
                    </View>
                </FadeInUp>
            </View>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    root: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xl },
    top: { gap: spacing.sm, marginTop: spacing.lg },
    title: { fontFamily: fonts.display, fontSize: 28, color: c.text },
    sub: { fontFamily: fonts.body, fontSize: 15, color: c.ink(0.6), lineHeight: 22 },
    frame: { alignItems: 'center', gap: spacing.lg },
    ringWrap: { alignItems: 'center', justifyContent: 'center' },
    ring: {
        width: 220, height: 220, borderRadius: 110,
        borderWidth: 2, borderColor: c.border,
        backgroundColor: c.field,
        alignItems: 'center', justifyContent: 'center',
    },
    defi: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: c.card,
        borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
        borderWidth: 1, borderColor: c.border,
    },
    defiTxt: { fontFamily: fonts.bodyMed, fontSize: 14, color: c.text },
    bottom: { gap: spacing.md },
    row: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
    note: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.6), flexShrink: 1, textAlign: 'center' },
    skip: { fontFamily: fonts.bodyMed, fontSize: 14, color: c.accent, textAlign: 'center', paddingVertical: spacing.sm },
});
