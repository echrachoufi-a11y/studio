import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

function CustomLogoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="64"
            height="64"
            {...props}
        >
            <path 
                d="M32 4.2c-2 0-3.8 1.4-4.2 3.3l-1.3 6.5h11l-1.3-6.5c-0.4-1.9-2.2-3.3-4.2-3.3zM14 18c-2.2 0-4 1.8-4 4s1.8 4 4 4h4.4l6.3 8.8h8.6l6.3-8.8H46c2.2 0 4-1.8 4-4s-1.8-4-4-4H14zM4.2 32c0-2 1.4-3.8 3.3-4.2l6.5-1.3v11l-6.5-1.3C5.6 35.8 4.2 34 4.2 32zM32 59.8c2 0 3.8-1.4 4.2-3.3l1.3-6.5h-11l1.3 6.5c0.4 1.9 2.2 3.3 4.2 3.3zM59.8 32c0 2-1.4 3.8-3.3 4.2l-6.5 1.3v-11l6.5 1.3c1.9 0.4 3.3 2.2 3.3 4.2zM15.1 46.2c-1.4-1.4-1.4-3.7 0-5.1l4.6-4.6h1.6l-6.2 6.2c-0.7 0.7-0.7 1.8 0 2.5l2.5 2.5c0.7 0.7 1.8 0.7 2.5 0l6.2-6.2v1.6l-4.6 4.6c-1.4 1.4-3.7 1.4-5.1 0zM48.9 46.2c1.4-1.4 1.4-3.7 0-5.1l-4.6-4.6h-1.6l6.2 6.2c0.7 0.7 0.7 1.8 0 2.5l-2.5 2.5c-0.7 0.7-1.8 0.7-2.5 0l-6.2-6.2v1.6l4.6 4.6c1.4 1.4 3.7 1.4 5.1 0zM19.7 17.8l-4.6 4.6c-1.4 1.4-1.4 3.7 0 5.1l5.1 5.1h1.6L15.6 26.4c-0.7-0.7-0.7-1.8 0-2.5l2.5-2.5c0.7-0.7 1.8-0.7 2.5 0l6.2 6.2v-1.6l-6.2-6.2c-1.4-1.4-3.7-1.4-5.1 0zM44.3 17.8l4.6 4.6c1.4 1.4 1.4 3.7 0 5.1l-5.1 5.1h-1.6l6.2-6.2c0.7-0.7 0.7-1.8 0-2.5l-2.5-2.5c-0.7-0.7-1.8-0.7-2.5 0l-6.2 6.2v-1.6l6.2-6.2c1.4-1.4 3.7-1.4 5.1 0z"
                fill="hsl(var(--primary))"
            />
            <path
                d="M32 18c-4.4 0-8 3.6-8 8v1.4c0 1.1 0.9 2 2 2h4v8.6c0 1.1 0.9 2 2 2s2-0.9 2-2V29.4h4c1.1 0 2-0.9 2-2V26c0-4.4-3.6-8-8-8z"
                fill="hsl(var(--accent))"
            />
             <path
                d="M32 18c4.4 0 8 3.6 8 8v2c0 1.1-0.9 2-2 2h-6V18z"
                fill="hsl(var(--primary-foreground))"
            />
        </svg>
    );
}


export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" aria-label="Meridian Logistics Logo">
      <CustomLogoIcon className="h-8 w-8" />
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
