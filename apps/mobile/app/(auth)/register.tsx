// app/(auth)/register.tsx — 6 étapes : identité, détails, préférences, selfie, photos, CGU
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import GradientButton from '../../src/components/GradientButton';
import { Pill } from '../../src/components/ui';
import { FadeInUp } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { spacing, radius } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { useColors, type Palette } from '../../src/theme/theme';
import { useScale } from '../../src/theme/responsive';
import { useStore, DEFAULT_PREFS } from '../../src/store/app';

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo'];
const TOTAL_STEPS = 6;

export default function Register() {
    const router = useRouter();
    const c = useColors();
    const sc = useScale();
    const s = makeStyles(c, sc);
    const setPrefs = useStore((st) => st.setPrefs);

    const [step, setStep] = useState(0);

    // Step 0 — identité
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [mdp2, setMdp2] = useState('');
    const [naissance, setNaissance] = useState('');

    // Step 1 — détails
    const [genre, setGenre] = useState('');
    const [ville, setVille] = useState('');
    const [interets, setInterets] = useState<string[]>([]);

    // Step 2 — préférences
    const [mode, setMode] = useState<'rencontre' | 'amitie' | 'les_deux'>(DEFAULT_PREFS.mode);
    const [gap, setGap] = useState(5); // ± années d'écart

    // Step 3 — selfie
    const [selfie, setSelfie] = useState(false);

    // Step 4 — photos (5 slots, 2 obligatoires)
    const [photos, setPhotos] = useState([false, false, false, false, false]);

    // Step 5 — CGU
    const [cgu, setCgu] = useState(false);

    const [err, setErr] = useState('');

    const calcAge = (d: string) => {
        const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!m) return null;
        const birth = new Date(+m[3], +m[2] - 1, +m[1]);
        return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
    };
    const monAge = calcAge(naissance);

    const prev = () => { setErr(''); if (step > 0) setStep(step - 1); else router.back(); };

    const next = () => {
        setErr('');
        if (step === 0) {
            if (!prenom.trim()) return setErr('Indique ton prénom.');
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Email invalide.');
            if (!mdp || mdp.length < 6) return setErr('Mot de passe : au moins 6 caractères.');
            if (mdp !== mdp2) return setErr('Les mots de passe ne correspondent pas.');
            if (monAge === null) return setErr('Date au format JJ/MM/AAAA.');
            if (monAge < 18) return setErr('KADY est réservé aux 18 ans et plus.');
        }
        if (step === 1 && !genre) return setErr('Choisis ton genre.');
        if (step === 3 && !selfie) return setErr('Prends un selfie pour continuer.');
        if (step === 5 && !cgu) return setErr('Tu dois accepter les conditions.');
        if (step < TOTAL_STEPS - 1) return setStep(step + 1);
        setPrefs({ lookingFor: 'tout', ageMin: (monAge ?? 25) - gap, ageMax: (monAge ?? 25) + gap, mode });
        router.replace('/onboarding' as any);
    };

    const togglePhoto = (i: number) => setPhotos((p) => { const n = [...p]; n[i] = !n[i]; return n; });

    const photoCount = photos.filter(Boolean).length;

    const STEP_LABELS = ['Continuer', 'Continuer', 'Continuer', selfie ? 'Continuer' : 'Prendre le selfie', 'Continuer', 'Créer mon compte'];
    const btnLabel = STEP_LABELS[step];

    const gapPct = (gap / 15) * 100;

    return (
        <Screen padded={false}>
            <View style={s.topBar}>
                <Pressable style={s.backBtn} onPress={prev}>
                    <Ionicons name="chevron-back" size={20} color={c.text} />
                </Pressable>
                <Text style={s.topTitle}>Inscription</Text>
            </View>

            <View style={s.stepsRow}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <View key={i} style={[s.stepBar, i <= step && s.stepBarOn]} />
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
                {step === 0 && (
                    <FadeInUp style={{ gap: spacing.md }}>
                        <Text style={s.title}>Qui es-tu ?</Text>
                        <Field label="Prénom">
                            <TextInput style={s.input} value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" placeholderTextColor={c.ink(0.42)} />
                        </Field>
                        <Field label="Email">
                            <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="toi@email.com" placeholderTextColor={c.ink(0.42)} autoCapitalize="none" keyboardType="email-address" />
                        </Field>
                        <Field label="Mot de passe">
                            <TextInput style={s.input} value={mdp} onChangeText={setMdp} placeholder="Au moins 6 caractères" placeholderTextColor={c.ink(0.42)} secureTextEntry />
                        </Field>
                        <Field label="Confirme le mot de passe">
                            <TextInput style={s.input} value={mdp2} onChangeText={setMdp2} placeholder="Retape ton mot de passe" placeholderTextColor={c.ink(0.42)} secureTextEntry />
                        </Field>
                        <Field label="Date de naissance">
                            <TextInput style={s.input} value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" placeholderTextColor={c.ink(0.42)} keyboardType="numbers-and-punctuation" />
                            <Text style={s.hint}>Réservé aux 18 ans et plus — vérifié à l'inscription.</Text>
                        </Field>

                        <View style={s.dividerRow}>
                            <View style={s.dividerLine} /><Text style={s.dividerTxt}>ou</Text><View style={s.dividerLine} />
                        </View>
                        <Pressable style={s.socialBtn} onPress={() => { setPrenom(prenom || 'Didier'); setEmail(email || 'didier@gmail.com'); setStep(1); }}>
                            <Ionicons name="logo-google" size={19} color="#ea4335" />
                            <Text style={[s.socialTxt, { color: c.text }]}>S'inscrire avec Google</Text>
                        </Pressable>
                        <Pressable style={[s.socialBtn, s.socialApple]} onPress={() => setStep(1)}>
                            <Ionicons name="logo-apple" size={20} color="#fff" />
                            <Text style={[s.socialTxt, { color: '#fff' }]}>S'inscrire avec Apple</Text>
                        </Pressable>
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
                        <Field label="Ville">
                            <TextInput style={s.input} value={ville} onChangeText={setVille} placeholder="Abidjan, Bouaké…" placeholderTextColor={c.ink(0.42)} />
                        </Field>
                        <Field label="Centres d'intérêt">
                            <View style={s.rowWrap}>{INTERETS.map((i) => <Pill key={i} label={i} active={interets.includes(i)} onPress={() => setInterets((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i])} />)}</View>
                        </Field>
                    </FadeInUp>
                )}

                {step === 2 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <View>
                            <Text style={s.title}>Tes préférences</Text>
                            <Text style={s.body}>On s'en sert pour te proposer des Cercles et des profils qui te correspondent.</Text>
                        </View>
                        <View style={s.warningBox}>
                            <Ionicons name="lock-closed" size={17} color="#e0a93a" />
                            <Text style={s.warningTxt}>Ton <Text style={{ color: c.text, fontFamily: fonts.bodyBold }}>genre</Text> et ton <Text style={{ color: c.text, fontFamily: fonts.bodyBold }}>écart d'âge</Text> sont définitifs : ils ne pourront plus être modifiés après l'inscription.</Text>
                        </View>
                        <Field label="Type de connexion">
                            <View style={s.rowWrap}>
                                <Pill label="Rencontre" active={mode === 'rencontre'} onPress={() => setMode('rencontre')} />
                                <Pill label="Amitié" active={mode === 'amitie'} onPress={() => setMode('amitie')} />
                                <Pill label="Les deux" active={mode === 'les_deux'} onPress={() => setMode('les_deux')} />
                            </View>
                        </Field>
                        <Field label="Écart d'âge accepté">
                            <View style={s.gapCard}>
                                <View style={s.gapTop}>
                                    <Text style={s.gapSub}>Toi : <Text style={{ color: c.text, fontFamily: fonts.bodyBold }}>{monAge ?? '?'} ans</Text></Text>
                                    <Text style={s.gapRange}>{(monAge ?? 25) - gap} – {(monAge ?? 25) + gap} ans</Text>
                                </View>
                                <View style={s.gapStepper}>
                                    <Pressable style={s.stepperBtn} onPress={() => setGap((g) => Math.max(0, g - 1))}>
                                        <Ionicons name="remove" size={20} color={c.text} />
                                    </Pressable>
                                    <View style={s.stepperVal}>
                                        <Text style={s.stepperNum}>± {gap}</Text>
                                        <Text style={s.stepperUnit}>ans d'écart</Text>
                                    </View>
                                    <Pressable style={s.stepperBtn} onPress={() => setGap((g) => Math.min(15, g + 1))}>
                                        <Ionicons name="add" size={20} color={c.text} />
                                    </Pressable>
                                </View>
                                <View style={s.gapTrack}>
                                    <View style={[s.gapFill, { width: `${gapPct}%` as any }]} />
                                    <View style={[s.gapThumb, { left: `${gapPct}%` as any }]} />
                                </View>
                                <View style={s.gapMinMax}><Text style={s.gapMinMaxTxt}>0</Text><Text style={s.gapMinMaxTxt}>15</Text></View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 13 }}>
                                    <Ionicons name="sync-outline" size={15} color={c.accent} style={{ marginTop: 1 }} />
                                    <Text style={s.gapNote}>Cet écart reste fixe, mais la tranche s'ajuste <Text style={{ color: c.accentDeep, fontFamily: fonts.bodyBold }}>automatiquement</Text> à mesure que tu prends de l'âge.</Text>
                                </View>
                            </View>
                        </Field>
                    </FadeInUp>
                )}

                {step === 3 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <View>
                            <Text style={s.title}>Vérifions que c'est bien toi</Text>
                            <Text style={s.body}>Prends un selfie en temps réel. Il sert uniquement à la vérification et n'apparaît pas sur ton profil.</Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 18, paddingVertical: 8 }}>
                            <View style={{ position: 'relative', width: sc.s(208), height: sc.s(208) }}>
                                <View style={[s.selfieCircle, selfie && { backgroundColor: 'transparent' }]}>
                                    {selfie ? (
                                        <View style={s.selfieVerified}>
                                            <Text style={{ fontFamily: fonts.display, fontSize: sc.ms(64), color: '#fff' }}>
                                                {prenom.charAt(0).toUpperCase() || 'D'}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Ionicons name="person" size={sc.s(96)} color={c.ink(0.22)} />
                                    )}
                                </View>
                                <View style={[s.selfieRing, { borderColor: selfie ? '#1f9d57' : c.ink(0.2) }]} />
                                {selfie && (
                                    <View style={s.selfieCheck}>
                                        <Ionicons name="checkmark" size={22} color="#fff" />
                                    </View>
                                )}
                            </View>
                            {selfie && (
                                <View style={s.selfieBadge}>
                                    <Ionicons name="shield-checkmark" size={15} color="#1f9d57" />
                                    <Text style={s.selfieBadgeTxt}>Visage détecté · Selfie validé</Text>
                                </View>
                            )}
                        </View>
                        {selfie ? (
                            <Pressable style={s.retakeBtn} onPress={() => setSelfie(false)}>
                                <Ionicons name="refresh" size={17} color={c.text} />
                                <Text style={s.retakeTxt}>Reprendre</Text>
                            </Pressable>
                        ) : (
                            <GradientButton label="Prendre le selfie" icon="camera" onPress={() => { setSelfie(true); }} />
                        )}
                    </FadeInUp>
                )}

                {step === 4 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <View>
                            <Text style={s.title}>Ajoute tes photos</Text>
                            <Text style={s.body}>Ta photo de profil et une seconde sont obligatoires. Les trois suivantes sont à toi de voir.</Text>
                        </View>
                        <View style={s.photoGrid}>
                            {photos.map((filled, i) => (
                                <Pressable key={i} style={[s.photoSlot, filled && s.photoSlotFilled]} onPress={() => togglePhoto(i)}>
                                    {filled ? (
                                        <View style={s.photoCheck}>
                                            <Ionicons name="checkmark" size={sc.ms(14)} color="#fff" />
                                        </View>
                                    ) : (
                                        <Ionicons name={i < 2 ? 'camera' : 'add'} size={sc.ms(24)} color={i < 2 ? c.accent : c.ink(0.3)} />
                                    )}
                                    <View style={s.photoLabel}>
                                        <Text style={[s.photoLabelTxt, { color: i < 2 ? c.accent : c.ink(0.45) }]}>
                                            {i === 0 ? 'Profil' : i === 1 ? 'Requis' : `Photo ${i + 1}`}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                        <View style={s.photoCounter}>
                            <Text style={s.photoCounterSub}>Photos ajoutées</Text>
                            <Text style={s.photoCounterVal}>{photoCount} / 5</Text>
                        </View>
                        <Text style={s.photoHint}>Appuie sur une case pour simuler l'ajout d'une photo.</Text>
                    </FadeInUp>
                )}

                {step === 5 && (
                    <FadeInUp style={{ gap: spacing.lg }}>
                        <Text style={s.title}>Presque fini</Text>
                        <Text style={s.body}>En rejoignant KADY, tu t'engages à respecter les autres membres. Pas de harcèlement, pas de coordonnées partagées avant la confiance établie.</Text>
                        <Pressable style={s.check} onPress={() => setCgu(!cgu)}>
                            <View style={[s.box, cgu && s.boxOn]}>{cgu && <Ionicons name="checkmark" size={16} color="#fff" />}</View>
                            <Text style={s.checkTxt}>J'accepte les conditions d'utilisation et la politique de confidentialité.</Text>
                        </Pressable>
                    </FadeInUp>
                )}

                {!!err && (
                    <View style={s.errBox}>
                        <Ionicons name="alert-circle" size={17} color="#ef5350" />
                        <Text style={s.errTxt}>{err}</Text>
                    </View>
                )}
            </ScrollView>

            <View style={s.footer}>
                {step === 3 && !selfie ? null : (
                    <GradientButton label={btnLabel} onPress={next} />
                )}
            </View>
        </Screen>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    const c = useColors();
    const { ms } = useScale();
    return (
        <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: fonts.bodyMed, fontSize: ms(14), color: c.text }}>{label}</Text>
            {children}
        </View>
    );
}

