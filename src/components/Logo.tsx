import { cn } from '@/lib/utils';
import { Anchor } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" aria-label="Meridian Logistics Logo">
      <Anchor className="h-8 w-8 text-primary" />
      <div className="flex items-baseline">
        <span className="font-headline text-2xl font-bold text-primary">
          Meridian
        </span>
        <span className="font-headline text-2xl font-semibold text-accent">
          Logistics
        </span>
      </div>
    </div>
  );
}
