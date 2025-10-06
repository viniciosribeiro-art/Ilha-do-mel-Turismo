import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANIES } from '../constants';

const CompaniesListPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Nossos Parceiros</h1>
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
                                <div className="p-6 bg-gray-50">
                                    <Link to={`/company/${company.slug}`} className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        Ver Passeios
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompaniesListPage;
