import { QuoteForm } from './QuoteForm';

export default function QuotePage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Solicitar una Cotización
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Complete el formulario a continuación y uno de nuestros especialistas en logística se pondrá en contacto con usted a la brevedad.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
            <QuoteForm />
        </div>
      </div>
    </div>
  );
}
