// This is an AI-powered route optimization tool for logistics planners.
// It takes shipment details (destination, size, type) as input and returns an AI-optimized route suggestion.
// The route considers distance, traffic, and customs efficiencies to provide clients with the fastest and most cost-effective shipping options.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeShippingRouteInputSchema = z.object({
  destination: z.string().describe('The final destination of the shipment.'),
  size: z.string().describe('The size of the shipment (e.g., small, medium, large).'),
  type: z.string().describe('The type of shipment (e.g., container, bulk, perishable).'),
  origin: z.string().describe('The origin location of the shipment.'),
});

export type OptimizeShippingRouteInput = z.infer<typeof OptimizeShippingRouteInputSchema>;

const OptimizeShippingRouteOutputSchema = z.object({
  optimizedRoute: z.string().describe('The AI-optimized route suggestion considering distance, traffic, and customs efficiencies.'),
  estimatedTime: z.string().describe('The estimated time for the shipment to arrive at the destination.'),
  estimatedCost: z.string().describe('The estimated cost for the shipment along the optimized route.'),
});

export type OptimizeShippingRouteOutput = z.infer<typeof OptimizeShippingRouteOutputSchema>;

export async function optimizeShippingRoute(input: OptimizeShippingRouteInput): Promise<OptimizeShippingRouteOutput> {
  return optimizeShippingRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeShippingRoutePrompt',
  input: {schema: OptimizeShippingRouteInputSchema},
  output: {schema: OptimizeShippingRouteOutputSchema},
  prompt: `You are an expert logistics planner. Optimize the shipping route based on the provided shipment details. Consider distance, traffic, and customs efficiencies.

Shipment Details:
Destination: {{{destination}}}
Size: {{{size}}}
Type: {{{type}}}
Origin: {{{origin}}}

Provide the optimized route, estimated time, and estimated cost for the shipment.`, 
});

const optimizeShippingRouteFlow = ai.defineFlow(
  {
    name: 'optimizeShippingRouteFlow',
    inputSchema: OptimizeShippingRouteInputSchema,
    outputSchema: OptimizeShippingRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
