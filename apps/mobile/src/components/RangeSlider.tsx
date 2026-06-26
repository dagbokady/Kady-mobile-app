// src/components/RangeSlider.tsx — sélecteur de tranche d'âge (double valeur).
// Piste visuelle avec deux poignées positionnées + steppers +/- pour min et max.
// Réutilisé dans Préférences et l'étape 3 de l'inscription.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { useColors } from '../theme/theme';

type Props = {
    min: number;
    max: number;
    floor?: number;
    ceil?: number;
    gap?: number;
    onChange: (min: number, max: number) => void;
    compact?: boolean;
};

export default function RangeSlider({ min, max, floor = 18, ceil = 75, gap = 1, onChange, compact }: Props) {
    const c = useColors();
    const span = ceil - floor;
    const lo = ((min - floor) / span) * 100;
    const hi = ((max - floor) / span) * 100;

    const setMin = (v: number) => onChange(Math.max(floor, Math.min(v, max - gap)), max);
    const setMax = (v: number) => onChange(min, Math.min(ceil, Math.max(v, min + gap)));

    const Stepper = ({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) => (
        <View style={{ flex: 1 }}>
            <Text style={[s.stepLabel, { color: c.ink(0.45) }]}>{label}</Text>
            <View style={[s.stepRow, { backgroundColor: c.field, borderColor: c.border }]}>
                <Pressable onPress={onMinus} hitSlop={8} style={[s.stepBtn, { backgroundColor: c.card, borderColor: c.border }]}>
                    <Ionicons name="remove" size={16} color={c.text} />
                </Pressable>
                <Text style={[s.stepVal, { color: c.text }]}>{value}</Text>
                <Pressable onPress={onPlus} hitSlop={8} style={[s.stepBtn, { backgroundColor: c.card, borderColor: c.border }]}>
                    <Ionicons name="add" size={16} color={c.text} />
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={[s.wrap, { backgroundColor: c.card, borderColor: c.border, padding: compact ? 16 : 18 }]}>
            <View style={s.head}>
                <Text style={[s.between, { color: c.ink(0.6) }]}>Entre</Text>
                <Text style={[s.range, { color: c.accentDeep }]}>{min} – {max} ans</Text>
            </View>

            <View style={[s.track, { backgroundColor: c.ink(0.12) }]}>
                <LinearGradient
                    colors={['#ff6aa9', '#e02a73']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[s.fill, { left: `${lo}%`, width: `${Math.max(0, hi - lo)}%` }]}
                />
                <View style={[s.thumb, { left: `${lo}%` }]} />
                <View style={[s.thumb, { left: `${hi}%` }]} />
            </View>

            <View style={s.steppers}>
                <Stepper label="Minimum" value={min} onMinus={() => setMin(min - 1)} onPlus={() => setMin(min + 1)} />
                <Stepper label="Maximum" value={max} onMinus={() => setMax(max - 1)} onPlus={() => setMax(max + 1)} />
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    wrap: { borderRadius: 18, borderWidth: 1 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    between: { fontFamily: fonts.body, fontSize: 13 },
    range: { fontFamily: fonts.display, fontSize: 16 },
    track: { marginTop: 16, height: 7, borderRadius: 99, justifyContent: 'center' },
    fill: { position: 'absolute', height: 7, borderRadius: 99, top: 0 },
    thumb: {
        position: 'absolute', top: '50%', width: 18, height: 18, borderRadius: 9, marginLeft: -9, marginTop: -9,
        backgroundColor: '#fff', borderWidth: 2, borderColor: '#ff6aa9',
        shadowColor: '#d6286e', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },
    steppers: { marginTop: 16, flexDirection: 'row', gap: 16 },
    stepLabel: { fontFamily: fonts.body, fontSize: 11, marginBottom: 6 },
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 12, borderWidth: 1 },
    stepBtn: { width: 28, height: 28, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    stepVal: { fontFamily: fonts.display, fontSize: 15 },
});
