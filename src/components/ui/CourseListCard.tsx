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

function CourseListCard({ item, onBookmark, isBookmarked }: Props) {
  return (
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
          <Text
            className="text-text font-bold text-sm mb-0.5"
            numberOfLines={2}
          >
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
          <View className="bg-primary/10 self-start px-2 py-0.5 rounded-full">
            <Text className="text-primary text-xs font-semibold">
              {item.category}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-2">
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
}

export default memo(CourseListCard);
