import { Link } from 'react-router-dom';
import { professionals } from '../data/professionals';
import { asset } from '../lib/asset';
import { ArrowRightIcon } from './icons';
import './Team.css';

export function Team() {
  return (
    <section className="team" id="equipe">
      <div className="container">
        <div className="team-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Nossa Equipe</div>
          <h2 className="sec-title">Especialistas para <span>Cada Detalhe</span></h2>
          <p className="sec-sub">Escolha a profissional e conheça todos os serviços</p>
        </div>
        <div className="team-row">
          {professionals.map((p, i) => (
            <Link to={`/${p.slug}`} className="team-member reveal" style={{ transitionDelay: `${i * .06}s` }} key={p.slug}>
              <div className="team-photo">
                <img src={asset(p.avatar)} alt={p.name} />
              </div>
              <div className="team-name">{p.name}</div>
              <div className="team-role">{p.role}</div>
              <span className="team-link">
                Ver Serviços <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
