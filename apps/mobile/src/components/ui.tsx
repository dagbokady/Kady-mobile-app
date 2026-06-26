// src/components/ui.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { colorForName } from '../theme/colors';
import { useColors, type Palette } from '../theme/theme';

/* ---------- Avatar (anneau dégradé optionnel + initiales colorées) ---------- */
function AvatarCircle({ uri, name = '?', size = 48, locked }: { uri?: string; name?: string; size?: number; locked?: boolean }) {
    const c = useColors();
    const tint = colorForName(name);
    return (
        <View style={{ width: size, height: size }}>
            <View style={[av.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: uri ? c.card2 : tint + '22' }]}>
                {uri ? (
                    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} blurRadius={locked ? 18 : 0} />
                ) : (
                    <Text style={[av.initial, { fontSize: size * 0.4, color: tint }]}>{name.charAt(0).toUpperCase()}</Text>
                )}
            </View>
            {locked && (
                <View style={[av.lock, { borderRadius: size / 2 }]}>
                    <Ionicons name="lock-closed" size={size * 0.32} color="#fff" />
                </View>
            )}
        </View>
    );
}

export function Avatar({
    uri, name = '?', size = 48, locked, ring,
}: { uri?: string; name?: string; size?: number; locked?: boolean; ring?: readonly string[] }) {
    const c = useColors();
    const circle = <AvatarCircle uri={uri} name={name} size={size} locked={locked} />;
    if (!ring) return circle;
    const gap = 2.5;
    const outer = size + gap * 4;
    return (
        <LinearGradient colors={ring as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: outer, height: outer, borderRadius: outer / 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ padding: gap, backgroundColor: c.card, borderRadius: outer / 2 }}>{circle}</View>
        </LinearGradient>
    );
}

/* ---------- Pile d'avatars superposés ---------- */
export function AvatarStack({ names, extra = 0, size = 28 }: { names: string[]; extra?: number; size?: number }) {
    const c = useColors();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {names.map((n, i) => {
                const tint = colorForName(n);
                return (
                    <View key={i} style={{
                        width: size, height: size, borderRadius: size / 2,
                        backgroundColor: tint + '33', borderWidth: 2, borderColor: c.card,
                        alignItems: 'center', justifyContent: 'center',
                        marginLeft: i === 0 ? 0 : -size * 0.32,
                    }}>
                        <Text style={{ fontFamily: fonts.bodySemi, fontSize: size * 0.4, color: tint }}>{n.charAt(0).toUpperCase()}</Text>
                    </View>
                );
            })}
            {extra > 0 && (
                <View style={{
                    width: size, height: size, borderRadius: size / 2,
                    backgroundColor: c.card2, borderWidth: 2, borderColor: c.card,
                    alignItems: 'center', justifyContent: 'center', marginLeft: -size * 0.32,
                }}>
                    <Text style={{ fontFamily: fonts.bodySemi, fontSize: size * 0.34, color: c.ink(0.6) }}>+{extra}</Text>
                </View>
            )}
        </View>
    );
}

/* ---------- Card ---------- */
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    const c = useColors();
    return <View style={[{
        backgroundColor: c.card, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, padding: spacing.md,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.07, shadowRadius: 14, elevation: 3,
    }, style]}>{children}</View>;
}

/* ---------- Grades (XP du Cercle) ---------- */
const GRADES: Record<string, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
    graine: { label: 'Graine', color: '#22B36B', icon: 'leaf' },
    flamme: { label: 'Flamme', color: '#FF6B4A', icon: 'flame' },
    etoile: { label: 'Étoile', color: '#F5A623', icon: 'star' },
    diamant: { label: 'Diamant', color: '#2BB7CF', icon: 'diamond' },
    legendaire: { label: 'Légendaire', color: '#8B5CF6', icon: 'sparkles' },
};
export function GradeChip({ grade, solid }: { grade: keyof typeof GRADES; solid?: boolean }) {
    const g = GRADES[grade] ?? GRADES.graine;
    if (solid) {
        return (
            <View style={[chip.base, { borderColor: 'transparent', backgroundColor: g.color }]}>
                <Ionicons name={g.icon} size={12} color="#fff" />
                <Text style={[chip.txt, { color: '#fff' }]}>{g.label}</Text>
            </View>
        );
    }
    return (
        <View style={[chip.base, { borderColor: g.color + '55', backgroundColor: g.color + '26' }]}>
            <Ionicons name={g.icon} size={12} color={g.color} />
            <Text style={[chip.txt, { color: g.color }]}>{g.label}</Text>
        </View>
    );
}

