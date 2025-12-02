import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Meridian Logistics Logo">
      {/* 
        INSTRUCCIÓ: 
        Aquest codi mostrarà la imatge 'logo.png' que has de pujar a la carpeta 'public'.
        Pots ajustar 'width' i 'height' si el teu logo té altres dimensions.
      */}
      <Image 
        src="/logo.png" 
        alt="Meridian Logistics Logo"
        width={40} 
        height={40} 
        className="h-10 w-10"
      />
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
