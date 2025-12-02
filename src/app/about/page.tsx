import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Ship, Truck, FileText, Users, Globe, Target } from 'lucide-react';

const teamMembers = [
  {
    name: 'Juan Pérez',
    role: 'CEO y Fundador',
    imageId: 'testimonial-1',
  },
  {
    name: 'Ana García',
    role: 'Directora de Operaciones',
    imageId: 'testimonial-2',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Jefe de Logística',
    imageId: 'testimonial-3',
  },
];

const values = [
    {
      icon: Target,
      title: 'Nuestra Misión',
      description: 'Facilitar el comercio global a través de soluciones logísticas innovadoras y confiables, superando las expectativas de nuestros clientes en cada envío.',
    },
    {
      icon: Globe,
      title: 'Nuestra Visión',
      description: 'Ser el socio logístico líder a nivel mundial, reconocido por nuestra excelencia operativa, compromiso con la sostenibilidad y la transformación digital del sector.',
    },
    {
      icon: Users,
      title: 'Nuestros Valores',
      description: 'Integridad, eficiencia, innovación y un enfoque centrado en el cliente son los pilares de nuestra cultura corporativa y guían todas nuestras acciones.',
    },
  ];

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'about-us-hero');
  const memberImages = PlaceHolderImages;

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full">
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
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className="container px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-white md:text-6xl">
              Conectando el Mundo, Entrega por Entrega
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">
              Somos Meridian Logistics, un equipo de apasionados por la logística dedicados a mover el mundo de manera más inteligente.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Nuestra Filosofía
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Impulsados por la innovación y un compromiso inquebrantable con el éxito de nuestros clientes.
                </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
                <div key={value.title} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">{value.title}</h3>
                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                </div>
            ))}
            </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Conozca a Nuestro Equipo Directivo
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              La experiencia y el liderazgo que guían nuestra compañía hacia el futuro.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map((member) => {
              const image = memberImages.find((img) => img.id === member.imageId);
              return (
                <div key={member.name} className="text-center">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={`Retrato de ${member.name}`}
                      data-ai-hint={image.imageHint}
                      width={128}
                      height={128}
                      className="mx-auto h-32 w-32 rounded-full object-cover"
                    />
                  )}
                  <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                  <p className="text-md text-primary">{member.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
