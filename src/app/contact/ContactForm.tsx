'use client';

import { useForm } from '@formspree/react';
import { Send, Loader2 } from 'lucide-react';
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

export function ContactForm() {
    const [state, handleSubmit] = useForm("manrjpwv");
    const { toast } = useToast();

    useEffect(() => {
        if (state.succeeded) {
            toast({
                title: 'Missatge Enviat',
                description: 'Gràcies per contactar amb nosaltres. Et respondrem el més aviat possible.',
            });
        } else if (state.errors) {
            toast({
                title: 'Error en l\'enviament',
                description: 'Hi ha hagut un problema al enviar el formulari. Si us plau, torna-ho a intentar.',
                variant: 'destructive',
            });
        }
    }, [state.succeeded, state.errors, toast]);


  return (
    <Card className="shadow-lg border-primary/10">
      <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">El teu Nom</Label>
                    <Input id="name" name="name" placeholder="Ex: Anna García" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">El teu Email</Label>
                    <Input id="email" name="email" type="email" placeholder="exemple@correu.com" required />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="subject">Assumpte</Label>
                <Select name="subject" defaultValue="Consulta General">
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Selecciona un assumpte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta General">Consulta General</SelectItem>
                      <SelectItem value="Suport">Suport Tècnic</SelectItem>
                      <SelectItem value="Vendes">Consultes de Vendes</SelectItem>
                      <SelectItem value="Altre">Altre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">El teu Missatge</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Escriu la teva consulta aquí..."
                    className="min-h-[150px]"
                    required
                    minLength={10}
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
                  Enviar Missatge <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
      </CardContent>
    </Card>
  );
}
