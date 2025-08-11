import * as React from "react";
import { View } from "react-native";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Button, buttonTextVariants } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Form,
  FormField,
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormCombobox,
  FormDatePicker,
  FormSwitch,
  FormDateTimePicker,
} from "~/components/ui/form";
import { RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { CreateTaskSchema } from "@/lib/validations";

type ComboboxOption = { value: string; label: string };

// Priority schema



export type TodoFormValues = z.infer<typeof CreateTaskSchema>;

type TodoFormProps<TValues extends Record<string, any> = TodoFormValues> = {
  form: UseFormReturn<TValues>;
  onSubmit: (values: TValues) => void;
  milestoneOptions?: ComboboxOption[];
  submitLabel?: string;
};

export default function TodoForm<TValues extends Record<string, any> = TodoFormValues>({
  form,
  onSubmit,
  milestoneOptions = [],
  submitLabel = "Save Task",
}: TodoFormProps<TValues>) {
  const [hasAlarm, setHasAlarm] = React.useState(false);

  return (
    <Form {...form} >
      <View className="gap-4">
        <FormField
          control={form.control}
          name={"title" as any }
          render={({ field }) => (
            <FormInput
              label="Task Title"
              placeholder="Write a clear task title"
              description="Keep it short and specific"
              autoCapitalize="sentences"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name={"description" as any}
          render={({ field }) => (
            <FormTextarea
              label="Description"
              placeholder="Optional details..."
              description="Provide any additional context"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name={"dueDate" as any}
          render={({ field }) => (
            <FormDatePicker
              label="Due Date"
              description="When do you want to complete this task?"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name={"priority" as any}
          render={({ field }) => (
            <FormRadioGroup
              label="Priority"
              description="How important is this task?"
              {...field}
              className="gap-4 flex-row"
            >
              {(["low", "medium", "high", "urgent"] as const).map((value) => (
                <View key={value} className="flex-row gap-2 items-center">
                  <RadioGroupItem
                    aria-labelledby={`priority-label-for-${value}`}
                    value={value}
                  />
                  <Label
                    nativeID={`priority-label-for-${value}`}
                    className="capitalize"
                    onPress={() => field.onChange(value)}
                  >
                    {value}
                  </Label>
                </View>
              ))}
            </FormRadioGroup>
          )}
        />

        <FormField
          control={form.control}
          name={"estimatedHours" as any}
          render={({ field }) => (
            <FormInput
              label="Estimated Hours"
              placeholder="How long will this take?"
              description="Optional time estimate"
              keyboardType="numeric"
              {...field}
              value={field.value?.toString()}
              onChangeText={(text) => {
                const num = parseFloat(text);
                field.onChange(isNaN(num) ? undefined : num);
              }}
            />
          )}
        />

        {milestoneOptions.length > 0 && (
          <FormField
            control={form.control}
            name={"milestoneId" as any}
            render={({ field }) => {
              const selected =
                milestoneOptions.find((opt) => opt.value === field.value) ??
                null;
              return (
                <FormCombobox
                  label="Milestone"
                  description="Assign this task to a milestone"
                  items={milestoneOptions}
                  name={field.name as any}
                  onBlur={field.onBlur}
                  value={selected as any}
                  onChange={(opt) => field.onChange((opt?.value ?? "") as any)}
                />
              );
            }}
          />
        )}

        {/* Alarm Settings */}
        <FormField
          control={form.control}
          name={"hasAlarm" as any}
          render={({ field }) => (
            <FormSwitch
              {...field}
              label="Set Alarm"
              description="Get notified about this task"
              value={field.value || hasAlarm}
              onChange={(checked) => {
                field.onChange(checked);
                setHasAlarm(checked);
              }}
            />
          )}
        />

        {(hasAlarm || form.watch("hasAlarm" as any)) && (
          <>
            <FormField
              control={form.control}
              name={"alarmMethod" as any}
              render={({ field }) => (
                <FormRadioGroup
                  label="Alarm Method"
                  description="How should you be notified?"
                  {...field}
                  className="gap-4 flex-row"
                >
                  {(["alert", "alarm"] as const).map((value) => (
                    <View key={value} className="flex-row gap-2 items-center">
                      <RadioGroupItem
                        aria-labelledby={`alarm-method-label-for-${value}`}
                        value={value}
                      />
                      <Label
                        nativeID={`alarm-method-label-for-${value}`}
                        className="capitalize"
                        onPress={() => field.onChange(value)}
                      >
                        {value}
                      </Label>
                    </View>
                  ))}
                </FormRadioGroup>
              )}
            />

            <FormField
              control={form.control}
              name={"alarmOffset" as any}
              render={({ field }) => (
                <FormInput
                  label="Alarm Offset (minutes)"
                  placeholder="15"
                  description="How many minutes before the due date?"
                  keyboardType="numeric"
                  {...field}
                  value={field.value?.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    field.onChange(isNaN(num) ? undefined : num);
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name={"alarmAbsoluteDate" as any}
              render={({ field }) => (
                <FormDateTimePicker
                  label="Custom Alarm Date"
                  description="Or set a specific alarm date/time"
                  {...field}
                />
              )}
            />
          </>
        )}

        <Button onPress={form.handleSubmit(onSubmit, console.error)}>
          <Text className={buttonTextVariants({})}>{submitLabel}</Text>
        </Button>
      </View>
    </Form>
  );
}