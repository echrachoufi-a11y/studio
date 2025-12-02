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
           <defs>
                <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            
            {/* <!-- Ship Body --> */}
            <path 
                d="M10 38 L 54 38 L 50 48 L 14 48 Z"
                fill="hsl(var(--primary))"
            />
            
            {/* <!-- Containers --> */}
            <rect x="15" y="32" width="10" height="6" fill="hsl(var(--card))" />
            <rect x="26" y="32" width="10" height="6" fill="hsl(var(--card))" />
            <rect x="37" y="32" width="10" height="6" fill="hsl(var(--card))" />

             {/* <!-- Bridge --> */}
            <path
                d="M48 32 L 48 26 L 44 26 L 44 32 Z"
                 fill="hsl(var(--primary-foreground))"
                 stroke="hsl(var(--primary))"
                 strokeWidth="0.5"
            />
            
            {/* <!-- Sea Waves --> */}
            <path 
                d="M4,52 C12,44 20,56 32,52 C44,48 52,60 60,52 L60,60 L4,60 Z"
                fill="url(#seaGradient)"
            />
            <path
                 d="M4,56 C12,48 20,60 32,56 C44,52 52,64 60,56"
                 fill="none"
                 stroke="hsl(var(--primary-foreground))"
                 strokeWidth="1"
                 strokeOpacity="0.5"
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
