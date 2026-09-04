import { Link } from 'react-router-dom';
import type { Professional } from '../data/professionals';
import { WHATSAPP_LINK } from '../data/professionals';
import { asset } from '../lib/asset';
import { ArrowLeftIcon, InstagramIcon, WhatsappIcon } from './icons';
import './ProHero.css';

export function ProHero({ pro }: { pro: Professional }) {
  return (
    <section className="pro-hero">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeftIcon />
          Voltar para o Studio
        </Link>

        <div className="pro-hero-grid">
          <div className="reveal-left">
            <div className="pro-hero-photo">
              <img src={asset(pro.avatar)} alt={pro.photoIsPlaceholder ? `${pro.name} (foto ilustrativa)` : pro.name} />
            </div>
            {pro.photoIsPlaceholder && (
              <p className="pro-note">Foto ilustrativa. Em breve, foto real de {pro.name}.</p>
            )}
          </div>

          <div className="reveal-right">
            <div className="pro-hero-role">{pro.role}</div>
            <h1 className="pro-hero-name">{pro.name}</h1>
            <p className="pro-hero-bio">{pro.bio}</p>
            <div className="pro-hero-actions">
              <a href={WHATSAPP_LINK} className="btn-primary" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="wa-icon" />
                Agendar pelo WhatsApp
              </a>
              {pro.instagramIsReal && pro.instagram && (
                <a href={`https://www.instagram.com/${pro.instagram}/`} className="btn-outline" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="ig-icon-sm" />
                  @{pro.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
