import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { courseApi } from "@src/services/api/courseApi";
import { useAuthStore, useCourseStore } from "@src/store";
import type { Course } from "@src/types";
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

const CourseCard = ({
  item,
  onBookmark,
  isBookmarked,
}: {
  item: Course;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
}) => (
  <TouchableOpacity
    className="bg-card rounded-2xl mr-4 overflow-hidden"
    style={{ width: 220 }}
    onPress={() => router.push(`/course/${item.id}`)}
    activeOpacity={0.85}
  >
    <Image
      source={{ uri: item.thumbnail }}
      className="w-full"
      style={{ height: 150 }}
      resizeMode="cover"
    />
    <View className="p-3">
      <View className="flex-row items-center mb-1">
        <View className="bg-primary/10 px-2 py-0.5 rounded-full">
          <Text className="text-primary text-xs font-semibold">
            {item.category}
          </Text>
        </View>
      </View>
      <Text className="text-text font-bold text-sm mb-1" numberOfLines={2}>
        {item.title}
      </Text>
      <View className="flex-row items-center justify-between mt-1">
        <View className="flex-row items-center gap-1">
          <Image
            source={{ uri: item.instructor.avatar }}
            className="w-5 h-5 rounded-full"
          />
          <Text className="text-textMuted text-xs" numberOfLines={1}>
            {item.instructor.firstName}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={12} color={COLORS.warning} />
          <Text className="text-xs text-textMuted">{item.rating}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-primary font-bold text-sm">${item.price}</Text>
        <TouchableOpacity onPress={() => onBookmark(item.id)} className="p-1">
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={isBookmarked ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const AllCourseCard = ({
  item,
  onBookmark,
  isBookmarked,
}: {
  item: Course;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
}) => (
  <TouchableOpacity
    className="bg-card rounded-2xl mb-3 flex-row overflow-hidden"
    style={{
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }}
    onPress={() => router.push(`/course/${item.id}`)}
    activeOpacity={0.85}
  >
    <Image
      source={{ uri: item.thumbnail }}
      style={{ width: 110, height: "100%", minHeight: 100 }}
      resizeMode="cover"
    />
    <View className="flex-1 p-3 justify-between">
      <View>
        <Text className="text-text font-bold text-sm mb-0.5" numberOfLines={2}>
          {item.title}
        </Text>
        <View className="flex-row items-center gap-1 mb-1">
          <Image
            source={{ uri: item.instructor.avatar }}
            className="w-4 h-4 rounded-full"
          />
          <Text className="text-textMuted text-xs">
            {item.instructor.firstName} {item.instructor.lastName}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={12} color={COLORS.warning} />
          <Text className="text-xs text-textMuted">{item.rating}</Text>
        </View>
        <Text className="text-primary font-bold text-sm">${item.price}</Text>
        <TouchableOpacity onPress={() => onBookmark(item.id)} className="p-1">
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={16}
            color={isBookmarked ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

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
            <View>
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
          <View className="flex-1 items-center justify-center py-20">
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
                  contentContainerStyle={{ paddingHorizontal: 20 }}
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
                  <AllCourseCard
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
