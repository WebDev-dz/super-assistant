import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import * as z from 'zod';
import { Alert } from 'react-native';
import { useNavigationPanel, UseNavigationPanelProps } from './useNavigationPanel';

export type UseFormFlowProps<T extends z.ZodObject> = {
  stepSchemas: z.ZodObject[];
  fullSchema: T;
  scrollEnabled?: boolean;
  overdragEnabled?: boolean;
  defaultValues: z.infer<T>;
  onSubmit?: (data: z.infer<T>) => void;
};

export function useFormFlow<T extends z.ZodObject>({
  stepSchemas,
  fullSchema,
  defaultValues,
  scrollEnabled = true,
  overdragEnabled = true,
  onSubmit,
}: UseFormFlowProps<T>) {
  const navigationPanel = useNavigationPanel(stepSchemas.length, (position) => {
    // Trigger validation for the current step when a page is selected
    form.trigger(getStepFields(position));
    return ({
      scrollEnabled: scrollEnabled && position < stepSchemas.length - 1,
      overdragEnabled: overdragEnabled && position < stepSchemas.length - 1,
    })
  });
  
  const form = useForm<any>({
    resolver: zodResolver(fullSchema),
    defaultValues,
  });
  
  const getStepFields = useCallback(
    (step: number): string[] => {
      if (step >= stepSchemas.length) return [];
      const schema = stepSchemas[step];
      return Object.keys(schema.shape || {});
    },
    [stepSchemas]
  );

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      if (step >= stepSchemas.length) return false;
      const fields = getStepFields(step);
      const result = await form.trigger(fields as any);
      if (!result) {
        const errors = form.formState.errors;
        const errorMessages = fields
          .map((field) => errors[field]?.message)
          .filter(Boolean)
          .join('\n');
        Alert.alert('Validation Error', errorMessages || 'Please fill out all required fields.');
      }
      return result;
    },
    [form, getStepFields]
  );

  const goToNextStep = useCallback(async () => {
    const isValid = await validateStep(navigationPanel.activePage);
    if (isValid && navigationPanel.activePage < stepSchemas.length - 1) {
      navigationPanel.setPage(navigationPanel.activePage + 1);
    }
  }, [navigationPanel, validateStep, stepSchemas.length]);

  const goToPreviousStep = useCallback(() => {
    if (navigationPanel.activePage > 0) {
      navigationPanel.setPage(navigationPanel.activePage - 1);
    }
  }, [navigationPanel]);

  const handleSubmit = useCallback(
    async (values: z.infer<T>) => {
      const result = await fullSchema.safeParseAsync(values);
      if (!result.success) {
        const errorMessages = result.error.issues.map((err) => err.message).join('\n');
        Alert.alert('Validation Error', errorMessages);
        return;
      }

      if (onSubmit) {
        onSubmit(result.data);
        form.reset();
        navigationPanel.setPage(0); // Reset to first step
      } else {
        Alert.alert('Form Submitted!', JSON.stringify(result.data, null, 2), [
          {
            text: 'OK',
            onPress: () => {
              form.reset();
              navigationPanel.setPage(0);
            },
          },
        ]);
      }
    },
    [form, navigationPanel, onSubmit, fullSchema]
  );

  return {
    form,
    navigationPanel,
    validateStep,
    goToNextStep,
    goToPreviousStep,
    onSubmit: form.handleSubmit(handleSubmit),
    currentStep: navigationPanel.activePage,
    totalSteps: stepSchemas.length,
  };
}