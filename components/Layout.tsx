import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavItemProps {
  to: string;
  children: ReactNode;
}
const NavItem: React.FC<NavItemProps> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-200 hover:bg-blue-800 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLinks = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.MASTER:
        return (
          <>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/dashboard/companies">Empresas</NavItem>
            <NavItem to="/dashboard/sellers">Vendedores</NavItem>
            <NavItem to="/dashboard/reports">Relatórios</NavItem>
            <NavItem to="/dashboard/homepage">Homepage</NavItem>
            <NavItem to="/dashboard/settings">Configurações</NavItem>
          </>
        );
      case UserRole.COMPANY:
        return (
          <>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/dashboard/tours">Meus Passeios</NavItem>
            <NavItem to="/dashboard/bookings">Reservas</NavItem>
            <NavItem to="/dashboard/seller-reports">Relatórios Vendedores</NavItem>
          </>
        );
      case UserRole.SELLER:
        return (
          <>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/dashboard/my-links">Meus Links</NavItem>
            <NavItem to="/dashboard/my-sales">Minhas Vendas</NavItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8">Painel</div>
        <nav className="flex-grow space-y-2">
          {renderNavLinks()}
        </nav>
        <div>
            <a href="/#/" target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-gray-300 hover:text-white mb-2">
                Ver Site Público
            </a>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Sair
            </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
            {user && (
                <div className="text-right">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>
            )}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;