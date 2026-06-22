// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import GradientButton from '../../src/components/GradientButton';
import AgeRange from '../../src/components/AgeRange';
import { ScreenHeader, Pill } from '../../src/components/ui';
import { FadeInUp } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { useColors, type Palette } from '../../src/theme/theme';
import { useStore, DEFAULT_PREFS } from '../../src/store/app';

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo'];
const STEPS = [0, 1, 2, 3];

export default function Register() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const setPrefs = useStore((st) => st.setPrefs);
    const [step, setStep] = useState(0);
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [naissance, setNaissance] = useState('');
    const [genre, setGenre] = useState('');
    const [ville, setVille] = useState('');
    const [interets, setInterets] = useState<string[]>([]);
    // Préférences : qui chercher + tranche d'âge du partenaire (l'écart avec soi).
    const [lookingFor, setLookingFor] = useState<'femmes' | 'hommes' | 'tout'>(DEFAULT_PREFS.lookingFor);
    const [mode, setMode] = useState<'rencontre' | 'amitie' | 'les_deux'>(DEFAULT_PREFS.mode);
    const [ageMin, setAgeMin] = useState(DEFAULT_PREFS.ageMin);
    const [ageMax, setAgeMax] = useState(DEFAULT_PREFS.ageMax);
    const [cgu, setCgu] = useState(false);
    const [err, setErr] = useState('');

    const calcAge = (d: string) => {
        const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!m) return null;
        const birth = new Date(+m[3], +m[2] - 1, +m[1]);
        const diff = Date.now() - birth.getTime();
        return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
    };
    const monAge = calcAge(naissance);

    const next = () => {
        setErr('');
        if (step === 0) {
            if (!prenom.trim()) return setErr('Indique ton prénom.');
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Email invalide.');
            if (monAge === null) return setErr('Date au format JJ/MM/AAAA.');
            if (monAge < 18) return setErr('KADY est réservé aux 18 ans et plus.');
        }
        if (step === 1 && !genre) return setErr('Choisis ton genre.');
        if (step === 3 && !cgu) return setErr('Tu dois accepter les conditions.');
        if (step < 3) return setStep(step + 1);
        setPrefs({ lookingFor, ageMin, ageMax, mode });
        router.replace('/verification');
    };

    const toggle = (i: string) => setInterets((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

    return (
        <Screen>
            <ScreenHeader title="Inscription" back />
            <View style={s.steps}>
                {STEPS.map((i) => <View key={i} style={[s.stepBar, i <= step && s.stepBarOn]} />)}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
                {step === 0 && (
                    <FadeInUp style={{ gap: spacing.md }}>
                        <Text style={s.title}>Qui es-tu ?</Text>
                        <Field label="Prénom"><TextInput style={s.input} value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" placeholderTextColor={c.ink(0.42)} /></Field>
                        <Field label="Email"><TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="toi@email.com" placeholderTextColor={c.ink(0.42)} autoCapitalize="none" keyboardType="email-address" /></Field>
                        <Field label="Date de naissance">
                            <TextInput style={s.input} value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" placeholderTextColor={c.ink(0.42)} keyboardType="numbers-and-punctuation" />
                            <Text style={s.hint}>Réservé aux 18 ans et plus — vérifié à l'inscription.</Text>
                        </Field>
                    </FadeInUp>
                )}

                {step === 1 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <Text style={s.title}>Quelques détails</Text>
                        <Field label="Genre">
                            <View style={s.rowWrap}>
                                <Pill label="Femme" active={genre === 'femme'} onPress={() => setGenre('femme')} />
                                <Pill label="Homme" active={genre === 'homme'} onPress={() => setGenre('homme')} />
                            </View>
                        </Field>
                        <Field label="Ville"><TextInput style={s.input} value={ville} onChangeText={setVille} placeholder="Abidjan, Bouaké…" placeholderTextColor={c.ink(0.42)} /></Field>
                        <Field label="Centres d'intérêt">
                            <View style={s.rowWrap}>{INTERETS.map((i) => <Pill key={i} label={i} active={interets.includes(i)} onPress={() => toggle(i)} />)}</View>
                        </Field>
                    </FadeInUp>
                )}

                {step === 2 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <Text style={s.title}>Tu recherches…</Text>
                        <Text style={s.body}>On s'en sert pour te proposer des Cercles et des profils qui te correspondent.</Text>
                        <Field label="Avec qui veux-tu te connecter ?">
                            <View style={s.rowWrap}>
                                <Pill label="Des femmes" active={lookingFor === 'femmes'} onPress={() => setLookingFor('femmes')} />
                                <Pill label="Des hommes" active={lookingFor === 'hommes'} onPress={() => setLookingFor('hommes')} />
                                <Pill label="Tout le monde" active={lookingFor === 'tout'} onPress={() => setLookingFor('tout')} />
                            </View>
                        </Field>
                        <Field label="Type de connexion">
                            <View style={s.rowWrap}>
                                <Pill label="Rencontre" active={mode === 'rencontre'} onPress={() => setMode('rencontre')} />
                                <Pill label="Amitié" active={mode === 'amitie'} onPress={() => setMode('amitie')} />
                                <Pill label="Les deux" active={mode === 'les_deux'} onPress={() => setMode('les_deux')} />
                            </View>
                        </Field>
                        <Field label="Tranche d'âge de ton/ta partenaire">
                            <AgeRange min={ageMin} max={ageMax} onChange={(lo, hi) => { setAgeMin(lo); setAgeMax(hi); }} monAge={monAge ?? undefined} />
                        </Field>
                    </FadeInUp>
                )}

                {step === 3 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <Text style={s.title}>Presque fini</Text>
                        <Text style={s.body}>En rejoignant KADY, tu t'engages à respecter les autres membres. Pas de harcèlement, pas de coordonnées partagées avant la confiance établie.</Text>
                        <Pressable style={s.check} onPress={() => setCgu(!cgu)}>
                            <View style={[s.box, cgu && s.boxOn]}>{cgu && <Ionicons name="checkmark" size={16} color={c.white} />}</View>
                            <Text style={s.checkTxt}>J'accepte les conditions d'utilisation et la politique de confidentialité.</Text>
                        </Pressable>
                    </FadeInUp>
                )}

                {!!err && <Text style={s.err}>{err}</Text>}
            </ScrollView>

            <View style={{ paddingBottom: spacing.md }}>
                <GradientButton label={step < 3 ? 'Continuer' : 'Créer mon compte'} onPress={next} />
            </View>
        </Screen>
    );
}

