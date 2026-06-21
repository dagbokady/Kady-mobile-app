// app/(app)/profil/carnet.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, Card } from '../../../src/components/ui';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { gradients } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors } from '../../../src/theme/colors';

type Note = { id: string; type: 'note' | 'souvenir' | 'rappel'; contenu: string; date: string };

const INIT: Note[] = [
    { id: '1', type: 'souvenir', contenu: 'Koffi adore l\'attiéké poisson — penser à proposer le maquis de Cocody.', date: 'Aujourd\'hui' },
    { id: '2', type: 'note', contenu: 'Mariam connaît plein de gospel ivoirien, lui demander des recommandations.', date: 'Hier' },
];

const TYPES = {
    note: { icon: 'document-text', color: '#2BB7CF' },
    souvenir: { icon: 'heart', color: '#EC4E86' },
    rappel: { icon: 'alarm', color: '#F5A623' },
} as const;

export default function Carnet() {
    const [notes, setNotes] = useState(INIT);
    const [txt, setTxt] = useState('');

    const add = () => {
        if (!txt.trim()) return;
        setNotes([{ id: String(Date.now()), type: 'note', contenu: txt, date: 'Maintenant' }, ...notes]);
        setTxt('');
    };

    return (
        <Screen>
            <ScreenHeader title="Carnet personnel" back />
            <View style={s.privacy}>
                <Ionicons name="lock-closed" size={13} color={colors.rose} />
                <Text style={s.privacyTxt}>Visible uniquement par toi. Personne d'autre n'y a accès.</Text>
            </View>

            <View style={s.addBar}>
                <TextInput
                    style={s.input} value={txt} onChangeText={setTxt}
                    placeholder="Une note, un souvenir, un rappel…"
                    placeholderTextColor={colors.dim} multiline
                />
                <PressableScale onPress={add} scaleTo={0.9}>
                    <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.send}>
                        <Ionicons name="add" size={22} color={colors.white} />
                    </LinearGradient>
                </PressableScale>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}>
                {notes.map((n, i) => {
                    const t = TYPES[n.type];
                    return (
                        <FadeInUp key={n.id} delay={i * 70}>
                            <Card style={{ borderLeftWidth: 3, borderLeftColor: t.color }}>
                                <View style={s.noteHead}>
                                    <View style={[s.noteType, { backgroundColor: t.color + '18' }]}>
                                        <Ionicons name={t.icon as any} size={13} color={t.color} />
                                        <Text style={[s.noteTypeTxt, { color: t.color }]}>{n.type}</Text>
                                    </View>
                                    <Text style={s.date}>{n.date}</Text>
                                </View>
                                <Text style={s.contenu}>{n.contenu}</Text>
                            </Card>
                        </FadeInUp>
                    );
                })}
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
    privacyTxt: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
    addBar: { flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginBottom: spacing.lg },
    input: {
        flex: 1, minHeight: 48, maxHeight: 120,
        backgroundColor: colors.cardLight,
        borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
        color: colors.cream, fontFamily: fonts.body, fontSize: 15,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center' },
    noteHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    noteType: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 100 },
    noteTypeTxt: { fontFamily: fonts.bodySemi, fontSize: 11, textTransform: 'capitalize' },
    date: { fontFamily: fonts.body, fontSize: 11, color: colors.dim },
    contenu: { fontFamily: fonts.body, fontSize: 15, color: colors.cream, lineHeight: 22 },
});
