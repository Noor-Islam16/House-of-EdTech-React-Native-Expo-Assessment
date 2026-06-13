import { ErrorBoundary, OfflineBanner } from "@src/components/common";
import { useNotifications } from "@src/hooks/useNotifications";
import { useAuthStore, useCourseStore, usePreferenceStore } from "@src/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AppInit() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateCourses = useCourseStore((s) => s.hydrate);
  const hydratePrefs = usePreferenceStore((s) => s.hydrate);
  const theme = usePreferenceStore((s) => s.theme);
  const { requestPermissions, scheduleReminderNotification } =
    useNotifications();

  useEffect(() => {
    Promise.all([hydrateAuth(), hydrateCourses(), hydratePrefs()]);
  }, []);

  useEffect(() => {
    requestPermissions().then((granted) => {
      if (granted) scheduleReminderNotification();
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="course/[id]"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppInit />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
