// src/components/TabBar.tsx
// Barre d'onglets KADY : Accueil · Cercles · (➕ FAB) · Messages · Profil.
// Surface arrondie ancrée en bas, onglet actif mis en valeur par une pastille
// magenta (icône pleine + libellé). FAB central surélevé. S'adapte à la zone
// sûre de chaque appareil (encoche, barre gestuelle).

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PopIn } from './motion';
import { colors, gradients } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useColors, type Palette } from '../theme/theme';

type Tab = { name: string; label: string; icon: keyof typeof Ionicons.glyphMap; badge?: number };

const TABS: Tab[] = [
    { name: 'accueil', label: 'Accueil', icon: 'home-outline' },
    { name: 'cercles', label: 'Cercles', icon: 'people-outline' },
    { name: 'messages', label: 'Messages', icon: 'chatbubble-outline', badge: 4 },
    { name: 'profil', label: 'Profil', icon: 'person-outline' },
];

export default function TabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();
    const c = useColors();
    const styles = makeStyles(c);
    const INACTIVE = c.ink(0.5);
    const activeName: string = state.routes[state.index]?.name ?? '';

    // Masque la barre sur les écrans plein écran hors onglets (Créer, Notifications…)
    const TAB_NAMES = ['accueil', 'cercles', 'messages', 'profil'];
    if (!TAB_NAMES.includes(activeName)) return null;

    // …et sur les écrans de détail : chaque onglet imbrique une Stack ; on n'affiche
    // la barre que sur son index (chat, cercle detail, carnet, paramètres… la masquent).
    const activeTab = state.routes[state.index];
    const nested = activeTab?.state;
    const nestedName = nested && typeof nested.index === 'number' ? nested.routes?.[nested.index]?.name : undefined;
    if (nestedName && nestedName !== 'index') return null;

    const go = (name: string) => {
        const route = state.routes.find((r: any) => r.name === name);
        if (!route) return;
        const focused = activeName === name || activeName.startsWith(name + '/');
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!focused && !event.defaultPrevented) navigation.navigate(name);
    };

    const Item = ({ tab }: { tab: Tab }) => {
        const focused = activeName === tab.name || activeName.startsWith(tab.name + '/');
        const icon = (focused ? tab.icon.replace('-outline', '') : tab.icon) as keyof typeof Ionicons.glyphMap;
        return (
            <Pressable onPress={() => go(tab.name)} style={({ pressed }) => [styles.item, pressed && { opacity: 0.55 }]} hitSlop={8}>
                <View style={[styles.iconWrap, focused && styles.iconWrapOn]}>
                    <Ionicons name={icon} size={22} color={focused ? c.accent : INACTIVE} />
                    {!!tab.badge && (
                        <View style={styles.badge}><Text style={styles.badgeTxt}>{tab.badge}</Text></View>
                    )}
                </View>
                <Text style={[styles.label, { color: focused ? c.accent : INACTIVE, fontFamily: focused ? fonts.bodyBold : fonts.bodySemi }]} numberOfLines={1}>
                    {tab.label}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) + 4 }]}>
            <View style={styles.row}>
                <Item tab={TABS[0]} />
                <Item tab={TABS[1]} />

                {/* FAB central — créer un cercle */}
                <View style={styles.fabSlot}>
                    <Pressable onPress={() => navigation.navigate('creer')} hitSlop={10}>
                        <PopIn from={0.85}>
                            <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
                                <Ionicons name="add" size={30} color={colors.white} />
                            </LinearGradient>
                        </PopIn>
                    </Pressable>
                </View>

                <Item tab={TABS[2]} />
                <Item tab={TABS[3]} />
            </View>
        </View>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    wrap: {
        backgroundColor: c.card,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        borderWidth: 1, borderBottomWidth: 0, borderColor: c.border,
        paddingTop: 12, paddingHorizontal: 12,
        shadowColor: '#281950', shadowOffset: { width: 0, height: -6 }, shadowOpacity: c.mode === 'dark' ? 0.4 : 0.1, shadowRadius: 18, elevation: 16,
    },
    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    item: { flex: 1, alignItems: 'center', gap: 5, paddingTop: 2 },
    iconWrap: { minWidth: 46, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
    iconWrapOn: { backgroundColor: c.mode === 'dark' ? 'rgba(255,122,176,0.18)' : 'rgba(255,106,169,0.14)' },
    label: { fontSize: 10.5, letterSpacing: 0.2 },
    fabSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
    fab: {
        top: -22, width: 60, height: 60, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 4, borderColor: c.card,
        shadowColor: '#e02a73', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 24,
    },
    badge: {
        position: 'absolute', top: -3, right: 2, minWidth: 16, height: 16, paddingHorizontal: 4,
        borderRadius: 8, backgroundColor: colors.pink, borderWidth: 2, borderColor: c.card,
        alignItems: 'center', justifyContent: 'center',
    },
    badgeTxt: { fontFamily: fonts.bodyBold, fontSize: 9, color: '#fff' },
});
