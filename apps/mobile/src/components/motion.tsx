// src/components/motion.tsx
// Primitives d'animation réutilisables, bâties sur l'API Animated de React Native
// (aucune dépendance supplémentaire). Elles donnent vie à toutes les pages :
// entrées en fondu + glissement, retour tactile élastique, pulsation, et
// transitions de mise en page (expand/collapse).

import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    LayoutAnimation,
    Platform,
    Pressable,
    PressableProps,
    StyleProp,
    UIManager,
    View,
    ViewStyle,
} from 'react-native';

// Active les LayoutAnimation sur Android (no-op si déjà actif).
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ---------- Entrée en fondu + glissement (avec décalage pour listes) ---------- */
export function FadeInUp({
    children,
    delay = 0,
    offset = 18,
    duration = 460,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    offset?: number;
    duration?: number;
    style?: StyleProp<ViewStyle>;
}) {
    const a = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const anim = Animated.timing(a, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        });
        anim.start();
        return () => anim.stop();
    }, []);
    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: a,
                    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] }) }],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}

/* ---------- Entrée « scale + fade » (cartes héro, médaillons) ---------- */
export function PopIn({
    children,
    delay = 0,
    from = 0.9,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    from?: number;
    style?: StyleProp<ViewStyle>;
}) {
    const a = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const anim = Animated.spring(a, { toValue: 1, delay, useNativeDriver: true, speed: 12, bounciness: 8 });
        anim.start();
        return () => anim.stop();
    }, []);
    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: a,
                    transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [from, 1] }) }],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}

/* ---------- Pressable avec retour tactile élastique ---------- */
type ScaleProps = PressableProps & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
};
export function PressableScale({ children, style, scaleTo = 0.97, ...rest }: ScaleProps) {
    const scale = useRef(new Animated.Value(1)).current;
    const to = (v: number) =>
        Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
    return (
        <Pressable onPressIn={() => to(scaleTo)} onPressOut={() => to(1)} {...rest}>
            <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
        </Pressable>
    );
}

/* ---------- Pulsation (point « en direct », accents vivants) ---------- */
export function Pulse({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
    const a = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(a, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(a, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, []);
    return (
        <Animated.View
            style={[
                style,
                {
                    transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
                    opacity: a.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] }),
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}

/* ---------- Halo qui pulse derrière un élément (anneau « live ») ---------- */
export function Ripple({ color, size = 12, style }: { color: string; size?: number; style?: StyleProp<ViewStyle> }) {
    const a = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(a, { toValue: 1, duration: 1700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        );
        loop.start();
        return () => loop.stop();
    }, []);
    return (
        <Animated.View
            pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    transform: [
                        { translateX: -size / 2 },
                        { translateY: -size / 2 },
                        { scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) },
                    ],
                    opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
                },
                style,
            ]}
        />
    );
}

/* ---------- Barre de progression qui se remplit à l'apparition ---------- */
export function AnimatedBar({
    progress,
    height = 6,
    track = 'rgba(0,0,0,0.06)',
    children,
    delay = 120,
}: {
    progress: number; // 0..1
    height?: number;
    track?: string;
    children: React.ReactNode; // le remplissage (ex: LinearGradient)
    delay?: number;
}) {
    const a = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const anim = Animated.timing(a, {
            toValue: Math.max(0, Math.min(1, progress)),
            duration: 900,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        });
        anim.start();
        return () => anim.stop();
    }, [progress]);
    return (
        <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
            <Animated.View
                style={{
                    height,
                    borderRadius: height,
                    overflow: 'hidden',
                    width: a.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }}
            >
                {children}
            </Animated.View>
        </View>
    );
}

/* ---------- Déclenche une transition de mise en page douce ---------- */
export function animateLayout() {
    LayoutAnimation.configureNext(
        LayoutAnimation.create(260, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
    );
}
