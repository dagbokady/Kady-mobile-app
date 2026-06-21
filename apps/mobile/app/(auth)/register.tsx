// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import GradientButton from '../../src/components/GradientButton';
import { ScreenHeader, Pill } from '../../src/components/ui';
import { FadeInUp } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo'];

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [naissance, setNaissance] = useState('');
    const [genre, setGenre] = useState('');
    const [ville, setVille] = useState('');
    const [interets, setInterets] = useState<string[]>([]);
    const [cgu, setCgu] = useState(false);
    const [err, setErr] = useState('');

    const calcAge = (d: string) => {
        const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!m) return null;
        const birth = new Date(+m[3], +m[2] - 1, +m[1]);
        const diff = Date.now() - birth.getTime();
        return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
    };

    const next = () => {
        setErr('');
        if (step === 0) {
            if (!prenom.trim()) return setErr('Indique ton prénom.');
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Email invalide.');
            const age = calcAge(naissance);
            if (age === null) return setErr('Date au format JJ/MM/AAAA.');
            if (age < 18) return setErr('KADY est réservé aux 18 ans et plus.');
        }
        if (step === 1 && !genre) return setErr('Choisis ton genre.');
        if (step === 2 && !cgu) return setErr('Tu dois accepter les conditions.');
        if (step < 2) setStep(step + 1);
        else router.replace('/verification');
    };

    const toggle = (i: string) => setInterets((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

    return (
        <Screen>
            <ScreenHeader title="Inscription" back />
            <View style={s.steps}>
                {[0, 1, 2].map((i) => <View key={i} style={[s.stepBar, i <= step && s.stepBarOn]} />)}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
                {step === 0 && (
                    <FadeInUp style={{ gap: spacing.md }}>
                        <Text style={s.title}>Qui es-tu ?</Text>
                        <Field label="Prénom"><TextInput style={s.input} value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" placeholderTextColor={colors.dim} /></Field>
                        <Field label="Email"><TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="toi@email.com" placeholderTextColor={colors.dim} autoCapitalize="none" keyboardType="email-address" /></Field>
                        <Field label="Date de naissance">
                            <TextInput style={s.input} value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" placeholderTextColor={colors.dim} keyboardType="numbers-and-punctuation" />
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
                        <Field label="Ville"><TextInput style={s.input} value={ville} onChangeText={setVille} placeholder="Abidjan, Bouaké…" placeholderTextColor={colors.dim} /></Field>
                        <Field label="Centres d'intérêt">
                            <View style={s.rowWrap}>{INTERETS.map((i) => <Pill key={i} label={i} active={interets.includes(i)} onPress={() => toggle(i)} />)}</View>
                        </Field>
                    </FadeInUp>
                )}

                {step === 2 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <Text style={s.title}>Presque fini</Text>
                        <Text style={s.body}>En rejoignant KADY, tu t'engages à respecter les autres membres. Pas de harcèlement, pas de coordonnées partagées avant la confiance établie.</Text>
                        <Pressable style={s.check} onPress={() => setCgu(!cgu)}>
                            <View style={[s.box, cgu && s.boxOn]}>{cgu && <Ionicons name="checkmark" size={16} color={colors.white} />}</View>
                            <Text style={s.checkTxt}>J'accepte les conditions d'utilisation et la politique de confidentialité.</Text>
                        </Pressable>
                    </FadeInUp>
                )}

                {!!err && <Text style={s.err}>{err}</Text>}
            </ScrollView>

            <View style={{ paddingBottom: spacing.md }}>
                <GradientButton label={step < 2 ? 'Continuer' : 'Créer mon compte'} onPress={next} />
            </View>
        </Screen>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <View style={{ gap: spacing.sm }}><Text style={s.label}>{label}</Text>{children}</View>;
}

const s = StyleSheet.create({
    steps: { flexDirection: 'row', gap: 6, marginBottom: spacing.lg },
    stepBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.cardLight },
    stepBarOn: { backgroundColor: colors.rose },
    title: { fontFamily: fonts.display, fontSize: 26, color: colors.cream, marginBottom: spacing.sm },
    body: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, lineHeight: 22 },
    label: { fontFamily: fonts.bodyMed, fontSize: 14, color: colors.cream },
    input: {
        backgroundColor: colors.cardLight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        color: colors.cream,
        fontFamily: fonts.body,
        fontSize: 16,
        padding: 15,
    },
    hint: { fontFamily: fonts.body, fontSize: 12, color: colors.dim, marginTop: 4 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    box: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    boxOn: { backgroundColor: colors.rose, borderColor: colors.rose },
    checkTxt: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.muted, lineHeight: 20 },
    err: { fontFamily: fonts.bodyMed, fontSize: 14, color: colors.danger, marginTop: spacing.md },
});
