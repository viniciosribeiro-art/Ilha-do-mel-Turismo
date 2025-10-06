import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../siteConfig';
import { COMPANIES } from '../constants';

const HomePage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-cover bg-center text-white" style={{ backgroundImage: `url(${siteConfig.hero.heroImageUrl})` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-6 py-32 text-center relative z-10">
                    <h1 className="text-5xl font-extrabold leading-tight mb-4">{siteConfig.hero.title}</h1>
                    <p className="text-lg mb-8">{siteConfig.hero.subtitle}</p>
                    <Link to="/companies" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105">
                        {siteConfig.hero.cta}
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">{siteConfig.aboutSection.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{siteConfig.aboutSection.paragraph}</p>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Nossos Parceiros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {COMPANIES.map(company => (
                             <div key={company.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
                                <img src={company.logoUrl} alt={`${company.name} logo`} className="w-full h-48 md:w-48 md:h-full object-cover" />
                                <div className="p-6 flex flex-col justify-between self-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">{company.name}</h3>
                                        <p className="text-gray-600 mt-2">{company.description}</p>
                                    </div>
                                    <Link to={`/company/${company.slug}`} className="mt-4 text-blue-600 font-semibold hover:underline self-start">
                                        Ver Passeios &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/companies" className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-900">
                           Ver Todas as Empresas
                        </Link>
                    </div>
                </div>
            </section>


            {/* Photo Gallery */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Galeria de Fotos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {siteConfig.photoGallery.map((photo, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg aspect-square">
                                <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                                    <p className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
