import * as React from 'react';
import { Text } from '../text';
import { cn } from '~/lib/utils';
import { useFormField } from './form';

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

export { FormDescription };
