'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio.'),
  email: z.string().email('Email inválido.'),
  subject: z.enum(['Consulta General', 'Soporte', 'Ventas', 'Otro']),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
});

type ContactFormValues = z.infer<typeof formSchema>;


export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: 'Consulta General',
            message: '',
        },
    });

  async function onSubmit(values: ContactFormValues) {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Contact form submitted:', values);
    setLoading(false);
    toast({
      title: 'Mensaje Enviado',
      description: 'Gracias por contactarnos. Le responderemos a la brevedad.',
    });
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Su Nombre</FormLabel>
                        <FormControl>
                        <Input placeholder="Ej: Ana García" {...field} />
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
                        <FormLabel>Su Email</FormLabel>
                        <FormControl>
                        <Input placeholder="ejemplo@correo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un asunto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Consulta General">Consulta General</SelectItem>
                      <SelectItem value="Soporte">Soporte Técnico</SelectItem>
                      <SelectItem value="Ventas">Consultas de Ventas</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Su Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escriba su consulta aquí..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
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
        </Form>
      </CardContent>
    </Card>
  );
}
