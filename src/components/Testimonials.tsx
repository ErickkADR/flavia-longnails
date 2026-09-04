import { testimonials } from '../data/testimonials';
import { Marquee } from './Marquee';
import './Testimonials.css';

export function Testimonials() {
  return (
    <section className="testimonials" id="avaliacoes">
      <div className="container">
        <div className="test-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Avaliações</div>
          <h2 className="sec-title">O que dizem nossas <span>clientes</span></h2>
          <p className="sec-sub">Avaliações de clientes do studio</p>
        </div>
      </div>
      <Marquee duration={48}>
        {testimonials.map((t) => (
          <div className="test-card" key={t.name}>
            <div className="test-quote">&ldquo;</div>
            <p className="test-text">{t.text}</p>
            <div className="test-stars">★★★★★</div>
            <div className="test-author">
              <div className="author-av">{t.initials}</div>
              <div>
                <div className="author-name">{t.name}</div>
                <div className="author-svc">{t.service} · {t.professional}</div>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