/* ---------- Badges ---------- */
const BADGES: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    pionnier: { label: 'Pionnier', icon: 'rocket', color: '#a78bfa' },
    verifie: { label: 'Vérifié', icon: 'checkmark-circle', color: '#2fb8c0' },
    verifie_plus: { label: 'Vérifié+', icon: 'shield-checkmark', color: '#5a7fd6' },
    membre_respectueux: { label: 'Respectueux', icon: 'heart', color: '#ff6fa8' },
};
export function Badge({ code }: { code: keyof typeof BADGES }) {
    const b = BADGES[code];
    if (!b) return null;
    return (
        <View style={[badge.base, { backgroundColor: b.color + '24' }]}>
            <Ionicons name={b.icon} size={14} color={b.color} />
            <Text style={[badge.txt, { color: b.color }]}>{b.label}</Text>
        </View>
    );
}

/* ---------- Progression des niveaux (Mode Rencontre / Amitié) ---------- */
export function LevelDots({ level, max = 5, labels, color }: { level: number; max?: number; labels?: string[]; color?: string }) {
    const c = useColors();
    const on0 = color ?? c.accent;
    return (
        <View>
            <View style={lv.row}>
                {Array.from({ length: max }).map((_, i) => {
                    const on = i < level;
                    return (
                        <React.Fragment key={i}>
                            <View style={[lv.dot, { backgroundColor: c.card2, borderColor: c.border }, on && { backgroundColor: on0, borderColor: on0 }]} />
                            {i < max - 1 && <View style={[lv.bar, { backgroundColor: c.card2 }, on && i + 1 < level && { backgroundColor: on0 }]} />}
                        </React.Fragment>
                    );
                })}
            </View>
            {labels && <Text style={[lv.label, { color: on0 }]}>{labels[Math.min(level, max) - 1]}</Text>}
        </View>
    );
}

/* ---------- Pill / chip sélectionnable ---------- */
export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
    const c = useColors();
    if (active) {
        return (
            <Pressable onPress={onPress}>
                <LinearGradient colors={['#ff6aa9', '#e02a73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[pill.base, { borderColor: 'transparent' }]}>
                    <Text style={[pill.txt, { color: '#fff', fontFamily: fonts.bodySemi }]}>{label}</Text>
                </LinearGradient>
            </Pressable>
        );
    }
    return (
        <Pressable onPress={onPress} style={[pill.base, { borderColor: c.border }]}>
            <Text style={[pill.txt, { color: c.ink(0.6) }]}>{label}</Text>
        </Pressable>
    );
}

/* ---------- En-tête d'écran ---------- */
export function ScreenHeader({ title, back, right, tint }: { title?: string; back?: boolean; right?: React.ReactNode; tint?: string }) {
    const router = useRouter();
    const c = useColors();
    return (
        <View style={hd.row}>
            {back && (
                <Pressable onPress={() => router.back()} hitSlop={8} style={[hd.backBtn, { backgroundColor: c.field, borderColor: c.border }]}>
                    <Ionicons name="chevron-back" size={20} color={tint ?? c.text} />
                </Pressable>
            )}
            {title ? <Text style={[hd.title, { color: c.text }]} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}
            {right}
        </View>
    );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
    const c = useColors();
    return <Text style={[sct.section, { color: c.ink(0.6) }]}>{children}</Text>;
}

/* ---------- styles (constantes non thématiques) ---------- */
const av = StyleSheet.create({
    base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    initial: { fontFamily: fonts.displayMed },
    lock: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,12,40,0.5)', alignItems: 'center', justifyContent: 'center' },
});
const chip = StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: radius.pill, paddingVertical: 3, paddingHorizontal: 9 },
    txt: { fontFamily: fonts.bodySemi, fontSize: 11 },
});
const badge = StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 11 },
    txt: { fontFamily: fonts.bodyMed, fontSize: 12 },
});
const lv = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 11, height: 11, borderRadius: 6, borderWidth: 1 },
    bar: { flex: 1, height: 2, marginHorizontal: 2 },
    label: { fontFamily: fonts.bodyMed, fontSize: 12, marginTop: 6 },
});
const pill = StyleSheet.create({
    base: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
    txt: { fontFamily: fonts.body, fontSize: 14 },
});
const hd = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 52, marginBottom: 4 },
    backBtn: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    title: { flex: 1, fontFamily: fonts.display, fontSize: 23, letterSpacing: -0.3 },
});
const sct = StyleSheet.create({
    section: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: spacing.sm },
});
