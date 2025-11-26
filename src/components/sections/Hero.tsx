import Image from 'next/image';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoveRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full md:h-[80vh]">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />

      <div className="relative z-10 flex h-full items-end justify-start text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-headline text-4xl font-bold leading-tight tracking-tighter text-white md:text-6xl lg:text-7xl">
              Soluciones Logísticas Globales a su Alcance
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">
              Conectamos su negocio con el mundo. Ofrecemos servicios de transporte marítimo, terrestre y gestión aduanera con la máxima eficiencia y seguridad.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/quote">
                  Obtener una Cotización <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white backdrop-blur-sm hover:bg-white/10">
                <Link href="/#services">
                  Nuestros Servicios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
