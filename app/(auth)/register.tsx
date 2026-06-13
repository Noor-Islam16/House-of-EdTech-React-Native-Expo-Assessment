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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface FieldConfig {
  name: keyof RegisterForm;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder: string;
  secure?: boolean;
  toggle?: boolean;
  show?: boolean;
  setShow?: (v: boolean) => void;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "words";
}

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setApiError(null);
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      const res = await authApi.login({
        email: data.email,
        password: data.password,
      });
      await login(res.user, res.tokens.accessToken);
      router.replace("/(tabs)");
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ?? "Registration failed. Try again.",
      );
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      icon: "person-outline",
      placeholder: "Choose a username",
      autoCapitalize: "none",
    },
    {
      name: "email",
      label: "Email",
      icon: "mail-outline",
      placeholder: "Enter your email",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      name: "password",
      label: "Password",
      icon: "lock-closed-outline",
      placeholder: "Create a password",
      secure: true,
      toggle: true,
      show: showPassword,
      setShow: setShowPassword,
      autoCapitalize: "none",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      icon: "lock-closed-outline",
      placeholder: "Confirm your password",
      secure: true,
      toggle: true,
      show: showConfirm,
      setShow: setShowConfirm,
      autoCapitalize: "none",
    },
  ];

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
        {/* Header */}
        <View
          className="bg-primary px-5 pb-8 rounded-b-[36px]"
          style={{ paddingTop: insets.top + 12 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mb-5"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="school" size={28} color="white" />
          </View>

          <Text className="text-white text-3xl font-bold">Create Account</Text>
          <Text className="text-white/70 text-sm mt-1">
            Start your learning journey today
          </Text>
        </View>

        {/* Form */}
        <View className="px-5 pt-6 pb-8">
          {/* API Error */}
          {apiError && (
            <View className="flex-row items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text className="text-red-600 text-sm flex-1">{apiError}</Text>
            </View>
          )}

          {fields.map((f) => (
            <View key={f.name} className="mb-4">
              <Text className="text-text text-sm font-semibold mb-2">
                {f.label}
              </Text>
              <Controller
                control={control}
                name={f.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center bg-card rounded-xl px-4 border ${
                      errors[f.name] ? "border-red-400" : "border-border"
                    }`}
                    style={{ height: 52 }}
                  >
                    <Ionicons
                      name={f.icon}
                      size={19}
                      color={COLORS.textMuted}
                    />
                    <TextInput
                      className="flex-1 text-text text-sm ml-3"
                      placeholder={f.placeholder}
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={f.secure && !f.show}
                      autoCapitalize={f.autoCapitalize ?? "none"}
                      keyboardType={f.keyboardType ?? "default"}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    {f.toggle && (
                      <TouchableOpacity
                        onPress={() => f.setShow?.(!f.show)}
                        className="p-1"
                      >
                        <Ionicons
                          name={f.show ? "eye-off-outline" : "eye-outline"}
                          size={19}
                          color={COLORS.textMuted}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              {errors[f.name] && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors[f.name]?.message}
                </Text>
              )}
            </View>
          ))}

          {/* Submit */}
          <TouchableOpacity
            className="bg-primary rounded-xl items-center justify-center mt-3"
            style={{
              height: 52,
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
              <Text className="text-white font-bold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-textMuted text-sm mx-4">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Login link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-textMuted text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold text-sm">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
