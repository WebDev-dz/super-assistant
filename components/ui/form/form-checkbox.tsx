import * as React from 'react';
import { View } from 'react-native';
import { Checkbox } from '../checkbox';
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

const FormCheckbox = React.forwardRef<
  React.ComponentRef<typeof Checkbox>,
  Omit<FormItemProps<typeof Checkbox, boolean>, 'checked' | 'onCheckedChange'>
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  function handleOnLabelPress() {
    onChange?.(!value);
  }

  return (
    <FormItem className='px-1'>
      <View className='flex-row gap-3 items-center'>
        <Checkbox
          // @ts-ignore
          ref={ref!}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel className='pb-0' nativeID={formItemNativeID} onPress={handleOnLabelPress}>
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

export { FormCheckbox };
