import React, { useState } from 'react';
import { siteConfig as initialSiteConfig } from '../../siteConfig';

const ManageHomepage: React.FC = () => {
    const [config, setConfig] = useState(initialSiteConfig);
    const [showSuccess, setShowSuccess] = useState(false);

    // FIX: Replaced the original implementation with a type-safe version to handle nested object updates
    // and prevent errors when spreading non-object types.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.'); // e.g., "hero.title"

        if (keys.length === 2) {
            const sectionKey = keys[0] as keyof typeof config;
            const fieldKey = keys[1];

            setConfig(prev => {
                const section = prev[sectionKey];
                // Check if the section is a plain object before spreading
                if (typeof section === 'object' && !Array.isArray(section) && section !== null) {
                    return {
                        ...prev,
                        [sectionKey]: {
                            ...section,
                            [fieldKey]: value,
                        },
                    };
                }
                return prev; // Return previous state if section is not an object
            });
        }
    };

    const handleGalleryChange = (gallery: 'photoGallery' | 'videoGallery', index: number, field: string, value: string) => {
        const newGallery = [...config[gallery]];
        // @ts-ignore
        newGallery[index][field] = value;
        setConfig(prev => ({ ...prev, [gallery]: newGallery }));
    };

    const addGalleryItem = (gallery: 'photoGallery' | 'videoGallery') => {
        const newItem = gallery === 'photoGallery' 
            ? { imageUrl: '', caption: '' }
            : { videoUrl: '', title: '' };
        setConfig(prev => ({ ...prev, [gallery]: [...prev[gallery], newItem] }));
    };

    const removeGalleryItem = (gallery: 'photoGallery' | 'videoGallery', index: number) => {
        setConfig(prev => ({ ...prev, [gallery]: prev[gallery].filter((_, i) => i !== index) }));
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Saving new homepage config:", config);
        // Here you would make an API call to save the config
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Página Inicial</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Section */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2 text-gray-700">Seção Principal (Hero)</legend>
                        <div className="space-y-4 p-2">
                             <div>
                                <label htmlFor="hero.title" className="block text-sm font-medium text-gray-700">Título Principal</label>
                                <input type="text" id="hero.title" name="hero.title" value={config.hero.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="hero.subtitle" className="block text-sm font-medium text-gray-700">Subtítulo</label>
                                <textarea id="hero.subtitle" name="hero.subtitle" value={config.hero.subtitle} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="hero.heroImageUrl" className="block text-sm font-medium text-gray-700">URL da Imagem de Fundo</label>
                                <input type="text" id="hero.heroImageUrl" name="hero.heroImageUrl" value={config.hero.heroImageUrl} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </fieldset>
                    
                     {/* About Section */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2 text-gray-700">Seção Sobre a Experiência</legend>
                        <div className="space-y-4 p-2">
                            <div>
                                <label htmlFor="aboutSection.title" className="block text-sm font-medium text-gray-700">Título da Seção</label>
                                <input type="text" name="aboutSection.title" value={config.aboutSection.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="aboutSection.paragraph" className="block text-sm font-medium text-gray-700">Parágrafo Descritivo</label>
                                <textarea name="aboutSection.paragraph" value={config.aboutSection.paragraph} onChange={handleInputChange} rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </fieldset>
                    
                    {/* Photo Gallery Management */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2 text-gray-700">Galeria de Fotos</legend>
                        <div className="space-y-4 p-2">
                            {config.photoGallery.map((photo, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border-b">
                                    <div className="flex-grow grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="URL da Imagem" value={photo.imageUrl} onChange={e => handleGalleryChange('photoGallery', index, 'imageUrl', e.target.value)} className="px-3 py-2 border rounded-md" />
                                        <input type="text" placeholder="Legenda" value={photo.caption} onChange={e => handleGalleryChange('photoGallery', index, 'caption', e.target.value)} className="px-3 py-2 border rounded-md" />
                                    </div>
                                    <button type="button" onClick={() => removeGalleryItem('photoGallery', index)} className="text-red-500 font-bold px-3 py-1 rounded hover:bg-red-100">X</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addGalleryItem('photoGallery')} className="text-sm text-blue-600 hover:underline mt-2">+ Adicionar Foto</button>
                        </div>
                    </fieldset>

                     {/* Video Gallery Management */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2 text-gray-700">Galeria de Vídeos</legend>
                        <div className="space-y-4 p-2">
                            {config.videoGallery.map((video, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border-b">
                                    <div className="flex-grow grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="URL de Embed do YouTube" value={video.videoUrl} onChange={e => handleGalleryChange('videoGallery', index, 'videoUrl', e.target.value)} className="px-3 py-2 border rounded-md" />
                                        <input type="text" placeholder="Título do Vídeo" value={video.title} onChange={e => handleGalleryChange('videoGallery', index, 'title', e.target.value)} className="px-3 py-2 border rounded-md" />
                                    </div>
                                    <button type="button" onClick={() => removeGalleryItem('videoGallery', index)} className="text-red-500 font-bold px-3 py-1 rounded hover:bg-red-100">X</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addGalleryItem('videoGallery')} className="text-sm text-blue-600 hover:underline mt-2">+ Adicionar Vídeo</button>
                        </div>
                    </fieldset>

                    <div className="flex justify-end items-center pt-4">
                         {showSuccess && (
                            <span className="text-green-600 font-medium mr-4">Conteúdo salvo com sucesso!</span>
                        )}
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Salvar Alterações
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default ManageHomepage;