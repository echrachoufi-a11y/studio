import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { Cta } from '@/components/sections/Cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Testimonials />
      <Cta />
    </>
  );
}
