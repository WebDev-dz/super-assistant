// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui

import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  Noop,
  useFormContext,
} from 'react-hook-form';
import { View, Platform } from 'react-native';
import * as DocumentPicker from "expo-document-picker"
import { FilePicker } from './file-picker';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
// For Expo projects, use: import DateTimePicker from 'expo-date-time-picker';
import RNDateTimePicker from "@react-native-community/datetimepicker"
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetOpenTrigger,
  BottomSheetView,
} from '~/components/deprecated-ui/bottom-sheet';
import { Calendar } from '~/components/deprecated-ui/calendar';
import { Combobox, ComboboxOption } from '~/components/deprecated-ui/combobox';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup } from '~/components/ui/radio-group';
import { Select, type Option } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { Calendar as CalendarIcon } from '~/lib/icons/Calendar';
import { X } from '~/lib/icons/X';
import { cn } from '~/lib/utils';
import { Text } from './text';
import { useColorScheme } from '@/lib/useColorScheme';
import { Clock1Icon } from 'lucide-react-native';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { nativeID } = itemContext;

  return {
    nativeID,
    name: fieldContext.name,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};

type FormItemContextValue = {
  nativeID: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
  const nativeID = React.useId();

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View ref={ref!} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  Omit<React.ComponentPropsWithoutRef<typeof Label>, 'children'> & {
    children: string;
  }
>(({ className, nativeID: _nativeID, ...props }, ref) => {
  const { error, formItemNativeID } = useFormField();

  return (
    <Label
        // @ts-ignore
      ref={ref!}
      className={cn('pb-1 mb-2 native:pb-2 px-px', error && 'text-destructive', className)}
      nativeID={formItemNativeID}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<
  React.ComponentRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
  const { formDescriptionNativeID } = useFormField();

  return (
    <Text
    // @ts-ignore
      ref={ref!}
      nativeID={formDescriptionNativeID}
      className={cn('text-sm text-muted-foreground pt-1', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  React.ComponentRef<typeof Animated.Text>,
  React.ComponentPropsWithoutRef<typeof Animated.Text>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageNativeID } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <Animated.Text
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      ref={ref!}
      nativeID={formMessageNativeID}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </Animated.Text>
  );
});
FormMessage.displayName = 'FormMessage';

type Override<T, U> = Omit<T, keyof U> & U;

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

const FormTextarea = React.forwardRef<
  React.ComponentRef<typeof Textarea>,
  FormItemProps<typeof Textarea, string>
>(({ label, description, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<React.ComponentRef<typeof Textarea>>(null);
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  React.useImperativeHandle(
    ref,
    () => {
      if (!textareaRef.current) {
        return {} as React.ComponentRef<typeof Textarea>;
      }
      return textareaRef.current;
    },
    [textareaRef.current]
  );

  function handleOnLabelPress() {
    if (!textareaRef.current) {
      return;
    }
    if (textareaRef.current.isFocused()) {
      textareaRef.current?.blur();
    } else {
      textareaRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
          {label}
        </FormLabel>
      )}

      <Textarea
          // @ts-ignore
        ref={textareaRef}
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

FormTextarea.displayName = 'FormTextarea';

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

const FormDatePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Calendar, string>
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
            {({ pressed }) => (
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
              style={{ height: 358,  }}
                  // @ts-ignore
              
              onDayPress={(day) => {
                onChange?.(day.dateString === value ? '' : day.dateString);
              }}
              markedDates={{
                [value ?? '']: {
                  selected: true,
                },
              }}

              theme = {{
                textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
                timeLabel: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                }
                
              }}
              
              current={value} // opens calendar on selected date
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

// Fixed FormTimePicker - not nested in BottomSheet
const FormTimePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Button, string> & {
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
    // Always dismiss the picker first
    setShowTimePicker(false);
    
    if (selectedTime && event.type !== 'dismissed') {
      onChange?.(selectedTime.toISOString());
    }
  };

  // Clean up on unmount
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

// Fixed FormDateTimePicker component
const FormDateTimePicker = React.forwardRef<
  React.ComponentRef<typeof Button>,
  FormItemProps<typeof Button, string> & {
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
      // Show time picker after date is selected
      setTimeout(() => {
        setShowTimePicker(true);
      }, 100); // Small delay to ensure proper cleanup
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime && event.type !== 'dismissed' && tempDate) {
      // Combine date and time
      const combinedDateTime = new Date(tempDate);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      combinedDateTime.setSeconds(selectedTime.getSeconds());
      
      onChange?.(combinedDateTime.toISOString());
    }
    
    // Clean up temp state
    setTempDate(null);
  };

  // Clean up on unmount
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
        {({ pressed }) => (
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

      {/* Render only one picker at a time */}
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

const FormCombobox = React.forwardRef<
  React.ComponentRef<typeof Combobox>,
  FormItemProps<typeof Combobox, ComboboxOption | null>
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Combobox
        ref={ref!}
        placeholder='Select framework'
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        selectedItem={value}
        onSelectedItemChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormCombobox.displayName = 'FormCombobox';

/**
 * @prop {children} 
 * @example
 *  <SelectTrigger className='w-[250px]'>
      <SelectValue
        className='text-foreground text-sm native:text-lg'
        placeholder='Select a fruit'
      />
    </SelectTrigger>
    <SelectContent insets={contentInsets} className='w-[250px]'>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem label='Apple' value='apple'>
          Apple
        </SelectItem>
      </SelectGroup>
    </SelectContent>
 */
const FormSelect = React.forwardRef<
  React.ComponentRef<typeof Select>,
  Omit<FormItemProps<typeof Select, Partial<Option>>, 'open' | 'onOpenChange' | 'onValueChange'>
>(({ label, description, onChange, value, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select
        ref={ref!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        value={value ? { label: value?.label ?? '', value: value?.label ?? '' } : undefined}
        onValueChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormSelect.displayName = 'FormSelect';

const FormSwitch = React.forwardRef<
  React.ComponentRef<typeof Switch>,
  Omit<FormItemProps<typeof Switch, boolean>, 'checked' | 'onCheckedChange'>
>(({ label, description, value, onChange, ...props }, ref) => {
  const switchRef = React.useRef<React.ComponentRef<typeof Switch>>(null);
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  React.useImperativeHandle(
    ref,
    () => {
      if (!switchRef.current) {
        return {} as React.ComponentRef<typeof Switch>;
      }
      return switchRef.current;
    },
    [switchRef.current]
  );

  function handleOnLabelPress() {
    onChange?.(!value);
  }

  return (
    <FormItem className='px-1'>
      <View className='flex-row gap-3 items-center'>
        <Switch
            // @ts-ignore
          ref={switchRef}
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

FormSwitch.displayName = 'FormSwitch';

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

export {
  Form,
  FormCheckbox,
  FormCombobox,
  FormDatePicker,
  FormDateTimePicker,
  FormDescription,
  FormField,
  FormFilePicker,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
  FormTimePicker,
  useFormField,
};