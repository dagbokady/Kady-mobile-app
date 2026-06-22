// src/components/AgeRange.tsx
// Sélecteur de tranche d'âge recherchée (min / max) — deux compteurs + un rail
// dégradé qui visualise l'écart. Thémé clair/sombre. Réutilisé à l'inscription
// et dans l'écran Préférences (Mode de connexion).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './motion';
import { fonts } from '../theme/typography';
import { useColors, type Palette } from '../theme/theme';
import { AGE_FLOOR, AGE_CEIL } from '../store/app';

type Props = { min: number; max: number; onChange: (min: number, max: number) => void; monAge?: number };

export default function AgeRange({ min, max, onChange, monAge }: Props) {
    const c = useColors();
    const s = makeStyles(c);

    const setMin = (v: number) => onChange(Math.min(Math.max(AGE_FLOOR, v), max - 1), max);
    const setMax = (v: number) => onChange(min, Math.max(Math.min(AGE_CEIL, v), min + 1));

    const span = AGE_CEIL - AGE_FLOOR;
    const left = ((min - AGE_FLOOR) / span) * 100;
    const right = ((max - AGE_FLOOR) / span) * 100;

    return (
        <View style={s.card}>
            <View style={s.values}>
                <Stepper label="Âge minimum" value={min} onDec={() => setMin(min - 1)} onInc={() => setMin(min + 1)} c={c} />
                <View style={s.gap}><Ionicons name="remove" size={16} color={c.ink(0.3)} /></View>
                <Stepper label="Âge maximum" value={max} onDec={() => setMax(max - 1)} onInc={() => setMax(max + 1)} c={c} />
            </View>

            <View style={s.track}>
                <View style={[s.fill, { left: `${left}%`, width: `${right - left}%` }]}>
                    <LinearGradient colors={c.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 99 }} />
                </View>
                <View style={[s.knob, { left: `${left}%` }]} />
                <View style={[s.knob, { left: `${right}%` }]} />
            </View>

            <View style={s.summaryRow}>
                <Ionicons name="people-outline" size={14} color={c.accent} />
                <Text style={s.summary}>
                    Profils de <Text style={s.strong}>{min}</Text> à <Text style={s.strong}>{max}</Text> ans
                    {typeof monAge === 'number' ? <Text> · écart jusqu'à <Text style={s.strong}>{Math.max(Math.abs(monAge - min), Math.abs(max - monAge))} ans</Text></Text> : null}
                </Text>
            </View>
        </View>
    );
}

function Stepper({ label, value, onDec, onInc, c }: { label: string; value: number; onDec: () => void; onInc: () => void; c: Palette }) {
    const s = makeStyles(c);
    return (
        <View style={s.stepper}>
            <Text style={s.stepLabel}>{label}</Text>
            <View style={s.stepRow}>
                <PressableScale onPress={onDec} scaleTo={0.88}><View style={s.stepBtn}><Ionicons name="remove" size={18} color={c.accentDeep} /></View></PressableScale>
                <Text style={s.stepVal}>{value}</Text>
                <PressableScale onPress={onInc} scaleTo={0.88}><View style={s.stepBtn}><Ionicons name="add" size={18} color={c.accentDeep} /></View></PressableScale>
            </View>
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    card: { padding: 16, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, gap: 16 },
    values: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
    gap: { paddingBottom: 14 },
    stepper: { flex: 1, gap: 9 },
    stepLabel: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: c.ink(0.55), textAlign: 'center' },
    stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    stepBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(255,106,169,0.12)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.4)', alignItems: 'center', justifyContent: 'center' },
    stepVal: { fontFamily: fonts.display, fontSize: 24, color: c.text, minWidth: 38, textAlign: 'center' },
    track: { height: 8, borderRadius: 99, backgroundColor: c.ink(0.12), justifyContent: 'center' },
    fill: { position: 'absolute', top: 0, height: 8, borderRadius: 99 },
    knob: { position: 'absolute', width: 20, height: 20, borderRadius: 10, marginLeft: -10, backgroundColor: '#fff', borderWidth: 2, borderColor: '#ff6aa9', shadowColor: '#d6286e', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 3 },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 7, justifyContent: 'center' },
    summary: { fontFamily: fonts.body, fontSize: 12.5, color: c.ink(0.6) },
    strong: { fontFamily: fonts.bodyBold, color: c.text },
});
