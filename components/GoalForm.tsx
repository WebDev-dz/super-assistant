import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import {
  Form,
  FormCombobox,
  FormDatePicker,
  FormField,
  FormInput,
  FormRadioGroup,
  FormTextarea,
} from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { RadioGroupItem } from '~/components/ui/radio-group';
import { Text } from '~/components/ui/text';
import { CreateGoal, GoalSchema } from '@/lib/validations';
import { useFormFlow, UseFormFlowProps } from '@/hooks/useFormFlow';

// Status and Priority schemas


// Sample data for dropdowns
export const categories = [
  { value: 'personal', label: 'Personal' },
  { value: 'career', label: 'Career' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'business', label: 'Business' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'travel', label: 'Travel' },
];





// Full schema
const fullSchema = GoalSchema


interface GoalFormComponentProps {
  formFlow: ReturnType<typeof useFormFlow<typeof fullSchema>>;
  onGoalCreated?: (goalData: CreateGoal) => void;
}

export default function GoalFormComponent({ formFlow, onGoalCreated }: GoalFormComponentProps) {
  const { form, navigationPanel, goToNextStep, goToPreviousStep, onSubmit, currentStep } = formFlow;
  

  return (
   
      <PagerView
        ref={navigationPanel.ref}
        style={styles.pagerView}
        className='h-full'
        initialPage={0}
        pageMargin={10}
        scrollEnabled={navigationPanel.scrollEnabled}
        overdrag={navigationPanel.overdragEnabled}
        onPageScroll={navigationPanel.onPageScroll}
        onPageSelected={navigationPanel.onPageSelected}
        onPageScrollStateChanged={navigationPanel.onPageScrollStateChanged}
      >
        {/* Step 1: Title and Description */}
        <View style={styles.formSection} key="1" collapsable={false}>
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
                  value={field.value ?? ''}
                />
              )}
            />
          </Form>
        </View>

        {/* Step 2: Status, Priority, and Category */}
        <View style={styles.formSection} key="2" collapsable={false}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                function onLabelPress(label: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled') {
                  return () => {
                    form.setValue('status', label);
                  };
                }
                return (
                  <FormRadioGroup
                    label="Status"
                    description="What's the current status of this goal?"
                    className="gap-4 flex-row"
                    {...field}
                  >
                    {(['not_started', 'in_progress', 'on_hold', 'completed', 'cancelled'] as const).map((value) => (
                      <View key={value} className="flex-row gap-2 items-center">
                        <RadioGroupItem aria-labelledby={`status-label-for-${value}`} value={value} />
                        <Label
                          nativeID={`status-label-for-${value}`}
                          className="capitalize"
                          onPress={onLabelPress(value)}
                        >
                          {value.replace('_', ' ')}
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
                function onLabelPress(label: 'low' | 'medium' | 'high' | 'urgent') {
                  return () => {
                    form.setValue('priority', label);
                  };
                }
                return (
                  <FormRadioGroup
                    label="Priority"
                    description="How important is this goal?"
                    className="gap-4 flex-row"
                    {...field}
                  >
                    {(['low', 'medium', 'high', 'urgent'] as const).map((value) => (
                      <View key={value} className="flex-row gap-2 items-center">
                        <RadioGroupItem aria-labelledby={`priority-label-for-${value}`} value={value} />
                        <Label
                          nativeID={`priority-label-for-${value}`}
                          className="capitalize"
                          onPress={onLabelPress(value)}
                        >
                          {value}
                        </Label>
                      </View>
                    ))}
                  </FormRadioGroup>
                );
              }}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field: { value, ...fields} }) => (
                <FormCombobox
                  label="Category"
                  description="Categorize your goal for better organization."
                  items={categories}
                  {...fields}
                  onChange={(value) => {
                    form.setValue('category', value?.value)
                    ;}}
                  selectedItem={categories.find((item) => item.value === value) ?? null}
                  value={value ?? null}
                />
              )}
            />
          </Form>
        </View>

        {/* Step 3: Dates */}
        <View style={styles.formSection} key="3" collapsable={false}>
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
          </Form>
        </View>

        {/* Step 4: Budget and Hours */}
        <View style={styles.formSection} key="4" collapsable={false}>
          <Form {...form}>
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
                  value={field.value ?? ''}
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
                  value={field.value ?? ''}
                />
              )}
            />
          </Form>
        </View>

      </PagerView>

      
   
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  pagerView: {
    // flex: 1,
    height: 300,
    // minHeight: "100%",
    // height: "auto"
  },
  formSection: {
    paddingHorizontal: 12,
    gap: 12,
    // collapsable: false,
    height: "auto"
    // paddingVertical: 16,
    // height: "100%"
    // flexGrow: 1,
    // minHeight: 200,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});