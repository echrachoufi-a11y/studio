'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  History, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  MapPin,
  Box
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  nom: string;
  usuari: string;
}

interface Solicitud {
  id: string;
  data: string;
  usuari: string;
  estat: string;
  detalls: string;
}

const SHEET_DB_ID = 'kltblqn245xln';

export default function BookingPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solicituds, setSolicituds] = useState<Solicitud[]>([]);
  const [fetchingSolicituds, setFetchingSolicituds] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [service, setService] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargo, setCargo] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (!stored) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(stored);
    setUserData(parsed);
    fetchMySolicituds(parsed.usuari);
    setLoading(false);
  }, [router]);

  const fetchMySolicituds = async (username: string) => {
    setFetchingSolicituds(true);
    try {
      const res = await fetch(`https://sheetdb.io/api/v1/${SHEET_DB_ID}?sheet=solicituds`);
      if (!res.ok) throw new Error('Error al carregar l\'històric');
      const data = await res.json();
      
      // Filtrem per l'usuari actual (insensible a majúscules i netejant espais)
      const filtered = data.filter((s: any) => 
        s.usuari?.toString().toLowerCase().trim() === username.toLowerCase().trim()
      );
      setSolicituds(filtered.reverse()); // Les més recents primer
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingSolicituds(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !origin || !destination || !cargo) {
      toast({
        title: "Camps incomplets",
        description: "Si us plau, omple tots els camps per fer la reserva.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('ca-ES');
    const detailsConcatenated = `Servei: ${service} | Origen: ${origin} | Destí: ${destination} | Càrrega: ${cargo}`;

    const newEntry = {
      id: bookingId,
      data: today,
      usuari: userData?.usuari,
      estat: 'Pendent',
      detalls: detailsConcatenated
    };

    try {
      const response = await fetch(`https://sheetdb.io/api/v1/${SHEET_DB_ID}?sheet=solicituds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [newEntry] }),
      });

      if (!response.ok) throw new Error('Error al desar la reserva');

      toast({
        title: "Reserva enviada",
        description: `La teva sol·licitud ${bookingId} s'ha registrat correctament.`,
      });

      // Reset form
      setOrigin('');
      setDestination('');
      setCargo('');
      setService('');
      
      // Refresh list
      if (userData) fetchMySolicituds(userData.usuari);
    } catch (error) {
      toast({
        title: "Error",
        description: "No s'ha pogut enviar la sol·licitud. Torna-ho a provar.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase().trim();
    if (s === 'aprovat' || s === 'completat') {
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Aprovat</Badge>;
    }
    if (s === 'pendent') {
      return <Badge className="bg-yellow-500 text-black hover:bg-yellow-600"><Clock className="mr-1 h-3 w-3" /> Pendent</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full bg-background py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Gestió de Comandes
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Gestiona les teves sol·licituds de transport i logística de manera ràpida.
            </p>
          </div>

          {/* Formulari */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Nova Sol·licitud de Booking
              </CardTitle>
              <CardDescription>Omple les dades del teu enviament per obtenir una proposta.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="service">Tipus de Servei</Label>
                    <Select onValueChange={setService} value={service}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Selecciona el servei" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transport Marítim">Transport Marítim</SelectItem>
                        <SelectItem value="Transport Aeri">Transport Aeri</SelectItem>
                        <SelectItem value="Transport Terrestre">Transport Terrestre</SelectItem>
                        <SelectItem value="Magatzem">Magatzem i Logística</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Detalls de la Càrrega</Label>
                    <Input 
                      id="cargo" 
                      placeholder="Ex: 2 contenidors, 500kg, mides..." 
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origen</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="origin" 
                        className="pl-10" 
                        placeholder="Ciutat o Port d'origen" 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destí</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="destination" 
                        className="pl-10" 
                        placeholder="Ciutat o Port de destí" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviant...
                    </>
                  ) : (
                    <>
                      Enviar Sol·licitud <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Històric */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                Les meves sol·licituds
              </h2>
              <Button variant="ghost" size="sm" onClick={() => userData && fetchMySolicituds(userData.usuari)}>
                Actualitzar
              </Button>
            </div>

            {fetchingSolicituds ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : solicituds.length > 0 ? (
              <div className="grid gap-4">
                {solicituds.map((s) => (
                  <Card key={s.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-primary">{s.id}</span>
                            <span className="text-xs text-muted-foreground">{s.data}</span>
                            {getStatusBadge(s.estat)}
                          </div>
                          <div className="flex items-start gap-2">
                            <Box className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                            <p className="text-sm font-medium leading-relaxed">
                              {s.detalls}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-xs text-muted-foreground uppercase font-bold">Usuari</span>
                           <span className="text-sm font-semibold">{s.usuari}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed py-12 text-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <AlertCircle className="h-10 w-10" />
                  <p>Encara no has realitzat cap sol·licitud.</p>
                </div>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
