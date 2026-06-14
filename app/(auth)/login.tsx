import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLORS } from "@src/constants/colors";
import { authApi } from "@src/services/api/authApi";
import { useAuthStore } from "@src/store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError(null);
      const res = await authApi.login(data);
      await login(res.user, res.tokens.accessToken);
      router.replace("/(tabs)");
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ?? "Login failed. Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          className="bg-primary overflow-hidden"
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 48,
            minHeight: 260,
          }}
        >
          {/* Decorative circles */}
          <View
            className="absolute bg-white/10 rounded-full"
            style={{ width: 200, height: 200, top: -60, right: -50 }}
          />
          <View
            className="absolute bg-white/5 rounded-full"
            style={{ width: 130, height: 130, top: 40, right: 60 }}
          />
          <View
            className="absolute bg-white/10 rounded-full"
            style={{ width: 80, height: 80, bottom: -20, left: -20 }}
          />

          <View className="px-6 items-center">
            {/* Logo — no bg */}
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: 80,
                height: undefined,
                aspectRatio: 1,
                marginBottom: 10,
              }}
              resizeMode="contain"
            />

            <Text className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
              Welcome back
            </Text>
            <Text
              className="text-white text-4xl leading-tight text-center"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Sign in to{"\n"}your account
            </Text>
          </View>
        </View>

        {/* ── Wave cutout illusion ── */}
        <View className="bg-primary h-6 -mb-6" />
        <View
          className="bg-background"
          style={{
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -24,
          }}
        >
          {/* ── Form Card ── */}
          <View className="px-6 pt-8 pb-10">
            {/* API Error */}
            {apiError && (
              <View className="flex-row items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
                <View className="bg-red-100 rounded-full p-1">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={COLORS.error}
                  />
                </View>
                <Text className="text-red-600 text-sm flex-1 font-medium">
                  {apiError}
                </Text>
              </View>
            )}

            {/* Email */}
            <View className="mb-4">
              <Text className="text-text font-semibold text-sm mb-2 ml-1">
                Email address
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center bg-card rounded-2xl px-4 border ${
                      errors.email ? "border-red-400" : "border-border"
                    }`}
                    style={{ height: 54 }}
                  >
                    <View className="bg-primary/10 rounded-xl p-1.5 mr-3">
                      <Ionicons
                        name="mail-outline"
                        size={17}
                        color={COLORS.primary}
                      />
                    </View>
                    <TextInput
                      className="flex-1 text-text text-sm"
                      style={{ fontFamily: "Nunito-Regular" }}
                      placeholder="you@example.com"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text
                  className="text-red-500 text-xs mt-1.5 ml-1"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-2">
              <Text className="text-text font-semibold text-sm mb-2 ml-1">
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center bg-card rounded-2xl px-4 border ${
                      errors.password ? "border-red-400" : "border-border"
                    }`}
                    style={{ height: 54 }}
                  >
                    <View className="bg-primary/10 rounded-xl p-1.5 mr-3">
                      <Ionicons
                        name="lock-closed-outline"
                        size={17}
                        color={COLORS.primary}
                      />
                    </View>
                    <TextInput
                      className="flex-1 text-text text-sm"
                      style={{ fontFamily: "Nunito-Regular" }}
                      placeholder="Min. 6 characters"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                      className="p-1.5"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text
                  className="text-red-500 text-xs mt-1.5 ml-1"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Forgot password */}
            <View className="items-end mb-7">
              <TouchableOpacity>
                <Text className="text-primary text-sm font-semibold">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-2xl items-center justify-center"
              style={{
                height: 54,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 8,
              }}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className="text-white text-base tracking-wide"
                  style={{ fontFamily: "Nunito-Bold" }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="text-textMuted text-xs mx-4 font-medium">
                OR
              </Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center items-center gap-1">
              <Text
                className="text-textMuted text-sm"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                New here?
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text
                    className="text-primary text-sm"
                    style={{ fontFamily: "Nunito-Bold" }}
                  >
                    Create an account
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
