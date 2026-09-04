import { testimonials } from '../data/testimonials';
import { ReviewCard } from './ReviewCard';
import './ProReviews.css';

export function ProReviews({ name }: { name: string }) {
  const reviews = testimonials.filter((t) => t.professional === name);
  if (reviews.length === 0) return null;

  return (
    <section className="pro-reviews">
      <div className="container">
        <div className="pro-reviews-header reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Avaliações</div>
          <h2 className="sec-title">O que dizem de <span>{name}</span></h2>
          <p className="sec-sub">Avaliações de clientes do studio</p>
        </div>
        <div className="pro-reviews-grid">
          {reviews.map((t) => (
            <ReviewCard t={t} key={t.name} />
          ))}
        </div>
      </div>
    </section>
  );
}