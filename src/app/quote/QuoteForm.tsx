'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { handleQuoteRequest } from '../actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio.'),
  company: z.string().optional(),
  email: z.string().email('Email inválido.'),
  phone: z.string().min(5, 'Número de teléfono inválido.'),
  origin: z.string().min(2, 'El origen es obligatorio.'),
  destination: z.string().min(2, 'El destino es obligatorio.'),
  shipmentType: z.enum(['FCL', 'LCL', 'Bulk', 'Terrestre']),
  cargoDetails: z.string().min(10, 'Por favor, proporcione más detalles.'),
});

type QuoteFormValues = z.infer<typeof formSchema>;

const initialState = {
  message: '',
  success: false,
};

export function QuoteForm() {
  const [state, formAction] = useFormState(handleQuoteRequest, initialState);
  const { toast } = useToast();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      origin: '',
      destination: '',
      shipmentType: 'FCL',
      cargoDetails: '',
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Cotización Enviada',
          description: state.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, form]);
  
  const { isSubmitting } = form.formState;

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Importaciones Global S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ejemplo@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad/Puerto de Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Shanghai, China" {...field} />
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
                    <FormLabel>Ciudad/Puerto de Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Valencia, España" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="shipmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Envío</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de envío" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FCL">Contenedor Completo (FCL)</SelectItem>
                      <SelectItem value="LCL">Carga Consolidada (LCL)</SelectItem>
                      <SelectItem value="Bulk">Carga a Granel (Bulk)</SelectItem>
                      <SelectItem value="Terrestre">Transporte Terrestre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargoDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles de la Carga</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa su mercancía, dimensiones, peso, y cualquier requerimiento especial."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Solicitud <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
