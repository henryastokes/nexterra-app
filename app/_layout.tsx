import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="insights" options={{ presentation: 'card' }} />
      <Stack.Screen name="research/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="profile" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="community" options={{ presentation: 'card' }} />
      <Stack.Screen name="funded" options={{ presentation: 'card' }} />
      <Stack.Screen name="user/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="messages" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="chat/compose" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="discussions" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="discussion/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="collaboration" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="collaboration/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="vote/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <RootLayoutNav />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
