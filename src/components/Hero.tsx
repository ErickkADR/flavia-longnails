import { useEffect, useRef, useState } from 'react';
import { WHATSAPP_LINK } from '../data/professionals';
import { asset } from '../lib/asset';
import { WhatsappIcon } from './icons';
import './Hero.css';

/**
 * Os três clipes de fundo, um por especialidade do studio. Ficam em `public/videos/`
 * e SÃO commitados (ver o LEIA-ME de lá): os dois hosts constroem a partir do repo,
 * não há storage separado. Somados dão ~3,3 MB depois da compressão.
 *
 * Só um toca por vez. Os outros ficam pausados com opacity 0, então o navegador não
 * gasta decodificação com o que ninguém está vendo.
 */
const CLIPS = [
  { src: 'videos/hero-unhas.mp4', label: 'Unhas & Nail Art' },
  { src: 'videos/hero-cabelo.mp4', label: 'Cabelo' },
  { src: 'videos/hero-make.mp4', label: 'Maquiagem' },
];

const HERO_POSTER = 'images/hero-nails-o-0j6oBo.jpg';
const ROTATE_MS = 8000;

export function Hero() {
  const [playVideo, setPlayVideo] = useState(false);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // O <source> só é renderizado em tela grande e sem prefers-reduced-motion. Em celular
  // nenhum mp4 chega a ser baixado (o poster já basta), e quem pediu menos movimento no
  // sistema vê a foto parada. A maior parte do tráfego de salão vem do Instagram, no 4G.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    const apply = () => setPlayVideo(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!playVideo) return;
    const id = setInterval(() => setActive((i) => (i + 1) % CLIPS.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [playVideo]);

  // Toca só o ativo. O `catch` silencioso é proposital: se o autoplay for bloqueado, o
  // hero fica no poster em vez de estourar um unhandled rejection no console da cliente.
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && playVideo) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, playVideo]);

  return (
    <section className="hero">
      <div className="hero-stage" aria-hidden="true">
        {CLIPS.map((clip, i) => (
          <video
            key={clip.src}
            ref={(el) => { refs.current[i] = el; }}
            className={`hero-video${i === active ? ' is-active' : ''}`}
            poster={asset(HERO_POSTER)}
            muted
            loop
            playsInline
            preload={i === 0 ? 'metadata' : 'none'}
            tabIndex={-1}
          >
            {playVideo && <source src={asset(clip.src)} type="video/mp4" />}
          </video>
        ))}
      </div>
      <div className="hero-scrim" aria-hidden="true" />

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
      </div>

      {playVideo && (
        <div className="hero-dots">
          <span className="hero-dots-lbl">{CLIPS[active].label}</span>
          {CLIPS.map((clip, i) => (
            <button
              key={clip.src}
              type="button"
              className={`hero-dot${i === active ? ' is-on' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Ver ${clip.label}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
