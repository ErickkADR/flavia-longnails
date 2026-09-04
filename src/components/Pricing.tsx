import { mostBooked } from '../data/testimonials';
import { Marquee } from './Marquee';
import './Pricing.css';

export function Pricing() {
  return (
    <section className="pricing" id="mais-contratados">
      <div className="container">
        <div className="pricing-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Ranking</div>
          <h2 className="sec-title">Serviços Mais <span>Contratados</span></h2>
          <p className="sec-sub">Os favoritos das nossas clientes no studio</p>
        </div>
        <div className="pricing-list">
          {mostBooked.map((s, i) => (
            <div className="price-row reveal" style={{ transitionDelay: `${i * .04}s` }} key={s.name}>
              <div className="price-info">
                <div className="price-rank">{i + 1}</div>
                <div>
                  <div className="price-name">{s.name}</div>
                  <div className="price-pro">{s.professional} · {s.category}</div>
                </div>
              </div>
              <div className="price-val">{s.price}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="tag-marquee">
        <Marquee duration={30}>
          {mostBooked.map((s) => (
            <span className="tag-item" key={s.name}>{s.name} <span className="tag-dot">✦</span></span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
