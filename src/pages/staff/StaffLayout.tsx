import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './StaffLayout.css';

const NAV_ITEMS = [
  { to: '/area-colaboradora/agendamento', label: 'Agendamento de Clientes' },
  { to: '/area-colaboradora/clientes', label: 'Registro de Clientes' },
  { to: '/area-colaboradora/contas', label: 'Contas do Salão' },
  { to: '/area-colaboradora/gastos', label: 'Gastos Pessoais' },
];

export function StaffLayout() {
  const { session, loading, name, signOut } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!session) return <Navigate to="/area-colaboradora" state={{ from: location.pathname }} replace />;

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-sidebar-top">
          <div className="staff-sidebar-logo">Studio <span>Flávia Alves</span></div>
          <div className="staff-sidebar-user">Olá, {name}</div>
        </div>
        <nav className="staff-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `staff-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="staff-logout" onClick={signOut}>Sair</button>
      </aside>
      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
}
