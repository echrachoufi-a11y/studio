import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Ship, Truck } from 'lucide-react';

const services = [
  {
    icon: Ship,
    title: 'Transporte Marítimo',
    description: 'Soluciones globales para carga de contenedor completo (FCL) y consolidada (LCL), garantizando seguridad y puntualidad.',
  },
  {
    icon: Truck,
    title: 'Transporte Terrestre',
    description: 'Red de transporte nacional e internacional para una entrega eficiente y fiable de su mercancía puerta a puerta.',
  },
  {
    icon: FileText,
    title: 'Gestión de Aduanas',
    description: 'Expertos en normativa aduanera para agilizar los despachos y asegurar el cumplimiento en todas sus importaciones y exportaciones.',
  },
];

export function Services() {
  return (
    <section 
      id="services" 
      className="relative w-full bg-background py-16 md:py-24 bg-cover bg-center bg-fixed"
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1613684815333-d5398939b49f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXB8ZW58MHx8fHwxNzE3MDM3MzUxfDA&ixlib=rb-4.0.3&q=80&w=1080')"}}
    >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Nuestra Experiencia a su Servicio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Desde el origen hasta el destino, gestionamos cada paso de su cadena de suministro con profesionalismo y dedicación.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 bg-card/80">
              <CardHeader className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <service.icon className="h-10 w-10" />
                </div>
                <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0 text-center">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
