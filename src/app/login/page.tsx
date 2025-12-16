import { LoginForm } from './LoginForm';

export const metadata = {
  title: "Accés d'Usuaris | Meridian Logistics",
  description: 'Inicia sessió per accedir al teu panell de control personalitzat.',
};

export default function LoginPage() {
  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 md:px-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              Benvingut de nou
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Introdueix les teves credencials per accedir.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
