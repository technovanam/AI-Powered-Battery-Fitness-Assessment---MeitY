import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../i18n';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#090d16',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'MeitY Battery Fitness AI', headerShown: false }}
        />
        <Stack.Screen
          name="athlete-setup"
          options={{ title: 'Athlete Registration' }}
        />
        <Stack.Screen
          name="battery-hub"
          options={{ title: 'Fitness Assessment Hub' }}
        />
        <Stack.Screen
          name="test-ai-camera"
          options={{ title: 'AI Live Assessment', headerShown: false }}
        />
        <Stack.Screen
          name="test-manual-entry"
          options={{ title: 'Manual Assessment' }}
        />
        <Stack.Screen
          name="report-card"
          options={{ title: 'Fitness Report Card' }}
        />
        <Stack.Screen
          name="sync-center"
          options={{ title: 'Sync & Privacy Center' }}
        />
      </Stack>
    </>
  );
}
