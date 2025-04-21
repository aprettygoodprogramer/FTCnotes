import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false, // Doesn't show header when switching tabs
      }}
    />
  )
}
