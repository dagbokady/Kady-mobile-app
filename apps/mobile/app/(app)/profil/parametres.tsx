// app/(app)/profil/parametres.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, SectionTitle } from '../../../src/components/ui';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { colors } from '../../../src/theme/colors';

export default function Parametres() {
    const router = useRouter();
    const [pause, setPause] = useState(false);
    const [notifs, setNotifs] = useState(true);

    return (
        <Screen>
            <ScreenHeader title="Paramètres" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.lg }}>

                {/* Pause relationnelle */}
                <FadeInUp>
                    <SectionTitle>Pause relationnelle</SectionTitle>
                    <View style={s.card}>
                        <View style={s.toggleRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.label}>Activer la pause</Text>
                                <Text style={s.sub}>Tu restes dans tes Cercles mais ne reçois plus de nouveaux DM et disparais des suggestions. Réversible.</Text>
                            </View>
                            <Switch
                                value={pause} onValueChange={setPause}
                                trackColor={{ true: colors.rose, false: colors.cardLight }}
                                thumbColor={colors.white}
                            />
                        </View>
                    </View>
                </FadeInUp>

                {/* Notifications */}
                <FadeInUp delay={70}>
                    <SectionTitle>Notifications</SectionTitle>
                    <View style={s.card}>
                        <View style={s.toggleRow}>
                            <Text style={s.label}>Notifications push</Text>
                            <Switch
                                value={notifs} onValueChange={setNotifs}
                                trackColor={{ true: colors.rose, false: colors.cardLight }}
                                thumbColor={colors.white}
                            />
                        </View>
                    </View>
                </FadeInUp>

                {/* Sécurité */}
                <FadeInUp delay={140}>
                    <SectionTitle>Sécurité & confidentialité</SectionTitle>
                    <View style={s.card}>
                        <Item icon="person-remove" color={colors.coral} label="Personnes bloquées" value="2" />
                        <Item icon="flag" color={colors.amber} label="Mes signalements" value="0" />
                        <Item icon="eye-off" color={colors.violet} label="Personnes masquées" value="1" />
                        <Item icon="document-text" color={colors.teal} label="Politique de confidentialité" last />
                    </View>
                </FadeInUp>

                {/* Compte */}
                <FadeInUp delay={210}>
                    <SectionTitle>Compte</SectionTitle>
                    <View style={s.card}>
                        <Item icon="mail" color={colors.sky} label="Modifier l'email" />
                        <Item icon="key" color={colors.gold} label="Changer le mot de passe" />
                        <Item icon="trash" color={colors.danger} label="Supprimer mon compte" danger last />
                    </View>
                </FadeInUp>

                <FadeInUp delay={280}>
                    <Pressable style={s.logout} onPress={() => router.replace('/')}>
                        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
                        <Text style={s.logoutTxt}>Se déconnecter</Text>
                    </Pressable>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

function Item({ icon, label, value, danger, last, color = colors.muted }: { icon: any; label: string; value?: string; danger?: boolean; last?: boolean; color?: string }) {
    const tint = danger ? colors.danger : color;
    return (
        <Pressable style={[s.item, !last && s.itemBorder]}>
            <View style={[s.itemIcon, { backgroundColor: tint + '18' }]}>
                <Ionicons name={icon} size={16} color={tint} />
            </View>
            <Text style={[s.itemLabel, danger && { color: colors.danger }]}>{label}</Text>
            {value && <Text style={[s.itemValue, { color: tint }]}>{value}</Text>}
            <Ionicons name="chevron-forward" size={16} color={colors.dim} />
        </Pressable>
    );
}

const s = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.07)',
        borderRadius: radius.lg, paddingHorizontal: spacing.md,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
    label: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.cream },
    sub: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 18 },
    item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 12 },
    itemBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
    itemIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    itemLabel: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.cream },
    itemValue: { fontFamily: fonts.bodyMed, fontSize: 14 },
    logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: spacing.md },
    logoutTxt: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.danger },
});
