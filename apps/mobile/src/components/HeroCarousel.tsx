// src/components/HeroCarousel.tsx — carrousel héro de l'accueil : 4 diapos qui
// défilent automatiquement, points de pagination, et bouton « Découvrir ».
import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';

export type HeroSlide = { grad: readonly [string, string, ...string[]]; chip?: string; title: string; sub: string };

export default function HeroCarousel({ slides, onDiscover }: { slides: HeroSlide[]; onDiscover?: () => void }) {
    const [w, setW] = useState(0);
    const [index, setIndex] = useState(0);
    const ref = useRef<ScrollView>(null);

    const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

    useEffect(() => {
        if (!w) return;
        const id = setInterval(() => {
            setIndex((i) => {
                const next = (i + 1) % slides.length;
                ref.current?.scrollTo({ x: next * w, animated: true });
                return next;
            });
        }, 4200);
        return () => clearInterval(id);
    }, [w, slides.length]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!w) return;
        const i = Math.round(e.nativeEvent.contentOffset.x / w);
        if (i !== index) setIndex(i);
    };

    const goTo = (i: number) => {
        setIndex(i);
        ref.current?.scrollTo({ x: i * w, animated: true });
    };

    return (
        <View>
            <View style={s.frame} onLayout={onLayout}>
                <ScrollView
                    ref={ref}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onScroll}
                    scrollEventThrottle={16}
                >
                    {slides.map((sl, i) => (
                        <View key={i} style={{ width: w, height: 206 }}>
                            <LinearGradient colors={sl.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                            <LinearGradient colors={['rgba(10,6,20,0.05)', 'rgba(10,6,20,0.78)']} style={StyleSheet.absoluteFill} />
                            <View style={s.slide}>
                                {!!sl.chip && (
                                    <View style={s.chip}>
                                        <Ionicons name="people-outline" size={14} color="#fff" />
                                        <Text style={s.chipTxt}>{sl.chip}</Text>
                                    </View>
                                )}
                                <View>
                                    <Text style={s.title}>{sl.title}</Text>
                                    <Text style={s.sub}>{sl.sub}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <Pressable onPress={onDiscover} style={s.discover}>
                    <Text style={s.discoverTxt}>Découvrir</Text>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                </Pressable>
            </View>

            <View style={s.dots}>
                {slides.map((_, i) => (
                    <Pressable key={i} onPress={() => goTo(i)} hitSlop={6}>
                        <View style={[s.dot, i === index ? s.dotOn : s.dotOff]} />
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    frame: { borderRadius: 26, overflow: 'hidden', height: 206, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    slide: { flex: 1, padding: 20, justifyContent: 'space-between' },
    chip: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    chipTxt: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: '#fff' },
    title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, color: '#fff', maxWidth: 250 },
    sub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.85)', marginTop: 8, maxWidth: 220 },
    discover: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 17, borderRadius: 99, backgroundColor: '#e02a73', shadowColor: '#ff6aa9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.55, shadowRadius: 14, elevation: 8 },
    discoverTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: '#fff' },
    dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
    dot: { height: 7, borderRadius: 4 },
    dotOn: { width: 22, backgroundColor: '#e02a73' },
    dotOff: { width: 7, backgroundColor: 'rgba(214,40,110,0.25)' },
});
