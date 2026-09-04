import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Observa `.reveal` / `.reveal-left` / `.reveal-right` e anima quando entram na tela. Reroda a cada troca de rota. */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('on');
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
}

/** Rola pro topo ao mudar de página, ou até a âncora quando a URL já chega com #hash. */
export function useScrollOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
}
