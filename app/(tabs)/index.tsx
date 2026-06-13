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
        {/* Header */}
        <View
          className="bg-primary px-5 pb-6 rounded-b-[32px]"
          style={{ paddingTop: insets.top + 12 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-white/70 text-sm">
                Hello, {user?.name?.split(" ")[0] ?? "Learner"} 👋
              </Text>
              <Text className="text-white text-xl font-bold mt-0.5">
                What do you want to learn?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              className="w-11 h-11 rounded-full bg-white/20 items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-11 h-11 rounded-full"
                />
              ) : (
                <Text className="text-white font-bold text-base">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white rounded-xl px-4 h-12 gap-2">
            <Ionicons
              name="search-outline"
              size={18}
              color={COLORS.textMuted}
            />
            <TextInput
              className="flex-1 text-text text-sm"
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
                    className={`px-4 py-2 rounded-full border ${
                      activeCategory === cat
                        ? "bg-primary border-primary"
                        : "bg-card border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        activeCategory === cat ? "text-white" : "text-textMuted"
                      }`}
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
                  <Text className="text-text font-bold text-base">
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
                <Text className="text-text font-bold text-base">
                  {search.length > 0
                    ? `Results for "${search}"`
                    : activeCategory !== "All"
                      ? `${activeCategory} Courses`
                      : "All Courses"}
                </Text>
                <Text className="text-textMuted text-xs">
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
                  <Text className="text-textMuted text-base mt-3">
                    No courses found
                  </Text>
                  <Text className="text-textMuted text-sm mt-1">
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
  );
}
