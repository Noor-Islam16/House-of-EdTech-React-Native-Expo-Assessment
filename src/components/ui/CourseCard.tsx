import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import type { Course } from "@src/types";
import { router } from "expo-router";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Course;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
}

function CourseCard({ item, onBookmark, isBookmarked }: Props) {
  return (
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
}

export default memo(CourseCard);
