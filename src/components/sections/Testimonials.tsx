import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    id: 1,
    name: 'Juan Pérez',
    title: 'Director de Operaciones, Importaciones Global S.A.',
    quote: 'El profesionalismo y la eficiencia de Meridian Logistics han sido clave para optimizar nuestra cadena de suministro. Su equipo de aduanas es simplemente el mejor.',
    imageId: 'testimonial-1',
  },
  {
    id: 2,
    name: 'Ana García',
    title: 'Gerente de Logística, TextilExport',
    quote: 'Desde que trabajamos con Meridian, nuestros envíos marítimos llegan siempre a tiempo. Su plataforma de seguimiento nos da una tranquilidad invaluable.',
    imageId: 'testimonial-2',
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    title: 'CEO, Tech Components Ltd.',
    quote: 'La atención al detalle y la comunicación proactiva son lo que distingue a Meridian. Un socio logístico en el que realmente podemos confiar.',
    imageId: 'testimonial-3',
  },
];

export function Testimonials() {
  const images = PlaceHolderImages;

  return (
    <section className="w-full bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            La Confianza de Nuestros Clientes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Historias reales de empresas que han transformado su logística con nosotros.
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-12 w-full max-w-4xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const image = images.find((img) => img.id === testimonial.imageId);
              return (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col justify-between p-6">
                        <blockquote className="text-lg italic text-foreground">
                          “{testimonial.quote}”
                        </blockquote>
                        <div className="mt-6 flex items-center gap-4">
                          {image && (
                            <Image
                              src={image.imageUrl}
                              alt={`Retrato de ${testimonial.name}`}
                              data-ai-hint={image.imageHint}
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px] hidden lg:inline-flex" />
          <CarouselNext className="right-[-50px] hidden lg:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
