// app/(app)/messages/index.tsx — Messages : recherche, filtres, liste de
// conversations (réservées aux cercles partagés). (proto L216-261)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { useColors, type Palette } from '../../../src/theme/theme';

const PAD = 22;
const CHIPS = ['Tous', 'Rencontre', 'Amitié'];
const REN = { dot: '#ff6fa8', label: 'Rencontre' };
const AMI = { dot: '#8f9dff', label: 'Amitié' };

type Conv = {
    id: string; initial: string; grad: readonly [string, string]; name: string;
    mode: { dot: string; label: string }; time: string; last: string;
    unread?: number; online?: boolean; mine?: boolean; photo?: boolean;
};
const CONVS: Conv[] = [
    { id: 'awa', initial: 'A', grad: ['#ff9d5c', '#d34d7e'], name: 'Awa, 26', mode: REN, last: 'Tu as déjà visité Assinie ? 🌴', time: '12:45', unread: 2, online: true },
    { id: 'koffi', initial: 'K', grad: ['#7be0a0', '#2f9ac2'], name: 'Koffi, 29', mode: AMI, last: 'On se capte ce week-end ? 🏀', time: '11:20', online: true, mine: true },
    { id: 'mariam', initial: 'M', grad: ['#b07bff', '#7a4fd6'], name: 'Mariam, 24', mode: REN, last: "J'ai adoré ta sélection de films 🎬", time: 'Hier', unread: 1 },
    { id: 'fatou', initial: 'F', grad: ['#ffb45c', '#d3744d'], name: 'Fatou, 31', mode: AMI, last: 'Photo envoyée', time: 'Hier', photo: true },
    { id: 'yann', initial: 'Y', grad: ['#8fd0ff', '#5a7fd6'], name: 'Yann, 27', mode: REN, last: 'Salut ! On partage le cercle business 👋', time: 'Lun', unread: 1 },
    { id: 'sophie', initial: 'S', grad: ['#9aa7d6', '#5b6aa8'], name: 'Sophie, 28', mode: AMI, last: 'Merci pour la recommandation 🙏', time: 'Dim', mine: true },
];

