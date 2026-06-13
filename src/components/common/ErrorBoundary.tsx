import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background items-center justify-center px-8">
          <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={COLORS.error}
            />
          </View>
          <Text className="text-text font-bold text-xl text-center">
            Something went wrong
          </Text>
          <Text className="text-textMuted text-sm text-center mt-2 leading-5">
            An unexpected error occurred. Please try again.
          </Text>
          <TouchableOpacity
            className="bg-primary px-8 py-3 rounded-2xl mt-6"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
