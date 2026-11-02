import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProfessionalPage } from './pages/ProfessionalPage';
import { Placeholder } from './pages/Placeholder';
import { TrabalheConosco } from './pages/TrabalheConosco';
import { Login } from './pages/staff/Login';
import { StaffLayout } from './pages/staff/StaffLayout';
import { Servicos } from './pages/staff/Servicos';
import { Agendamento } from './pages/staff/Agendamento';
import { Retorno } from './pages/staff/Retorno';
import { Clientes } from './pages/staff/Clientes';
import { ContasSalao } from './pages/staff/ContasSalao';
import { Calendario } from './pages/staff/Calendario';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Placeholder title="Cursos" />} />
        {/* Antes do /:slug: aquele e catch-all e engoliria esta rota. */}
        <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
        <Route path="/:slug" element={<ProfessionalPage />} />
      </Route>

      <Route path="/area-colaboradora">
        <Route index element={<Login />} />
        <Route element={<StaffLayout />}>
          <Route path="servicos" element={<Servicos />} />
          <Route path="agendamento" element={<Agendamento />} />
          <Route path="retorno" element={<Retorno />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="contas" element={<ContasSalao />} />
          <Route path="calendario" element={<Calendario />} />
          {/* Gastos Pessoais saiu em 02/11/2026; link salvo cai no calendário. */}
          <Route path="gastos" element={<Navigate to="/area-colaboradora/calendario" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
