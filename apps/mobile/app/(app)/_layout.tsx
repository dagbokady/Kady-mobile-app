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
        </Tabs>
    );
}
