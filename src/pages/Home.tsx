import { Hero } from '../components/Hero';
import { Resultados } from '../components/Resultados';
import { Team } from '../components/Team';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { Contact } from '../components/Contact';

export function Home() {
  return (
    <>
      <Hero />
      <Resultados />
      <Team />
      <Testimonials />
      <Pricing />
      <Contact />
    </>
  );
}
