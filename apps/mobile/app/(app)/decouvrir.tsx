// app/(app)/decouvrir.tsx — Découvrir : recherche, filtres avancés, chips,
// cartes à couverture (CoverCard) + état vide. (proto L142-214)
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { Pill } from '../../src/components/ui';
import CoverCard from '../../src/components/CoverCard';
import AdvancedFilters, { type AdvValues } from '../../src/components/AdvancedFilters';
import { FadeInUp, animateLayout } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { useColors, type Palette } from '../../src/theme/theme';
import { cerclesDecouvrir } from '../../src/data/mock';
import { useStore, useToast } from '../../src/store/app';

const PAD = spacing.lg;
const CHIPS = ['Tous', 'Populaires', 'Proches', 'Actifs', 'Nouveaux'];
const DEFAULT_ADV: AdvValues = { places: 'all', grade: 'all', sort: 'pop' };

export default function Decouvrir() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const joined = useStore((st) => st.joined);
    const join = useStore((st) => st.join);

    const [search, setSearch] = useState('');
    const [chip, setChip] = useState('Tous');
    const [advOpen, setAdvOpen] = useState(false);
    const [adv, setAdv] = useState<AdvValues>(DEFAULT_ADV);

    const advCount = (adv.places !== 'all' ? 1 : 0) + (adv.grade !== 'all' ? 1 : 0) + (adv.sort !== 'pop' ? 1 : 0);

    const cards = useMemo(() => {
        let list = cerclesDecouvrir.filter((cc) => {
            const q = search.trim().toLowerCase();
            if (q && !(cc.nom.toLowerCase().includes(q) || cc.theme.toLowerCase().includes(q))) return false;
            const places = cc.max - cc.membres;
            if (adv.places === 'few' && places > 3) return false;
            if (adv.places === 'many' && places < 4) return false;
            if (adv.grade !== 'all' && cc.grade !== adv.grade) return false;
            return true;
        });
        if (chip === 'Populaires' || adv.sort === 'pop') list = [...list].sort((a, b) => b.membres - a.membres);
        if (chip === 'Nouveaux') list = [...list].sort((a, b) => b.expireDans - a.expireDans);
        return list;
    }, [search, chip, adv]);

    const resetAdv = () => { animateLayout(); setAdv(DEFAULT_ADV); };

    return (
        <Screen edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 130 }}>
                <FadeInUp>
                    <Text style={s.h1}>Découvrir</Text>
                    <Text style={s.intro}>Trouve un Cercle qui te ressemble. Lis la salle d'accueil avant de rejoindre.</Text>
                </FadeInUp>

                <FadeInUp delay={60}>
                    <View style={s.searchRow}>
                        <View style={s.searchBox}>
                            <Ionicons name="search" size={18} color={c.ink(0.42)} />
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Rechercher un cercle, un thème…"
                                placeholderTextColor={c.ink(0.4)}
                                style={s.searchInput}
                            />
                            {search.length > 0 && (
                                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                                    <Ionicons name="close-circle" size={18} color={c.ink(0.35)} />
                                </Pressable>
                            )}
                        </View>
                        <Pressable
                            onPress={() => { animateLayout(); setAdvOpen((o) => !o); }}
                            style={[s.advBtn, { borderColor: advOpen || advCount ? c.accent : c.border, backgroundColor: advOpen || advCount ? 'rgba(255,106,169,0.1)' : c.field }]}
                        >
                            <Ionicons name="options-outline" size={21} color={advOpen || advCount ? c.accent : c.text} />
                            {advCount > 0 && (
                                <View style={s.advBadge}><Text style={s.advBadgeTxt}>{advCount}</Text></View>
                            )}
                        </Pressable>
                    </View>
                </FadeInUp>

                {advOpen && (
                    <AdvancedFilters
                        values={adv}
                        onChange={(v) => { animateLayout(); setAdv((p) => ({ ...p, ...v })); }}
                        count={cards.length}
                        onApply={() => { animateLayout(); setAdvOpen(false); }}
                        onReset={resetAdv}
                    />
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD }} contentContainerStyle={s.chips}>
                    {CHIPS.map((f) => <Pill key={f} label={f} active={chip === f} onPress={() => setChip(f)} />)}
                </ScrollView>

                <View style={{ gap: 20 }}>
                    {cards.map((cc, i) => (
                        <FadeInUp key={cc.id} delay={80 + i * 60}>
                            <CoverCard
                                nom={cc.nom}
                                theme={cc.theme}
                                membres={cc.membres}
                                max={cc.max}
                                grade={cc.grade}
                                expireDans={cc.expireDans}
                                apercu={cc.apercu}
                                joined={joined.includes(cc.id)}
                                onOpen={() => router.push(`/(app)/cercles/${cc.id}`)}
                                onJoin={() => { join(cc.id); useToast.getState().show(`Tu as rejoint ${cc.nom}`); }}
                            />
                        </FadeInUp>
                    ))}

                    {cards.length === 0 && (
                        <View style={s.empty}>
                            <View style={s.emptyIcon}><Ionicons name="compass-outline" size={30} color={c.ink(0.3)} /></View>
                            <Text style={s.emptyTitle}>Aucun cercle trouvé</Text>
                            <Text style={s.emptySub}>Essaie un autre thème ou ajuste tes filtres.</Text>
                            <Pressable onPress={() => { setSearch(''); setChip('Tous'); resetAdv(); }} style={s.emptyBtn}>
                                <Text style={s.emptyBtnTxt}>Réinitialiser les filtres</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    h1: { fontFamily: fonts.display, fontSize: 30, color: c.text },
    intro: { fontFamily: fonts.body, fontSize: 14, color: c.ink(0.6), marginTop: 4, lineHeight: 20 },

    searchRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14, borderRadius: 14, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    searchInput: { flex: 1, minWidth: 0, padding: 0, fontFamily: fonts.body, fontSize: 14, color: c.text },
    advBtn: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    advBadge: { position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: '#ff4d97', borderWidth: 2, borderColor: c.bg[1], alignItems: 'center', justifyContent: 'center' },
    advBadgeTxt: { fontFamily: fonts.bodyBold, fontSize: 10, color: '#fff' },

    chips: { gap: 9, paddingHorizontal: PAD, marginTop: 16, marginBottom: 18 },

    empty: { paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center', gap: 10 },
    emptyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: c.field, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontFamily: fonts.display, fontSize: 16, color: c.text },
    emptySub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: c.ink(0.5), textAlign: 'center', maxWidth: 220 },
    emptyBtn: { marginTop: 4, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 99, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    emptyBtnTxt: { fontFamily: fonts.bodySemi, fontSize: 13, color: c.accent },
});
