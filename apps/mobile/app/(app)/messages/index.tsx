// app/(app)/messages/index.tsx — Messages : recherche, filtres, liste de
// conversations (réservées aux cercles partagés). (proto L216-261)
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { colorForName } from '../../../src/theme/colors';
import { useColors, type Palette } from '../../../src/theme/theme';
import { dm as dmApi, type ConversationApi } from '../../../src/api';
import { apiError } from '../../../src/api/client';
import { useToast } from '../../../src/store/app';

const PAD = 22;
const NIVEAUX = ['L\'Inconnu', 'La Connaissance', 'L\'Ami(e)', 'La Confiance', 'L\'Intimité'];

type Conv = { id: string; initial: string; grad: readonly [string, string]; name: string; niveau: number; relationId: string; autreId: string };

function versConv(cv: ConversationApi): Conv {
    const nom = cv.prenom ?? 'Inconnu';
    const tint = colorForName(nom);
    return { id: cv.id, initial: nom.charAt(0).toUpperCase(), grad: [tint, tint], name: nom, niveau: cv.niveau, relationId: cv.relation_id, autreId: cv.autre_id };
}

export default function Messages() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const [search, setSearch] = useState('');
    const [data, setData] = useState<Conv[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const charger = useCallback(async () => {
        try {
            setData((await dmApi.conversations()).map(versConv));
        } catch (e) {
            useToast.getState().show(apiError(e));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);
    useFocusEffect(useCallback(() => { charger(); }, [charger]));

    const q = search.trim().toLowerCase();
    const shown = data.filter((cv) => !q || cv.name.toLowerCase().includes(q));

    return (
        <Screen padded={false} edges={['top']}>
            <FadeInUp>
                <View style={s.header}>
                    <Text style={s.h1}>Messages</Text>
                    <Pressable style={s.iconBtn} onPress={() => router.push('/(app)/cercles')}><Ionicons name="create-outline" size={20} color={c.text} /></Pressable>
                </View>
            </FadeInUp>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 140 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); charger(); }} tintColor={c.accent} />}>
                <FadeInUp delay={40}>
                    <View style={s.searchBox}>
                        <Ionicons name="search" size={18} color={c.ink(0.42)} />
                        <TextInput value={search} onChangeText={setSearch} placeholder="Rechercher" placeholderTextColor={c.ink(0.4)} style={s.searchInput} />
                        {search.length > 0 && (
                            <Pressable onPress={() => setSearch('')} hitSlop={8}><Ionicons name="close-circle" size={18} color={c.ink(0.35)} /></Pressable>
                        )}
                    </View>
                </FadeInUp>

                <View style={{ marginTop: 14 }}>
                    {shown.map((cv, i) => (
                        <FadeInUp key={cv.id} delay={90 + i * 45}>
                            <Pressable style={s.conv} onPress={() => router.push({ pathname: '/(app)/messages/[id]', params: { id: cv.id, name: cv.name, niveau: String(cv.niveau), relationId: cv.relationId, autreId: cv.autreId } })}>
                                <LinearGradient colors={cv.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.convAvatar}>
                                    <Text style={s.convLetter}>{cv.initial}</Text>
                                </LinearGradient>
                                <View style={s.convBody}>
                                    <View style={s.convTop}>
                                        <Text style={s.convName} numberOfLines={1}>{cv.name}</Text>
                                    </View>
                                    <View style={s.convBottom}>
                                        <View style={s.convLastWrap}>
                                            <Ionicons name="heart" size={13} color={c.accent} />
                                            <Text style={s.convLast} numberOfLines={1}>{NIVEAUX[Math.min(cv.niveau, 5) - 1]}</Text>
                                        </View>
                                        <View style={s.convMeta}>
                                            <Text style={[s.modeTxt, { color: c.accent }]}>Niveau {cv.niveau}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </FadeInUp>
                    ))}

                    {loading && <View style={s.empty}><ActivityIndicator color={c.accent} /></View>}

                    {!loading && shown.length === 0 && (
                        <View style={s.empty}>
                            <Ionicons name="chatbubbles-outline" size={34} color={c.ink(0.25)} />
                            <Text style={s.emptyTxt}>{q ? `Aucune conversation pour « ${search} »` : 'Pas encore de conversation. Fais grandir un lien dans un Cercle pour débloquer le privé.'}</Text>
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
