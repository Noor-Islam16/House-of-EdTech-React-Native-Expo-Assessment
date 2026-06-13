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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
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
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + hp("2%"),
            paddingBottom: hp("4%"),
            paddingHorizontal: wp("6%"),
            backgroundColor: COLORS.primary,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View
            style={{
              width: wp("14%"),
              height: wp("14%"),
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: hp("2%"),
            }}
          >
            <Ionicons name="school" size={wp("7%")} color="white" />
          </View>
          <Text
            style={{
              color: "white",
              fontSize: wp("7%"),
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: wp("4%"),
              marginTop: 4,
            }}
          >
            Continue your learning journey
          </Text>
        </View>

        {/* Form */}
        <View style={{ paddingHorizontal: wp("6%"), paddingTop: hp("4%") }}>
          {/* API Error */}
          {apiError && (
            <View
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.3)",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: wp("4%"),
                paddingVertical: hp("1.5%"),
                marginBottom: hp("2%"),
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text
                style={{ color: COLORS.error, fontSize: wp("3.5%"), flex: 1 }}
              >
                {apiError}
              </Text>
            </View>
          )}

          {/* Email */}
          <View style={{ marginBottom: hp("2%") }}>
            <Text
              style={{
                color: COLORS.text,
                fontWeight: "600",
                marginBottom: hp("1%"),
                fontSize: wp("3.5%"),
              }}
            >
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.card,
                    borderWidth: 1,
                    borderColor: errors.email ? COLORS.error : COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: wp("4%"),
                    height: hp("7%"),
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.textMuted}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: wp("3%"),
                      color: COLORS.text,
                      fontSize: wp("4%"),
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text
                style={{
                  color: COLORS.error,
                  fontSize: wp("3%"),
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View style={{ marginBottom: hp("3%") }}>
            <Text
              style={{
                color: COLORS.text,
                fontWeight: "600",
                marginBottom: hp("1%"),
                fontSize: wp("3.5%"),
              }}
            >
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.card,
                    borderWidth: 1,
                    borderColor: errors.password ? COLORS.error : COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: wp("4%"),
                    height: hp("7%"),
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.textMuted}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: wp("3%"),
                      color: COLORS.text,
                      fontSize: wp("4%"),
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text
                style={{
                  color: COLORS.error,
                  fontSize: wp("3%"),
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              height: hp("7%"),
              alignItems: "center",
              justifyContent: "center",
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: wp("4%"),
                }}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: hp("3%"),
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
            />
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: wp("3.5%"),
                marginHorizontal: wp("4%"),
              }}
            >
              or
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
            />
          </View>

          {/* Register Link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: COLORS.textMuted, fontSize: wp("3.5%") }}>
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: wp("3.5%"),
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
