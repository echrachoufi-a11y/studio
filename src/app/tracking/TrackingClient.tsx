'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Search, Loader2, XCircle, Package, MapPin, Calendar, Clock, Anchor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  tracking_code: z.string().min(3, 'El codi ha de tenir almenys 3 caràcters.'),
});

type TrackFormValues = z.infer<typeof formSchema>;

type TrackingInfo = {
    id: string;
    tracking_code: string;
    origen: string;
    desti: string;
    estat: 'En magatzem' | 'En trànsit' | 'Lliurat';
    ubicacio_actual: string;
    eta: string;
};

const statusConfig = {
    'En magatzem': { progress: 10, color: 'bg-yellow-500', icon: <Anchor className="h-5 w-5" /> },
    'En trànsit': { progress: 50, color: 'bg-primary', icon: <Clock className="h-5 w-5" /> },
    'Lliurat': { progress: 100, color: 'bg-green-500', icon: <Package className="h-5 w-5" /> },
};


export function TrackingClient() {
  const [loading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tracking_code: '',
    },
  });

  async function onSubmit(values: TrackFormValues) {
    setLoading(true);
    setTrackingInfo(null);
    setError(null);

    try {
        const response = await fetch(`https://sheetdb.io/api/v1/2v03n23o1ksd9/search?tracking_code=${values.tracking_code}`);
        const data = await response.json();

        if (data.length > 0) {
            setTrackingInfo(data[0]);
        } else {
            setError('Codi no trobat. Si us plau, verifica el codi i torna a intentar-ho.');
        }
    } catch (e) {
        setError('Hi ha hagut un error en la connexió. Si us plau, intenta-ho més tard.');
    } finally {
        setLoading(false);
    }
  }

  const currentStatus = trackingInfo?.estat ? statusConfig[trackingInfo.estat] : null;

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="tracking_code"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="Introdueix el teu codi..." {...field} className="h-12 text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-12" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="ml-2 hidden md:inline">Cercar</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Buscant informació...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
      )}

      {trackingInfo && currentStatus && (
        <Card className="mt-8 animate-in fade-in-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Resultats del Seguiment</span>
                <span className="text-sm font-mono text-muted-foreground">{trackingInfo.tracking_code}</span>
            </CardTitle>
            <CardDescription>Informació detallada del teu enviament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className='space-y-3'>
                <div className="flex items-center gap-2 text-lg">
                    {currentStatus.icon}
                    <span className="font-semibold">{trackingInfo.estat}</span>
                </div>
                <Progress value={currentStatus.progress} indicatorClassName={currentStatus.color} />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>En magatzem</span>
                    <span>En trànsit</span>
                    <span>Lliurat</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <MapPin className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Ubicació Actual</p>
                  <p className="font-semibold">{trackingInfo.ubicacio_actual}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <Calendar className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Data Prevista (ETA)</p>
                  <p className="font-semibold">{trackingInfo.eta}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <Package className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Origen</p>
                  <p className="font-semibold">{trackingInfo.origen}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <Package className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Destí</p>
                  <p className="font-semibold">{trackingInfo.desti}</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </>
  );
}
