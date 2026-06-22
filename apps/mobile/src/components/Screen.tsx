// src/components/Screen.tsx
import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../theme/spacing';
import { useColors } from '../theme/theme';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    padded?: boolean;
    edges?: ('top' | 'bottom')[];
    style?: ViewStyle;
};

export default function Screen({ children, padded = true, edges = ['top', 'bottom'], style }: Props) {
    const c = useColors();
    return (
        <View style={styles.fill}>
            <StatusBar barStyle={c.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <LinearGradient colors={c.bg} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
            <View pointerEvents="none" style={[styles.auraTop, { backgroundColor: c.auraTop }]} />
            <View pointerEvents="none" style={[styles.auraBottom, { backgroundColor: c.auraBottom }]} />
            <SafeAreaView style={styles.fill} edges={edges}>
                <View style={[styles.fill, padded && styles.padded, style]}>{children}</View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: { flex: 1 },
    padded: { paddingHorizontal: spacing.lg },
    auraTop: { position: 'absolute', top: -150, alignSelf: 'center', width: 420, height: 320, borderRadius: 210 },
    auraBottom: { position: 'absolute', bottom: -40, right: -90, width: 300, height: 300, borderRadius: 150 },
});
