import { Link } from 'react-router-dom';
import { professionals, WHATSAPP_LINK } from '../data/professionals';
import { InstagramIcon, WhatsappIcon } from './icons';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link to="/" className="footer-logo">Afrodite Studio</Link>
            <p className="footer-tagline">Unhas, maquiagem e cabelo em um só lugar</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/flavia_longnails/" className="soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={WHATSAPP_LINK} className="soc-btn" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsappIcon />
              </a>
            </div>
          </div>

          <div>
            <div className="f-col-title">Navegação</div>
            <ul className="f-links">
              <li><Link to="/#resultados">Resultados</Link></li>
              <li><Link to="/#equipe">Equipe</Link></li>
              <li><Link to="/#avaliacoes">Avaliações</Link></li>
              <li><Link to="/#mais-contratados">Mais Contratados</Link></li>
              <li><Link to="/#contato">Contato</Link></li>
            </ul>
          </div>

          <div>
            <div className="f-col-title">Profissionais</div>
            <ul className="f-links">
              {professionals.map((p) => (
                <li key={p.slug}><Link to={`/${p.slug}`}>{p.name} · {p.role}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="f-col-title">Horários</div>
            <ul className="f-links f-hours">
              <li>Seg–Sex: 9h às 19h</li>
              <li>Sábado: 9h às 17h</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Afrodite Studio. Todos os direitos reservados.</span>
          <span>Feito com 💅 para você</span>
        </div>
      </div>
    </footer>
  );
}
