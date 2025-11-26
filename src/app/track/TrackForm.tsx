'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { ArrowRight, CircleCheck, Loader2, MapPin, Package, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  trackingNumber: z.string().min(5, 'El número de seguimiento es demasiado corto.'),
});

type TrackFormValues = z.infer<typeof formSchema>;

type TrackingInfo = {
  status: string;
  location: string;
  estimatedDelivery: string;
  history: {
    date: string;
    status: string;
    location: string;
  }[];
};

const mockTrackingData: Record<string, TrackingInfo> = {
    'ML12345': {
        status: 'En Tránsito',
        location: 'Océano Atlántico',
        estimatedDelivery: '25 de Julio, 2024',
        history: [
            { date: '15 de Julio, 2024', status: 'En el puerto de origen', location: 'Shanghai, China' },
            { date: '17 de Julio, 2024', status: 'Embarcado', location: 'Shanghai, China' },
            { date: '20 de Julio, 2024', status: 'En tránsito marítimo', location: 'Mar de China Meridional' },
        ],
    },
};

export function TrackForm() {
  const [loading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingNumber: '',
    },
  });

  function onSubmit(values: TrackFormValues) {
    setLoading(true);
    setTrackingInfo(null);
    setError(null);

    setTimeout(() => {
      const data = mockTrackingData[values.trackingNumber.toUpperCase()];
      if (data) {
        setTrackingInfo(data);
      } else {
        setError('No se encontraron resultados para este número de seguimiento.');
      }
      setLoading(false);
    }, 1500);
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Número de Seguimiento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: ML12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Buscando información...</p>
        </div>
      )}

      {error && (
        <Card className="mt-8 border-destructive bg-destructive/10">
          <CardContent className="p-6 text-center text-destructive-foreground">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {trackingInfo && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Resultados del Seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <Package className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-semibold">{trackingInfo.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <MapPin className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación Actual</p>
                  <p className="font-semibold">{trackingInfo.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <Clock className="h-8 w-8 text-primary"/>
                <div>
                  <p className="text-sm text-muted-foreground">Entrega Estimada</p>
                  <p className="font-semibold">{trackingInfo.estimatedDelivery}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 font-headline text-lg">Historial del Envío</h3>
              <div className="relative space-y-6 border-l-2 border-border pl-8">
                {trackingInfo.history.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[38px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <CircleCheck className="h-4 w-4 text-primary-foreground"/>
                    </div>
                    <p className="font-semibold">{item.status}</p>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </>
  );
}
