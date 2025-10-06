import React, { useState } from 'react';

interface SystemSettings {
    platformName: string;
    defaultCommissionRate: number;
    systemEmail: string;
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SystemSettings>({
        platformName: 'Passeios Ilha do Mel',
        defaultCommissionRate: 10, // in percent
        systemEmail: 'contato@ilhadomel.com'
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Saving settings:', settings);
        // In a real app, an API call would be made here.
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide message after 3 seconds
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações Gerais</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">Nome da Plataforma</label>
                        <input
                            type="text"
                            name="platformName"
                            id="platformName"
                            value={settings.platformName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="defaultCommissionRate" className="block text-sm font-medium text-gray-700">Taxa de Comissão Padrão (%)</label>
                        <input
                            type="number"
                            name="defaultCommissionRate"
                            id="defaultCommissionRate"
                            value={settings.defaultCommissionRate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            step="0.1"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <label htmlFor="systemEmail" className="block text-sm font-medium text-gray-700">Email de Contato do Sistema</label>
                        <input
                            type="email"
                            name="systemEmail"
                            id="systemEmail"
                            value={settings.systemEmail}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div className="flex justify-end items-center pt-4">
                         {showSuccess && (
                            <span className="text-green-600 font-medium mr-4">Configurações salvas com sucesso!</span>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;