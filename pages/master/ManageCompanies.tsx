import React, { useState } from 'react';
import { COMPANIES } from '../../constants';
import { Company } from '../../types';

const emptyCompany: Omit<Company, 'id'> = {
    name: '',
    slug: '',
    description: '',
    logoUrl: 'https://picsum.photos/seed/newcompany/200',
    contactEmail: ''
};

const ManageCompanies: React.FC = () => {
    // Local state to trigger re-renders, initialized with the global data
    const [companies, setCompanies] = useState(COMPANIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    const openModal = (company: Company | null) => {
        setEditingCompany(company ? { ...company } : { id: `company-${Date.now()}`, ...emptyCompany });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    const handleSave = () => {
        if (!editingCompany) return;
        
        // Find index in the global source-of-truth array
        const existingIndex = COMPANIES.findIndex(c => c.id === editingCompany.id);
        
        if (existingIndex > -1) {
            // Edit: Update the global array directly
            COMPANIES[existingIndex] = editingCompany;
        } else {
            // Add: Push to the global array directly
            COMPANIES.push(editingCompany);
        }

        // Update local state from the mutated global array to trigger a re-render
        setCompanies([...COMPANIES]);
        closeModal();
    };

    const handleDelete = (companyId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
            const indexToDelete = COMPANIES.findIndex(c => c.id === companyId);
            if (indexToDelete > -1) {
                // Delete from the global array
                COMPANIES.splice(indexToDelete, 1);
            }
            // Update local state to reflect the deletion
            setCompanies([...COMPANIES]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingCompany) return;
        const { name, value } = e.target;
        
        let finalValue = value;
        let updatedCompany = { ...editingCompany, [name]: finalValue };

        if (name === 'name') {
            updatedCompany.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        
        setEditingCompany(updatedCompany);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Empresas</h1>
                <button onClick={() => openModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Adicionar Empresa
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Nome</th>
                            <th className="py-2 px-4 border-b text-left">Email de Contato</th>
                            <th className="py-2 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id}>
                                <td className="py-2 px-4 border-b">{company.name}</td>
                                <td className="py-2 px-4 border-b">{company.contactEmail}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => openModal(company)} className="text-blue-600 hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(company.id)} className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && editingCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{editingCompany.id.startsWith('company-') && editingCompany.id.length > 10 ? 'Adicionar Empresa' : 'Editar Empresa'}</h2>
                        <div className="space-y-4">
                           <input name="name" value={editingCompany.name} onChange={handleInputChange} placeholder="Nome da Empresa" className="w-full p-2 border rounded" />
                           <input name="slug" value={editingCompany.slug} onChange={handleInputChange} placeholder="Slug (gerado automaticamente)" className="w-full p-2 border rounded bg-gray-100" readOnly />
                           <input name="contactEmail" type="email" value={editingCompany.contactEmail} onChange={handleInputChange} placeholder="Email de Contato" className="w-full p-2 border rounded" />
                           <input name="logoUrl" value={editingCompany.logoUrl} onChange={handleInputChange} placeholder="URL do Logo" className="w-full p-2 border rounded" />
                           <textarea name="description" value={editingCompany.description} onChange={handleInputChange} placeholder="Descrição" className="w-full p-2 border rounded" rows={4} />
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCompanies;