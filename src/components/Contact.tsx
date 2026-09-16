import { WHATSAPP_LINK } from '../data/professionals';
import { WhatsappIcon } from './icons';
import './Contact.css';
import { Icon } from './Icon';

export function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-grid">
        <div className="reveal-left">
          <div className="sec-label">Contato</div>
          <h2 className="sec-title">Encontre-nos e<br /><span>agende sua visita</span></h2>
          <p className="sec-sub" style={{ marginBottom: 44 }}>Estamos aqui para te atender</p>

          <div className="c-item">
            <div className="c-icon"><Icon name="local" /></div>
            <div>
              <div className="c-label">Rua Ministro Lins de Barros, 465 - cs 13</div>
              <div className="c-value">Jardim Santa Cruz, São Paulo - SP, 02674-000</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon"><Icon name="telefone" /></div>
            <div>
              <div className="c-label">WhatsApp</div>
              <div className="c-value">(55) 11 94665-0392</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon"><Icon name="relogio" /></div>
            <div>
              <div className="c-label">Horário de Atendimento</div>
              <div className="c-value">Seg – Sex: 9h às 19h<br />Sábado: 9h às 17h<br />Domingo: Fechado</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon"><Icon name="instagram" /></div>
            <div>
              <div className="c-label">Instagram</div>
              <div className="c-value">
                <a href="https://www.instagram.com/lummier_studiobeauty/" target="_blank" rel="noopener noreferrer">@lummier_studiobeauty</a>
              </div>
            </div>
          </div>

          <a href={WHATSAPP_LINK} className="c-wa-link" target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="wa-icon" />
            Agendar pelo WhatsApp
          </a>
        </div>

        <div className="contact-map reveal-right">
          <iframe
            title="Localização do Lummier Studio"
            src="https://www.google.com/maps?q=Rua+Ministro+Lins+de+Barros%2C+465%2C+Jardim+Santa+Cruz%2C+S%C3%A3o+Paulo+-+SP%2C+02674-000&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
