import { ContactForm } from './ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const contactDetails = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contacto@meridianlogistics.com',
    href: 'mailto:contacto@meridianlogistics.com',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Oficina Central',
    value: '123 Calle de la Logística, Puerto Principal, País',
  },
];

export default function ContactPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Póngase en Contacto
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ¿Tiene alguna pregunta o desea hablar sobre sus necesidades logísticas? Estamos aquí para ayudarle.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div className="flex flex-col justify-center space-y-8">
            {contactDetails.map((detail) => (
              <div key={detail.title} className="flex items-start gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <detail.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-semibold">{detail.title}</h3>
                  {detail.href ? (
                    <a href={detail.href} className="text-muted-foreground transition-colors hover:text-primary">
                      {detail.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{detail.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
