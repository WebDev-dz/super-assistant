import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

function Textarea({
  className,
  multiline = true,
  numberOfLines = 4,
  placeholderClassName,
  appearance = 'default',
  largePlaceholder = false,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
  appearance?: 'default' | 'soft';
  largePlaceholder?: boolean;
}) {
  return (
    <TextInput
      className={cn(
        'web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        appearance === 'soft' && 'bg-gray-50 border-gray-200 rounded-xl px-4 py-4',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', largePlaceholder && 'text-gray-300', placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical='top'
      {...props}
    />
  );
}

export { Textarea };
