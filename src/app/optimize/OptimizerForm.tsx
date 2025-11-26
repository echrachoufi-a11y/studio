'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Wand2, Loader2, ArrowRight, DollarSign, Timer, Route } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { optimizeShippingRoute, OptimizeShippingRouteOutput } from '@/ai/flows/optimize-shipping-route';

const formSchema = z.object({
  origin: z.string().min(2, 'El origen es obligatorio.'),
  destination: z.string().min(2, 'El destino es obligatorio.'),
  size: z.enum(['Pequeño', 'Mediano', 'Grande']),
  type: z.enum(['Contenedor', 'Carga a Granel', 'Perecedero']),
});

type OptimizerFormValues = z.infer<typeof formSchema>;

export function OptimizerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeShippingRouteOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<OptimizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      destination: '',
      size: 'Mediano',
      type: 'Contenedor',
    },
  });

  async function onSubmit(values: OptimizerFormValues) {
    setLoading(true);
    setResult(null);
    try {
      const aiResponse = await optimizeShippingRoute({
        origin: values.origin,
        destination: values.destination,
        size: values.size,
        type: values.type,
      });
      setResult(aiResponse);
    } catch (error) {
      console.error('AI optimization failed:', error);
      toast({
        title: 'Error de Optimización',
        description: 'No se pudo generar la ruta. Por favor, inténtelo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origen</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Puerto de Hamburgo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Puerto de Buenos Aires" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño del Envío</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tamaño" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pequeño">Pequeño</SelectItem>
                          <SelectItem value="Mediano">Mediano</SelectItem>
                          <SelectItem value="Grande">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Carga</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Contenedor">Contenedor</SelectItem>
                          <SelectItem value="Carga a Granel">Carga a Granel</SelectItem>
                          <SelectItem value="Perecedero">Perecedero</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Optimizando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Optimizar Ruta
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Ruta Optimizada Sugerida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                    <Timer className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Tiempo Estimado</p>
                        <Skeleton className="mt-1 h-5 w-24" />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                    <DollarSign className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Costo Estimado</p>
                        <Skeleton className="mt-1 h-5 w-20" />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 shadow-lg">
          <CardHeader>
            <CardTitle>Ruta Optimizada Sugerida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Route className="h-5 w-5 text-primary" />
                Ruta Propuesta
              </h3>
              <p className="mt-1 text-muted-foreground">{result.optimizedRoute}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                    <Timer className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Tiempo Estimado</p>
                        <p className="font-semibold">{result.estimatedTime}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                    <DollarSign className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Costo Estimado</p>
                        <p className="font-semibold">{result.estimatedCost}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
