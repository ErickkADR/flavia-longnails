import { professionals } from '../data/professionals';
import { asset } from '../lib/asset';
import './Resultados.css';

export function Resultados() {
  return (
    <section className="resultados" id="resultados">
      <div className="container resultados-grid">
        {/* Composição em camadas: arco principal, contorno deslocado atrás pra dar
            profundidade, e um círculo menor mordendo o canto. Era um círculo só com
            borda branca grossa, que ficava chapado. */}
        <div className="resultados-visual reveal-left">
          <div className="rv-ring" aria-hidden="true" />
          <div className="rv-main">
            <img
              src={asset('images/ig-flavia-4.jpg')}
              alt="Unhas em cromado com francesinha e detalhe de estrela, feitas no Afrodite Studio"
            />
          </div>
          <div className="rv-inset">
            <img
              src={asset('images/ig-flavia-2.jpg')}
              alt="Francesinha vermelha com aplique de cereja"
            />
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
