import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { asset } from '../../lib/asset';
import { Icon } from '../../components/Icon';
import './StaffLayout.css';

const NAV_ITEMS = [
  { to: '/area-colaboradora/servicos', label: 'Meus Serviços', short: 'Serviços', icon: 'estrela' },
  { to: '/area-colaboradora/agendamento', label: 'Agendamento de Clientes', short: 'Agenda', icon: 'agenda' },
  { to: '/area-colaboradora/retorno', label: 'Retorno de Clientes', short: 'Retorno', icon: 'retorno' },
  { to: '/area-colaboradora/clientes', label: 'Registro de Clientes', short: 'Clientes', icon: 'clientes' },
  // Só a Flávia vê Contas do Salão (pedido do Erick, 15/09/2026): as outras usam Gastos
  // Pessoais com âmbito "Salão", que já soma pra ela em "Visão Geral da Equipe".
  { to: '/area-colaboradora/contas', label: 'Contas do Salão', short: 'Contas', icon: 'contas', ownerOnly: true },
  { to: '/area-colaboradora/gastos', label: 'Gastos Pessoais', short: 'Gastos', icon: 'gastos' },
];

export function StaffLayout() {
  const { session, loading, name, isOwner, signOut } = useAuth();
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

  const items = NAV_ITEMS.filter((item) => !item.ownerOnly || isOwner);

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-sidebar-top">
          <Link to="/" className="staff-sidebar-logo">
            <img src={asset('logo.png')} alt="Lummier Studio" className="staff-sidebar-logo-img" />
          </Link>
          <div className="staff-sidebar-user">
            <span>Olá, {name}</span>
            <button className="staff-logout-mob" onClick={handleLogout} aria-label="Sair">
              <Icon name="sair" />
            </button>
          </div>
        </div>
        <nav className="staff-nav">
          {items.map((item) => (
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
      {/* Barra inferior fixa, só existe (visualmente) abaixo de 900px — ver
          @media em StaffLayout.css. Renderizar sempre e esconder por CSS em vez de
          checar largura em JS evita layout shift num resize/rotate. */}
      <nav className="staff-bottomnav" aria-label="Navegação principal">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `staff-bnav-link${isActive ? ' active' : ''}`}
          >
            <Icon name={item.icon} />
            <span>{item.short}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
