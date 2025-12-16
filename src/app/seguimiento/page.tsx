import { SeguimientoClient } from './SeguimientoClient';

export const metadata = {
  title: "Seguiment d'Enviaments | Meridian Logistics",
  description: 'Localitza el teu enviament en temps real i coneix el seu estat actual.',
};

export default function SeguimientoPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Localitza el teu enviament
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Introdueix el teu codi de seguiment per obtenir informació actualitzada sobre la ubicació i l'estat del teu paquet.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <SeguimientoClient />
        </div>
      </div>
    </div>
  );
}
