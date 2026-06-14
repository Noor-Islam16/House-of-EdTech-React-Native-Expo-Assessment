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
      {/* ── Header ── */}
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
          <Text className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
            Library
          </Text>
          <Text
            className="text-white text-4xl leading-tight"
            style={{ fontFamily: "Nunito-Bold" }}
          >
            My Bookmarks
          </Text>
          <Text
            className="text-white/60 text-sm mt-2"
            style={{ fontFamily: "Nunito-Regular" }}
          >
            {bookmarkedCourses.length} saved{" "}
            {bookmarkedCourses.length === 1 ? "course" : "courses"}
          </Text>
        </View>
      </View>

      {/* ── Sheet overlay ── */}
      <View
        className="bg-background flex-1"
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          marginTop: -24,
        }}
      >
        {bookmarkedCourses.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-5">
              <Ionicons
                name="bookmark-outline"
                size={44}
                color={COLORS.primary}
              />
            </View>
            <Text
              className="text-text text-xl text-center"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              No Bookmarks Yet
            </Text>
            <Text
              className="text-textMuted text-sm text-center mt-2 leading-5"
              style={{ fontFamily: "Nunito-Regular" }}
            >
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
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Browse Courses
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          >
            {/* Stats */}
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-card rounded-2xl p-4 items-center">
                <Text
                  className="text-primary text-2xl"
                  style={{ fontFamily: "Nunito-Bold" }}
                >
                  {bookmarkedCourses.length}
                </Text>
                <Text
                  className="text-textMuted text-xs mt-1"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  Saved
                </Text>
              </View>
              <View className="flex-1 bg-card rounded-2xl p-4 items-center">
                <Text
                  className="text-success text-2xl"
                  style={{ fontFamily: "Nunito-Bold" }}
                >
                  {useCourseStore.getState().enrollments.length}
                </Text>
                <Text
                  className="text-textMuted text-xs mt-1"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  Enrolled
                </Text>
              </View>
              <View className="flex-1 bg-card rounded-2xl p-4 items-center">
                <Text
                  className="text-warning text-2xl"
                  style={{ fontFamily: "Nunito-Bold" }}
                >
                  0
                </Text>
                <Text
                  className="text-textMuted text-xs mt-1"
                  style={{ fontFamily: "Nunito-Regular" }}
                >
                  Completed
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-text text-base"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Saved Courses
              </Text>
              <Text
                className="text-textMuted text-xs"
                style={{ fontFamily: "Nunito-Regular" }}
              >
                {bookmarkedCourses.length} courses
              </Text>
            </View>

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
    </View>
  );
}
