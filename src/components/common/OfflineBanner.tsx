import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useNetwork } from "@src/hooks/useNetwork";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function OfflineBanner() {
  const { isOnline, isChecking } = useNetwork();
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    if (isChecking) return;
    Animated.spring(translateY, {
      toValue: isOnline ? -60 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isOnline, isChecking]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      <View
        className="flex-row items-center justify-center gap-2 py-3 px-5"
        style={{ backgroundColor: COLORS.error }}
      >
        <Ionicons name="wifi-outline" size={16} color="white" />
        <Text className="text-white font-bold text-xs">
          No Internet Connection
        </Text>
      </View>
    </Animated.View>
  );
}
