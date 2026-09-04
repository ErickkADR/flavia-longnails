import type { Professional } from '../data/professionals';
import { asset } from '../lib/asset';
import { Marquee } from './Marquee';
import { InstagramIcon } from './icons';
import './InstaGallery.css';

export function InstaGallery({ pro }: { pro: Professional }) {
  const heading = pro.instagramIsReal ? 'Trabalhos' : 'Inspirações';
  const sub = pro.instagramIsReal
    ? `Imagens ilustrativas — os posts reais estão no Instagram @${pro.instagram}`
    : `Imagens ilustrativas — Instagram de ${pro.name} em breve`;

  return (
    <section className="insta-gallery">
      <div className="container">
        <div className="sec-head-row reveal">
          <div>
            <div className="sec-label">{pro.instagramIsReal ? 'Instagram' : 'Inspirações'}</div>
            <h2 className="sec-title">{heading} de <span>{pro.name}</span></h2>
            <p className="sec-sub">{sub}</p>
          </div>
        </div>
      </div>

      <Marquee duration={pro.gallery.length * 6}>
        {pro.gallery.map((src, i) => (
          <div className="insta-post" key={i}>
            <img src={asset(src)} alt={`Trabalho de ${pro.name}`} />
            {pro.instagramIsReal && (
              <span className="insta-post-tag"><InstagramIcon /></span>
            )}
          </div>
        ))}
      </Marquee>

      <div className="insta-gallery-cta">
        {pro.instagramIsReal && pro.instagram ? (
          <a href={`https://www.instagram.com/${pro.instagram}/`} className="btn-primary" target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="ig-icon-sm" />
            Ver posts reais no Instagram
          </a>
        ) : (
          <p className="pro-note" style={{ marginTop: 0 }}>Perfil do Instagram de {pro.name} em breve.</p>
        )}
      </div>
    </section>
  );
}
