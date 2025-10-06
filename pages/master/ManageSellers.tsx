import React, { useState } from 'react';
import { SELLERS } from '../../constants';
import { Seller } from '../../types';

const emptySeller: Omit<Seller, 'id'> = { name: '', email: '' };

const ManageSellers: React.FC = () => {
    // Local state to trigger re-renders, initialized with the global data
    const [sellers, setSellers] = useState(SELLERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

    const openModal = (seller: Seller | null) => {
        setEditingSeller(seller ? { ...seller } : { id: `seller-${Date.now()}`, ...emptySeller });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSeller(null);
    };

    const handleSave = () => {
        if (!editingSeller) return;
        
        // Find index in the global source-of-truth array
        const existingIndex = SELLERS.findIndex(s => s.id === editingSeller.id);
        
        if (existingIndex > -1) {
            // Edit: Update the global array directly
            SELLERS[existingIndex] = editingSeller;
        } else {
            // Add: Push to the global array directly
            SELLERS.push(editingSeller);
        }
        
        // Update local state from the mutated global array to trigger a re-render
        setSellers([...SELLERS]);
        closeModal();
    };
    
    const handleDelete = (sellerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
            const indexToDelete = SELLERS.findIndex(s => s.id === sellerId);
            if (indexToDelete > -1) {
                // Delete from the global array
                SELLERS.splice(indexToDelete, 1);
            }
            // Update local state to reflect the deletion
            setSellers([...SELLERS]);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingSeller) return;
        const { name, value } = e.target;
        setEditingSeller({ ...editingSeller, [name]: value });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Vendedores</h1>
                <button onClick={() => openModal(null)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Adicionar Vendedor
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Nome</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map(seller => (
                            <tr key={seller.id}>
                                <td className="py-2 px-4 border-b">{seller.name}</td>
                                <td className="py-2 px-4 border-b">{seller.email}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => openModal(seller)} className="text-blue-600 hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(seller.id)} className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingSeller && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">{editingSeller.id.startsWith('seller-') && editingSeller.id.length > 10 ? 'Adicionar Vendedor' : 'Editar Vendedor'}</h2>
                        <div className="space-y-4">
                           <input name="name" value={editingSeller.name} onChange={handleInputChange} placeholder="Nome do Vendedor" className="w-full p-2 border rounded" />
                           <input name="email" type="email" value={editingSeller.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 border rounded" />
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSellers;