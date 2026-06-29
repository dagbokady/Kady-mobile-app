// app/index.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Screen from '../src/components/Screen';
import Logo from '../src/components/Logo';
import GradientButton from '../src/components/GradientButton';
import { FadeInUp, PopIn } from '../src/components/motion';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { useColors, type Palette } from '../src/theme/theme';
import { useAuth } from '../src/store/auth';

export default function Welcome() {
    const router = useRouter();
    const c = useColors();
    const { width } = useWindowDimensions();
    const styles = makeStyles(c, width);
    const spin = useRef(new Animated.Value(0)).current;

    // Session déjà active (jeton valide restauré) → on saute l'accueil marketing.
    const status = useAuth((s) => s.status);
    useEffect(() => {
        if (status === 'authed') router.replace('/(app)/accueil');
    }, [status]);

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(spin, { toValue: 1, duration: 60000, easing: Easing.linear, useNativeDriver: true }),
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Screen>
            <View style={styles.root}>
                <Animated.View style={[styles.decor, { transform: [{ rotate }] }]} pointerEvents="none">
                    <Svg width={width * 1.5} height={width * 1.5} viewBox="0 0 300 300">
                        <Defs>
                            <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
                                <Stop offset="0" stopColor="#ff6aa9" stopOpacity={0.2} />
                                <Stop offset="0.6" stopColor="#ff6aa9" stopOpacity={0.07} />
                                <Stop offset="1" stopColor="#ff6aa9" stopOpacity={0} />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="150" cy="150" r="150" fill="url(#halo)" />
                        <Circle cx="150" cy="150" r="88" stroke="rgba(214,40,110,0.18)" strokeWidth={1.5} fill="none" strokeDasharray="6 10" />
                        <Circle cx="150" cy="150" r="115" stroke={c.border} strokeWidth={1} fill="none" />
                        <Circle cx="150" cy="150" r="140" stroke={c.border} strokeWidth={0.5} fill="none" strokeDasharray="2 8" />
                    </Svg>
                </Animated.View>

                <PopIn delay={120} style={styles.brand}>
                    <Logo size={100} color={c.accent} />
                    <Text style={styles.wordmark}>K A D Y</Text>
                </PopIn>

                <View style={styles.copy}>
                    <FadeInUp delay={260}><Text style={styles.eyebrow}>LA RENCONTRE, AUTREMENT</Text></FadeInUp>
                    <FadeInUp delay={340}>
                        <Text style={styles.headline}>
                            Ici, on se rencontre{'\n'}d'abord <Text style={styles.em}>en cercle.</Text>
                        </Text>
                    </FadeInUp>
                    <FadeInUp delay={420}>
                        <Text style={styles.sub}>
                            Pas de message privé sans un Cercle partagé.{'\n'}On apprend à se connaître avant de se parler.
                        </Text>
                    </FadeInUp>
                </View>

                <FadeInUp delay={520} style={styles.actions}>
                    <GradientButton label="Créer mon compte" onPress={() => router.push('/register')} />
                    <Pressable onPress={() => router.push('/login')} hitSlop={10} style={styles.secondary}>
                        <Text style={styles.secondaryTxt}>J'ai déjà un compte</Text>
                    </Pressable>
                    <Text style={styles.legal}>Réservé aux 18 ans et plus</Text>
                </FadeInUp>
            </View>
        </Screen>
    );
}

const makeStyles = (c: Palette, width: number) => StyleSheet.create({
    root: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xl },
    decor: { position: 'absolute', top: -width * 0.22, alignSelf: 'center', opacity: 1 },

    brand: { alignItems: 'center', marginTop: spacing.xxxl },
    wordmark: { fontFamily: fonts.display, color: c.accent, fontSize: 34, letterSpacing: 12, marginTop: spacing.lg },

    copy: { alignItems: 'center', paddingHorizontal: spacing.sm },
    eyebrow: { fontFamily: fonts.bodySemi, color: c.ink(0.6), fontSize: 11, letterSpacing: 2.5, marginBottom: spacing.md, textAlign: 'center' },
    headline: { fontFamily: fonts.display, color: c.text, fontSize: 32, lineHeight: 42, textAlign: 'center', letterSpacing: 0.3 },
    em: { color: c.accent },
    sub: { fontFamily: fonts.body, color: c.ink(0.6), fontSize: 16, lineHeight: 25, textAlign: 'center', marginTop: spacing.md, maxWidth: 320 },

    actions: { alignItems: 'center', gap: spacing.md },
    secondary: { paddingVertical: spacing.sm },
    secondaryTxt: { fontFamily: fonts.bodyMed, color: c.accent, fontSize: 15 },
    legal: { fontFamily: fonts.body, color: c.ink(0.42), fontSize: 12, marginTop: spacing.xs },
});
