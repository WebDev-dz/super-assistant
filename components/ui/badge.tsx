import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { View, ViewProps } from 'react-native';
import { cn } from '~/lib/utils';
import { TextClassContext } from '~/components/ui/text';

const badgeVariants = cva(
  'web:inline-flex items-center border border-border px-3 py-1 rounded-full web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary web:hover:opacity-80 active:opacity-80',
        secondary: 'border-transparent bg-secondary web:hover:opacity-80 active:opacity-80',
        destructive: 'border-transparent bg-destructive web:hover:opacity-80 active:opacity-80',
        success: 'border-transparent bg-green-500 web:hover:opacity-80 active:opacity-80',
        warning: 'border-transparent bg-yellow-500 web:hover:opacity-80 active:opacity-80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-semibold ', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      success: 'text-white',
      warning: 'text-gray-900',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = ViewProps & {
  asChild?: boolean;
} & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

type Priority = 'low' | 'normal' | 'high' | 'urgent';

function getPriorityVariant(priority: Priority): VariantProps<typeof badgeVariants>['variant'] {
  switch (priority) {
    case 'low':
      return 'secondary';
    case 'normal':
      return 'default';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'destructive';
    default:
      return 'default';
  }
}

export { Badge, badgeTextVariants, badgeVariants, getPriorityVariant };
export type { BadgeProps, Priority };
