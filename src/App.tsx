import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProfessionalPage } from './pages/ProfessionalPage';
import { Placeholder } from './pages/Placeholder';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Placeholder title="Cursos" />} />
        <Route path="/area-colaboradora" element={<Placeholder title="Área da Colaboradora" />} />
        <Route path="/:slug" element={<ProfessionalPage />} />
      </Route>
    </Routes>
  );
}
