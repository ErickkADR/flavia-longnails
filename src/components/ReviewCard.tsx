import type { Testimonial } from '../data/testimonials';
import { asset } from '../lib/asset';
import './ReviewCard.css';

export function ReviewCard({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <article className={className ? `review-card ${className}` : 'review-card'}>
      <div className="review-card-head">
        <img className="review-avatar" src={asset(t.avatar)} alt={t.name} loading="lazy" />
        <div>
          <div className="review-name">{t.name}</div>
          <div className="review-svc">{t.service} · {t.professional}</div>
        </div>
      </div>
      <p className="review-text">{t.text}</p>
      <div className="review-stars">★★★★★</div>
    </article>
  );
}