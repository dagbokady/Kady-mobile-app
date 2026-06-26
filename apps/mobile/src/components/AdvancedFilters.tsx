// src/components/AdvancedFilters.tsx — panneau de filtres avancés de Découvrir :
// places disponibles, grade du cercle, tri. Sélection contrôlée par le parent.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { useColors } from '../theme/theme';

export type AdvValues = { places: string; grade: string; sort: string };

export const ADV_PLACES = [
    { key: 'all', label: 'Toutes' },
    { key: 'few', label: '1–3 places' },
    { key: 'many', label: '4+ places' },
];
export const ADV_GRADES: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'all', label: 'Tous', icon: 'apps', color: '#9aa0ad' },
    { key: 'flamme', label: 'Flamme', icon: 'flame', color: '#FF6B4A' },
    { key: 'etoile', label: 'Étoile', icon: 'star', color: '#F5A623' },
    { key: 'diamant', label: 'Diamant', icon: 'diamond', color: '#2BB7CF' },
    { key: 'legendaire', label: 'Légendaire', icon: 'sparkles', color: '#8B5CF6' },
];
export const ADV_SORTS = [
    { key: 'pop', label: 'Populaires' },
    { key: 'near', label: 'Proches' },
];

type Props = {
    values: AdvValues;
    onChange: (v: Partial<AdvValues>) => void;
    count: number;
    onApply: () => void;
    onReset: () => void;
};

export default function AdvancedFilters({ values, onChange, count, onApply, onReset }: Props) {
    const c = useColors();

    const Opt = ({ active, label, icon, color }: { active: boolean; label: string; icon?: keyof typeof Ionicons.glyphMap; color?: string }) => {
        const txt = active ? c.accent : c.ink(0.7);
        return (
            <View style={[
                f.opt,
                { backgroundColor: active ? 'rgba(255,106,169,0.12)' : c.field, borderColor: active ? 'rgba(255,106,169,0.45)' : c.border },
            ]}>
                {icon && <Ionicons name={icon} size={13} color={color && !active ? color : txt} />}
                <Text style={[f.optTxt, { color: txt }]}>{label}</Text>
            </View>
        );
    };

    return (
        <View style={[f.panel, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={f.head}>
                <Text style={[f.headTitle, { color: c.text }]}>Filtres avancés</Text>
                <Pressable onPress={onReset} hitSlop={8}><Text style={[f.reset, { color: c.accent }]}>Réinitialiser</Text></Pressable>
            </View>

            <View>
                <Text style={[f.section, { color: c.ink(0.5) }]}>Places disponibles</Text>
                <View style={f.rowWrap}>
                    {ADV_PLACES.map((o) => (
                        <Pressable key={o.key} onPress={() => onChange({ places: o.key })}>
                            <Opt active={values.places === o.key} label={o.label} />
                        </Pressable>
                    ))}
                </View>
            </View>

            <View>
                <Text style={[f.section, { color: c.ink(0.5) }]}>Grade du cercle</Text>
                <View style={f.rowWrap}>
                    {ADV_GRADES.map((o) => (
                        <Pressable key={o.key} onPress={() => onChange({ grade: o.key })}>
                            <Opt active={values.grade === o.key} label={o.label} icon={o.icon} color={o.color} />
                        </Pressable>
                    ))}
                </View>
            </View>

            <View>
                <Text style={[f.section, { color: c.ink(0.5) }]}>Trier par</Text>
                <View style={f.rowWrap}>
                    {ADV_SORTS.map((o) => (
                        <Pressable key={o.key} onPress={() => onChange({ sort: o.key })}>
                            <Opt active={values.sort === o.key} label={o.label} />
                        </Pressable>
                    ))}
                </View>
            </View>

            <Pressable onPress={onApply}>
                <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={f.apply}>
                    <Text style={f.applyTxt}>Voir {count} {count > 1 ? 'résultats' : 'résultat'}</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const f = StyleSheet.create({
    panel: { marginTop: 12, padding: 16, borderRadius: 18, borderWidth: 1, gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headTitle: { fontFamily: fonts.display, fontSize: 15 },
    reset: { fontFamily: fonts.bodySemi, fontSize: 12.5 },
    section: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 9 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    opt: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 9, paddingHorizontal: 13, borderRadius: radius.pill, borderWidth: 1 },
    optTxt: { fontFamily: fonts.bodySemi, fontSize: 13 },
    apply: { paddingVertical: 13, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    applyTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' },
});
