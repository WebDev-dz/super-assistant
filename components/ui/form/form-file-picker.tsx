import * as React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { FilePicker } from '../file-picker';
import { FormItem } from './form';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';
import { FormMessage } from './form-message';
import { useFormField } from './form';
import type { Override } from './types';
import { Noop } from 'react-hook-form';

interface FormFieldFieldProps<T> {
  name: string;
  onBlur: Noop;
  onChange: (val: T) => void;
  value: T;
  disabled?: boolean;
}

type FormItemProps<T extends React.ElementType<any>, U> = Override<
  React.ComponentPropsWithoutRef<T>,
  FormFieldFieldProps<U>
> & {
  label?: string;
  description?: string;
};

const FormFilePicker = React.forwardRef<
  React.ComponentRef<typeof FilePicker>,
  FormItemProps<typeof FilePicker, DocumentPicker.DocumentPickerResult[]>
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <FilePicker
        // @ts-ignore
        ref={ref!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onFileSelect={(result) => {
          if (!result.canceled && result.assets) {
            onChange?.([result]);
          }
        }}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormFilePicker.displayName = 'FormFilePicker';

export { FormFilePicker };
