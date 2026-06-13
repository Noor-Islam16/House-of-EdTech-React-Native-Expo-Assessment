import { COLORS } from "@src/constants/colors";
import { ActivityIndicator, Text, View } from "react-native";

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading..." }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text className="text-textMuted text-sm mt-3">{message}</Text>
    </View>
  );
}
