import * as React from 'react';
import { View } from 'react-native';
import { Button, buttonTextVariants } from '../button';
import type { ButtonChildrenProps } from './button-types';
import { FormItem } from './form';
import { FormLabel } from './form-label';
import { FormDescription } from './form-description';
import { FormMessage } from './form-message';
import { useFormField } from './form';
import { Calendar } from '~/components/deprecated-ui/calendar';
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetOpenTrigger,
  BottomSheetView,
} from '~/components/deprecated-ui/bottom-sheet';
import { useColorScheme } from '@/lib/useColorScheme';
import { Calendar as CalendarIcon } from '~/lib/icons/Calendar';
import { X } from '~/lib/icons/X';
import { cn } from '~/lib/utils';
import { Text } from '../text';
import type { Override } from './types';

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

const FormDatePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Calendar, string> & ButtonChildrenProps
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <BottomSheet>
        <BottomSheetOpenTrigger asChild>
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
          >
            {({ pressed }: { pressed: boolean }) => (
              <>
                <CalendarIcon
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
                  {value ? (new Date(value).toDateString()) : 'Pick a date'}
                </Text>
                {!!value && (
                  <Button
                    className='absolute right-0 active:opacity-70 native:pr-3'
                    variant='ghost'
                    onPress={() => {
                      onChange?.('');
                    }}
                  >
                    <X size={18} className='text-muted-foreground text-xs' />
                  </Button>
                )}
              </>
            )}
          </Button>
        </BottomSheetOpenTrigger>
        <BottomSheetContent>
          <BottomSheetView hadHeader={false} className='pt-2'>
            <Calendar
              style={{ height: 358 }}
              onDayPress={(day) => {
                onChange?.(day.dateString === value ? '' : day.dateString);
              }}
              markedDates={{
                [value ?? '']: {
                  selected: true,
                },
              }}
              theme={{
                textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
                timeLabel: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                }
              }}
              current={value}
              {...props}
            />
            <View className={'pb-2 pt-4'}>
              <BottomSheetCloseTrigger asChild>
                <Button>
                  <Text>Close</Text>
                </Button>
              </BottomSheetCloseTrigger>
            </View>
          </BottomSheetView>
        </BottomSheetContent>
      </BottomSheet>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormDatePicker.displayName = 'FormDatePicker';

export { FormDatePicker };
