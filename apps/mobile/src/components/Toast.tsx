// src/components/Toast.tsx — toast bas-centre, piloté par useToast (store/app.ts).
// Monté une seule fois dans le layout racine ; superposé à tous les écrans.
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '../theme/typography';
import { useToast } from '../store/app';

export default function Toast() {
    const msg = useToast((s) => s.msg);
    const insets = useSafeAreaInsets();
    const a = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(a, { toValue: msg ? 1 : 0, duration: 220, useNativeDriver: true }).start();
    }, [msg]);

    if (!msg) return null;
    return (
        <View pointerEvents="none" style={[styles.layer, { bottom: insets.bottom + 96 }]}>
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        opacity: a,
                        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
                    },
                ]}
            >
                <Text style={styles.txt}>{msg}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    layer: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 50 },
    bubble: {
        maxWidth: 300,
        backgroundColor: 'rgba(20,12,40,0.93)',
        paddingVertical: 11,
        paddingHorizontal: 18,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 30,
        elevation: 20,
    },
    txt: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: '#fff', textAlign: 'center' },
});
