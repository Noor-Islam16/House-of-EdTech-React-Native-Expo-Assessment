import { isValidAvatar } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore, useCourseStore, usePreferenceStore } from "@src/store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconBg: string;
  iconColor: string;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showArrow?: boolean;
}

const SettingRow = ({
  icon,
  iconBg,
  iconColor,
  label,
  onPress,
  right,
  showArrow = true,
}: SettingRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center px-4 py-3.5"
  >
    <View
      className="w-9 h-9 rounded-xl items-center justify-center mr-3"
      style={{ backgroundColor: iconBg }}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <Text className="text-text font-semibold text-sm flex-1">{label}</Text>
    {right ??
      (showArrow && (
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      ))}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, setUser } = useAuthStore();
  const { bookmarks, enrollments, completedCourses } = useCourseStore();
  const { theme } = usePreferenceStore();

  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [editLoading, setEditLoading] = useState(false);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      if (user) setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setEditLoading(true);
    try {
      if (user)
        setUser({ ...user, name: editName.trim(), email: editEmail.trim() });
      setEditVisible(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const avatarSource = isValidAvatar(user?.avatar)
    ? { uri: user!.avatar }
    : require("../../assets/images/avatar.png");

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View
          className="bg-primary overflow-hidden"
          style={{ paddingTop: insets.top + 16, paddingBottom: 48 }}
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

          <View className="px-6">
            <Text
              className="text-white text-2xl tracking-widest uppercase mb-5"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              My Profile
            </Text>

            {/* Avatar + name */}
            <View className="items-center">
              <TouchableOpacity
                onPress={handlePickAvatar}
                activeOpacity={0.85}
                className="relative"
              >
                <View
                  className="w-24 h-24 rounded-3xl overflow-hidden bg-white/20"
                  style={{
                    borderWidth: 3,
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                >
                  <Image
                    source={avatarSource}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>
                <View
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center"
                  style={{ elevation: 4 }}
                >
                  <Ionicons name="camera" size={15} color={COLORS.primary} />
                </View>
              </TouchableOpacity>

              <Text
                className="text-white text-2xl mt-3"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {user?.name ?? "User"}
              </Text>
              <Text
                className="text-white/60 text-sm mt-0.5"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                {user?.email ?? ""}
              </Text>
            </View>
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
          {/* Stats */}
          <View className="flex-row px-5 gap-3 mt-6">
            <TouchableOpacity
              className="flex-1 bg-card rounded-2xl p-4 items-center"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
              onPress={() => router.push("/(tabs)/webview")}
              activeOpacity={0.8}
            >
              <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mb-2">
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text
                className="text-text text-xl"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {enrollments.length}
              </Text>
              <Text
                className="text-textMuted text-xs mt-0.5"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                Enrolled
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-card rounded-2xl p-4 items-center"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
              onPress={() => router.push("/(tabs)/bookmarks")}
              activeOpacity={0.8}
            >
              <View className="w-10 h-10 bg-warning/10 rounded-xl items-center justify-center mb-2">
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={COLORS.warning}
                />
              </View>
              <Text
                className="text-text text-xl"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {bookmarks.length}
              </Text>
              <Text
                className="text-textMuted text-xs mt-0.5"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                Bookmarks
              </Text>
            </TouchableOpacity>

            <View
              className="flex-1 bg-card rounded-2xl p-4 items-center"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View className="w-10 h-10 bg-success/10 rounded-xl items-center justify-center mb-2">
                <Ionicons
                  name="trophy-outline"
                  size={20}
                  color={COLORS.success}
                />
              </View>
              <Text
                className="text-text text-xl"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {completedCourses.length}
              </Text>
              <Text
                className="text-textMuted text-xs mt-0.5"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                Completed
              </Text>
            </View>
          </View>

          {/* Account */}
          <View
            className="mx-5 mt-4 bg-card rounded-2xl overflow-hidden"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-textMuted text-xs uppercase tracking-widest px-4 pt-4 pb-2"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Account
            </Text>
            <SettingRow
              icon="person-outline"
              iconBg="#EFF6FF"
              iconColor={COLORS.primary}
              label="Edit Profile"
              onPress={() => {
                setEditName(user?.name ?? "");
                setEditEmail(user?.email ?? "");
                setEditVisible(true);
              }}
            />
            <View className="h-px bg-border mx-4" />
            <SettingRow
              icon="shield-checkmark-outline"
              iconBg="#DCFCE7"
              iconColor={COLORS.success}
              label="Privacy & Security"
              onPress={() =>
                Alert.alert("Coming Soon", "Privacy settings coming soon.")
              }
            />
            <View className="h-px bg-border mx-4" />
            <SettingRow
              icon="help-circle-outline"
              iconBg="#F0F9FF"
              iconColor={COLORS.secondary}
              label="Help & Support"
              onPress={() => Alert.alert("Coming Soon", "Support coming soon.")}
            />
          </View>

          {/* App info */}
          <View
            className="mx-5 mt-4 bg-card rounded-2xl overflow-hidden"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-textMuted text-xs uppercase tracking-widest px-4 pt-4 pb-2"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              App
            </Text>
            <SettingRow
              icon="information-circle-outline"
              iconBg="#F8FAFC"
              iconColor={COLORS.textMuted}
              label="App Version"
              showArrow={false}
              right={
                <Text
                  className="text-textMuted text-sm"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  v1.0.0
                </Text>
              }
            />
          </View>

          {/* Logout */}
          <View className="mx-5 mt-4 mb-8">
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.85}
              className="bg-red-50 border border-red-100 rounded-2xl flex-row items-center justify-center py-4 gap-2"
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text
                className="text-error text-sm"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className="bg-card rounded-t-[32px] px-5 pt-5 pb-8">
            <View className="w-10 h-1 bg-border rounded-full self-center mb-5" />
            <View className="flex-row items-center justify-between mb-5">
              <Text
                className="text-text text-lg"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text className="text-text font-semibold text-sm mb-2">
              Display Name
            </Text>
            <View
              className="flex-row items-center bg-background border border-border rounded-xl px-4 mb-4"
              style={{ height: 52 }}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={COLORS.textMuted}
              />
              <TextInput
                className="flex-1 ml-3 text-text text-sm"
                style={{ fontFamily: "Nunito-Regular" }}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                value={editName}
                onChangeText={setEditName}
              />
            </View>

            <Text className="text-text font-semibold text-sm mb-2">Email</Text>
            <View
              className="flex-row items-center bg-background border border-border rounded-xl px-4 mb-6"
              style={{ height: 52 }}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={COLORS.textMuted}
              />
              <TextInput
                className="flex-1 ml-3 text-text text-sm"
                style={{ fontFamily: "Nunito-Regular" }}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={editEmail}
                onChangeText={setEditEmail}
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={editLoading}
              className="bg-primary rounded-2xl items-center justify-center"
              style={{
                height: 54,
                elevation: 4,
                shadowColor: COLORS.primary,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
              activeOpacity={0.85}
            >
              {editLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  className="text-white text-base"
                  style={{ fontFamily: "Nunito-Bold" }}
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
