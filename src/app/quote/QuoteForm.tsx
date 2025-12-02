'use client';

import { useForm } from '@formspree/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export function QuoteForm() {
  const [state, handleSubmit] = useForm("manrjpwv");
  const { toast } = useToast();

  useEffect(() => {
    if (state.succeeded) {
      toast({
        title: 'Cotización Enviada',
        description: 'Su solicitud ha sido recibida. Nos pondremos en contacto pronto.',
      });
    } else if (state.errors) {
       toast({
        title: 'Error',
        description: 'Hubo un problema al enviar su solicitud. Inténtelo de nuevo.',
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
           <input type="hidden" name="_subject" value="Nueva Solicitud de Cotización" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" placeholder="Ej: Juan Pérez" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (Opcional)</Label>
                <Input id="company" name="company" placeholder="Ej: Importaciones Global S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Ciudad/Puerto de Origen</Label>
                <Input id="origin" name="origin" placeholder="Ej: Shanghai, China" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Ciudad/Puerto de Destino</Label>
                <Input id="destination" name="destination" placeholder="Ej: Valencia, España" required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="shipmentType">Tipo de Envío</Label>
                <Select name="shipmentType" defaultValue="FCL">
                    <SelectTrigger id="shipmentType">
                        <SelectValue placeholder="Seleccione un tipo de envío" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCL">Contenedor Completo (FCL)</SelectItem>
                      <SelectItem value="LCL">Carga Consolidada (LCL)</SelectItem>
                      <SelectItem value="Bulk">Carga a Granel (Bulk)</SelectItem>
                      <SelectItem value="Terrestre">Transporte Terrestre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="cargoDetails">Detalles de la Carga</Label>
                <Textarea
                    id="cargoDetails"
                    name="cargoDetails"
                    placeholder="Describa su mercancía, dimensiones, peso, y cualquier requerimiento especial."
                    className="min-h-[120px]"
                    required
                />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={state.submitting}>
              {state.submitting ? (
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
      </CardContent>
    </Card>
  );
}
