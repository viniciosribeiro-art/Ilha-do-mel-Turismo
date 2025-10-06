import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TOURS } from '../../constants';
import { Tour } from '../../types';

const emptyTour: Omit<Tour, 'id' | 'companyId'> = {
    name: '',
    description: '',
    duration: '',
    pricing: { adult: 0, child: 0, infant: 0 },
    schedules: [{ time: '09:00', capacity: 20 }],
    pickupLocations: [''],
};

const ManageTours: React.FC = () => {
    const { user } = useAuth();
    // In a real app, this would be fetched from an API
    const [tours, setTours] = useState(TOURS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState<Omit<Tour, 'companyId'> | null>(null);

    const companyTours = useMemo(() => {
        return tours.filter(t => t.companyId === user?.companyId);
    }, [tours, user]);

    const openModal = (tour: Tour | null) => {
        setEditingTour(tour ? { ...tour } : { id: `new-tour-${Date.now()}`, ...emptyTour });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTour(null);
    };

    const handleSave = () => {
        if (!editingTour || !user?.companyId) return;

        const tourWithCompany: Tour = { ...editingTour, companyId: user.companyId };
        
        const existingIndex = tours.findIndex(t => t.id === tourWithCompany.id);
        if (existingIndex > -1) {
            const updatedTours = [...tours];
            updatedTours[existingIndex] = tourWithCompany;
            setTours(updatedTours);
        } else {
            // This would be a POST request in a real app
            setTours([...tours, tourWithCompany]);
        }
        closeModal();
    };

    const handleDelete = (tourId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este passeio?')) {
            // This would be a DELETE request
            setTours(tours.filter(t => t.id !== tourId));
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingTour) return;
        setEditingTour({ ...editingTour, [e.target.name]: e.target.value });
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingTour) return;
        const { name, value } = e.target;
        setEditingTour({
            ...editingTour,
            pricing: {
                ...editingTour.pricing,
                [name]: parseFloat(value) || 0,
            },
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Passeios</h1>
                <button onClick={() => openModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Adicionar Passeio
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Nome</th>
                            <th className="py-2 px-4 border-b text-left">Duração</th>
                            <th className="py-2 px-4 border-b text-left">Preço Adulto</th>
                            <th className="py-2 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyTours.map(tour => (
                            <tr key={tour.id}>
                                <td className="py-2 px-4 border-b">{tour.name}</td>
                                <td className="py-2 px-4 border-b">{tour.duration}</td>
                                <td className="py-2 px-4 border-b">R$ {tour.pricing.adult.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => openModal(tour)} className="text-blue-600 hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(tour.id)} className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                         {companyTours.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">Nenhum passeio cadastrado.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingTour && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{editingTour.id.startsWith('new-tour') ? 'Adicionar Novo Passeio' : 'Editar Passeio'}</h2>
                        <div className="space-y-4">
                           <input name="name" value={editingTour.name} onChange={handleInputChange} placeholder="Nome do Passeio" className="w-full p-2 border rounded" />
                           <textarea name="description" value={editingTour.description} onChange={handleInputChange} placeholder="Descrição" className="w-full p-2 border rounded" rows={3}/>
                           <input name="duration" value={editingTour.duration} onChange={handleInputChange} placeholder="Duração (ex: 3 horas)" className="w-full p-2 border rounded" />
                           <fieldset className="border p-4 rounded">
                             <legend className="font-semibold text-sm px-2">Preços</legend>
                             <div className="grid grid-cols-3 gap-2">
                                <input name="adult" type="number" value={editingTour.pricing.adult} onChange={handlePriceChange} placeholder="Adulto" className="w-full p-2 border rounded" />
                                <input name="child" type="number" value={editingTour.pricing.child} onChange={handlePriceChange} placeholder="Criança" className="w-full p-2 border rounded" />
                                <input name="infant" type="number" value={editingTour.pricing.infant} onChange={handlePriceChange} placeholder="Bebê" className="w-full p-2 border rounded" />
                             </div>
                           </fieldset>
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

export default ManageTours;
