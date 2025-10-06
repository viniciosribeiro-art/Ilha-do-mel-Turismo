import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../siteConfig';

const PublicHeader: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                    {siteConfig.title}
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">Início</Link>
                    <Link to="/companies" className="text-gray-600 hover:text-blue-600">Empresas</Link>
                    <Link to="/manage-booking" className="text-gray-600 hover:text-blue-600">Minha Reserva</Link>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;