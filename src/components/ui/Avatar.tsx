import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const avatarVariants = cva(
  'inline-flex flex-shrink-0 select-none items-center justify-center overflow-hidden bg-primary-100 font-bold text-primary',
  {
    variants: {
      size: { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-14 w-14 text-xl' },
      shape: { circle: 'rounded-full', portrait: 'rounded-lg' },
    },
    defaultVariants: { size: 'md', shape: 'circle' },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  name: string;
  className?: string;
}

export function Avatar({ src, name, size, shape, className }: AvatarProps) {
  return (
    <BaseAvatar.Root className={cn(avatarVariants({ size, shape }), className)}>
      {src && <BaseAvatar.Image src={src} alt={name} className="h-full w-full object-cover" />}
      <BaseAvatar.Fallback>{name.charAt(0).toUpperCase()}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
