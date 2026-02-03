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
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  usuari: z.string().min(1, { message: "L'usuari és obligatori." }),
  password: z.string().min(1, { message: 'La contrasenya és obligatòria.' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function normalizeUserData(rawData: any): any | null {
    if (!rawData || typeof rawData !== 'object') return null;
    const normalizedData: { [key: string]: any } = {};
    for (const key in rawData) {
        if (Object.prototype.hasOwnProperty.call(rawData, key)) {
            const trimmedKey = key.trim().toLowerCase();
            normalizedData[trimmedKey] = rawData[key];
        }
    }
    return normalizedData;
}

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

    const { usuari: inputUsuari, password: inputPassword } = data;

    try {
      // Usar 'usuaris' como nombre de pestaña estándar
      const url = `https://sheetdb.io/api/v1/kymb6tvlvb694?sheet=usuaris`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('No es pot connectar amb el servidor de dades.');
      }

      const allUsers = await response.json();
      const normalizedUsers = allUsers.map(normalizeUserData).filter(Boolean);
      
      const foundUser = normalizedUsers.find(
        (user: any) => 
            user.usuari && user.password &&
            user.usuari.toString().trim().toLowerCase() === inputUsuari.trim().toLowerCase() &&
            user.password.toString().trim() === inputPassword.trim()
      );

      if (foundUser) {
        const nom = foundUser.nom || foundUser.usuari || 'Usuari';
        const empresa = foundUser.empresa || 'Empresa No Definida';
        
        // Guardar dades i forçar redirecció
        localStorage.setItem('userData', JSON.stringify({ nom, empresa }));
        
        // Forçar un refresh per assegurar que el Header veu els canvis immediatament si fos necessari
        router.push('/dashboard');
      } else {
        setError('Dades incorrectes. Verifica el teu usuari i contrasenya.');
      }

    } catch (e) {
      console.error(e);
      setError('Error de connexió. Si us plau, torna-ho a provar més tard.');
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
            <Label htmlFor="usuari">Usuari</Label>
            <Input
              id="usuari"
              type="text"
              placeholder="El teu usuari"
              {...register('usuari')}
            />
            {errors.usuari && <p className="text-sm text-destructive">{errors.usuari.message}</p>}
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