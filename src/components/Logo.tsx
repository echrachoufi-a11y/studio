import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

function ShipIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M2 21c.6.5 1.2 1 2.5 1 1.9 0 2.5-1.5 5-1.5s3.1 1.5 5 1.5c1.3 0 1.9-.5 2.5-1" />
            <path d="M19.6 19.5c.4.2.8.4 1.4.5" />
            <path d="M3 21V10l9-6 9 6v11" />
            <path d="M12 15V4" />
            <path d="M8 7l4-2.5" />
            <path d="M16 7l-4-2.5" />
        </svg>
    );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" aria-label="Meridian Logistics Logo">
      <ShipIcon className="h-8 w-8 text-primary" />
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
