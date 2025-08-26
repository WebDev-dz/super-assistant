import * as React from 'react';
import { Input } from '../input';
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

const FormInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  FormItemProps<typeof Input, string>
>(({ label, description, onChange, ...props }, ref) => {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  React.useImperativeHandle(
    ref,
    () => {
      if (!inputRef.current) {
        return {} as React.ComponentRef<typeof Input>;
      }
      return inputRef.current;
    },
    [inputRef.current]
  );

  function handleOnLabelPress() {
    if (!inputRef.current) {
      return;
    }
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
          {label}
        </FormLabel>
      )}

      <Input
        // @ts-ignore
        ref={inputRef!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormInput.displayName = 'FormInput';

export { FormInput };
