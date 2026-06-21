// src/components/GradientButton.tsx
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { shadow, radius } from '../theme/spacing';
import { colors, gradients } from '../theme/colors';

type Props = {
    label: string;
    onPress?: (e: GestureResponderEvent) => void;
};

export default function GradientButton({ label, onPress }: Props) {
    const scale = useRef(new Animated.Value(1)).current;

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
                    style={styles.btn}
                >
                    <Text style={styles.label}>{label}</Text>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 17,
        paddingHorizontal: 32,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { fontFamily: fonts.bodySemi, color: colors.white, fontSize: 16, letterSpacing: 0.3 },
});
