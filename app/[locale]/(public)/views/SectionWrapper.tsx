import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  className?: string;
}>;

export default async function SectionWrapper({ className, children }: Props) {
  return (
    <div
      className={cn(
        'bg-section-background text-foreground p-6 md:p-10 w-full mx-auto rounded-xl border border-section-border [box-shadow:var(--shadow-section)] backdrop-blur-[2px] my-4 md:my-6 hover-lift animate-fadeInScale overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );
}
