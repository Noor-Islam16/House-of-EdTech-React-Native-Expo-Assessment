import { isValidAvatar } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { CourseCard, CourseListCard } from "@src/components/ui";
import { COLORS } from "@src/constants/colors";
import { courseApi } from "@src/services/api/courseApi";
import { useAuthStore, useCourseStore } from "@src/store";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORIES = [
  "All",
  "React Native",
  "Flutter",
  "Backend",
  "UI/UX",
  "AI",
  "Cloud",
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((s) => s.user);
  const { bookmarks, toggleBookmark, setCourses } = useCourseStore();

  const {
    data: courses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const data = await courseApi.getCourses();
      setCourses(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.firstName.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        activeCategory === "All" ||
        c.category.toLowerCase().includes(activeCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [courses, search, activeCategory]);

  const featured = useMemo(() => courses.slice(0, 5), [courses]);

  return (
    <View className="flex-1 bg-background">
      {/* ── Fixed Header ── */}
      <View
        className="bg-primary overflow-hidden"
        style={{ paddingTop: insets.top + 16, paddingBottom: 48 }}
      >
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
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-1 mr-3">
              <Text className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
                Hello, {user?.name?.split(" ")[0] ?? "Learner"}
              </Text>
              <Text
                className="text-white text-3xl leading-tight"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                What will you{"\n"}learn today?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              className="rounded-2xl overflow-hidden bg-white/20"
              style={{ width: 52, height: 52 }}
            >
              <Image
                source={
                  isValidAvatar(user?.avatar)
                    ? { uri: user!.avatar }
                    : require("../../assets/images/avatar.png")
                }
                style={{ width: 52, height: 52 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View
            className="flex-row items-center bg-white rounded-2xl px-4 gap-2"
            style={{ height: 50 }}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={COLORS.textMuted}
            />
            <TextInput
              className="flex-1 text-text text-sm"
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Search courses..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <View
        className="flex-1 bg-background"
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          marginTop: -24,
          overflow: "hidden",
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text className="text-textMuted text-sm mt-3">
                Loading courses...
              </Text>
            </View>
          ) : (
            <>
              {/* Categories */}
              <View className="mt-5">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full border ${activeCategory === cat ? "bg-primary border-primary" : "bg-card border-border"}`}
                    >
                      <Text
                        className={`text-sm font-semibold ${activeCategory === cat ? "text-white" : "text-textMuted"}`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Featured */}
              {search.length === 0 && activeCategory === "All" && (
                <View className="mt-5">
                  <View className="flex-row items-center justify-between px-5 mb-3">
                    <Text
                      className="text-text text-base"
                      style={{ fontFamily: "Nunito-Bold" }}
                    >
                      Featured Courses
                    </Text>
                    <Text className="text-primary text-sm font-semibold">
                      See all
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 0 }}
                  >
                    {featured.map((item) => (
                      <CourseCard
                        key={item.id}
                        item={item}
                        isBookmarked={bookmarks.includes(item.id)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* All Courses */}
              <View className="mt-5 px-5">
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    className="text-text text-base"
                    style={{ fontFamily: "Nunito-Bold" }}
                  >
                    {search.length > 0
                      ? `Results for "${search}"`
                      : activeCategory !== "All"
                        ? `${activeCategory} Courses`
                        : "All Courses"}
                  </Text>
                  <Text
                    className="text-textMuted text-xs"
                    style={{ fontFamily: "Nunito-Regular" }}
                  >
                    {filtered.length} courses
                  </Text>
                </View>

                {filtered.length === 0 ? (
                  <View className="items-center py-12">
                    <Ionicons
                      name="search-outline"
                      size={48}
                      color={COLORS.border}
                    />
                    <Text
                      className="text-textMuted text-base mt-3"
                      style={{ fontFamily: "Nunito-Regular" }}
                    >
                      No courses found
                    </Text>
                    <Text
                      className="text-textMuted text-sm mt-1"
                      style={{ fontFamily: "Nunito-Regular" }}
                    >
                      Try a different search
                    </Text>
                  </View>
                ) : (
                  filtered.map((item) => (
                    <CourseListCard
                      key={item.id}
                      item={item}
                      isBookmarked={bookmarks.includes(item.id)}
                      onBookmark={toggleBookmark}
                    />
                  ))
                )}
              </View>

              <View className="h-6" />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
