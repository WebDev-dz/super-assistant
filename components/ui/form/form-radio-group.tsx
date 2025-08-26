import * as React from 'react';
import { View } from 'react-native';
import { RadioGroup } from '../radio-group';
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

const FormRadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroup>,
  Omit<FormItemProps<typeof RadioGroup, string>, 'onValueChange'>
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  return (
    <FormItem className='gap-3'>
      <View>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        {!!description && <FormDescription className='pt-0'>{description}</FormDescription>}
      </View>
      <RadioGroup
        // @ts-ignore
        ref={ref!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onValueChange={onChange}
        value={value}
        {...props}
      />
      <FormMessage />
    </FormItem>
  );
});

FormRadioGroup.displayName = 'FormRadioGroup';

export { FormRadioGroup };
