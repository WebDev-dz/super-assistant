import * as React from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { cn } from '~/lib/utils';
import { useFormField } from './form';

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

export { FormMessage };
