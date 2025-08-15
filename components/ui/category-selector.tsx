import * as React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "~/components/ui/text";

// Enhanced categories with icons and colors
export const categories = [
  {
    value: "personal",
    label: "Personal",
    icon: "person-outline" as keyof typeof Ionicons.glyphMap,
    color: "#8B5CF6", // purple-500
    bgColor: "bg-purple-100",
    selectedBg: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-600",
  },
  {
    value: "career",
    label: "Career",
    icon: "briefcase-outline" as keyof typeof Ionicons.glyphMap,
    color: "#3B82F6", // blue-500
    bgColor: "bg-blue-100",
    selectedBg: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
  },
  {
    value: "health",
    label: "Health & Fitness",
    icon: "fitness-outline" as keyof typeof Ionicons.glyphMap,
    color: "#10B981", // green-500
    bgColor: "bg-green-100",
    selectedBg: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-600",
  },
  {
    value: "education",
    label: "Education",
    icon: "school-outline" as keyof typeof Ionicons.glyphMap,
    color: "#F59E0B", // amber-500
    bgColor: "bg-amber-100",
    selectedBg: "bg-amber-50",
    borderColor: "border-amber-500",
    textColor: "text-amber-600",
  },
  {
    value: "finance",
    label: "Finance",
    icon: "card-outline" as keyof typeof Ionicons.glyphMap,
    color: "#EF4444", // red-500
    bgColor: "bg-red-100",
    selectedBg: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-600",
  },
  {
    value: "business",
    label: "Business",
    icon: "business-outline" as keyof typeof Ionicons.glyphMap,
    color: "#6366F1", // indigo-500
    bgColor: "bg-indigo-100",
    selectedBg: "bg-indigo-50",
    borderColor: "border-indigo-500",
    textColor: "text-indigo-600",
  },
  {
    value: "relationships",
    label: "Relationships",
    icon: "heart-outline" as keyof typeof Ionicons.glyphMap,
    color: "#EC4899", // pink-500
    bgColor: "bg-pink-100",
    selectedBg: "bg-pink-50",
    borderColor: "border-pink-500",
    textColor: "text-pink-600",
  },
  {
    value: "travel",
    label: "Travel",
    icon: "airplane-outline" as keyof typeof Ionicons.glyphMap,
    color: "#14B8A6", // teal-500
    bgColor: "bg-teal-100",
    selectedBg: "bg-teal-50",
    borderColor: "border-teal-500",
    textColor: "text-teal-600",
  },
  {
    value: "family",
    label: "Family",
    icon: "people-outline" as keyof typeof Ionicons.glyphMap,
    color: "#F43F5E", // rose-500
    bgColor: "bg-rose-100",
    selectedBg: "bg-rose-50",
    borderColor: "border-rose-500",
    textColor: "text-rose-600",
  },
  {
    value: "hobbies",
    label: "Hobbies",
    icon: "game-controller-outline" as keyof typeof Ionicons.glyphMap,
    color: "#EAB308", // yellow-500
    bgColor: "bg-yellow-100",
    selectedBg: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-600",
  },
  {
    value: "home",
    label: "Home",
    icon: "home-outline" as keyof typeof Ionicons.glyphMap,
    color: "#6D28D9", // violet-700
    bgColor: "bg-violet-100",
    selectedBg: "bg-violet-50",
    borderColor: "border-violet-500",
    textColor: "text-violet-600",
  },
  {
    value: "environment",
    label: "Environment",
    icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
    color: "#84CC16", // lime-500
    bgColor: "bg-lime-100",
    selectedBg: "bg-lime-50",
    borderColor: "border-lime-500",
    textColor: "text-lime-600",
  },
  {
    value: "community",
    label: "Community",
    icon: "globe-outline" as keyof typeof Ionicons.glyphMap,
    color: "#06B6D4", // cyan-500
    bgColor: "bg-cyan-100",
    selectedBg: "bg-cyan-50",
    borderColor: "border-cyan-500",
    textColor: "text-cyan-600",
  },
  {
    value: "creativity",
    label: "Creativity",
    icon: "color-palette-outline" as keyof typeof Ionicons.glyphMap,
    color: "#D946EF", // fuchsia-500
    bgColor: "bg-fuchsia-100",
    selectedBg: "bg-fuchsia-50",
    borderColor: "border-fuchsia-500",
    textColor: "text-fuchsia-600",
  },
  {
    value: "spiritual",
    label: "Spiritual",
    icon: "sparkles-outline" as keyof typeof Ionicons.glyphMap,
    color: "#F97316", // orange-500
    bgColor: "bg-orange-100",
    selectedBg: "bg-orange-50",
    borderColor: "border-orange-500",
    textColor: "text-orange-600",
  },
  {
    value: "wellness",
    label: "Wellness",
    icon: "medkit-outline" as keyof typeof Ionicons.glyphMap,
    color: "#22D3EE", // sky-500
    bgColor: "bg-sky-100",
    selectedBg: "bg-sky-50",
    borderColor: "border-sky-500",
    textColor: "text-sky-600",
  },
  {
    value: "learning",
    label: "Learning",
    icon: "book-outline" as keyof typeof Ionicons.glyphMap,
    color: "#A21CAF", // purple-700
    bgColor: "bg-purple-100",
    selectedBg: "bg-purple-50",
    borderColor: "border-purple-700",
    textColor: "text-purple-600",
  },
  {
    value: "adventure",
    label: "Adventure",
    icon: "compass-outline" as keyof typeof Ionicons.glyphMap,
    color: "#DC2626", // red-600
    bgColor: "bg-red-100",
    selectedBg: "bg-red-50",
    borderColor: "border-red-600",
    textColor: "text-red-600",
  },
  {
    value: "social",
    label: "Social",
    icon: "chatbubbles-outline" as keyof typeof Ionicons.glyphMap,
    color: "#EA580C", // orange-600
    bgColor: "bg-orange-100",
    selectedBg: "bg-orange-50",
    borderColor: "border-orange-600",
    textColor: "text-orange-600",
  },
  {
    value: "charity",
    label: "Charity",
    icon: "gift-outline" as keyof typeof Ionicons.glyphMap,
    color: "#16A34A", // green-600
    bgColor: "bg-green-100",
    selectedBg: "bg-green-50",
    borderColor: "border-green-600",
    textColor: "text-green-600",
  },
  {
    value: "technology",
    label: "Technology",
    icon: "laptop-outline" as keyof typeof Ionicons.glyphMap,
    color: "#2563EB", // blue-600
    bgColor: "bg-blue-100",
    selectedBg: "bg-blue-50",
    borderColor: "border-blue-600",
    textColor: "text-blue-600",
  },
  {
    value: "culture",
    label: "Culture",
    icon: "musical-notes-outline" as keyof typeof Ionicons.glyphMap,
    color: "#C026D3", // fuchsia-600
    bgColor: "bg-fuchsia-100",
    selectedBg: "bg-fuchsia-50",
    borderColor: "border-fuchsia-600",
    textColor: "text-fuchsia-600",
  },
];

// Custom Category Selector Component
interface CategorySelectorProps {
  selectedValue: string | null;
  onValueChange: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedValue,
  onValueChange,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold mb-1 text-gray-800">
        Category
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Categorize your goal for better organization.
      </Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.value}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({ item: category }) => {
          const isSelected = selectedValue === category.value;
          return (
            <TouchableOpacity
              key={category.value}
              className={`flex-1 items-center justify-center py-4 px-3 rounded-xl border-2 bg-white m-1 shadow-sm ${
                isSelected
                  ? `${category.borderColor} ${category.selectedBg} shadow-md`
                  : "border-gray-200"
              }`}
              onPress={() => onValueChange(category.value)}
              activeOpacity={0.7}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                  isSelected ? "" : category.bgColor
                }`}
                style={
                  isSelected ? { backgroundColor: category.color } : undefined
                }
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={isSelected ? "#ffffff" : category.color}
                />
              </View>
              <Text
                className={`text-xs text-center font-medium ${
                  isSelected ? category.textColor : "text-gray-600"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CategorySelector;