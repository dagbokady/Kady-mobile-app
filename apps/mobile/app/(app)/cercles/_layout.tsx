// app/(app)/cercles/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function CerclesLayout() {
    return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
