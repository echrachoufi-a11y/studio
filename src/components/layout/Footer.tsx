import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const footerLinks = {
  servicios: [
    { href: '/#services', label: 'Transporte Marítimo' },
    { href: '/#services', label: 'Transporte Terrestre' },
    { href: '/#services', label: 'Gestión de Aduanas' },
    { href: '/quote', label: 'Cotizaciones' },
  ],
  empresa: [
    { href: '#', label: 'Sobre Nosotros' },
    { href: '#', label: 'Carreras' },
    { href: '/contact', label: 'Contacto' },
  ],
  legal: [
    { href: '#', label: 'Términos de Servicio' },
    { href: '#', label: 'Política de Privacidad' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 inline-block">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Su socio de confianza en logística global, ofreciendo soluciones eficientes y seguras.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <h3 className="mb-4 font-headline text-base font-semibold">Servicios</h3>
              <ul className="space-y-3">
                {footerLinks.servicios.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-headline text-base font-semibold">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-headline text-base font-semibold">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Meridian Logistics. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <Button key={social.label} variant="ghost" size="icon" asChild>
                <a href={social.href} aria-label={social.label}>
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
