import { Navigate, useParams } from 'react-router-dom';
import { getProfessional } from '../data/professionals';
import { ProHero } from '../components/ProHero';
import { ServiceGrid } from '../components/ServiceGrid';
import { ProReviews } from '../components/ProReviews';
import { InstaGallery } from '../components/InstaGallery';

export function ProfessionalPage() {
  const { slug = '' } = useParams();
  const pro = getProfessional(slug);

  if (!pro) return <Navigate to="/" replace />;

  return (
    <>
      <ProHero pro={pro} />
      <ServiceGrid name={pro.name} services={pro.services} />
      <ProReviews name={pro.name} />
      <InstaGallery pro={pro} />
    </>
  );
}