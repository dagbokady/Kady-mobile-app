// app/(app)/profil/carnet.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, Card } from '../../../src/components/ui';
import { FadeInUp, PressableScale } from '../../../src/components/motion';
import { gradients } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { useColors, type Palette } from '../../../src/theme/theme';
import { useStore } from '../../../src/store/app';

const TYPES = {
    note: { icon: 'document-text', color: '#2BB7CF' },
    souvenir: { icon: 'heart', color: '#EC4E86' },
    rappel: { icon: 'alarm', color: '#F5A623' },
} as const;

export default function Carnet() {
    const c = useColors();
    const s = makeStyles(c);
    const notes = useStore((st) => st.notes);
    const addNote = useStore((st) => st.addNote);
    const [txt, setTxt] = useState('');

    const add = () => {
        if (!txt.trim()) return;
        addNote(txt.trim());
        setTxt('');
    };

    return (
        <Screen>
            <ScreenHeader title="Carnet personnel" back />
            <View style={s.privacy}>
                <Ionicons name="lock-closed" size={13} color={c.accent} />
                <Text style={s.privacyTxt}>Visible uniquement par toi. Personne d'autre n'y a accès.</Text>
            </View>

            <View style={s.addBar}>
                <TextInput
                    style={s.input} value={txt} onChangeText={setTxt}
                    placeholder="Une note, un souvenir, un rappel…"
                    placeholderTextColor={c.ink(0.42)} multiline
                />
                <PressableScale onPress={add} scaleTo={0.9}>
                    <LinearGradient colors={gradients.rose} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.send}>
                        <Ionicons name="add" size={22} color="#fff" />
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
                                    <View style={[s.noteType, { backgroundColor: t.color + '26' }]}>
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

const makeStyles = (c: Palette) => StyleSheet.create({
    privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
    privacyTxt: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.6) },
    addBar: { flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginBottom: spacing.lg },
    input: {
        flex: 1, minHeight: 48, maxHeight: 120,
        backgroundColor: c.card2,
        borderRadius: radius.md, borderWidth: 1, borderColor: c.border,
        color: c.text, fontFamily: fonts.body, fontSize: 15,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    send: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    noteHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    noteType: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 100 },
    noteTypeTxt: { fontFamily: fonts.bodySemi, fontSize: 11, textTransform: 'capitalize' },
    date: { fontFamily: fonts.body, fontSize: 11, color: c.ink(0.4) },
    contenu: { fontFamily: fonts.body, fontSize: 15, color: c.text, lineHeight: 22 },
});
