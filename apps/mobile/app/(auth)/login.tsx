// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Logo from '../../src/components/Logo';
import GradientButton from '../../src/components/GradientButton';
import { FadeInUp, PopIn } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { useColors, type Palette } from '../../src/theme/theme';
import { useScale } from '../../src/theme/responsive';

export default function Login() {
    const router = useRouter();
    const c = useColors();
    const sc = useScale();
    const s = makeStyles(c, sc);
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');

    return (
        <Screen padded={false}>
            <View style={s.backRow}>
                <Pressable style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color={c.text} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
                <PopIn delay={60} style={s.brand}>
                    <Logo size={58} color={c.accent} />
                    <Text style={s.title}>Content de te revoir</Text>
                    <Text style={s.sub}>Connecte-toi pour retrouver tes Cercles.</Text>
                </PopIn>

                <FadeInUp delay={160} style={s.fields}>
                    <View style={s.inputRow}>
                        <Ionicons name="mail-outline" size={19} color={c.ink(0.42)} />
                        <TextInput
                            style={s.input} value={email} onChangeText={setEmail}
                            placeholder="Adresse e-mail" placeholderTextColor={c.ink(0.4)}
                            autoCapitalize="none" keyboardType="email-address"
                        />
                    </View>
                    <View style={s.inputRow}>
                        <Ionicons name="lock-closed-outline" size={19} color={c.ink(0.42)} />
                        <TextInput
                            style={s.input} value={mdp} onChangeText={setMdp}
                            placeholder="Mot de passe" placeholderTextColor={c.ink(0.4)}
                            secureTextEntry
                        />
                    </View>
                    <Pressable style={{ alignSelf: 'flex-end' }} hitSlop={8}>
                        <Text style={s.forgot}>Mot de passe oublié ?</Text>
                    </Pressable>
                </FadeInUp>

                <FadeInUp delay={260} style={{ marginTop: spacing.lg }}>
                    <GradientButton label="Se connecter" onPress={() => router.replace('/(app)/accueil')} />
                </FadeInUp>

                <FadeInUp delay={300} style={s.dividerRow}>
                    <View style={s.dividerLine} />
                    <Text style={s.dividerTxt}>ou</Text>
                    <View style={s.dividerLine} />
                </FadeInUp>

                <FadeInUp delay={360} style={s.socials}>
                    <Pressable style={s.socialBtn} onPress={() => router.replace('/(app)/accueil')}>
                        <Ionicons name="logo-google" size={19} color="#ea4335" />
                        <Text style={[s.socialTxt, { color: c.text }]}>Continuer avec Google</Text>
                    </Pressable>
                    <Pressable style={[s.socialBtn, s.socialApple]} onPress={() => router.replace('/(app)/accueil')}>
                        <Ionicons name="logo-apple" size={20} color="#fff" />
                        <Text style={[s.socialTxt, { color: '#fff' }]}>Continuer avec Apple</Text>
                    </Pressable>
                </FadeInUp>

                <FadeInUp delay={400}>
                    <Pressable onPress={() => router.replace('/register')} hitSlop={8} style={{ alignSelf: 'center', paddingVertical: spacing.sm, marginTop: spacing.sm }}>
                        <Text style={s.signup}>Pas encore de compte ? <Text style={{ color: c.accent, fontFamily: fonts.bodyBold }}>S'inscrire</Text></Text>
                    </Pressable>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette, sc: ReturnType<typeof useScale>) => {
    const { s, ms } = sc;
    return StyleSheet.create({
    backRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    backBtn: { width: s(42), height: s(42), borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },

    scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },

    brand: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl, gap: spacing.sm },
    title: { fontFamily: fonts.display, fontSize: ms(27), color: c.text, marginTop: spacing.md },
    sub: { fontFamily: fonts.body, fontSize: ms(15), color: c.ink(0.6), textAlign: 'center' },

    fields: { gap: spacing.md },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 15, paddingVertical: s(15), borderRadius: radius.md, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    input: { flex: 1, minWidth: 0, padding: 0, fontFamily: fonts.body, fontSize: ms(16), color: c.text },
    forgot: { fontFamily: fonts.bodyMed, fontSize: ms(13), color: c.accent },

    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: spacing.xl },
    dividerLine: { flex: 1, height: 1, backgroundColor: c.border },
    dividerTxt: { fontFamily: fonts.bodySemi, fontSize: ms(12), color: c.ink(0.42) },

    socials: { gap: spacing.md, marginTop: spacing.md },
    socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: s(14), borderRadius: radius.md, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    socialApple: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.12)' },
    socialTxt: { fontFamily: fonts.bodyBold, fontSize: ms(14.5) },

    signup: { fontFamily: fonts.body, fontSize: ms(14), color: c.ink(0.55) },
    });
};
