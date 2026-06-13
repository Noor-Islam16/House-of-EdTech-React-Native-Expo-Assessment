import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore, useCourseStore } from "@src/store";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WHAT_YOU_LEARN = [
  "Build real-world production apps",
  "Master component architecture",
  "State management best practices",
  "API integration & error handling",
  "Performance optimization techniques",
  "Deploy to App Store & Play Store",
];

const CURRICULUM = [
  { title: "Introduction & Setup", duration: "45 min", lessons: 5 },
  { title: "Core Concepts", duration: "1h 20min", lessons: 8 },
  { title: "Building Components", duration: "2h 10min", lessons: 12 },
  { title: "State Management", duration: "1h 45min", lessons: 9 },
  { title: "API Integration", duration: "1h 30min", lessons: 7 },
  { title: "Testing & Deployment", duration: "1h 15min", lessons: 6 },
];

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const { courses, bookmarks, toggleBookmark, enroll, enrollments } =
    useCourseStore();
  const user = useAuthStore((s) => s.user);

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);

  const isBookmarked = bookmarks.includes(id ?? "");
  const isEnrolled = enrollments.includes(id ?? "");

  // Enroll button scale animation
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleEnroll = () => {
    if (!id) return;
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    enroll(id);
    Alert.alert(
      "🎉 Enrolled!",
      `You've successfully enrolled in ${course?.title}`,
      [
        {
          text: "Start Learning",
          onPress: () => router.push("/(tabs)/webview"),
        },
      ],
    );
  };

  const handleShare = async () => {
    await Share.share({
      message: `Check out this course: ${course?.title} on EduFlex!`,
    });
  };

  if (!course) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text className="text-text font-bold text-lg mt-3">
          Course not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalLessons = CURRICULUM.reduce((a, c) => a + c.lessons, 0);

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: 260 }}
            resizeMode="cover"
          />
          {/* Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          {/* Top bar */}
          <View
            style={{ paddingTop: insets.top + 8 }}
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-5"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
              >
                <Ionicons name="share-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleBookmark(id ?? "")}
                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? COLORS.warning : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category badge on image */}
          <View className="absolute bottom-4 left-5">
            <View className="bg-primary px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {course.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 pt-5">
          {/* Title */}
          <Text className="text-text text-xl font-bold leading-7">
            {course.title}
          </Text>

          {/* Instructor row */}
          <View className="flex-row items-center mt-3 gap-3">
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-10 h-10 rounded-full"
            />
            <View>
              <Text className="text-text font-semibold text-sm">
                {course.instructor.firstName} {course.instructor.lastName}
              </Text>
              <Text className="text-textMuted text-xs">Course Instructor</Text>
            </View>
          </View>

          {/* Stats row */}
          <View className="flex-row items-center justify-between bg-card rounded-2xl p-4 mt-4">
            <View className="items-center flex-1">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color={COLORS.warning} />
                <Text className="text-text font-bold text-base">
                  {course.rating}
                </Text>
              </View>
              <Text className="text-textMuted text-xs mt-0.5">Rating</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="items-center flex-1">
              <Text className="text-text font-bold text-base">
                {totalLessons}
              </Text>
              <Text className="text-textMuted text-xs mt-0.5">Lessons</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="items-center flex-1">
              <Text className="text-text font-bold text-base">6</Text>
              <Text className="text-textMuted text-xs mt-0.5">Weeks</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="items-center flex-1">
              <Text className="text-success font-bold text-base">
                ${course.price}
              </Text>
              <Text className="text-textMuted text-xs mt-0.5">Price</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mt-5">
            <Text className="text-text font-bold text-base mb-2">
              About This Course
            </Text>
            <Text className="text-textMuted text-sm leading-6">
              {course.description} Learn from industry experts and build
              portfolio-worthy projects. This course is designed for developers
              who want to take their skills to the next level with hands-on
              practice and real-world scenarios.
            </Text>
          </View>

          {/* What you'll learn */}
          <View className="mt-5">
            <Text className="text-text font-bold text-base mb-3">
              What You'll Learn
            </Text>
            <View className="bg-card rounded-2xl p-4 gap-3">
              {WHAT_YOU_LEARN.map((item, i) => (
                <View key={i} className="flex-row items-start gap-3">
                  <View className="w-5 h-5 bg-success/20 rounded-full items-center justify-center mt-0.5">
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={COLORS.success}
                    />
                  </View>
                  <Text className="text-text text-sm flex-1">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Curriculum */}
          <View className="mt-5">
            <Text className="text-text font-bold text-base mb-3">
              Curriculum
            </Text>
            <View className="gap-2">
              {CURRICULUM.map((section, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() =>
                    setExpandedSection(expandedSection === i ? null : i)
                  }
                  className="bg-card rounded-2xl overflow-hidden"
                >
                  <View className="flex-row items-center justify-between p-4">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                        <Text className="text-primary font-bold text-xs">
                          {i + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-text font-semibold text-sm"
                          numberOfLines={1}
                        >
                          {section.title}
                        </Text>
                        <Text className="text-textMuted text-xs mt-0.5">
                          {section.lessons} lessons • {section.duration}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === i ? "chevron-up" : "chevron-down"
                      }
                      size={18}
                      color={COLORS.textMuted}
                    />
                  </View>
                  {expandedSection === i && (
                    <View className="px-4 pb-4 pt-0 border-t border-border">
                      {Array.from({ length: section.lessons }).map((_, j) => (
                        <View
                          key={j}
                          className="flex-row items-center gap-3 py-2"
                        >
                          <Ionicons
                            name="play-circle-outline"
                            size={18}
                            color={COLORS.secondary}
                          />
                          <Text className="text-textMuted text-sm flex-1">
                            Lesson {j + 1}: {section.title} Part {j + 1}
                          </Text>
                          <Text className="text-textMuted text-xs">
                            {Math.floor(Math.random() * 15) + 5}m
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="h-32" />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={
              isEnrolled ? () => router.push("/(tabs)/webview") : handleEnroll
            }
            className={`rounded-2xl h-14 items-center justify-center ${
              isEnrolled ? "bg-success" : "bg-primary"
            }`}
            style={{
              shadowColor: isEnrolled ? COLORS.success : COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            activeOpacity={0.85}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={isEnrolled ? "play-circle" : "add-circle-outline"}
                size={20}
                color="white"
              />
              <Text className="text-white font-bold text-base">
                {isEnrolled
                  ? "Continue Learning"
                  : `Enroll Now • $${course.price}`}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
