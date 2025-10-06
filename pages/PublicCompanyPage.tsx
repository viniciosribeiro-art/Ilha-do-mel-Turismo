import React from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { COMPANIES, TOURS } from '../constants';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PublicCompanyPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const query = useQuery();
    const sellerId = query.get('sellerId');
    
    const company = COMPANIES.find(c => c.slug === slug);
    
    if (!company) {
        return <Navigate to="/companies" replace />;
    }

    const companyTours = TOURS.filter(t => t.companyId === company.id);
    
    const bookingLink = (tourId: string) => {
        let path = `/book/${tourId}`;
        if (sellerId) {
            path += `?sellerId=${sellerId}`;
        }
        return path;
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    {/* Company Header */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
                        <img src={company.logoUrl} alt={`${company.name} logo`} className="w-32 h-32 rounded-full border-4 border-blue-500" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">{company.name}</h1>
                            <p className="mt-2 text-gray-600 max-w-2xl">{company.description}</p>
                            <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline mt-2 inline-block">{company.contactEmail}</a>
                        </div>
                    </div>

                    {/* Tours List */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossos Passeios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companyTours.map(tour => (
                            <div key={tour.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
                                    <p className="text-sm text-gray-500"><strong>Duração:</strong> {tour.duration}</p>
                                </div>
                                <div className="p-6 bg-gray-50 mt-auto">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-gray-600 text-sm">A partir de</span>
                                            <p className="text-2xl font-bold text-blue-600">R$ {tour.pricing.adult.toFixed(2)}</p>
                                        </div>
                                        <Link 
                                            to={bookingLink(tour.id)} 
                                            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Reservar Agora
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {companyTours.length === 0 && (
                            <p className="col-span-full text-center text-gray-500 py-8">
                                Esta empresa ainda não possui passeios cadastrados.
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicCompanyPage;