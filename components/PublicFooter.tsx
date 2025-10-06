import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../siteConfig';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-6 text-center">
                <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-gray-300">Acesso Restrito</h3>
                    <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <Link to="/login" className="hover:text-white hover:underline">Painel Master</Link>
                        <span>&bull;</span>
                        <Link to="/login" className="hover:text-white hover:underline">Painel Empresa</Link>
                        <span>&bull;</span>
                        <Link to="/login" className="hover:text-white hover:underline">Painel Vendedor</Link>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6">
                    <p>&copy; {new Date().getFullYear()} {siteConfig.title}. Todos os direitos reservados.</p>
                    <p className="text-sm text-gray-400 mt-2">Plataforma de passeios na Ilha do Mel, PR.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;