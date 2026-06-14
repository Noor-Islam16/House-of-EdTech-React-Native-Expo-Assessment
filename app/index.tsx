import { COLORS } from "@src/constants/colors";
import { useAuthStore } from "@src/store";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";

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
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // dots loop
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

    // 3-5s timer — navigate after 4s regardless of auth loading
    const timer = setTimeout(() => {
      dotLoop.stop();
      if (!isLoading) {
        router.replace(isAuthenticated ? "/(tabs)" : "/(auth)/login");
      } else {
        // poll until isLoading done
        const poll = setInterval(() => {
          const auth = useAuthStore.getState();
          if (!auth.isLoading) {
            clearInterval(poll);
            router.replace(auth.isAuthenticated ? "/(tabs)" : "/(auth)/login");
          }
        }, 100);
      }
    }, 4000);

    return () => {
      dotLoop.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Decorative circles */}
      <View
        className="absolute bg-white/10 rounded-full"
        style={{ width: 300, height: 300, top: -80, right: -80 }}
      />
      <View
        className="absolute bg-white/5 rounded-full"
        style={{ width: 200, height: 200, bottom: -40, left: -60 }}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 200, height: undefined, aspectRatio: 1 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text — right below logo, no gap */}
      <Animated.View style={{ opacity: textOpacity, alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontFamily: "Nunito-Bold",
            letterSpacing: 1,
            textAlign: "center",
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
