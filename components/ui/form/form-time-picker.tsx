import * as React from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Button, buttonTextVariants } from '../button';
import type { ButtonChildrenProps } from './button-types';
import { FormItem } from './form';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';
import { FormMessage } from './form-message';
import { useFormField } from './form';
import { Clock1Icon } from 'lucide-react-native';
import { X } from '~/lib/icons/X';
import { cn } from '~/lib/utils';
import { Text } from '../text';
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

const FormTimePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Button, string> & ButtonChildrenProps & {
    mode?: 'time' | 'countdown';
    is24Hour?: boolean;
    display?: 'default' | 'spinner' | 'compact';
  }
>(({ label, description, value, onChange, mode = 'time', is24Hour = true, display = 'default', ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Pick a time';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !is24Hour 
      });
    } catch {
      return 'Pick a time';
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime && event.type !== 'dismissed') {
      onChange?.(selectedTime.toISOString());
    }
  };

  React.useEffect(() => {
    return () => {
      setShowTimePicker(false);
    };
  }, []);

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      
      <Button
        variant='outline'
        className='flex-row gap-3 justify-start px-3 relative'
        ref={ref!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onPress={() => setShowTimePicker(true)}
        {...props}
      >
        {({ pressed }) => (
          <>
            <Clock1Icon
              className={buttonTextVariants({
                variant: 'outline',
                className: cn(!value && 'opacity-80', pressed && 'opacity-60'),
              })}
              size={18}
            />
            <Text
              className={buttonTextVariants({
                variant: 'outline',
                className: cn('font-normal', !value && 'opacity-70', pressed && 'opacity-50'),
              })}
            >
              {formatTime(value)}
            </Text>
            {!!value && (
              <Button
                className='absolute right-0 active:opacity-70 native:pr-3'
                variant='ghost'
                onPress={(e) => {
                  e.stopPropagation();
                  onChange?.('');
                }}
              >
                <X size={18} className='text-muted-foreground text-xs' />
              </Button>
            )}
          </>
        )}
      </Button>

      {showTimePicker && (
        <RNDateTimePicker
          value={value ? new Date(value) : new Date()}
          mode={mode}
          is24Hour={is24Hour}
          display={display}
          onChange={handleTimeChange}
        />
      )}
      
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormTimePicker.displayName = 'FormTimePicker';

export { FormTimePicker };
