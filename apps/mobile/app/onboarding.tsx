// app/onboarding.tsx — Onboarding post-inscription (5 slides animées)
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Screen from '../src/components/Screen';
import Logo from '../src/components/Logo';
import GradientButton from '../src/components/GradientButton';
import { useToast } from '../src/store/app';
import { fonts } from '../src/theme/typography';
import { spacing, radius } from '../src/theme/spacing';
import { useColors, type Palette } from '../src/theme/theme';

const SLIDES = [
    {
        key: 'cercles', accent: '#ff6fa8',
        title: 'Tout commence en cercle',
        sub: "Rejoins des petites communautés (max 10) autour d'une passion. C'est là que les liens naissent.",
    },
    {
        key: 'lock', accent: '#8f9dff',
        title: 'Pas de DM sans cercle partagé',
        sub: "Impossible d'écrire à quelqu'un tant que vous ne partagez pas un cercle. Fini les messages non sollicités.",
    },
    {
        key: 'niveaux', accent: '#ff9d5c',
        title: 'La confiance se construit',
        sub: 'Chaque lien progresse par niveaux. Photos et fonctions se débloquent à mesure que vous vous découvrez.',
    },
    {
        key: 'decouvrir', accent: '#2fb8c0',
        title: 'Profil à découvrir',
        sub: "Au début, tu ne vois que la photo, le prénom et l'âge. Le reste se révèle au fil de vos conversations.",
    },
    {
        key: 'mode', accent: '#43e08a',
        title: 'Rencontre ou Amitié',
        sub: 'À toi de choisir le sens de chaque connexion. KADY te propose ce qui te correspond vraiment.',
    },
];

/* ---------- Illustrations par slide ---------- */

