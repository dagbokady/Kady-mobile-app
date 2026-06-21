// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Logo from '../../src/components/Logo';
import GradientButton from '../../src/components/GradientButton';
import { ScreenHeader } from '../../src/components/ui';
import { FadeInUp, PopIn } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');

    return (
        <Screen>
            <ScreenHeader back />
            <PopIn delay={80} style={s.head}>
                <Logo size={60} color={colors.rose} />
                <Text style={s.title}>Content de te revoir</Text>
                <Text style={s.sub}>Connecte-toi pour retrouver tes Cercles.</Text>
            </PopIn>

            <FadeInUp delay={220} style={{ gap: spacing.md }}>
                <TextInput
                    style={s.input} value={email} onChangeText={setEmail}
                    placeholder="Adresse e-mail" placeholderTextColor={colors.dim}
                    autoCapitalize="none" keyboardType="email-address"
                />
                <TextInput
                    style={s.input} value={mdp} onChangeText={setMdp}
                    placeholder="Mot de passe" placeholderTextColor={colors.dim}
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

const s = StyleSheet.create({
    head: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xxl, gap: spacing.sm },
    title: { fontFamily: fonts.display, fontSize: 28, color: colors.cream, marginTop: spacing.md },
    sub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
    input: {
        backgroundColor: colors.cardLight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        color: colors.cream,
        fontFamily: fonts.body,
        fontSize: 16,
        padding: 15,
    },
    forgot: { fontFamily: fonts.bodyMed, fontSize: 13, color: colors.rose, textAlign: 'right' },
});
