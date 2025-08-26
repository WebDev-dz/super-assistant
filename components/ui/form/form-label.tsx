import * as React from 'react';
import { Label } from '../label';
import { useFormField } from './form';
import { cn } from '~/lib/utils';

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

export { FormLabel };
