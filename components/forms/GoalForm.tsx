import * as React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";
import { Ionicons } from "@expo/vector-icons";

import {
  Form,
  FormCombobox,
  FormDatePicker,
  FormField,
  FormInput,
  FormRadioGroup,
  FormTextarea,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import { CreateGoal, GoalSchema } from "@/lib/validations";
import { useFormFlow, UseFormFlowProps } from "@/hooks/useFormFlow";

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
];

// Full schema
const fullSchema = GoalSchema;

interface GoalFormComponentProps {
  formFlow: ReturnType<typeof useFormFlow<typeof fullSchema>>;
  onGoalCreated?: (goalData: CreateGoal) => void;
}

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
        className="-mx-1"
      >
        {categories.map((category) => {
          const isSelected = selectedValue === category.value;
          return (
            <TouchableOpacity
              key={category.value}
              className={`items-center justify-center py-4 px-3 rounded-xl border-2 bg-white min-w-[90px] mx-1 shadow-sm ${
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
        })}
      </ScrollView>
    </View>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {totalSteps}
        </Text>
        <Text className="text-sm font-semibold text-purple-600">
          {Math.round(progress)}%
        </Text>
      </View>
      <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};

export default function GoalFormComponent({
  formFlow,
  onGoalCreated,
}: GoalFormComponentProps) {
  const {
    form,
    navigationPanel,
    goToNextStep,
    goToPreviousStep,
    onSubmit,
    currentStep,
  } = formFlow;
  const totalSteps = 4;

  return (
    <View className="flex-1 h-[400px]">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <PagerView
        ref={navigationPanel.ref}
        className="flex-1 h-[400px]"
        style={{ height: 400 }}
        initialPage={0}
        pageMargin={10}
        scrollEnabled={navigationPanel.scrollEnabled}
        overdrag={navigationPanel.overdragEnabled}
        onPageScroll={navigationPanel.onPageScroll}
        onPageSelected={navigationPanel.onPageSelected}
        onPageScrollStateChanged={navigationPanel.onPageScrollStateChanged}
      >
        {/* Step 1: Title and Description */}
        <View
          style={{ height: 400 }}
          className="px-4 gap-4 py-2"
          key="1"
          collapsable={false}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormInput
                  label="Goal Title"
                  placeholder="Complete my fitness goals"
                  description="Give your goal a clear, specific title."
                  autoCapitalize="words"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormTextarea
                  label="Description"
                  placeholder="Describe your goal in detail..."
                  description="Provide additional context and details about your goal."
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </Form>
        </View>

        {/* Step 2: Category Selection Only */}
        <View 
         style={{ height: 400 }}
        className="px-4 gap-4 py-2" key="2" collapsable={false}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="category"
              render={({ field: { value, onChange } }) => (
                <CategorySelector
                  selectedValue={value}
                  onValueChange={(categoryValue) => {
                    form.setValue("category", categoryValue);
                  }}
                />
              )}
            />
          </Form>
        </View>

        {/* Step 3: Status and Priority */}
        <View  style={{ height: 400 }}
         className="px-4 gap-4 py-2 h-auto" key="3" collapsable={false}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                function onLabelPress(
                  label:
                    | "not_started"
                    | "in_progress"
                    | "on_hold"
                    | "completed"
                    | "cancelled"
                ) {
                  return () => {
                    form.setValue("status", label);
                  };
                }
                return (
                  <FormRadioGroup
                    label="Status"
                    description="What's the current status of this goal?"
                    className="gap-4 flex-row"
                    {...field}
                  >
                    {(
                      [
                        "not_started",
                        "in_progress",
                        "on_hold",
                        "completed",
                        "cancelled",
                      ] as const
                    ).map((value) => (
                      <View key={value} className="flex-row gap-2 items-center">
                        <RadioGroupItem
                          aria-labelledby={`status-label-for-${value}`}
                          value={value}
                        />
                        <Label
                          nativeID={`status-label-for-${value}`}
                          className="capitalize"
                          onPress={onLabelPress(value)}
                        >
                          {value.replace("_", " ")}
                        </Label>
                      </View>
                    ))}
                  </FormRadioGroup>
                );
              }}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => {
                function onLabelPress(
                  label: "low" | "medium" | "high" | "urgent"
                ) {
                  return () => {
                    form.setValue("priority", label);
                  };
                }
                return (
                  <FormRadioGroup
                    label="Priority"
                    description="How important is this goal?"
                    className="gap-4 flex-row"
                    {...field}
                  >
                    {(["low", "medium", "high", "urgent"] as const).map(
                      (value) => (
                        <View
                          key={value}
                          className="flex-row gap-2 items-center"
                        >
                          <RadioGroupItem
                            aria-labelledby={`priority-label-for-${value}`}
                            value={value}
                          />
                          <Label
                            nativeID={`priority-label-for-${value}`}
                            className="capitalize"
                            onPress={onLabelPress(value)}
                          >
                            {value}
                          </Label>
                        </View>
                      )
                    )}
                  </FormRadioGroup>
                );
              }}
            />
          </Form>
        </View>

        {/* Step 4: Dates, Budget and Hours */}
        <View className="px-4 gap-4 py-2 h-auto" key="4" collapsable={false}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormDatePicker
                  label="Start Date"
                  description="When do you plan to start working on this goal?"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="targetEndDate"
              render={({ field }) => (
                <FormDatePicker
                  label="Target End Date"
                  description="When do you want to complete this goal?"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormInput
                  label="Budget"
                  placeholder="1000"
                  description="Optional budget allocated for this goal (in your currency)."
                  keyboardType="numeric"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
            <FormField
              control={form.control}
              name="estimatedTotalHours"
              render={({ field }) => (
                <FormInput
                  label="Estimated Total Hours"
                  placeholder="40"
                  description="How many hours do you estimate this goal will take?"
                  keyboardType="numeric"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </Form>
        </View>
      </PagerView>
    </View>
  );
}
