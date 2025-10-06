import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SELLERS, COMPANIES } from '../constants';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const SellerPublicPage: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const seller = SELLERS.find(s => s.id === sellerId);

    if (!seller) {
        return (
             <div className="bg-gray-100 min-h-screen flex flex-col">
                <PublicHeader />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-600">Vendedor Não Encontrado</h1>
                        <p className="text-gray-600 mt-4">O link de vendedor que você acessou parece estar quebrado ou inválido.</p>
                        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                            Voltar para a Página Inicial
                        </Link>
                    </div>
                </main>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-4xl font-bold text-gray-800">Recomendações de {seller.name}</h1>
                        <p className="mt-2 text-gray-600">Escolha uma de nossas empresas parceiras para ver os passeios disponíveis.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {COMPANIES.map(company => (
                            <div key={company.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                <div className="p-6 text-center">
                                    <img src={company.logoUrl} alt={`${company.name} logo`} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-200" />
                                    <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
                                </div>
                                <div className="p-6 flex-grow">
                                    <p className="text-gray-600">{company.description}</p>
                                </div>
                                <div className="p-6 bg-gray-50 mt-auto">
                                    <Link 
                                        to={`/company/${company.slug}?sellerId=${sellerId}`} 
                                        className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Ver Passeios
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default SellerPublicPage;
