// src/components/GradientButton.tsx
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../theme/typography';
import { shadow, radius } from '../theme/spacing';
import { colors, gradients } from '../theme/colors';
import { useScale } from '../theme/responsive';

type Props = {
    label: string;
    onPress?: (e: GestureResponderEvent) => void;
    icon?: keyof typeof Ionicons.glyphMap;
};

export default function GradientButton({ label, onPress, icon }: Props) {
    const scale = useRef(new Animated.Value(1)).current;
    const { s, ms } = useScale();

    const animate = (to: number) =>
        Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

    return (
        <Animated.View style={[{ transform: [{ scale }] }, shadow.glow]}>
            <Pressable
                onPressIn={() => animate(0.97)}
                onPressOut={() => animate(1)}
                onPress={onPress}
            >
                <LinearGradient
                    colors={gradients.rose}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.btn, { paddingVertical: s(17), borderRadius: radius.pill }]}
                >
                    {icon && <Ionicons name={icon} size={ms(19)} color={colors.white} style={{ marginRight: 8 }} />}
                    <Text style={[styles.label, { fontSize: ms(16) }]}>{label}</Text>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { fontFamily: fonts.bodySemi, color: colors.white, letterSpacing: 0.3 },
});
