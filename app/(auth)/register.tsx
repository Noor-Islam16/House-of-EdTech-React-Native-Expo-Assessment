import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLORS } from "@src/constants/colors";
import { authApi } from "@src/services/api/authApi";
import { useAuthStore } from "@src/store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
      label: "Email address",
      icon: "mail-outline",
      placeholder: "you@example.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      name: "password",
      label: "Password",
      icon: "lock-closed-outline",
      placeholder: "Min. 6 characters",
      secure: true,
      toggle: true,
      show: showPassword,
      setShow: setShowPassword,
      autoCapitalize: "none",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      icon: "shield-checkmark-outline",
      placeholder: "Re-enter your password",
      secure: true,
      toggle: true,
      show: showConfirm,
      setShow: setShowConfirm,
      autoCapitalize: "none",
    },
  ];

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
      enableAutomaticScroll
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          className="bg-primary overflow-hidden"
          style={{ paddingTop: insets.top + 16, paddingBottom: 48 }}
        >
          {/* Decorative circles */}
          <View
            className="absolute bg-white/10 rounded-full"
            style={{ width: 180, height: 180, top: -50, right: -40 }}
          />
          <View
            className="absolute bg-white/5 rounded-full"
            style={{ width: 110, height: 110, top: 50, right: 55 }}
          />
          <View
            className="absolute bg-white/10 rounded-full"
            style={{ width: 70, height: 70, bottom: -15, left: -15 }}
          />

          <View className="px-6">
            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            {/* Icon pill */}
            <View className="bg-white/20 self-start rounded-2xl p-3 mb-5">
              <Ionicons name="school" size={26} color="white" />
            </View>

            <Text className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
              Get started
            </Text>
            <Text className="text-white text-4xl font-bold leading-tight">
              Create your{"\n"}account
            </Text>
          </View>
        </View>

        {/* ── Sheet overlay ── */}
        <View
          className="bg-background"
          style={{
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -24,
          }}
        >
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

            {fields.map((f) => (
              <View key={f.name} className="mb-4">
                <Text className="text-text text-sm font-semibold mb-2 ml-1">
                  {f.label}
                </Text>
                <Controller
                  control={control}
                  name={f.name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      className={`flex-row items-center bg-card rounded-2xl px-4 border ${
                        errors[f.name] ? "border-red-400" : "border-border"
                      }`}
                      style={{ height: 54 }}
                    >
                      <View className="bg-primary/10 rounded-xl p-1.5 mr-3">
                        <Ionicons
                          name={f.icon}
                          size={17}
                          color={COLORS.primary}
                        />
                      </View>
                      <TextInput
                        className="flex-1 text-text text-sm"
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
                          className="p-1.5"
                        >
                          <Ionicons
                            name={f.show ? "eye-off-outline" : "eye-outline"}
                            size={18}
                            color={COLORS.textMuted}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                />
                {errors[f.name] && (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1">
                    {errors[f.name]?.message}
                  </Text>
                )}
              </View>
            ))}

            {/* Submit */}
            <TouchableOpacity
              className="bg-primary rounded-2xl items-center justify-center mt-4"
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
                <Text className="text-white font-bold text-base tracking-wide">
                  Create Account
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

            {/* Login link */}
            <View className="flex-row justify-center items-center gap-1">
              <Text className="text-textMuted text-sm">
                Already have an account?
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-bold text-sm">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
