import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './StaffLayout.css';

const NAV_ITEMS = [
  { to: '/area-colaboradora/agendamento', label: 'Agendamento de Clientes' },
  { to: '/area-colaboradora/retorno', label: 'Retorno de Clientes' },
  { to: '/area-colaboradora/clientes', label: 'Registro de Clientes' },
  { to: '/area-colaboradora/contas', label: 'Contas do Salão' },
  { to: '/area-colaboradora/gastos', label: 'Gastos Pessoais' },
];

export function StaffLayout() {
  const { session, loading, name, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Sair volta pra HOME, nao pra tela de login.
   *
   * A ordem importa: navega primeiro e so depois derruba a sessao. Se fosse ao
   * contrario, o `!session` logo abaixo dispararia o <Navigate> pra
   * /area-colaboradora antes, e a colaboradora veria a tela de login piscar no
   * caminho.
   */
  async function handleLogout() {
    navigate('/', { replace: true });
    await signOut();
  }

  if (loading) return null;
  if (!session) return <Navigate to="/area-colaboradora" state={{ from: location.pathname }} replace />;

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-sidebar-top">
          <Link to="/" className="staff-sidebar-logo">Afrodite <span>Studio</span></Link>
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
        <button className="staff-logout" onClick={handleLogout}>Sair</button>
      </aside>
      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
}
