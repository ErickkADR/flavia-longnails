import { testimonials } from '../data/testimonials';
import { Marquee } from './Marquee';
import { ReviewCard } from './ReviewCard';
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
          <ReviewCard t={t} className="test-card" key={t.name} />
        ))}
      </Marquee>
    </section>
  );
}