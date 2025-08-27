import { useColorScheme } from '@/lib/useColorScheme';
import * as React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

function Input({
  className,
  placeholderClassName,
  appearance = 'default',
  largePlaceholder = false,
  leftIcon,
  rightIcon,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
  appearance?: 'default' | 'soft';
  largePlaceholder?: boolean;
  leftIcon?: () => React.ReactNode
  rightIcon?: () => React.ReactNode

}) {

   const { colorScheme, setColorScheme,isDarkColorScheme } = useColorScheme();
    const isDark = colorScheme == 'dark';
    console.log({isDarkColorScheme})
  return (
    <View className="dark:bg-gray-800 bg-gray-200 rounded-lg px-4 py-4 flex-row items-center">
      {leftIcon?.()}
    <TextInput
      className={cn(
        'web:flex dark:bg-gray-900 dark:text-white web:w-full px-5 rounded-xl  web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        {"bg-gray-900": isDark},
        className
      )}
      placeholderClassName={cn('text-muted-foreground', largePlaceholder && 'text-gray-300', placeholderClassName)}
      {...props}
    />
    {rightIcon?.()}
    </View>
  );
}

export { Input };