// Défini au niveau module : une identité de composant stable évite que le
// TextInput enfant ne soit démonté/remonté à chaque frappe (clavier qui se ferme).
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    const s = makeStyles(useColors());
    return <View style={{ gap: spacing.sm }}><Text style={s.label}>{label}</Text>{children}</View>;
}

const makeStyles = (c: Palette) => StyleSheet.create({
    steps: { flexDirection: 'row', gap: 6, marginBottom: spacing.lg },
    stepBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: c.field },
    stepBarOn: { backgroundColor: c.accent },
    title: { fontFamily: fonts.display, fontSize: 26, color: c.text, marginBottom: spacing.sm },
    body: { fontFamily: fonts.body, fontSize: 15, color: c.ink(0.6), lineHeight: 22 },
    label: { fontFamily: fonts.bodyMed, fontSize: 14, color: c.text },
    input: {
        backgroundColor: c.field,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: radius.md,
        color: c.text,
        fontFamily: fonts.body,
        fontSize: 16,
        padding: 15,
    },
    hint: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.42), marginTop: 4 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    box: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    boxOn: { backgroundColor: c.accent, borderColor: c.accent },
    checkTxt: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: c.ink(0.6), lineHeight: 20 },
    err: { fontFamily: fonts.bodyMed, fontSize: 14, color: colors.danger, marginTop: spacing.md },
});
