import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Home } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  const router = useRouter();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        router.replace("/");
      } catch {
        setShowFallback(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 3000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Redirecting...", headerShown: false }} />
      <View style={styles.container}>
        {!showFallback ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading NexTerra...</Text>
          </View>
        ) : (
          <View style={styles.fallbackContainer}>
            <View style={styles.iconCircle}>
              <Home size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Welcome to NexTerra</Text>
            <Text style={styles.subtitle}>Tap below to get started</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  fallbackContainer: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
