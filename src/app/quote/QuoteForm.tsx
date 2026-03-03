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
        title: 'Cotització Enviada',
        description: 'Hem rebut la teva sol·licitud. Ens posarem en contacte amb tu ben aviat.',
      });
    } else if (state.errors) {
       toast({
        title: 'Error',
        description: 'Hi ha hagut un problema al enviar la teva sol·licitud. Torna-ho a intentar.',
        variant: 'destructive',
      });
    }
  }, [state.succeeded, state.errors, toast]);

  return (
    <Card className="shadow-lg border-primary/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
           <input type="hidden" name="_subject" value="Nova Sol·licitud de Cotització - Meridian Logistics" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom Complet</Label>
                <Input id="name" name="name" placeholder="Ex: Joan Pere" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (Opcional)</Label>
                <Input id="company" name="company" placeholder="Ex: Importacions Globals S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="exemple@correu.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telèfon</Label>
                <Input id="phone" name="phone" placeholder="+34 600 000 000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Ciutat/Port d'Origen</Label>
                <Input id="origin" name="origin" placeholder="Ex: Shanghai, Xina" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Ciutat/Port de Destí</Label>
                <Input id="destination" name="destination" placeholder="Ex: Barcelona, Espanya" required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="shipmentType">Tipus d'Enviament</Label>
                <Select name="shipmentType" defaultValue="FCL">
                    <SelectTrigger id="shipmentType">
                        <SelectValue placeholder="Selecciona un tipus d'enviament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCL">Contenidor Complet (FCL)</SelectItem>
                      <SelectItem value="LCL">Càrrega Consolidada (LCL)</SelectItem>
                      <SelectItem value="Bulk">Càrrega a Granel (Bulk)</SelectItem>
                      <SelectItem value="Terrestre">Transport Terrestre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="cargoDetails">Detalls de la Càrrega</Label>
                <Textarea
                    id="cargoDetails"
                    name="cargoDetails"
                    placeholder="Descriu la teva mercaderia, dimensions, pes i qualsevol requeriment especial."
                    className="min-h-[120px]"
                    required
                />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={state.submitting}>
              {state.submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviant...
                </>
              ) : (
                <>
                  Enviar Sol·licitud <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
      </CardContent>
    </Card>
  );
}
