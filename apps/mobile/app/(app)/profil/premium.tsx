// app/(app)/profil/premium.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../../src/components/Screen';
import Logo from '../../../src/components/Logo';
import GradientButton from '../../../src/components/GradientButton';
import { ScreenHeader } from '../../../src/components/ui';
import { FadeInUp, PopIn } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors, gradients } from '../../../src/theme/colors';

const AVANTAGES = [
    { icon: 'infinite', t: 'Cercles illimités', d: 'Rejoins autant de Cercles que tu veux.', color: colors.violet },
    { icon: 'chatbubbles', t: 'DM illimités', d: 'Plus de limite de 3 conversations.', color: colors.pink },
    { icon: 'stats-chart', t: 'Statistiques', d: 'Vois qui s\'intéresse à toi.', color: colors.teal },
    { icon: 'color-palette', t: 'Personnalisation', d: 'Profil et thème à ton image.', color: colors.amber },
    { icon: 'time', t: 'Ton rythme', d: 'Avance dans les niveaux à ta vitesse.', color: colors.sky },
];

export default function Premium() {
    return (
        <Screen>
            <ScreenHeader title="KADY Premium" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
                <PopIn>
                    <LinearGradient colors={gradients.royal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
                        <View style={s.heroLogo}><Logo size={48} color={colors.white} /></View>
                        <Text style={s.title}>Va plus loin avec Premium</Text>
                        <Text style={s.sub}>Tout KADY, sans limites. Annulable à tout moment.</Text>
                    </LinearGradient>
                </PopIn>

                <View style={s.list}>
                    {AVANTAGES.map((a, i) => (
                        <FadeInUp key={a.t} delay={100 + i * 70}>
                            <View style={s.item}>
                                <View style={[s.itemIcon, { backgroundColor: a.color + '18' }]}><Ionicons name={a.icon as any} size={18} color={a.color} /></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.itemT}>{a.t}</Text>
                                    <Text style={s.itemD}>{a.d}</Text>
                                </View>
                            </View>
                        </FadeInUp>
                    ))}
                </View>

                <FadeInUp delay={100 + AVANTAGES.length * 70}>
                    <View style={s.price}>
                        <Text style={s.priceAmount}>2 000 FCFA<Text style={s.priceMois}> / mois</Text></Text>
                        <Text style={s.priceNote}>Paiement par Orange Money, Wave, MTN ou Moov.</Text>
                    </View>

                    <GradientButton label="Continuer le paiement" onPress={() => Linking.openURL('https://kady.ci/premium')} />
                    <View style={s.secure}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.muted} />
                        <Text style={s.secureTxt}>Paiement sécurisé via mobile money sur kady.ci. Aucune commission de store ne s'applique.</Text>
                    </View>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    hero: {
        alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl,
        borderRadius: radius.lg, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg,
        shadowColor: colors.violet, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
    },
    heroLogo: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    title: { fontFamily: fonts.display, fontSize: 26, color: colors.white, marginTop: spacing.sm, textAlign: 'center' },
    sub: { fontFamily: fonts.body, fontSize: 15, color: 'rgba(255,255,255,0.92)', textAlign: 'center' },
    list: { gap: spacing.md, marginBottom: spacing.xl },
    item: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
    itemIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    itemT: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.cream },
    itemD: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
    price: {
        alignItems: 'center',
        backgroundColor: colors.card,
        borderWidth: 1, borderColor: colors.borderRose,
        borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
        shadowColor: colors.rose, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
    },
    priceAmount: { fontFamily: fonts.display, fontSize: 32, color: colors.cream },
    priceMois: { fontFamily: fonts.body, fontSize: 16, color: colors.muted },
    priceNote: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6 },
    secure: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: spacing.md },
    secureTxt: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, flexShrink: 1, textAlign: 'center' },
});
