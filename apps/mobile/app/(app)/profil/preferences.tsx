// app/(app)/profil/preferences.tsx — Mode de connexion & préférences d'âge.
// Mêmes réglages qu'à l'inscription, modifiables à tout moment (persistés).
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, SectionTitle, Pill } from '../../../src/components/ui';
import RangeSlider from '../../../src/components/RangeSlider';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { useColors, type Palette } from '../../../src/theme/theme';
import { useStore } from '../../../src/store/app';

export default function Preferences() {
    const c = useColors();
    const s = makeStyles(c);
    const prefs = useStore((st) => st.prefs);
    const setPrefs = useStore((st) => st.setPrefs);

    return (
        <Screen>
            <ScreenHeader title="Mode de connexion" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.lg }}>
                <FadeInUp>
                    <View style={s.intro}>
                        <Ionicons name="sparkles" size={16} color={c.accent} />
                        <Text style={s.introTxt}>Ces préférences orientent les Cercles et profils qu'on te propose. Tu peux les changer quand tu veux.</Text>
                    </View>
                </FadeInUp>

                <FadeInUp delay={60}>
                    <SectionTitle>Avec qui te connecter</SectionTitle>
                    <View style={s.row}>
                        <Pill label="Des femmes" active={prefs.lookingFor === 'femmes'} onPress={() => setPrefs({ lookingFor: 'femmes' })} />
                        <Pill label="Des hommes" active={prefs.lookingFor === 'hommes'} onPress={() => setPrefs({ lookingFor: 'hommes' })} />
                        <Pill label="Tout le monde" active={prefs.lookingFor === 'tout'} onPress={() => setPrefs({ lookingFor: 'tout' })} />
                    </View>
                </FadeInUp>

                <FadeInUp delay={120}>
                    <SectionTitle>Type de connexion</SectionTitle>
                    <View style={s.row}>
                        <Pill label="Rencontre" active={prefs.mode === 'rencontre'} onPress={() => setPrefs({ mode: 'rencontre' })} />
                        <Pill label="Amitié" active={prefs.mode === 'amitie'} onPress={() => setPrefs({ mode: 'amitie' })} />
                        <Pill label="Les deux" active={prefs.mode === 'les_deux'} onPress={() => setPrefs({ mode: 'les_deux' })} />
                    </View>
                </FadeInUp>

                <FadeInUp delay={180}>
                    <SectionTitle>Tranche d'âge recherchée</SectionTitle>
                    <RangeSlider min={prefs.ageMin} max={prefs.ageMax} onChange={(lo, hi) => setPrefs({ ageMin: lo, ageMax: hi })} />
                </FadeInUp>

                <FadeInUp delay={240}>
                    <View style={s.note}>
                        <Ionicons name="lock-closed" size={13} color={c.ink(0.45)} />
                        <Text style={s.noteTxt}>Ton âge reste visible, mais ta tranche de recherche ne l'est pas.</Text>
                    </View>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    intro: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,106,169,0.08)', borderWidth: 1, borderColor: 'rgba(255,140,190,0.25)' },
    introTxt: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: c.ink(0.65) },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: spacing.sm },
    note: { flexDirection: 'row', alignItems: 'center', gap: 7, justifyContent: 'center' },
    noteTxt: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.45) },
});
