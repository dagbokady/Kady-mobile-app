// app/(app)/profil/parametres.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../../src/components/Screen';
import { ScreenHeader, SectionTitle } from '../../../src/components/ui';
import { FadeInUp } from '../../../src/components/motion';
import { fonts } from '../../../src/theme/typography';
import { spacing, radius } from '../../../src/theme/spacing';
import { useColors, useTheme, type Palette } from '../../../src/theme/theme';
import { useStore } from '../../../src/store/app';
import { useAuth } from '../../../src/store/auth';

export default function Parametres() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const { dark, toggle } = useTheme();
    const pause = useStore((st) => st.pause);
    const setPause = useStore((st) => st.setPause);
    const notifs = useStore((st) => st.notifsPush);
    const setNotifs = useStore((st) => st.setNotifsPush);
    const reset = useStore((st) => st.reset);
    const trackColor = { true: c.accent, false: c.ink(0.18) };

    const deleteAccount = () => {
        Alert.alert('Supprimer mon compte', 'Cette action est définitive : tes Cercles, messages et données seront effacés.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: async () => { reset(); await useAuth.getState().logout(); router.replace('/'); } },
        ]);
    };
    const web = (path: string) => Linking.openURL(`https://kady.ci/${path}`).catch(() => {});

    return (
        <Screen>
            <ScreenHeader title="Paramètres" back />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.lg }}>

                {/* Apparence */}
                <FadeInUp>
                    <SectionTitle>Apparence</SectionTitle>
                    <View style={s.card}>
                        <View style={s.toggleRow}>
                            <View style={[s.itemIcon, { backgroundColor: '#a78bfa22' }]}><Ionicons name="moon" size={16} color="#a78bfa" /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.label}>Mode sombre</Text>
                                <Text style={s.sub}>{dark ? 'Activé' : 'Désactivé'} · s'applique à toute l'app.</Text>
                            </View>
                            <Switch value={dark} onValueChange={toggle} trackColor={trackColor} thumbColor="#fff" />
                        </View>
                    </View>
                </FadeInUp>

                {/* Pause relationnelle */}
                <FadeInUp delay={70}>
                    <SectionTitle>Pause relationnelle</SectionTitle>
                    <View style={s.card}>
                        <View style={s.toggleRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.label}>Activer la pause</Text>
                                <Text style={s.sub}>Tu restes dans tes Cercles mais ne reçois plus de nouveaux DM et disparais des suggestions. Réversible.</Text>
                            </View>
                            <Switch value={pause} onValueChange={setPause} trackColor={trackColor} thumbColor="#fff" />
                        </View>
                    </View>
                </FadeInUp>

                {/* Notifications */}
                <FadeInUp delay={140}>
                    <SectionTitle>Notifications</SectionTitle>
                    <View style={s.card}>
                        <View style={s.toggleRow}>
                            <Text style={[s.label, { flex: 1 }]}>Notifications push</Text>
                            <Switch value={notifs} onValueChange={setNotifs} trackColor={trackColor} thumbColor="#fff" />
                        </View>
                    </View>
                </FadeInUp>

                {/* Sécurité */}
                <FadeInUp delay={210}>
                    <SectionTitle>Sécurité & confidentialité</SectionTitle>
                    <View style={s.card}>
                        <Item icon="person-remove" color="#ff9d5c" label="Personnes bloquées" value="2" onPress={() => Alert.alert('Personnes bloquées', '• Yann B.\n• Compte 225\n\nUne personne bloquée ne peut plus te contacter ni voir ton profil.')} />
                        <Item icon="flag" color="#ffb45c" label="Mes signalements" value="0" onPress={() => Alert.alert('Mes signalements', 'Aucun signalement en cours. Merci d\'aider à garder KADY sûr. 🙏')} />
                        <Item icon="eye-off" color="#a78bfa" label="Personnes masquées" value="1" onPress={() => Alert.alert('Personnes masquées', '• Sophie K.\n\nLes profils masqués n\'apparaissent plus dans tes suggestions.')} />
                        <Item icon="document-text" color="#2fb8c0" label="Politique de confidentialité" onPress={() => web('confidentialite')} last />
                    </View>
                </FadeInUp>

                {/* Compte */}
                <FadeInUp delay={280}>
                    <SectionTitle>Compte</SectionTitle>
                    <View style={s.card}>
                        <Item icon="mail" color="#5a7fd6" label="Modifier l'email" onPress={() => web('compte')} />
                        <Item icon="key" color="#ffd27a" label="Changer le mot de passe" onPress={() => web('compte')} />
                        <Item icon="trash" color="#ef5350" label="Supprimer mon compte" danger last onPress={deleteAccount} />
                    </View>
                </FadeInUp>

                <FadeInUp delay={350}>
                    <Pressable style={s.logout} onPress={async () => { await useAuth.getState().logout(); router.replace('/'); }}>
                        <Ionicons name="log-out-outline" size={18} color="#ef5350" />
                        <Text style={s.logoutTxt}>Se déconnecter</Text>
                    </Pressable>
                </FadeInUp>
            </ScrollView>
        </Screen>
    );
}

function Item({ icon, label, value, danger, last, color, onPress }: { icon: any; label: string; value?: string; danger?: boolean; last?: boolean; color?: string; onPress?: () => void }) {
    const c = useColors();
    const s = makeStyles(c);
    const tint = danger ? '#ef5350' : (color ?? c.ink(0.6));
    return (
        <Pressable style={[s.item, !last && s.itemBorder]} onPress={onPress}>
            <View style={[s.itemIcon, { backgroundColor: tint + '22' }]}>
                <Ionicons name={icon} size={16} color={tint} />
            </View>
            <Text style={[s.itemLabel, danger && { color: '#ef5350' }]}>{label}</Text>
            {value && <Text style={[s.itemValue, { color: tint }]}>{value}</Text>}
            <Ionicons name="chevron-forward" size={16} color={c.ink(0.35)} />
        </Pressable>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    card: {
        backgroundColor: c.card,
        borderWidth: 1, borderColor: c.border,
        borderRadius: radius.lg, paddingHorizontal: spacing.md,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
    label: { fontFamily: fonts.bodySemi, fontSize: 15, color: c.text },
    sub: { fontFamily: fonts.body, fontSize: 12, color: c.ink(0.55), marginTop: 3, lineHeight: 18 },
    item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 12 },
    itemBorder: { borderBottomWidth: 1, borderBottomColor: c.border },
    itemIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    itemLabel: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: c.text },
    itemValue: { fontFamily: fonts.bodyMed, fontSize: 14 },
    logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: spacing.md },
    logoutTxt: { fontFamily: fonts.bodySemi, fontSize: 15, color: '#ef5350' },
});
