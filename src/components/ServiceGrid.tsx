import type { Service } from '../data/professionals';
import { whatsappForService } from '../data/professionals';
import './ServiceGrid.css';

export function ServiceGrid({ name, services }: { name: string; services: Service[] }) {
  return (
    <section className="svc-section">
      <div className="container">
        <div className="svc-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Serviços</div>
          <h2 className="sec-title">Atendimentos com <span>{name}</span></h2>
          <p className="sec-sub">Escolha o serviço ideal para você</p>
        </div>
        <div className="svc-grid">
          {services.map((s, i) => (
            <a
              className={`svc-card${s.popular ? ' feat' : ''} reveal`}
              style={{ transitionDelay: `${i * .05}s` }}
              key={s.name}
              href={whatsappForService(s.name, name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.popular && <div className="feat-badge">Popular</div>}
              <span className="svc-icon">{s.icon}</span>
              <div className="svc-name">{s.name}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-price">
                <span className="svc-pre">A partir de</span>
                <span className="svc-val">{s.price}</span>
                {s.priceNote && <span className="svc-note">{s.priceNote}</span>}
              </div>
              <span className="svc-cta">Agendar no WhatsApp</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
