import type { Testimonial } from '../data/testimonials';
import { asset } from '../lib/asset';
import './ReviewCard.css';

export function ReviewCard({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <article className={className ? `review-card ${className}` : 'review-card'}>
      <div className="review-card-head">
        <img className="review-avatar" src={asset(t.avatar)} alt={t.name} loading="lazy" />
        <div>
          <div className="review-name">
            {t.name}
            {t.verified && (
              <span className="review-verified" title="Avaliação verificada" aria-label="Avaliação verificada">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 1.5l2.6 1.9 3.2-.3 1 3.1 2.7 1.8-1.3 3 1.3 3-2.7 1.8-1 3.1-3.2-.3L12 22.5l-2.6-1.9-3.2.3-1-3.1L2.5 16l1.3-3-1.3-3 2.7-1.8 1-3.1 3.2.3L12 1.5z" />
                  <path className="review-verified-check" d="M8.2 12.2l2.6 2.6 5-5.2" />
                </svg>
              </span>
            )}
          </div>
          <div className="review-svc">{t.service} · {t.professional}</div>
        </div>
      </div>
      <p className="review-text">{t.text}</p>
      <div className="review-stars">★★★★★</div>
    </article>
  );
}