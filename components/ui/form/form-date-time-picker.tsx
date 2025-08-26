import * as React from 'react';
import { View } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Button, buttonTextVariants } from '../button';
import type { ButtonChildrenProps } from './button-types';
import { FormItem } from './form';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';
import { FormMessage } from './form-message';
import { useFormField } from './form';
import { Calendar as CalendarIcon } from '~/lib/icons/Calendar';
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

const FormDateTimePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Button, string> & ButtonChildrenProps & {
    is24Hour?: boolean;
    display?: 'default' | 'spinner' | 'compact';
  }
>(({ label, description, value, onChange, is24Hour = true, display = 'default', ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'Pick date & time';
    try {
      const date = new Date(dateTimeString);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !is24Hour 
      });
      return `${dateStr} ${timeStr}`;
    } catch {
      return 'Pick date & time';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate && event.type !== 'dismissed') {
      setTempDate(selectedDate);
      setTimeout(() => {
        setShowTimePicker(true);
      }, 100);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime && event.type !== 'dismissed' && tempDate) {
      const combinedDateTime = new Date(tempDate);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      combinedDateTime.setSeconds(selectedTime.getSeconds());
      
      onChange?.(combinedDateTime.toISOString());
    }
    
    setTempDate(null);
  };

  React.useEffect(() => {
    return () => {
      setShowDatePicker(false);
      setShowTimePicker(false);
      setTempDate(null);
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
        onPress={() => setShowDatePicker(true)}
        {...props}
      >
                    {({ pressed }: { pressed: boolean }) => (
          <>
            <View className='flex-row gap-1'>
              <CalendarIcon
                className={buttonTextVariants({
                  variant: 'outline',
                  className: cn(!value && 'opacity-80', pressed && 'opacity-60'),
                })}
                size={16}
              />
              <Clock1Icon
                className={buttonTextVariants({
                  variant: 'outline',
                  className: cn(!value && 'opacity-80', pressed && 'opacity-60'),
                })}
                size={16}
              />
            </View>
            <Text
              className={buttonTextVariants({
                variant: 'outline',
                className: cn('font-normal', !value && 'opacity-70', pressed && 'opacity-50'),
              })}
            >
              {formatDateTime(value)}
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

      {showDatePicker && (
        <RNDateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={display}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && tempDate && (
        <RNDateTimePicker
          value={tempDate}
          mode="time"
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

FormDateTimePicker.displayName = 'FormDateTimePicker';

export { FormDateTimePicker };
