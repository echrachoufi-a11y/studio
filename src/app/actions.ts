'use server';

import { z } from 'zod';

const quoteSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  origin: z.string(),
  destination: z.string(),
  shipmentType: z.string(),
  cargoDetails: z.string(),
});

export async function handleQuoteRequest(prevState: any, formData: FormData) {
  const validatedFields = quoteSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    shipmentType: formData.get('shipmentType'),
    cargoDetails: formData.get('cargoDetails'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error de validación. Por favor, revise los campos.',
      success: false,
    };
  }
  
  // Simulate network delay and processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log('Received quote request:', validatedFields.data);

  return {
    message: 'Su solicitud de cotización ha sido recibida. Nos pondremos en contacto con usted pronto.',
    success: true,
  };
}
