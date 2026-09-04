import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { FloatingWhatsapp } from './FloatingWhatsapp';
import { useReveal, useScrollOnNavigate } from '../hooks/scroll';

export function Layout() {
  useReveal();
  useScrollOnNavigate();

  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  );
}
