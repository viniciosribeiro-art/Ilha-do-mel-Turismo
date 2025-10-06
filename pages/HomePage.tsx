import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { siteConfig } from '../siteConfig';
import { VOUCHERS, SELLERS, COMPANIES } from '../constants';

type ModalTab = 'code' | 'qr';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h3>
            {children}
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ModalTab>('code');
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const navigate = useNavigate();

    const handleValidation = (e: React.FormEvent) => {
        e.preventDefault();
        setInputError('');
        const trimmedInput = inputValue.trim();

        if (!trimmedInput) {
            setInputError('Por favor, insira um código ou nome.');
            return;
        }
        
        const voucher = VOUCHERS.find(v => v.code.toUpperCase() === trimmedInput.toUpperCase());
        if (voucher) {
            const company = COMPANIES.find(c => c.id === voucher.companyId);
            if (company) {
                setIsModalOpen(false);
                navigate(`/company/${company.slug}?sellerId=${voucher.sellerId}`);
                return;
            }
        }

        const seller = SELLERS.find(s => s.name.toUpperCase() === trimmedInput.toUpperCase());
        if (seller) {
            setIsModalOpen(false);
            navigate(`/seller/${seller.id}`);
            return;
        }

        setInputError('Código, nome ou voucher inválido. Por favor, verifique e tente novamente.');
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-blue-700 text-white text-center py-40 relative h-[80vh] flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30" 
                        style={{ backgroundImage: `url('${siteConfig.hero.heroImageUrl}')` }}
                    ></div>
                    <div className="container mx-auto px-6 z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{siteConfig.hero.title}</h1>
                        <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto drop-shadow-md">{siteConfig.hero.subtitle}</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-blue-700 font-bold py-3 px-10 rounded-full hover:bg-blue-100 transition-colors text-lg shadow-xl transform hover:scale-105"
                        >
                            {siteConfig.hero.cta}
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">{siteConfig.aboutSection.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">{siteConfig.aboutSection.paragraph}</p>
                    </div>
                </section>

                {/* Photo Gallery Section */}
                <section className="py-20 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Galeria de Fotos</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {siteConfig.photoGallery.map((photo, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                                    <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                                        <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Video Gallery Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                         <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Vídeos da Experiência</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {siteConfig.videoGallery.map((video, index) => (
                                <div key={index} className="rounded-lg shadow-lg overflow-hidden">
                                    <div className="aspect-w-16 aspect-h-9">
                                        <iframe 
                                            src={video.videoUrl} 
                                            title={video.title} 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                     <h3 className="p-4 text-center font-semibold text-gray-700 bg-gray-50">{video.title}</h3>
                                </div>
                            ))}
                         </div>
                    </div>
                </section>

            </main>
            <PublicFooter />

            {isModalOpen && (
                <Modal title="Acessar com Vendedor" onClose={() => setIsModalOpen(false)}>
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`${activeTab === 'code' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                            >
                                Código ou Nome
                            </button>
                            <button
                                onClick={() => setActiveTab('qr')}
                                className={`${activeTab === 'qr' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                            >
                                Escanear QR Code
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'code' && (
                        <form onSubmit={handleValidation} className="space-y-4">
                            <p className="text-center text-gray-600 mb-4">Insira o código ou nome completo fornecido pelo seu vendedor.</p>
                            <div>
                                <label htmlFor="code-input" className="sr-only">Código, Voucher ou Nome do Vendedor</label>
                                <input
                                    id="code-input"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Insira o código ou nome"
                                    autoFocus
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-center text-lg tracking-wider ${inputError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                                {inputError && <p className="text-red-600 text-sm mt-2 text-center">{inputError}</p>}
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg">
                                Validar e Continuar
                            </button>
                        </form>
                    )}

                    {activeTab === 'qr' && (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Aponte a câmera do seu celular para o QR Code do vendedor para ser redirecionado automaticamente.</p>
                            <div className="bg-gray-800 p-4 rounded-lg inline-block">
                                <svg className="w-32 h-32 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 9h18M3 15h18" />
                                </svg>
                            </div>
                             <p className="text-xs text-gray-400 mt-4">Simulação de scanner. Use o app de câmera do seu dispositivo.</p>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default HomePage;