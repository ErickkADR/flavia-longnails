import { WHATSAPP_LINK } from '../data/professionals';
import { WhatsappIcon } from './icons';
import './Contact.css';

export function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-grid">
        <div className="reveal-left">
          <div className="sec-label">Contato</div>
          <h2 className="sec-title">Encontre-nos e<br /><span>agende sua visita</span></h2>
          <p className="sec-sub" style={{ marginBottom: 44 }}>Estamos aqui para te atender</p>

          <div className="c-item">
            <div className="c-icon">📍</div>
            <div>
              <div className="c-label">Rua doutor francisco elgenio do amaral, 11</div>
              <div className="c-value">Jardim Peri - Alto, São Paulo - SP, 02281-206</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon">📱</div>
            <div>
              <div className="c-label">WhatsApp</div>
              <div className="c-value">(55) 11 94665-0392</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon">🕐</div>
            <div>
              <div className="c-label">Horário de Atendimento</div>
              <div className="c-value">Seg – Sex: 9h às 19h<br />Sábado: 9h às 17h<br />Domingo: Fechado</div>
            </div>
          </div>
          <div className="c-item">
            <div className="c-icon">📸</div>
            <div>
              <div className="c-label">Instagram</div>
              <div className="c-value">
                <a href="https://www.instagram.com/flavia_longnails/" target="_blank" rel="noopener noreferrer">@flavia_longnails</a>
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
            title="Localização do Afrodite Studio"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d915.0323548835642!2d-46.667898988954924!3d-23.45579574530064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef52306e1536f%3A0x19d2b4efe3ad44d2!2sFl%C3%A1via%20LongNails!5e0!3m2!1spt-BR!2sbr!4v1777825096078!5m2!1spt-BR!2sbr"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
