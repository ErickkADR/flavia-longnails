import { Navigate, useParams } from 'react-router-dom';
import { getProfessional } from '../data/professionals';
import type { Service } from '../data/professionals';
import { useTable } from '../hooks/useTable';
import { ProHero } from '../components/ProHero';
import { ServiceGrid } from '../components/ServiceGrid';
import { ProReviews } from '../components/ProReviews';
import { InstaGallery } from '../components/InstaGallery';
import { ProPolicies } from '../components/ProPolicies';

export function ProfessionalPage() {
  const { slug = '' } = useParams();
  const pro = getProfessional(slug);
  // Busca todo mundo e filtra aqui, igual Clientes.tsx/Retorno.tsx já fazem com
  // clients/appointments: a tabela é pequena (catálogo de 4 profissionais), não
  // compensa criar uma query filtrada só pra isso. `ascending: true` mantém a ordem
  // de quando cada serviço foi cadastrado — sem isso um serviço editado agora não
  // reordena (só update, não created_at), mas um serviço novo sempre entraria no
  // topo do grid se a ordem fosse "mais recente primeiro".
  const { rows: allServices } = useTable<Service>('services', 'created_at', true);
  const services = allServices.filter((s) => s.professional === pro?.name);

  if (!pro) return <Navigate to="/" replace />;

  return (
    <>
      <ProHero pro={pro} />
      <ServiceGrid name={pro.name} services={services} />
      <ProPolicies pro={pro} />
      <ProReviews name={pro.name} />
      <InstaGallery pro={pro} />
    </>
  );
}