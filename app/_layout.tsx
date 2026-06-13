import "@/global.css";
import { useAuthStore, useCourseStore, usePreferenceStore } from "@src/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 min
    },
  },
});

export default function RootLayout() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateCourses = useCourseStore((s) => s.hydrate);
  const hydratePrefs = usePreferenceStore((s) => s.hydrate);
  const theme = usePreferenceStore((s) => s.theme);

  useEffect(() => {
    Promise.all([hydrateAuth(), hydrateCourses(), hydratePrefs()]);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="course/[id]"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
