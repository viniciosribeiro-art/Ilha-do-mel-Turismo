import React, { useState } from 'react';
import { SELLERS } from '../../constants';
import { Seller } from '../../types';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; }> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            {children}
        </div>
    </div>
);

const ManageSellers: React.FC = () => {
    const [sellers, setSellers] = useState<Seller[]>(SELLERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSeller, setCurrentSeller] = useState<Partial<Seller> | null>(null);

    const handleAddNew = () => {
        setCurrentSeller({ name: '', email: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (seller: Seller) => {
        setCurrentSeller(seller);
        setIsModalOpen(true);
    };

    const handleDelete = (sellerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
            setSellers(sellers.filter(s => s.id !== sellerId));
            // API call to delete would be here
        }
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentSeller) return;

        if (currentSeller.id) { // Editing
            setSellers(sellers.map(s => s.id === currentSeller.id ? currentSeller as Seller : s));
        } else { // Adding new
            const newSeller: Seller = {
                id: `seller-${Date.now()}`,
                ...currentSeller,
            } as Seller;
            setSellers([...sellers, newSeller]);
        }
        setIsModalOpen(false);
        setCurrentSeller(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSeller(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Vendedores</h1>
                <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm">
                    + Adicionar Vendedor
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Nome</th>
                            <th className="py-3 px-4 border-b text-left">Email</th>
                            <th className="py-3 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map(seller => (
                            <tr key={seller.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{seller.name}</td>
                                <td className="py-3 px-4 border-b">{seller.email}</td>
                                <td className="py-3 px-4 border-b">
                                    <button onClick={() => handleEdit(seller)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Editar</button>
                                    <button onClick={() => handleDelete(seller.id)} className="text-red-500 hover:text-red-700 font-medium">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sellers.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum vendedor cadastrado.</p>}
            </div>

            {isModalOpen && currentSeller && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">{currentSeller.id ? 'Editar Vendedor' : 'Adicionar Novo Vendedor'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Vendedor</label>
                            <input type="text" name="name" id="name" value={currentSeller.name || ''} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value={currentSeller.email || ''} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="flex justify-end pt-4 space-x-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ManageSellers;