function IlluCercles({ accent }: { accent: string }) {
    const c = useColors();
    const avatars = [
        { color: '#ff9d5c', size: 26, top: -13, left: '50%' as any, ml: -13 },
        { color: '#7be0a0', size: 26, bottom: -13 as any, left: '50%' as any, ml: -13 },
        { color: '#b07bff', size: 26, left: -13, top: '50%' as any, mt: -13 },
        { color: '#8fd0ff', size: 26, right: -13 as any, top: '50%' as any, mt: -13 },
    ];
    return (
        <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: `${accent}72`, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {avatars.map((av, i) => (
                    <View key={i} style={{ position: 'absolute', width: av.size, height: av.size, borderRadius: av.size / 2, backgroundColor: av.color, ...av } as any} />
                ))}
                <View style={{ width: 78, height: 78, borderRadius: 26, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="people" size={38} color="#fff" />
                </View>
            </View>
        </View>
    );
}

function IlluLock({ accent }: { accent: string }) {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 180, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff9d5c' }} />
                <View style={{ width: 62, height: 62, borderRadius: 20, marginHorizontal: -10, zIndex: 2, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="lock-closed" size={28} color="#fff" />
                </View>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#7be0a0' }} />
            </View>
            <View style={{ paddingHorizontal: 14, paddingVertical: 5, borderRadius: 99, backgroundColor: `${accent}29`, borderWidth: 1, borderColor: `${accent}59` }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: accent }}>Cercle requis</Text>
            </View>
        </View>
    );
}

function IlluLevels({ accent }: { accent: string }) {
    return (
        <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center', gap: 11 }}>
            {[0, 0.4, 0.8, 1.2].map((_, i) => (
                <View key={i} style={{ width: 170, height: 13, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <LinearGradient colors={['#ff6fa8', '#ff9d5c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: '100%', width: `${75 - i * 15}%` }} />
                </View>
            ))}
            <View style={{ position: 'absolute', top: 24, right: 26, width: 40, height: 40, borderRadius: 20, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="trending-up" size={20} color="#fff" />
            </View>
        </View>
    );
}

function IlluDecouvrir({ accent }: { accent: string }) {
    const c = useColors();
    const cards = [
        { icon: 'location', label: 'Cocody', revealed: true },
        { icon: null, label: null, revealed: false },
        { icon: null, label: null, revealed: false },
        { icon: 'musical-notes', label: 'Afro', revealed: true },
    ];
    return (
        <View style={{ width: 178, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {cards.map((card, i) => (
                <View key={i} style={{ width: 83, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5, backgroundColor: card.revealed ? `${accent}24` : c.card }}>
                    {card.revealed ? (
                        <>
                            <Ionicons name={card.icon as any} size={15} color={accent} />
                            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: accent }}>{card.label}</Text>
                        </>
                    ) : (
                        <Ionicons name="help" size={22} color={c.ink(0.25)} />
                    )}
                </View>
            ))}
        </View>
    );
}

function IlluMode({ accent }: { accent: string }) {
    const c = useColors();
    return (
        <View style={{ width: 182, height: 60, borderRadius: 30, backgroundColor: c.card, flexDirection: 'row', alignItems: 'center', padding: 5, position: 'relative' }}>
            <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ position: 'absolute', top: 5, left: 5, width: 86, height: 50, borderRadius: 25 }} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, zIndex: 2 }}>
                <Ionicons name="heart" size={17} color="#fff" />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' }}>Rencontre</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, zIndex: 2 }}>
                <Ionicons name="people" size={17} color={c.ink(0.5)} />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: c.ink(0.5) }}>Amitié</Text>
            </View>
        </View>
    );
}

function Illustration({ slideKey, accent }: { slideKey: string; accent: string }) {
    const c = useColors();
    const soft = `${accent}18`;
    return (
        <View style={{ width: 236, height: 236, borderRadius: 40, backgroundColor: soft, alignItems: 'center', justifyContent: 'center' }}>
            {slideKey === 'cercles' && <IlluCercles accent={accent} />}
            {slideKey === 'lock' && <IlluLock accent={accent} />}
            {slideKey === 'niveaux' && <IlluLevels accent={accent} />}
            {slideKey === 'decouvrir' && <IlluDecouvrir accent={accent} />}
            {slideKey === 'mode' && <IlluMode accent={accent} />}
        </View>
    );
}

export default function Onboarding() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const { width } = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const goTo = (i: number) => {
        setIndex(i);
        scrollRef.current?.scrollTo({ x: i * width, animated: true });
    };

    const next = () => {
        if (index < SLIDES.length - 1) goTo(index + 1);
        else {
            useToast.getState().show('Bienvenue sur KADY 🎉');
            router.replace('/(app)/accueil');
        }
    };

    const skip = () => {
        useToast.getState().show('Bienvenue sur KADY 🎉');
        router.replace('/(app)/accueil');
    };

    const slide = SLIDES[index];

    return (
        <Screen padded={false} style={{ backgroundColor: c.bg[1] }}>
            {/* Header */}
            <View style={s.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                    <Logo size={30} color={c.accent} />
                    <Text style={s.wordmark}>KADY</Text>
                </View>
                <Pressable style={s.skipBtn} onPress={skip}>
                    <Text style={s.skipTxt}>Passer</Text>
                </Pressable>
            </View>

            {/* Slides */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={{ flex: 1 }}
            >
                {SLIDES.map((sl) => (
                    <View key={sl.key} style={[s.slide, { width }]}>
                        <Illustration slideKey={sl.key} accent={sl.accent} />
                        <Text style={s.slideTitle}>{sl.title}</Text>
                        <Text style={s.slideSub}>{sl.sub}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={s.footer}>
                <View style={s.dots}>
                    {SLIDES.map((_, i) => (
                        <Pressable key={i} onPress={() => goTo(i)} style={[s.dot, i === index && s.dotOn]} />
                    ))}
                </View>
                <GradientButton
                    label={index < SLIDES.length - 1 ? 'Continuer' : 'Commencer'}
                    onPress={next}
                />
            </View>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 0 },
    wordmark: { fontFamily: fonts.display, fontSize: 14, letterSpacing: 3, color: c.text },
    skipBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    skipTxt: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: c.ink(0.55) },

    slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 },
    slideTitle: { fontFamily: fonts.display, fontSize: 25, lineHeight: 31, color: c.text, textAlign: 'center', marginTop: 40 },
    slideSub: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, color: c.ink(0.6), textAlign: 'center', maxWidth: 300, marginTop: 13 },

    footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
    dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
    dot: { width: 7, height: 7, borderRadius: 99, backgroundColor: c.ink(0.18) },
    dotOn: { width: 22, height: 7, backgroundColor: c.accent },
});
