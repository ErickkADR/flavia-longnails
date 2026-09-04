import { WHATSAPP_LINK } from '../data/professionals';
import { WhatsappIcon } from './icons';
import './FloatingWhatsapp.css';

export function FloatingWhatsapp() {
  return (
    <div className="float-wa">
      <a href={WHATSAPP_LINK} className="float-wa-btn" target="_blank" rel="noopener noreferrer">
        <WhatsappIcon className="wa-icon" />
        Agendar pelo WhatsApp
      </a>
    </div>
  );
}
