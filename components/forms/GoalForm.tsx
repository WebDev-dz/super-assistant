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
import CategorySelector from "../ui/category-selector";



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
