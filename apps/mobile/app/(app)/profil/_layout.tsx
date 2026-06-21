// app/(app)/profil/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function ProfilLayout() {
    return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
