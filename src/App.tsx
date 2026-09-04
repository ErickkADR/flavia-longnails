import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProfessionalPage } from './pages/ProfessionalPage';
import { Placeholder } from './pages/Placeholder';
import { Login } from './pages/staff/Login';
import { StaffLayout } from './pages/staff/StaffLayout';
import { Agendamento } from './pages/staff/Agendamento';
import { Clientes } from './pages/staff/Clientes';
import { ContasSalao } from './pages/staff/ContasSalao';
import { GastosPessoais } from './pages/staff/GastosPessoais';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Placeholder title="Cursos" />} />
        <Route path="/:slug" element={<ProfessionalPage />} />
      </Route>

      <Route path="/area-colaboradora">
        <Route index element={<Login />} />
        <Route element={<StaffLayout />}>
          <Route path="agendamento" element={<Agendamento />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="contas" element={<ContasSalao />} />
          <Route path="gastos" element={<GastosPessoais />} />
        </Route>
      </Route>
    </Routes>
  );
}
