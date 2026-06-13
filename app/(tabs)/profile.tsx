import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore, useCourseStore, usePreferenceStore } from "@src/store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
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
  const { bookmarks, enrollments } = useCourseStore();
  const { theme, setTheme, notificationsEnabled, toggleNotifications } =
    usePreferenceStore();

  const [avatarLoading, setAvatarLoading] = useState(false);

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
      setAvatarLoading(true);
      // update local avatar optimistically
      if (user) {
        setUser({ ...user, avatar: result.assets[0].uri });
      }
      setAvatarLoading(false);
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

  const isDark = theme === "dark";

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="bg-primary px-5 pb-8 rounded-b-[36px]"
          style={{ paddingTop: insets.top + 12 }}
        >
          <Text className="text-white text-2xl font-bold mb-6">Profile</Text>

          {/* Avatar + info */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handlePickAvatar}
              activeOpacity={0.85}
              className="relative"
            >
              <View
                className="w-24 h-24 rounded-full bg-white/20 items-center justify-center overflow-hidden"
                style={{
                  borderWidth: 3,
                  borderColor: "rgba(255,255,255,0.4)",
                }}
              >
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={{ width: 96, height: 96 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text
                    style={{ fontSize: 36, color: "white", fontWeight: "800" }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </Text>
                )}
              </View>
              {/* Camera badge */}
              <View
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera" size={15} color={COLORS.primary} />
              </View>
            </TouchableOpacity>

            <Text className="text-white font-bold text-xl mt-3">
              {user?.name ?? "User"}
            </Text>
            <Text className="text-white/70 text-sm mt-0.5">
              {user?.email ?? ""}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row px-5 gap-3 mt-5">
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
            <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mb-2">
              <Ionicons name="book-outline" size={20} color={COLORS.primary} />
            </View>
            <Text className="text-text font-bold text-xl">
              {enrollments.length}
            </Text>
            <Text className="text-textMuted text-xs mt-0.5">Enrolled</Text>
          </View>

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
            <View className="w-10 h-10 bg-warning/10 rounded-xl items-center justify-center mb-2">
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={COLORS.warning}
              />
            </View>
            <Text className="text-text font-bold text-xl">
              {bookmarks.length}
            </Text>
            <Text className="text-textMuted text-xs mt-0.5">Bookmarks</Text>
          </View>

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
            <Text className="text-text font-bold text-xl">0</Text>
            <Text className="text-textMuted text-xs mt-0.5">Completed</Text>
          </View>
        </View>

        {/* Preferences */}
        <View
          className="mx-5 mt-5 bg-card rounded-2xl overflow-hidden"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text className="text-textMuted text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-2">
            Preferences
          </Text>

          <SettingRow
            icon="moon-outline"
            iconBg="#EDE9FE"
            iconColor="#7C3AED"
            label="Dark Mode"
            showArrow={false}
            right={
              <Switch
                value={isDark}
                onValueChange={(v) => setTheme(v ? "dark" : "light")}
                trackColor={{
                  false: COLORS.border,
                  true: COLORS.primary,
                }}
                thumbColor="white"
              />
            }
          />

          <View className="h-px bg-border mx-4" />

          <SettingRow
            icon="notifications-outline"
            iconBg="#FEF3C7"
            iconColor="#D97706"
            label="Notifications"
            showArrow={false}
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: COLORS.border,
                  true: COLORS.primary,
                }}
                thumbColor="white"
              />
            }
          />
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
          <Text className="text-textMuted text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-2">
            Account
          </Text>

          <SettingRow
            icon="person-outline"
            iconBg="#EFF6FF"
            iconColor={COLORS.primary}
            label="Edit Profile"
            onPress={() =>
              Alert.alert("Coming Soon", "Edit profile coming soon.")
            }
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
          <Text className="text-textMuted text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-2">
            App
          </Text>

          <SettingRow
            icon="information-circle-outline"
            iconBg="#F8FAFC"
            iconColor={COLORS.textMuted}
            label="App Version"
            showArrow={false}
            right={<Text className="text-textMuted text-sm">v1.0.0</Text>}
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
            <Text className="text-error font-bold text-sm">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
