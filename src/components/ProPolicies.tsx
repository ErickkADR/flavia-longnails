import type { Professional } from '../data/professionals';
import './ProPolicies.css';

/**
 * Regras de atendimento da profissional (sinal, atraso, domicílio, pagamento).
 *
 * A seção inteira só existe se `policies` estiver preenchido. Hoje só a Jheny tem,
 * porque foi a única que entregou material com isso. Não inventar conteúdo aqui:
 * são condições comerciais e cada uma define as suas.
 */
export function ProPolicies({ pro }: { pro: Professional }) {
  if (!pro.policies || pro.policies.length === 0) return null;

  return (
    <section className="pro-policies">
      <div className="container">
        <div className="pro-policies-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Antes de agendar</div>
          <h2 className="sec-title">Como funciona o <span>atendimento</span></h2>
          <p className="sec-sub">Combinado desde o começo, para o dia fluir sem surpresa</p>
        </div>
        <div className="pol-grid">
          {pro.policies.map((p, i) => (
            <div className="pol-card reveal" style={{ transitionDelay: `${i * .05}s` }} key={p.title}>
              <div className="pol-title">{p.title}</div>
              <p className="pol-text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
