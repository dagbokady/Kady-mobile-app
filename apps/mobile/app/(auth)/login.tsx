// app/(auth)/login.tsx
import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Logo from '../../src/components/Logo';
import GradientButton from '../../src/components/GradientButton';
import { ScreenHeader } from '../../src/components/ui';
import { FadeInUp, PopIn } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { useColors, type Palette } from '../../src/theme/theme';

export default function Login() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');

    return (
        <Screen>
            <ScreenHeader back />
            <PopIn delay={80} style={s.head}>
                <Logo size={60} color={c.accent} />
                <Text style={s.title}>Content de te revoir</Text>
                <Text style={s.sub}>Connecte-toi pour retrouver tes Cercles.</Text>
            </PopIn>

            <FadeInUp delay={220} style={{ gap: spacing.md }}>
                <TextInput
                    style={s.input} value={email} onChangeText={setEmail}
                    placeholder="Adresse e-mail" placeholderTextColor={c.ink(0.42)}
                    autoCapitalize="none" keyboardType="email-address"
                />
                <TextInput
                    style={s.input} value={mdp} onChangeText={setMdp}
                    placeholder="Mot de passe" placeholderTextColor={c.ink(0.42)}
                    secureTextEntry
                />
                <Text style={s.forgot}>Mot de passe oublié ?</Text>
            </FadeInUp>

            <FadeInUp delay={340} style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: spacing.md }}>
                <GradientButton label="Se connecter" onPress={() => router.replace('/(app)/accueil')} />
            </FadeInUp>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    head: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xxl, gap: spacing.sm },
    title: { fontFamily: fonts.display, fontSize: 28, color: c.text, marginTop: spacing.md },
    sub: { fontFamily: fonts.body, fontSize: 15, color: c.ink(0.6) },
    input: {
        backgroundColor: c.field,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: radius.md,
        color: c.text,
        fontFamily: fonts.body,
        fontSize: 16,
        padding: 15,
    },
    forgot: { fontFamily: fonts.bodyMed, fontSize: 13, color: c.accent, textAlign: 'right' },
});
