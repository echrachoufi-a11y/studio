import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Cta() {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div 
          className="relative overflow-hidden rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-12 bg-cover bg-center"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1616431772126-52722353765e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb250YWluZXJzJTIwdHJ1Y2t8ZW58MHx8fHwxNzE3MDM3NTM0fDA&ixlib=rb-4.0.3&q=80&w=1080')"}}
        >
          <div className="absolute inset-0 bg-primary/70"/>
          <div className="relative z-10">
            <h2 className="font-headline text-3xl font-bold">
              ¿Listo para Optimizar su Logística?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Permítanos mostrarle cómo nuestra experiencia puede beneficiar a su negocio. Contáctenos hoy para una consulta personalizada.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/quote">
                  Solicitar una Cotización <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
