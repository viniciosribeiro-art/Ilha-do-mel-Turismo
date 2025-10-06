import React, { useState } from 'react';
import { COMPANIES } from '../../constants';
import { Company } from '../../types';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; }> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            {children}
        </div>
    </div>
);

const ManageCompanies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>(COMPANIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<Partial<Company> | null>(null);

    const handleAddNew = () => {
        setCurrentCompany({ name: '', slug: '', description: '', logoUrl: 'https://picsum.photos/seed/new/200', contactEmail: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (company: Company) => {
        setCurrentCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = (companyId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta empresa? Todos os passeios e reservas associados também serão afetados.')) {
            setCompanies(companies.filter(c => c.id !== companyId));
            // In a real app, API call to delete would be made here
        }
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentCompany) return;

        if (currentCompany.id) { // Editing existing company
            setCompanies(companies.map(c => c.id === currentCompany.id ? currentCompany as Company : c));
        } else { // Adding new company
            const newCompany: Company = {
                id: `company-${Date.now()}`,
                ...currentCompany,
            } as Company;
            setCompanies([...companies, newCompany]);
        }
        setIsModalOpen(false);
        setCurrentCompany(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentCompany(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Empresas</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm">
                    + Adicionar Empresa
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Nome</th>
                            <th className="py-3 px-4 border-b text-left">Slug</th>
                            <th className="py-3 px-4 border-b text-left">Email de Contato</th>
                            <th className="py-3 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{company.name}</td>
                                <td className="py-3 px-4 border-b">{company.slug}</td>
                                <td className="py-3 px-4 border-b">{company.contactEmail}</td>
                                <td className="py-3 px-4 border-b">
                                    <button onClick={() => handleEdit(company)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Editar</button>
                                    <button onClick={() => handleDelete(company.id)} className="text-red-500 hover:text-red-700 font-medium">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {companies.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma empresa cadastrada.</p>}
            </div>

            {isModalOpen && currentCompany && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">{currentCompany.id ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                            <input type="text" name="name" id="name" value={currentCompany.name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Subdomínio (slug)</label>
                            <input type="text" name="slug" id="slug" value={currentCompany.slug || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="ex: nome-da-empresa" required />
                        </div>
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email de Contato</label>
                            <input type="email" name="contactEmail" id="contactEmail" value={currentCompany.contactEmail || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL do Logo</label>
                            <input type="text" name="logoUrl" id="logoUrl" value={currentCompany.logoUrl || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea name="description" id="description" value={currentCompany.description || ''} onChange={handleInputChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required></textarea>
                        </div>
                        <div className="flex justify-end pt-4 space-x-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ManageCompanies;