const makeStyles = (c: Palette, sc: ReturnType<typeof useScale>) => {
    const { s, ms } = sc;
    return StyleSheet.create({
    topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingBottom: 8 },
    backBtn: { width: s(42), height: s(42), borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    topTitle: { fontFamily: fonts.display, fontSize: ms(23), letterSpacing: -0.3, color: c.text },

    stepsRow: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    stepBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: c.field },
    stepBarOn: { backgroundColor: c.accent },

    scroll: { paddingHorizontal: spacing.lg, paddingBottom: s(120) },

    title: { fontFamily: fonts.display, fontSize: ms(25), color: c.text },
    body: { fontFamily: fonts.body, fontSize: ms(14), lineHeight: ms(21), color: c.ink(0.6) },
    hint: { fontFamily: fonts.body, fontSize: ms(12), color: c.ink(0.42), marginTop: 4 },

    input: { backgroundColor: c.field, borderWidth: 1, borderColor: c.border, borderRadius: radius.md, color: c.text, fontFamily: fonts.body, fontSize: ms(16), padding: s(15) },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },

    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    dividerLine: { flex: 1, height: 1, backgroundColor: c.border },
    dividerTxt: { fontFamily: fonts.bodySemi, fontSize: ms(12), color: c.ink(0.42) },

    socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: s(14), borderRadius: radius.md, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    socialApple: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.12)' },
    socialTxt: { fontFamily: fonts.bodyBold, fontSize: ms(14.5) },

    warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: s(13), borderRadius: radius.md, backgroundColor: 'rgba(255,210,122,0.12)', borderWidth: 1, borderColor: 'rgba(255,200,110,0.35)' },
    warningTxt: { flex: 1, fontFamily: fonts.body, fontSize: ms(12.5), lineHeight: ms(18), color: c.ink(0.7) },

    gapCard: { padding: s(18), borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    gapTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    gapSub: { fontFamily: fonts.body, fontSize: ms(13), color: c.ink(0.6) },
    gapRange: { fontFamily: fonts.display, fontSize: ms(15), color: c.accentDeep },
    gapStepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(18), marginTop: 16 },
    stepperBtn: { width: s(40), height: s(40), borderRadius: 13, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    stepperVal: { alignItems: 'center', minWidth: s(74) },
    stepperNum: { fontFamily: fonts.display, fontSize: ms(30), lineHeight: ms(32), color: c.accentDeep },
    stepperUnit: { fontFamily: fonts.bodySemi, fontSize: ms(11.5), color: c.ink(0.5), marginTop: 4 },
    gapTrack: { marginTop: 16, height: 7, borderRadius: 99, backgroundColor: c.ink(0.12) as any, position: 'relative' },
    gapFill: { position: 'absolute', left: 0, top: 0, height: 7, borderRadius: 99, backgroundColor: c.accent },
    gapThumb: { position: 'absolute', top: -6.5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: '#ff6aa9', marginLeft: -10 },
    gapMinMax: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    gapMinMaxTxt: { fontFamily: fonts.body, fontSize: ms(11), color: c.ink(0.4) },
    gapNote: { flex: 1, fontFamily: fonts.body, fontSize: ms(12), lineHeight: ms(17), color: c.ink(0.55) },

    selfieCircle: { position: 'absolute', inset: 0 as any, width: s(208), height: s(208), borderRadius: s(104), backgroundColor: c.field, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    selfieVerified: { width: '100%', height: '100%', backgroundColor: '#5a7fd6', alignItems: 'center', justifyContent: 'center' },
    selfieRing: { position: 'absolute', top: -6, left: -6, right: -6, bottom: -6, borderRadius: s(110), borderWidth: 3, borderStyle: 'dashed' },
    selfieCheck: { position: 'absolute', bottom: 4, right: 8, width: s(42), height: s(42), borderRadius: s(21), backgroundColor: '#1f9d57', borderWidth: 4, borderColor: c.bg[1], alignItems: 'center', justifyContent: 'center' },
    selfieBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: 'rgba(31,157,87,0.12)', borderWidth: 1, borderColor: 'rgba(31,157,87,0.3)' },
    selfieBadgeTxt: { fontFamily: fonts.bodyBold, fontSize: ms(12.5), color: '#1f9d57' },
    retakeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: s(14), borderRadius: radius.md, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    retakeTxt: { fontFamily: fonts.bodyBold, fontSize: ms(14), color: c.text },

    photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(11) },
    photoSlot: { width: '30.5%', aspectRatio: 3 / 4, borderRadius: s(16), backgroundColor: c.field, borderWidth: 1.5, borderColor: c.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
    photoSlotFilled: { backgroundColor: 'rgba(255,106,169,0.15)', borderColor: c.accent, borderStyle: 'solid' },
    photoCheck: { position: 'absolute', top: 7, right: 7, width: s(22), height: s(22), borderRadius: s(11), backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    photoLabel: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 5, paddingHorizontal: 7, backgroundColor: 'rgba(10,6,20,0.55)' },
    photoLabelTxt: { fontFamily: fonts.bodyBold, fontSize: ms(9.5) },
    photoCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: s(13), borderRadius: radius.md, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    photoCounterSub: { fontFamily: fonts.body, fontSize: ms(13), color: c.ink(0.6) },
    photoCounterVal: { fontFamily: fonts.display, fontSize: ms(15), color: c.accentDeep },
    photoHint: { fontFamily: fonts.body, fontSize: ms(11.5), lineHeight: ms(17), color: c.ink(0.45), textAlign: 'center' },

    check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    box: { width: s(24), height: s(24), borderRadius: 7, borderWidth: 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    boxOn: { backgroundColor: c.accent, borderColor: c.accent },
    checkTxt: { flex: 1, fontFamily: fonts.body, fontSize: ms(14), color: c.ink(0.6), lineHeight: ms(20) },

    errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: s(12), borderRadius: 12, backgroundColor: 'rgba(239,83,80,0.1)', borderWidth: 1, borderColor: 'rgba(239,83,80,0.25)', marginTop: spacing.md },
    errTxt: { flex: 1, fontFamily: fonts.bodySemi, fontSize: ms(13.5), color: '#ef5350' },

    footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.bg[1] },
    });
};
