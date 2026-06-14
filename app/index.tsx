import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore } from "@src/store";
import { Redirect } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // logo pop in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // loading dots loop
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity1, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity2, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity3, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );
    dotLoop.start();
    return () => dotLoop.stop();
  }, []);

  if (!isLoading) {
    return isAuthenticated ? (
      <Redirect href="/(tabs)" />
    ) : (
      <Redirect href="/(auth)/login" />
    );
  }

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Background circles */}
      <View
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "rgba(255,255,255,0.05)",
          top: -80,
          right: -80,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "rgba(255,255,255,0.05)",
          bottom: -40,
          left: -60,
        }}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <Ionicons name="school" size={48} color="white" />
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: 36,
            fontWeight: "800",
            letterSpacing: 1,
          }}
        >
          EduFlex
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            marginTop: 6,
            letterSpacing: 0.5,
          }}
        >
          Learn Anything, Anywhere
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 48,
          alignItems: "center",
        }}
      >
        {[dotOpacity1, dotOpacity2, dotOpacity3].map((dot, i) => (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
              opacity: dot,
            }}
          />
        ))}
      </View>
    </View>
  );
}
