import { OptimizerForm } from './OptimizerForm';

export default function OptimizerPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Optimizador de Rutas con IA
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Utilice nuestra herramienta de planificación para obtener sugerencias de rutas optimizadas por IA. Analizamos distancia, tráfico y eficiencia aduanera para encontrar la mejor opción.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <OptimizerForm />
        </div>
      </div>
    </div>
  );
}
