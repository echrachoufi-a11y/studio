'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'El nom d\'usuari és obligatori.' }),
  password: z.string().min(1, { message: 'La contrasenya és obligatòria.' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setError(null);

    const { username, password } = data;

    try {
      const response = await fetch(
        `https://sheetdb.io/api/v1/kltblqn245xln/search?sheet=usuaris&usuari=${encodeURIComponent(username)}&contrasenya=${encodeURIComponent(password)}`
      );

      if (!response.ok) {
        setError('Error en la connexió amb el servidor. Intenta-ho de nou més tard.');
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.length > 0) {
        const user = result[0];
        // Guardar dades a localStorage
        localStorage.setItem('userData', JSON.stringify({ nom: user.nom, empresa: user.empresa }));
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        setError('Dades incorrectes. Si us plau, verifica el teu usuari i contrasenya.');
      }
    } catch (e) {
      console.error(e);
      setError('Hi ha hagut un problema de connexió. Intenta-ho de nou més tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error d'accés</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Usuari</Label>
            <Input
              id="username"
              type="text"
              placeholder="El teu nom d'usuari"
              {...register('username')}
            />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contrasenya</Label>
            <Input
              id="password"
              type="password"
              placeholder="La teva contrasenya"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificant...
              </>
            ) : (
              <>
                Entrar <LogIn className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
