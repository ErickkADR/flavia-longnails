import { professionals, WHATSAPP_LINK } from '../data/professionals';
import { asset } from '../lib/asset';
import { WhatsappIcon } from './icons';
import './Hero.css';

export function Hero() {
  const flavia = professionals[0];

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy reveal-left">
          <h1 className="hero-title">
            Beleza que <span>Transforma</span> Você
          </h1>
          <p className="hero-desc">
            Unhas, maquiagem e cabelo em um só lugar. Três especialistas, uma só experiência:
            do alongamento perfeito à make dos sonhos, passando pelo cabelo que você sempre quis.
          </p>
          <div className="hero-actions">
            <a href={WHATSAPP_LINK} className="btn-primary" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="wa-icon" />
              Agendar pelo WhatsApp
            </a>
            <a href="#resultados" className="btn-outline">Ver Resultados</a>
          </div>
          <div className="hero-stats">
            <div><span className="stat-num">5+</span><span className="stat-lbl">Anos de Experiência</span></div>
            <div><span className="stat-num">3</span><span className="stat-lbl">Especialistas</span></div>
            <div><span className="stat-num">4.9★</span><span className="stat-lbl">Avaliação Média</span></div>
          </div>
        </div>

        <div className="hero-visual reveal-right">
          <div className="hero-blob" aria-hidden="true"></div>
          <div className="hero-frame">
            <img src={asset(flavia.avatar)} alt="Trabalho de nail art da Flávia" />
          </div>
        </div>
      </div>
    </section>
  );
}
