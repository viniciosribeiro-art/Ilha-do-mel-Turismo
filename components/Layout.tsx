import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

interface NavItemProps {
    to: string;
    children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
        }
    >
        {children}
    </NavLink>
);

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isDashboard = location.pathname.startsWith('/dashboard');

    if (!isDashboard) {
        // Public layout
        return (
            <div className="flex flex-col min-h-screen">
                <PublicHeader />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <PublicFooter />
            </div>
        );
    }


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
                        <NavItem to="/dashboard/homepage">Página Inicial</NavItem>
                        <NavItem to="/dashboard/settings">Configurações</NavItem>
                    </>
                );
            case UserRole.COMPANY:
                return (
                    <>
                        <NavItem to="/dashboard">Dashboard</NavItem>
                        <NavItem to="/dashboard/tours">Meus Passeios</NavItem>
                        <NavItem to="/dashboard/bookings">Reservas</NavItem>
                        <NavItem to="/dashboard/seller-reports">Relatórios de Vendedores</NavItem>
                    </>
                );
            case UserRole.SELLER:
                return (
                    <>
                        <NavItem to="/dashboard">Dashboard</NavItem>
                        <NavItem to="/dashboard/my-links">Central de Vendas</NavItem>
                        <NavItem to="/dashboard/my-sales">Minhas Vendas</NavItem>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <div className="text-2xl font-bold mb-6 text-center">Painel</div>
                <nav className="flex-grow space-y-2">
                    {renderNavLinks()}
                </nav>
                <div className="mt-auto">
                    <p className="text-sm text-gray-400 px-4">{user?.name}</p>
                    <p className="text-xs text-gray-500 px-4 mb-2">{user?.email}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
