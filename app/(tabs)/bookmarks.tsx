import { Ionicons } from "@expo/vector-icons";
import { CourseListCard } from "@src/components/ui";
import { COLORS } from "@src/constants/colors";
import { useCourseStore } from "@src/store";
import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { courses, bookmarks, toggleBookmark } = useCourseStore();

  const bookmarkedCourses = useMemo(
    () => courses.filter((c) => bookmarks.includes(c.id)),
    [courses, bookmarks],
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-5 pb-6 rounded-b-[32px]"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-white text-2xl font-bold">My Bookmarks</Text>
        <Text className="text-white/70 text-sm mt-1">
          {bookmarkedCourses.length} saved{" "}
          {bookmarkedCourses.length === 1 ? "course" : "courses"}
        </Text>
      </View>

      {bookmarkedCourses.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-5">
            <Ionicons
              name="bookmark-outline"
              size={44}
              color={COLORS.primary}
            />
          </View>
          <Text className="text-text font-bold text-xl text-center">
            No Bookmarks Yet
          </Text>
          <Text className="text-textMuted text-sm text-center mt-2 leading-5">
            Save courses you're interested in and find them here anytime.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary px-8 py-3 rounded-2xl mt-6"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text className="text-white font-bold text-sm">Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          {/* Stats bar */}
          <View className="flex-row gap-3 mb-5">
            <View className="flex-1 bg-card rounded-2xl p-4 items-center">
              <Text className="text-primary font-bold text-2xl">
                {bookmarkedCourses.length}
              </Text>
              <Text className="text-textMuted text-xs mt-1">Saved</Text>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 items-center">
              <Text className="text-success font-bold text-2xl">
                {useCourseStore.getState().enrollments.length}
              </Text>
              <Text className="text-textMuted text-xs mt-1">Enrolled</Text>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 items-center">
              <Text className="text-warning font-bold text-2xl">0</Text>
              <Text className="text-textMuted text-xs mt-1">Completed</Text>
            </View>
          </View>

          {/* Section title */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text font-bold text-base">Saved Courses</Text>
            <Text className="text-textMuted text-xs">
              {bookmarkedCourses.length} courses
            </Text>
          </View>

          {/* Course list */}
          {bookmarkedCourses.map((item) => (
            <CourseListCard
              key={item.id}
              item={item}
              isBookmarked={true}
              onBookmark={toggleBookmark}
            />
          ))}

          <View className="h-4" />
        </ScrollView>
      )}
    </View>
  );
}
