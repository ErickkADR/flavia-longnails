import { professionals } from '../data/professionals';
import { asset } from '../lib/asset';
import './Resultados.css';
import { Stars } from './Icon';

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
              src={asset('images/flavia-trabalho-1.jpg')}
              alt="Unhas com francesinha em glitter, feitas no Lummier Studio"
            />
          </div>
          {/* Os três círculos menores existem pra dizer, sem texto, que o studio faz
              quatro coisas: a foto grande é unha, e as pequenas são cabelo, maquiagem
              e cílios (adicionado em 15/09/2026, ver rv-inset-cilios).
              A de cabelo ainda é banco de imagem, a Vitória não passou material. */}
          <div className="rv-inset rv-inset-cabelo">
            <img
              src={asset('images/vitoria-look-1-stock.jpg')}
              alt="Cabelo longo com ondas e iluminação, trabalho de cabelo do studio"
            />
          </div>
          <div className="rv-inset rv-inset-make">
            <img
              src={asset('images/jheny-trabalho-1.jpg')}
              alt="Maquiagem com delineado gráfico, feita no Lummier Studio"
            />
          </div>
          {/* Quarto círculo, adicionado em 15/09/2026 quando a Mayte entrou (cílios e
              sobrancelhas). Morde o canto inferior direito do círculo principal, espelhando
              como o rv-inset-make morde o topo. */}
          <div className="rv-inset rv-inset-cilios">
            <img
              src={asset('images/ig-mayte-1.jpg')}
              alt="Extensão de cílios em close, trabalho feito no Lummier Studio"
            />
          </div>
        </div>

        <div className="reveal-right">
          <div className="sec-label">Portfolio</div>
          <h2 className="sec-title">Resultados que <span>Falam por Si</span></h2>
          <p className="resultados-text">
            Cada atendimento no studio é pensado pra durar, na unha, na make, no cabelo ou
            nos cílios, com produtos de qualidade, técnica apurada e um olhar atento a cada detalhe.
          </p>
          <div className="resultados-stats">
            <div className="rs-rating">
              <span className="rs-num">4.9</span>
              <Stars className="rs-stars" />
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
