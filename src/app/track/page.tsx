import { TrackForm } from './TrackForm';

export default function TrackPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Rastrear su Envío
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Introduzca su número de seguimiento para ver el estado actual y la ubicación de su mercancía en tiempo real.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <TrackForm />
        </div>
      </div>
    </div>
  );
}
