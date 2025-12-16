'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, User, LogOut, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
  nom: string;
  empresa: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading || !userData) {
      return (
        <div className="w-full bg-background py-16 md:py-24">
            <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 md:px-6">
                <div className="flex items-center space-x-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Carregant el teu perfil...</p>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${userData.nom}`} alt={userData.nom} />
                        <AvatarFallback>{getInitials(userData.nom)}</AvatarFallback>
                    </Avatar>
                </div>
              <CardTitle className="text-3xl font-bold">Benvingut a la teva zona privada, {userData.nom}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Aquest és el teu panell de control personalitzat.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-6">
              <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                <Building className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                  <p className="font-semibold">{userData.empresa}</p>
                </div>
              </div>
               <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom d'Usuari</p>
                  <p className="font-semibold">{userData.nom}</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Tancar Sessió
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
