// src/components/Toggle.tsx — interrupteur (piste + pastille) et ligne de réglage
// réutilisés dans Profil et Paramètres. La piste « on » prend le dégradé magenta.
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { useColors } from '../theme/theme';

export function Toggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
    const c = useColors();
    const a = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(a, { toValue: value ? 1 : 0, duration: 180, useNativeDriver: true }).start();
    }, [value]);

    const knob = (
        <Animated.View
            style={[tg.knob, { transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }] }]}
        />
    );

    return (
        <Pressable onPress={() => onValueChange(!value)} hitSlop={8}>
            {value ? (
                <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={tg.track}>
                    {knob}
                </LinearGradient>
            ) : (
                <View style={[tg.track, { backgroundColor: c.field }]}>{knob}</View>
            )}
        </Pressable>
    );
}

/* Ligne de réglage : médaillon icône + titre + sous-titre + contrôle à droite. */
export function SettingRow({
    icon, tint, tintBg, title, sub, subColor, right,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    tint: string;
    tintBg: string;
    title: string;
    sub?: string;
    subColor?: string;
    right?: React.ReactNode;
}) {
    const c = useColors();
    return (
        <View style={[sr.row, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[sr.icon, { backgroundColor: tintBg }]}>
                <Ionicons name={icon} size={20} color={tint} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[sr.title, { color: c.text }]}>{title}</Text>
                {!!sub && <Text style={[sr.sub, { color: subColor ?? c.ink(0.45) }]}>{sub}</Text>}
            </View>
            {right}
        </View>
    );
}

const tg = StyleSheet.create({
    track: { width: 48, height: 28, borderRadius: 14, padding: 3.5, justifyContent: 'center' },
    knob: {
        width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
});
const sr = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, borderRadius: 18, borderWidth: 1 },
    icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    title: { fontFamily: fonts.bodyBold, fontSize: 14.5 },
    sub: { fontFamily: fonts.body, fontSize: 11.5, marginTop: 2, lineHeight: 17 },
});
