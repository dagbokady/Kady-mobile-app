// app/(app)/profil/modifier.tsx — Modifier le profil.
// Édite prénom, âge, ville, quartier, bio et centres d'intérêt ; enregistre dans
// le store (persisté) et revient au profil, qui se met à jour automatiquement.
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../../src/components/Screen';
import GradientButton from '../../../src/components/GradientButton';
import { ScreenHeader, Pill } from '../../../src/components/ui';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { useColors, type Palette } from '../../../src/theme/theme';
import { useStore, AGE_FLOOR } from '../../../src/store/app';
import { INTERESTS_CATALOG } from '../../../src/data/interests';

export default function Modifier() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const profile = useStore((st) => st.profile);
    const setProfile = useStore((st) => st.setProfile);

    const [prenom, setPrenom] = useState(profile.prenom);
    const [age, setAge] = useState(String(profile.age));
    const [ville, setVille] = useState(profile.ville);
    const [quartier, setQuartier] = useState(profile.quartier);
    const [bio, setBio] = useState(profile.bio);
    const [interets, setInterets] = useState<string[]>(profile.interets);
    const [err, setErr] = useState('');

    const toggle = (label: string) =>
        setInterets((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));

    const save = () => {
        setErr('');
        if (!prenom.trim()) return setErr('Indique ton prénom.');
        const n = parseInt(age, 10);
        if (isNaN(n) || n < AGE_FLOOR || n > 99) return setErr(`Âge invalide (min. ${AGE_FLOOR} ans).`);
        setProfile({ prenom: prenom.trim(), age: n, ville: ville.trim(), quartier: quartier.trim(), bio: bio.trim(), interets });
        router.back();
    };

    return (
        <Screen>
            <ScreenHeader title="Modifier le profil" back />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
                <FadeInUp style={{ gap: spacing.md }}>
                    <Field label="Prénom" c={c}>
                        <TextInput style={s.input} value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" placeholderTextColor={c.ink(0.42)} />
                    </Field>
                    <Field label="Âge" c={c}>
                        <TextInput style={s.input} value={age} onChangeText={setAge} placeholder="Ton âge" placeholderTextColor={c.ink(0.42)} keyboardType="number-pad" maxLength={2} />
                    </Field>
                    <View style={s.rowFields}>
                        <Field label="Ville" c={c} flex>
                            <TextInput style={s.input} value={ville} onChangeText={setVille} placeholder="Abidjan" placeholderTextColor={c.ink(0.42)} />
                        </Field>
                        <Field label="Quartier" c={c} flex>
                            <TextInput style={s.input} value={quartier} onChangeText={setQuartier} placeholder="Cocody" placeholderTextColor={c.ink(0.42)} />
                        </Field>
                    </View>
                    <Field label="Bio" c={c}>
                        <TextInput style={[s.input, s.bio]} value={bio} onChangeText={setBio} placeholder="Parle un peu de toi…" placeholderTextColor={c.ink(0.42)} multiline maxLength={240} />
                        <Text style={s.counter}>{bio.length}/240</Text>
                    </Field>
                </FadeInUp>

                <FadeInUp delay={80}>
                    <Text style={s.label}>Centres d'intérêt</Text>
                    <View style={s.chips}>
                        {INTERESTS_CATALOG.map((it) => (
                            <Pill key={it.label} label={`${it.emoji} ${it.label}`} active={interets.includes(it.label)} onPress={() => toggle(it.label)} />
                        ))}
                    </View>
                </FadeInUp>

                {!!err && (
                    <View style={s.errRow}>
                        <Ionicons name="alert-circle" size={15} color="#ef5350" />
                        <Text style={s.err}>{err}</Text>
                    </View>
                )}

                <FadeInUp delay={140}>
                    <GradientButton label="Enregistrer" onPress={save} />
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

// Identité stable (module-level) → le TextInput ne se remonte pas à chaque frappe.
function Field({ label, children, c, flex }: { label: string; children: React.ReactNode; c: Palette; flex?: boolean }) {
    const s = makeStyles(c);
    return <View style={[{ gap: spacing.sm }, flex && { flex: 1 }]}><Text style={s.label}>{label}</Text>{children}</View>;
}

const makeStyles = (c: Palette) => StyleSheet.create({
    label: { fontFamily: fonts.bodyMed, fontSize: 14, color: c.text },
    rowFields: { flexDirection: 'row', gap: spacing.md },
    input: {
        backgroundColor: c.field,
        borderWidth: 1, borderColor: c.border,
        borderRadius: radius.md,
        color: c.text, fontFamily: fonts.body, fontSize: 16,
        padding: 15,
    },
    bio: { minHeight: 110, textAlignVertical: 'top' },
    counter: { alignSelf: 'flex-end', fontFamily: fonts.body, fontSize: 11, color: c.ink(0.4) },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: spacing.sm },
    errRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    err: { fontFamily: fonts.bodyMed, fontSize: 14, color: '#ef5350' },
});
