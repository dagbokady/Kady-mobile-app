// app/(app)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar';

export default function AppLayout() {
    return (
        <Tabs
            initialRouteName="accueil"
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="accueil" options={{ title: 'Accueil' }} />
            <Tabs.Screen name="cercles" options={{ title: 'Cercles' }} />
            <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
            <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
            <Tabs.Screen name="decouvrir" options={{ href: null }} />
            <Tabs.Screen name="creer" options={{ href: null }} />
            <Tabs.Screen name="notifications" options={{ href: null }} />
            <Tabs.Screen name="membre" options={{ href: null }} />
            <Tabs.Screen name="apropos" options={{ href: null }} />
        </Tabs>
    );
}
