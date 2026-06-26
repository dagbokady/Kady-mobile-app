// src/components/XPBar.tsx — carte de progression XP / niveau d'un Cercle.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedBar } from './motion';
import { fonts } from '../theme/typography';
import { useColors } from '../theme/theme';

export default function XPBar({ level, xp, max, unlock }: { level: number; xp: number; max: number; unlock?: string }) {
    const c = useColors();
    const remaining = Math.max(0, max - xp);
    return (
        <View style={[s.wrap, { borderColor: 'rgba(255,140,190,0.2)' }]}>
            <LinearGradient
                colors={['rgba(255,106,169,0.12)', 'rgba(255,111,194,0.06)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={s.head}>
                <View style={s.headLeft}>
                    <Ionicons name="flash" size={15} color={c.accent} />
                    <Text style={[s.title, { color: c.text }]}>Niveau du cercle {level}</Text>
                </View>
                <Text style={[s.xp, { color: c.ink(0.6) }]}>
                    <Text style={{ color: c.text, fontFamily: fonts.bodyBold }}>{xp}</Text> / {max} XP
                </Text>
            </View>
            <AnimatedBar progress={max ? xp / max : 0} height={8} track={c.ink(0.12)}>
                <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </AnimatedBar>
            {!!unlock && (
                <Text style={[s.hint, { color: c.ink(0.5) }]}>
                    Encore {remaining} XP pour débloquer les <Text style={{ color: c.accentDeep, fontFamily: fonts.bodyBold }}>{unlock}</Text>
                </Text>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    wrap: { padding: 15, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
    headLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    title: { fontFamily: fonts.bodyBold, fontSize: 13 },
    xp: { fontFamily: fonts.body, fontSize: 12 },
    hint: { fontFamily: fonts.body, fontSize: 11, marginTop: 9, lineHeight: 16 },
});
