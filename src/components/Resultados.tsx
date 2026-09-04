import { professionals } from '../data/professionals';
import { asset } from '../lib/asset';
import './Resultados.css';

export function Resultados() {
  return (
    <section className="resultados" id="resultados">
      <div className="container resultados-grid">
        <div className="resultados-visual reveal-left">
          <div className="resultados-blob" aria-hidden="true"></div>
          <div className="resultados-frame">
            <img src={asset('images/gallery-1-BmiSL3Sa.jpg')} alt="Nail art feita no Studio Flávia Alves" />
          </div>
        </div>

        <div className="reveal-right">
          <div className="sec-label">Portfolio</div>
          <h2 className="sec-title">Resultados que <span>Falam por Si</span></h2>
          <p className="resultados-text">
            Cada atendimento no studio é pensado pra durar, na unha, na make ou no cabelo,
            com produtos de qualidade, técnica apurada e um olhar atento a cada detalhe.
          </p>
          <div className="resultados-stats">
            <div className="rs-rating">
              <span className="rs-num">4.9</span>
              <span className="rs-stars">★★★★★</span>
              <span className="rs-lbl">Avaliação média</span>
            </div>
            <div className="rs-divider"></div>
            <div className="rs-count">
              <span className="rs-num">500+</span>
              <span className="rs-lbl">Clientes atendidas</span>
            </div>
            <div className="rs-divider"></div>
            <div className="rs-team">
              <div className="rs-avatars">
                {professionals.map((p) => (
                  <img key={p.slug} src={asset(p.avatar)} alt={p.name} className="rs-avatar" />
                ))}
              </div>
              <span className="rs-lbl">Nossa equipe</span>
            </div>
          </div>
          <a href="#equipe" className="btn-primary">Conhecer a Equipe</a>
        </div>
      </div>
    </section>
  );
}
