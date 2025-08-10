import * as React from 'react';
import { View } from 'react-native';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Form, FormField, FormInput, FormTextarea, FormRadioGroup, FormCombobox } from '~/components/ui/form';
import { RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';

export const TodoFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  milestoneId: z.string().optional(),
});

type ComboboxOption = { value: string; label: string };

type TodoFormProps<TValues extends Record<string, any> = any> = {
  form: UseFormReturn<TValues>;
  onSubmit: (values: TValues) => void;
  milestoneOptions?: ComboboxOption[];
  submitLabel?: string;
};

export default function TodoForm<TValues extends Record<string, any>>({
  form,
  onSubmit,
  milestoneOptions = [],
  submitLabel = 'Save Task',
}: TodoFormProps<TValues>) {
  return (
    <Form {...form}>
      <View className="gap-4">
        <FormField
          control={form.control}
          name={"title" as any}
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
          name={"priority" as any}
          render={({ field }) => (
            <FormRadioGroup label="Priority" description="How important is this task?" {...field} className="gap-4 flex-row">
              {(['low', 'medium', 'high', 'urgent'] as const).map((value) => (
                <View key={value} className="flex-row gap-2 items-center">
                  <RadioGroupItem aria-labelledby={`priority-label-for-${value}`} value={value} />
                  <Label nativeID={`priority-label-for-${value}`} className="capitalize" onPress={() => field.onChange(value)}>
                    {value}
                  </Label>
                </View>
              ))}
            </FormRadioGroup>
          )}
        />

        {milestoneOptions.length > 0 && (
          <FormField
            control={form.control}
            name={"milestoneId" as any}
            render={({ field }) => {
              const selected = milestoneOptions.find((opt) => opt.value === field.value) ?? null;
              return (
                <FormCombobox
                  label="Milestone"
                  description="Assign this task to a milestone"
                  items={milestoneOptions}
                  name={field.name as any}
                  onBlur={field.onBlur}
                  value={selected as any}
                  onChange={(opt) => field.onChange((opt?.value ?? '') as any)}
                />
              );
            }}
          />
        )}

        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className={buttonTextVariants({})}>{submitLabel}</Text>
        </Button>
      </View>
    </Form>
  );
}


