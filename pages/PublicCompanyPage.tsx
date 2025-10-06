import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { COMPANIES, TOURS } from '../constants';

const PublicCompanyPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sellerId = queryParams.get('sellerId');

    const company = COMPANIES.find(c => c.slug === slug);
    const companyTours = TOURS.filter(t => t.companyId === company?.id);

    if (!company) {
        return (
             <div className="bg-gray-100 min-h-screen flex flex-col">
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-600">Empresa Não Encontrada</h1>
                        <p className="text-gray-600 mt-4">A página que você está tentando acessar não existe.</p>
                        <Link to="/companies" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                            Ver todas as empresas
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
         <div className="bg-gray-50 min-h-screen flex flex-col">
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
                        <img src={company.logoUrl} alt={`${company.name} logo`} className="w-32 h-32 rounded-full border-4 border-gray-200" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">{company.name}</h1>
                            <p className="text-gray-600 mt-2">{company.description}</p>
                            <p className="text-sm text-gray-500 mt-2">Contato: <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline">{company.contactEmail}</a></p>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossos Passeios</h2>
                    <div className="space-y-6">
                        {companyTours.map(tour => (
                            <div key={tour.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
                                <div className="flex-grow mb-4 md:mb-0">
                                    <h3 className="text-2xl font-semibold text-gray-800">{tour.name}</h3>
                                    <p className="text-gray-600 mt-1">{tour.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span>Duração: {tour.duration}</span>
                                        <span>Adulto: R$ {tour.pricing.adult.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link
                                        to={`/book/${tour.id}${sellerId ? `?sellerId=${sellerId}` : ''}`}
                                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Reservar Agora
                                    </Link>
                                </div>
                            </div>
                        ))}
                         {companyTours.length === 0 && (
                            <p className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">Nenhum passeio disponível no momento.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicCompanyPage;
