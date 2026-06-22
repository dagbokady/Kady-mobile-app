// app/(app)/creer.tsx — Créer (handoff "KADY Creer.dc.html")
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Animated, Image, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../src/components/Screen';
import { FadeInUp, PressableScale } from '../../src/components/motion';
import { fonts } from '../../src/theme/typography';
import { useColors, type Palette } from '../../src/theme/theme';
import { useStore, pickImage } from '../../src/store/app';

const PAD = 22;
const BRAND = ['#ff6aa9', '#e02a73'] as const;

const CATS = [
    { emoji: '✈️', label: 'Voyage', grad: ['#ff9d5c', '#d34d7e'] },
    { emoji: '🏀', label: 'Sport', grad: ['#7be0a0', '#2f9ac2'] },
    { emoji: '🎬', label: 'Cinéma', grad: ['#8fd0ff', '#5a7fd6'] },
    { emoji: '🍲', label: 'Cuisine', grad: ['#ffb45c', '#d3744d'] },
    { emoji: '🎨', label: 'Art', grad: ['#b07bff', '#7a4fd6'] },
] as const;
const SIZES = [6, 10, 15, 20];

export default function Creer() {
    const router = useRouter();
    const c = useColors();
    const s = makeStyles(c);
    const [name, setName] = useState('');
    const [cat, setCat] = useState(0);
    const [type, setType] = useState<'rencontre' | 'amitie'>('rencontre');
    const [max, setMax] = useState(10);
    const [priv, setPriv] = useState(false);
    const [cover, setCover] = useState<string | null>(null);
    const knob = useRef(new Animated.Value(0)).current;
    const createCercle = useStore((st) => st.createCercle);
    const pickCover = async () => { const uri = await pickImage(); if (uri) setCover(uri); };
    const shareInvite = () => { Share.share({ message: "Rejoins-moi sur KADY — ici on se rencontre d'abord en cercle 💫 https://kady.ci" }).catch(() => {}); };

    const onCreate = () => {
        createCercle({ nom: name.trim() || 'Mon nouveau cercle', theme: CATS[cat].label, type, max });
        router.replace('/(app)/cercles');
    };

    const togglePriv = () => {
        const v = !priv; setPriv(v);
        Animated.spring(knob, { toValue: v ? 1 : 0, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
    };
    const isRenc = type === 'rencontre';
    const pct = ((max - 4) / (20 - 4)) * 100;

    return (
        <Screen padded={false}>
            <View style={{ flex: 1 }}>
                <FadeInUp>
                    <View style={s.header}>
                        <View>
                            <Text style={s.h1}>Créer</Text>
                            <Text style={s.h1sub}>Lancez quelque chose de nouveau</Text>
                        </View>
                        <Pressable onPress={() => router.back()} style={s.close}><Ionicons name="close" size={20} color={c.text} /></Pressable>
                    </View>
                </FadeInUp>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 110 }}>
                    <FadeInUp delay={50}>
                        <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.primary}>
                            <View style={s.primaryGlow} />
                            <View style={s.primaryIcon}><Ionicons name="people-outline" size={26} color="#fff" /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.primaryTitle}>Créer un cercle</Text>
                                <Text style={s.primarySub}>Rassemblez une communauté autour d'une passion</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </FadeInUp>

                    <FadeInUp delay={100}>
                        <QuickItem icon="calendar-outline" color="#ff9d5c" title="Proposer une activité" sub="Sortie, soirée, événement d'un cercle" />
                    </FadeInUp>
                    <FadeInUp delay={140}>
                        <QuickItem icon="person-add-outline" color="#8f9dff" title="Inviter des amis" sub="Partagez KADY et gagnez de l'XP" onPress={shareInvite} />
                    </FadeInUp>

                    <View style={s.divider}>
                        <View style={s.divLine} /><Text style={s.divTxt}>NOUVEAU CERCLE</Text><View style={s.divLine} />
                    </View>

                    <FadeInUp delay={180}>
                        <LinearGradient colors={CATS[cat].grad as any} start={{ x: 0.2, y: 0 }} end={{ x: 0.85, y: 1 }} style={s.cover}>
                            {cover && <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
                            <LinearGradient colors={['transparent', 'rgba(10,6,20,0.45)']} style={StyleSheet.absoluteFill} />
                            <Pressable style={s.coverBtn} onPress={pickCover}>
                                <Ionicons name="image-outline" size={13} color="#fff" />
                                <Text style={s.coverBtnTxt}>{cover ? 'Changer' : 'Couverture'}</Text>
                            </Pressable>
                            <Text style={s.coverName}>{name.trim() || 'Aperçu du cercle'}</Text>
                        </LinearGradient>
                    </FadeInUp>

                    <FadeInUp delay={220}>
                        <Text style={s.label}>Nom du cercle</Text>
                        <View style={s.field}>
                            <Ionicons name="people-outline" size={18} color={c.ink(0.4)} />
                            <TextInput value={name} onChangeText={setName} placeholder="Ex. Randonneurs d'Abidjan" placeholderTextColor={c.ink(0.4)} style={s.fieldInput} />
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={260}>
                        <Text style={[s.label, { marginTop: 18 }]}>Catégorie</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -PAD, marginTop: 10 }} contentContainerStyle={s.catRow}>
                            {CATS.map((cat2, i) => {
                                const on = i === cat;
                                return (
                                    <Pressable key={cat2.label} onPress={() => setCat(i)} style={[s.catChip, on ? s.catOn : s.catOff]}>
                                        <Text style={{ fontSize: 15 }}>{cat2.emoji}</Text>
                                        <Text style={[s.catTxt, { color: on ? c.accentDeep : c.ink(0.65) }]}>{cat2.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </FadeInUp>

                    <FadeInUp delay={300}>
                        <Text style={[s.label, { marginTop: 18 }]}>Type de connexion</Text>
                        <View style={s.typeRow}>
                            <Pressable onPress={() => setType('rencontre')} style={[s.typeBtn, isRenc ? { backgroundColor: 'rgba(255,111,168,0.14)', borderColor: 'rgba(255,111,168,0.5)', borderWidth: 1.5 } : s.typeOff]}>
                                <Ionicons name="heart" size={22} color={isRenc ? '#ff6fa8' : c.ink(0.35)} />
                                <Text style={[s.typeTxt, { color: isRenc ? '#ff6fa8' : c.ink(0.55) }]}>Rencontre</Text>
                            </Pressable>
                            <Pressable onPress={() => setType('amitie')} style={[s.typeBtn, !isRenc ? { backgroundColor: 'rgba(143,157,255,0.14)', borderColor: 'rgba(143,157,255,0.5)', borderWidth: 1.5 } : s.typeOff]}>
                                <Ionicons name="people" size={22} color={!isRenc ? '#8f9dff' : c.ink(0.35)} />
                                <Text style={[s.typeTxt, { color: !isRenc ? '#8f9dff' : c.ink(0.55) }]}>Amitié</Text>
                            </Pressable>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={340}>
                        <View style={s.maxCard}>
                            <View style={s.maxTop}>
                                <Text style={s.maxLabel}>Membres maximum</Text>
                                <Text style={s.maxVal}>{max}</Text>
                            </View>
                            <View style={s.track}>
                                <View style={[s.trackFill, { width: `${pct}%` }]}>
                                    <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 99 }} />
                                </View>
                                <View style={[s.trackKnob, { left: `${pct}%` }]} />
                            </View>
                            <View style={s.sizeRow}>
                                {SIZES.map((n) => {
                                    const on = n === max;
                                    return (
                                        <Pressable key={n} onPress={() => setMax(n)} style={[s.sizeBtn, on ? s.sizeOn : s.sizeOff]}>
                                            <Text style={[s.sizeTxt, { color: on ? c.accentDeep : c.ink(0.55) }]}>{n}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </FadeInUp>

                    <FadeInUp delay={380}>
                        <View style={s.privCard}>
                            <View style={s.privIcon}><Ionicons name="lock-closed" size={20} color="#1f9d57" /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.privTitle}>Cercle privé</Text>
                                <Text style={[s.privSub, priv && { color: '#1f9d57' }]}>{priv ? 'Sur invitation uniquement' : 'Visible et ouvert à tous'}</Text>
                            </View>
                            <Pressable onPress={togglePriv} hitSlop={8}>
                                <View style={s.privTrack}>
                                    {priv && <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
                                    <Animated.View style={[s.privKnob, { transform: [{ translateX: knob.interpolate({ inputRange: [0, 1], outputRange: [0, 19] }) }] }]} />
                                </View>
                            </Pressable>
                        </View>
                    </FadeInUp>
                </ScrollView>

                <View style={s.footer}>
                    <PressableScale onPress={onCreate}>
                        <LinearGradient colors={BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.createBtn}>
                            <Ionicons name="add" size={19} color="#fff" />
                            <Text style={s.createTxt}>Créer mon cercle</Text>
                        </LinearGradient>
                    </PressableScale>
                </View>
            </View>
        </Screen>
    );
}

function QuickItem({ icon, color, title, sub, onPress }: { icon: any; color: string; title: string; sub: string; onPress?: () => void }) {
    const c = useColors();
    const s = makeStyles(c);
    return (
        <PressableScale style={s.quick} scaleTo={0.98} onPress={onPress}>
            <View style={[s.quickIcon, { backgroundColor: color + '22' }]}><Ionicons name={icon} size={22} color={color} /></View>
            <View style={{ flex: 1 }}>
                <Text style={s.quickTitle}>{title}</Text>
                <Text style={s.quickSub}>{sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={c.ink(0.35)} />
        </PressableScale>
    );
}

const makeStyles = (c: Palette) => StyleSheet.create({
    header: { paddingHorizontal: PAD, paddingTop: 4, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontFamily: fonts.display, fontSize: 25, color: c.text, letterSpacing: -0.3 },
    h1sub: { marginTop: 2, fontFamily: fonts.body, fontSize: 13, color: c.ink(0.5) },
    close: { width: 44, height: 44, borderRadius: 14, backgroundColor: c.field, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },

    primary: { overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 22, marginBottom: 11, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 8 },
    primaryGlow: { position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.22)' },
    primaryIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
    primaryTitle: { fontFamily: fonts.display, fontSize: 17, color: '#fff' },
    primarySub: { marginTop: 3, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: 'rgba(255,255,255,0.88)' },

    quick: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, marginBottom: 11, shadowColor: '#281950', shadowOffset: { width: 0, height: 6 }, shadowOpacity: c.mode === 'dark' ? 0.3 : 0.1, shadowRadius: 14, elevation: 2 },
    quickIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    quickTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: c.text },
    quickSub: { marginTop: 2, fontFamily: fonts.body, fontSize: 12, color: c.ink(0.5) },

    divider: { marginVertical: 22, flexDirection: 'row', alignItems: 'center', gap: 12 },
    divLine: { flex: 1, height: 1, backgroundColor: c.border },
    divTxt: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: c.ink(0.4) },

    cover: { height: 120, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end', padding: 14, shadowColor: '#281950', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 22, elevation: 5 },
    coverBtn: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    coverBtnTxt: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: '#fff' },
    coverName: { fontFamily: fonts.display, fontSize: 18, color: '#fff', textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 10 },

    label: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: c.text },
    field: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 15, borderRadius: 15, backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    fieldInput: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, color: c.text, padding: 0 },

    catRow: { gap: 9, paddingHorizontal: PAD },
    catChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 99, borderWidth: 1 },
    catOn: { backgroundColor: 'rgba(255,106,169,0.18)', borderColor: 'rgba(255,140,190,0.5)' },
    catOff: { backgroundColor: c.field, borderColor: c.border },
    catTxt: { fontFamily: fonts.bodySemi, fontSize: 13 },

    typeRow: { marginTop: 10, flexDirection: 'row', gap: 10 },
    typeBtn: { flex: 1, paddingVertical: 14, borderRadius: 15, alignItems: 'center', gap: 7 },
    typeOff: { backgroundColor: c.field, borderWidth: 1, borderColor: c.border },
    typeTxt: { fontFamily: fonts.bodyBold, fontSize: 13 },

    maxCard: { marginTop: 18, padding: 15, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    maxTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    maxLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: c.text },
    maxVal: { fontFamily: fonts.display, fontSize: 15, color: c.accentDeep },
    track: { marginTop: 12, height: 7, borderRadius: 99, backgroundColor: c.ink(0.12) },
    trackFill: { position: 'absolute', left: 0, top: 0, height: 7, borderRadius: 99 },
    trackKnob: { position: 'absolute', top: '50%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: '#ff6aa9', marginLeft: -10, marginTop: -10, shadowColor: '#d6286e', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 3 },
    sizeRow: { marginTop: 9, flexDirection: 'row', gap: 8 },
    sizeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
    sizeOn: { backgroundColor: 'rgba(255,106,169,0.16)', borderColor: 'rgba(255,140,190,0.5)' },
    sizeOff: { backgroundColor: c.field, borderColor: c.border },
    sizeTxt: { fontFamily: fonts.bodyBold, fontSize: 12.5 },

    privCard: { marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    privIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(123,224,160,0.14)', alignItems: 'center', justifyContent: 'center' },
    privTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: c.text },
    privSub: { marginTop: 2, fontFamily: fonts.body, fontSize: 11.5, color: c.ink(0.45) },
    privTrack: { width: 46, height: 27, borderRadius: 99, padding: 3, backgroundColor: c.ink(0.16), justifyContent: 'center', overflow: 'hidden' },
    privKnob: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },

    footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: PAD, paddingTop: 14, paddingBottom: 16, backgroundColor: c.bg[2] },
    createBtn: { paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, shadowColor: '#e02a73', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 8 },
    createTxt: { fontFamily: fonts.display, fontSize: 15, color: '#fff' },
});
