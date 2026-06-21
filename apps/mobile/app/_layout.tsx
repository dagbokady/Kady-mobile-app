// app/_layout.tsx
import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useFonts, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        Sora_600SemiBold,
        Sora_700Bold,
        Sora_800ExtraBold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
    });

    const onReady = useCallback(async () => {
        if (loaded) await SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} onLayout={onReady}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#FFFFFF' },
                        animation: 'slide_from_right',
                    }}
                />
            </View>
        </SafeAreaProvider>
    );
}
