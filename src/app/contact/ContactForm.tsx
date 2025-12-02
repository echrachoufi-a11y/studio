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
                title: 'Mensaje Enviado',
                description: 'Gracias por contactarnos. Le responderemos a la brevedad.',
            });
        } else if (state.errors) {
            toast({
                title: 'Error al enviar',
                description: 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.',
                variant: 'destructive',
            });
        }
    }, [state.succeeded, state.errors, toast]);


  return (
    <Card>
      <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Su Nombre</Label>
                    <Input id="name" name="name" placeholder="Ej: Ana García" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Su Email</Label>
                    <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" required />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Select name="subject" defaultValue="Consulta General">
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Seleccione un asunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta General">Consulta General</SelectItem>
                      <SelectItem value="Soporte">Soporte Técnico</SelectItem>
                      <SelectItem value="Ventas">Consultas de Ventas</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Su Mensaje</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Escriba su consulta aquí..."
                    className="min-h-[150px]"
                    required
                    minLength={10}
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
                  Enviar Mensaje <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
      </CardContent>
    </Card>
  );
}
