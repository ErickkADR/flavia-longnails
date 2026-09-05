import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_LINK } from '../data/professionals';
import { WhatsappIcon } from './icons';
import './Nav.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            Afrodite <span>Studio</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/cursos">Cursos</Link></li>
            <li><Link to="/area-colaboradora">Área da Colaboradora</Link></li>
            <li>
              <a href={WHATSAPP_LINK} className="nav-cta" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="wa-icon" />
                Agendar Agora
              </a>
            </li>
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
        <button className="mob-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">✕</button>
        <Link to="/cursos" onClick={() => setMenuOpen(false)}>Cursos</Link>
        <Link to="/area-colaboradora" onClick={() => setMenuOpen(false)}>Área da Colaboradora</Link>
        <a href={WHATSAPP_LINK} className="mob-cta" target="_blank" rel="noopener noreferrer">Agendar Agora</a>
      </div>
    </>
  );
}
