import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../siteConfig';

const PublicHeader: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    {siteConfig.title}
                </Link>
                <nav className="hidden md:flex space-x-6 text-gray-600 items-center">
                    <Link to="/" className="hover:text-blue-600">Início</Link>
                    <Link to="/companies" className="hover:text-blue-600">Empresas</Link>
                    <Link to="/manage-booking" className="hover:text-blue-600">Gerenciar Reserva</Link>
                    <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</Link>
                </nav>
                 <div className="md:hidden">
                    {/* Mobile menu button could be added here */}
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
