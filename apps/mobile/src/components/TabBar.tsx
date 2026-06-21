// src/components/TabBar.tsx
// Barre d'onglets du design KADY : Accueil · Cercles · (➕ FAB) · Messages · Profil.
// Onglet actif = encre #211633 + libellé gras ; inactif = estompé. FAB central surélevé.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PopIn } from './motion';
import { colors, gradients } from '../theme/colors';
import { fonts } from '../theme/typography';

type Tab = { name: string; label: string; icon: keyof typeof Ionicons.glyphMap; badge?: number };

const TABS: Tab[] = [
    { name: 'accueil', label: 'Accueil', icon: 'home-outline' },
    { name: 'cercles', label: 'Cercles', icon: 'people-outline' },
    { name: 'messages', label: 'Messages', icon: 'chatbubble-outline', badge: 4 },
    { name: 'profil', label: 'Profil', icon: 'person-outline' },
];

const ACTIVE = '#211633';
const INACTIVE = 'rgba(33,22,51,0.45)';

export default function TabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();
    const activeName: string = state.routes[state.index]?.name ?? '';

    const go = (name: string) => {
        const route = state.routes.find((r: any) => r.name === name);
        if (!route) return;
        const focused = activeName === name || activeName.startsWith(name + '/');
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!focused && !event.defaultPrevented) navigation.navigate(name);
    };

    const Item = ({ tab }: { tab: Tab }) => {
        const focused = activeName === tab.name || activeName.startsWith(tab.name + '/');
        const color = focused ? ACTIVE : INACTIVE;
        return (
            <Pressable onPress={() => go(tab.name)} style={styles.item} hitSlop={6}>
                <View>
                    <Ionicons name={tab.icon} size={23} color={color} />
                    {!!tab.badge && (
                        <View style={styles.badge}><Text style={styles.badgeTxt}>{tab.badge}</Text></View>
                    )}
                </View>
                <Text style={[styles.label, { color, fontFamily: focused ? fonts.bodyBold : fonts.bodySemi }]}>{tab.label}</Text>
            </Pressable>
        );
    };

    return (
        <View style={[styles.wrap, { paddingBottom: (insets.bottom || 8) + 6 }]}>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.row}>
                <Item tab={TABS[0]} />
                <Item tab={TABS[1]} />

                {/* FAB central — créer un cercle */}
                <View style={styles.fabSlot}>
                    <Pressable onPress={() => go('cercles')} hitSlop={8}>
                        <PopIn from={0.85}>
                            <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
                                <Ionicons name="add" size={28} color={colors.white} />
                            </LinearGradient>
                        </PopIn>
                    </Pressable>
                </View>

                <Item tab={TABS[2]} />
                <Item tab={TABS[3]} />
            </View>
            <View style={styles.homeBar} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        paddingTop: 10, paddingHorizontal: 18,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(33,22,51,0.06)',
    },
    row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 6 },
    item: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 6 },
    label: { fontSize: 10.5 },
    fabSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    fab: {
        position: 'relative', top: -14, width: 58, height: 58, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#ff6fc2', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.55, shadowRadius: 18, elevation: 10,
    },
    badge: {
        position: 'absolute', top: -5, right: -9, minWidth: 16, height: 16, paddingHorizontal: 4,
        borderRadius: 8, backgroundColor: colors.pink, borderWidth: 2, borderColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
    },
    badgeTxt: { fontFamily: fonts.bodyBold, fontSize: 9, color: '#fff' },
    homeBar: { alignSelf: 'center', marginTop: 8, width: 130, height: 5, borderRadius: 99, backgroundColor: 'rgba(33,22,51,0.22)' },
});
