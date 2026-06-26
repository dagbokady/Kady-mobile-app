// app/_layout.tsx
import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useFonts, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from '../src/components/Toast';
import { useColors } from '../src/theme/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Sora_600SemiBold,
        Sora_700Bold,
        Sora_800ExtraBold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
    });
    // Ne jamais bloquer l'app si le chargement d'une police échoue : on affiche
    // avec des polices de repli plutôt que de rester sur un écran vide.
    const ready = loaded || !!error;

    const c = useColors();

    const onReady = useCallback(async () => {
        if (ready) await SplashScreen.hideAsync();
    }, [ready]);

    if (!ready) return null;

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: c.bg[0] }} onLayout={onReady}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: c.bg[0] },
                        animation: 'slide_from_right',
                    }}
                />
                <Toast />
            </View>
        </SafeAreaProvider>
    );
}