export default function Messages() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const [filter, setFilter] = useState(0);
    const [search, setSearch] = useState('');

    const q = search.trim().toLowerCase();
    const shown = CONVS.filter((cv) => {
        if (filter !== 0 && cv.mode.label !== CHIPS[filter]) return false;
        if (q && !cv.name.toLowerCase().includes(q)) return false;
        return true;
    });

    return (
        <Screen padded={false} edges={['top']}>
            <FadeInUp>
                <View style={s.header}>
                    <Text style={s.h1}>Messages</Text>
                    <Pressable style={s.iconBtn} onPress={() => router.push('/(app)/cercles')}><Ionicons name="create-outline" size={20} color={c.text} /></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}>
                <FadeInUp delay={40}>
                    <View style={s.searchBox}>
                        <Ionicons name="search" size={18} color={c.ink(0.42)} />
                        <TextInput value={search} onChangeText={setSearch} placeholder="Rechercher" placeholderTextColor={c.ink(0.4)} style={s.searchInput} />
                        {search.length > 0 && (
                            <Pressable onPress={() => setSearch('')} hitSlop={8}><Ionicons name="close-circle" size={18} color={c.ink(0.35)} /></Pressable>
                        )}
                    </View>
                </FadeInUp>

                <FadeInUp delay={70}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD }} contentContainerStyle={s.chipsRow}>
                        {CHIPS.map((label, i) => {
                            const on = i === filter;
                            return (
                                <Pressable key={label} onPress={() => setFilter(i)} style={[s.chip, on ? s.chipOn : s.chipOff]}>
                                    <Text style={[s.chipTxt, { color: on ? c.accentDeep : c.ink(0.6) }]}>{label}</Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </FadeInUp>

                <View style={{ marginTop: 8 }}>
                    {shown.map((cv, i) => (
                        <FadeInUp key={cv.id} delay={90 + i * 45}>
                            <Pressable style={s.conv} onPress={() => router.push(`/(app)/messages/${cv.id}`)}>
                                <View>
                                    <LinearGradient colors={cv.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.convAvatar}>
                                        <Text style={s.convLetter}>{cv.initial}</Text>
                                    </LinearGradient>
                                    {cv.online && <View style={s.convOnline} />}
                                </View>
                                <View style={s.convBody}>
                                    <View style={s.convTop}>
                                        <Text style={[s.convName, cv.unread ? { fontFamily: fonts.bodyBold } : null]} numberOfLines={1}>{cv.name}</Text>
                                        <Text style={[s.convTime, cv.unread ? { color: c.accent, fontFamily: fonts.bodySemi } : null]}>{cv.time}</Text>
                                    </View>
                                    <View style={s.convBottom}>
                                        <View style={s.convLastWrap}>
                                            {cv.mine && <Ionicons name="checkmark-done" size={15} color={c.accent} />}
                                            {cv.photo && <Ionicons name="image-outline" size={15} color={c.ink(0.5)} />}
                                            <Text style={[s.convLast, cv.unread ? { color: c.text, fontFamily: fonts.bodyMed } : null]} numberOfLines={1}>{cv.last}</Text>
                                        </View>
                                        <View style={s.convMeta}>
                                            <View style={[s.modeDot, { backgroundColor: cv.mode.dot }]} />
                                            <Text style={[s.modeTxt, { color: cv.mode.dot }]}>{cv.mode.label}</Text>
                                            {!!cv.unread && <View style={s.unread}><Text style={s.unreadTxt}>{cv.unread}</Text></View>}
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </FadeInUp>
                    ))}

                    {shown.length === 0 && (
                        <View style={s.empty}>
                            <Ionicons name="search-outline" size={34} color={c.ink(0.25)} />
                            <Text style={s.emptyTxt}>Aucune conversation pour « {search} »</Text>
                        </View>
                    )}
                </View>

                <View style={s.privacy}>
                    <Ionicons name="lock-closed" size={13} color={c.ink(0.4)} />
                    <Text style={s.privacyTxt}>Messages privés réservés à vos cercles partagés</Text>
                </View>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontFamily: fonts.displayBold, fontSize: 27, color: c.text, letterSpacing: -0.5 },
    iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },

    searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14, borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, color: c.text, padding: 0 },

    chipsRow: { gap: 8, paddingHorizontal: PAD, paddingTop: 14, paddingBottom: 2 },
    chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 99, borderWidth: 1 },
    chipOn: { backgroundColor: 'rgba(255,106,169,0.18)', borderColor: 'rgba(255,140,190,0.5)' },
    chipOff: { backgroundColor: c.field, borderColor: c.border },
    chipTxt: { fontFamily: fonts.bodySemi, fontSize: 13 },

    conv: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 0, paddingHorizontal: 2 },
    convAvatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
    convLetter: { fontFamily: fonts.display, fontSize: 19, color: '#fff' },
    convOnline: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#43e08a', borderWidth: 2.5, borderColor: c.bg[1] },
    convBody: { flex: 1, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: c.border },
    convTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    convName: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 15.5, color: c.text },
    convTime: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.45) },
    convBottom: { marginTop: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    convLastWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
    convLast: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, color: c.ink(0.5) },
    convMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    modeDot: { width: 4, height: 4, borderRadius: 2 },
    modeTxt: { fontFamily: fonts.bodySemi, fontSize: 11 },
    unread: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: '#ff4d97', alignItems: 'center', justifyContent: 'center' },
    unreadTxt: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: '#fff' },

    empty: { paddingVertical: 48, alignItems: 'center', gap: 10 },
    emptyTxt: { fontFamily: fonts.body, fontSize: 14, color: c.ink(0.45), textAlign: 'center' },

    privacy: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12, borderRadius: 14, backgroundColor: c.field },
    privacyTxt: { fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.42) },
});
