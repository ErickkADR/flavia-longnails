import { mostBooked } from '../data/testimonials';
import { whatsappForService } from '../data/professionals';
import { Marquee } from './Marquee';
import './Pricing.css';

export function Pricing() {
  const [top, ...rest] = mostBooked;

  return (
    <section className="pricing" id="mais-contratados">
      <div className="container">
        <div className="pricing-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Ranking</div>
          <h2 className="sec-title">Serviços Mais <span>Contratados</span></h2>
          <p className="sec-sub">Os favoritos das nossas clientes no studio</p>
        </div>

        <div className="rank-grid">
          <a
            className="rank-spotlight reveal"
            href={whatsappForService(top.name, top.professional)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rank-spotlight-left">
              <div className="rank-medal">1º</div>
              <div>
                <div className="rank-spotlight-tag">O mais contratado do studio</div>
                <div className="rank-spotlight-name">{top.name}</div>
                <div className="rank-spotlight-pro">{top.professional} · {top.category}</div>
              </div>
            </div>
            <div className="rank-spotlight-price">{top.price}</div>
          </a>

          <div className="rank-others">
            {rest.map((s, i) => (
              <a
                className="rank-card reveal"
                style={{ transitionDelay: `${i * 0.05}s` }}
                key={s.name}
                href={whatsappForService(s.name, s.professional)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="rank-card-top">
                  <div className="rank-card-num">{i + 2}</div>
                  <div className="rank-card-name">{s.name}</div>
                </div>
                <div className="rank-card-pro">{s.professional} · {s.category}</div>
                <div className="rank-card-price">{s.price}</div>
              </a>
            ))}
          </div>
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
