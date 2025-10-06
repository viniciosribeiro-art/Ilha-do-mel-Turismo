import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TOURS } from '../../constants';
import { Tour, TourSchedule, TourPricing } from '../../types';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; }> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            {children}
        </div>
    </div>
);

const ManageTours: React.FC = () => {
    const { user } = useAuth();
    
    const initialTours = useMemo(() => TOURS.filter(t => t.companyId === user?.companyId), [user]);
    const [tours, setTours] = useState<Tour[]>(initialTours);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for the form inside the modal
    const [currentTour, setCurrentTour] = useState<Partial<Tour> | null>(null);
    const [schedules, setSchedules] = useState<TourSchedule[]>([]);
    const [pickupLocationsStr, setPickupLocationsStr] = useState('');

    const handleAddNew = () => {
        setCurrentTour({ 
            name: '', 
            description: '', 
            duration: '',
            pricing: { adult: 0, child: 0, infant: 0 }
        });
        setSchedules([{ time: '09:00', capacity: 20 }]);
        setPickupLocationsStr('');
        setIsModalOpen(true);
    };

    const handleEdit = (tour: Tour) => {
        setCurrentTour(tour);
        setSchedules(tour.schedules);
        setPickupLocationsStr(tour.pickupLocations.join(', '));
        setIsModalOpen(true);
    };

    const handleDelete = (tourId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este passeio? Esta ação não pode ser desfeita.')) {
            setTours(tours.filter(t => t.id !== tourId));
            console.log(`Simulating DELETE for tour ID: ${tourId}`);
        }
    };
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentTour || !user?.companyId) return;

        const finalTourData = {
            ...currentTour,
            schedules,
            pickupLocations: pickupLocationsStr.split(',').map(s => s.trim()).filter(Boolean),
        };

        if (finalTourData.id) {
            setTours(tours.map(t => t.id === finalTourData.id ? finalTourData as Tour : t));
            console.log('Simulating UPDATE for tour:', finalTourData);
        } else {
            const newTour: Tour = {
                id: `tour-${Date.now()}`,
                companyId: user.companyId,
                ...finalTourData,
            } as Tour;
            setTours([...tours, newTour]);
            console.log('Simulating CREATE for tour:', newTour);
        }
        
        setIsModalOpen(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentTour(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; // name is "adult", "child", or "infant"
        setCurrentTour(prev => prev ? ({ 
            ...prev, 
            pricing: { ...prev.pricing as TourPricing, [name]: parseFloat(value) || 0 } 
        }) : null);
    };
    
    const handleScheduleChange = (index: number, field: keyof TourSchedule, value: string | number) => {
        const newSchedules = [...schedules];
        (newSchedules[index] as any)[field] = field === 'capacity' ? Number(value) : value;
        setSchedules(newSchedules);
    };

    const addSchedule = () => setSchedules([...schedules, { time: '', capacity: 0 }]);
    const removeSchedule = (index: number) => setSchedules(schedules.filter((_, i) => i !== index));

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Passeios</h1>
            <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                + Adicionar Passeio
            </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
                <tr>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Nome</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Preço Adulto</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Duração</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
                </tr>
            </thead>
            <tbody>
              {tours.map(tour => (
                <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-gray-700">{tour.name}</td>
                    <td className="py-3 px-4 border-b text-gray-700">R$ {tour.pricing.adult.toFixed(2)}</td>
                    <td className="py-3 px-4 border-b text-gray-700">{tour.duration}</td>
                    <td className="py-3 px-4 border-b text-gray-700">
                        <button onClick={() => handleEdit(tour)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Editar</button>
                        <button onClick={() => handleDelete(tour.id)} className="text-red-500 hover:text-red-700 font-medium">Excluir</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
            {tours.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum passeio cadastrado.</p>}
        </div>

        {isModalOpen && currentTour && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentTour.id ? 'Editar Passeio' : 'Adicionar Novo Passeio'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nome do Passeio</label>
                    <input type="text" name="name" id="name" value={currentTour.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
                  </div>
                   <div>
                    <label htmlFor="duration" className="block text-gray-700 font-medium mb-1">Duração</label>
                    <input type="text" name="duration" id="duration" value={currentTour.duration || ''} onChange={handleInputChange} placeholder="Ex: 3 horas" className="w-full px-4 py-2 border rounded-lg" required />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Descrição</label>
                <textarea name="description" id="description" value={currentTour.description || ''} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border rounded-lg" required></textarea>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2">Preços por Idade (R$)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="adult" className="block text-gray-700 font-medium mb-1">Adulto</label>
                        <input type="number" name="adult" id="adult" value={currentTour.pricing?.adult || 0} onChange={handlePricingChange} className="w-full px-4 py-2 border rounded-lg" required step="0.01" min="0" />
                    </div>
                     <div>
                        <label htmlFor="child" className="block text-gray-700 font-medium mb-1">Criança</label>
                        <input type="number" name="child" id="child" value={currentTour.pricing?.child || 0} onChange={handlePricingChange} className="w-full px-4 py-2 border rounded-lg" required step="0.01" min="0" />
                    </div>
                     <div>
                        <label htmlFor="infant" className="block text-gray-700 font-medium mb-1">De Colo</label>
                        <input type="number" name="infant" id="infant" value={currentTour.pricing?.infant || 0} onChange={handlePricingChange} className="w-full px-4 py-2 border rounded-lg" required step="0.01" min="0" />
                    </div>
                 </div>
              </div>
              
               {/* Schedules */}
              <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Horários e Capacidade</h3>
                  <div className="space-y-2">
                    {schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="time" value={schedule.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} className="px-4 py-2 border rounded-lg" />
                            <input type="number" value={schedule.capacity} onChange={e => handleScheduleChange(index, 'capacity', e.target.value)} className="w-24 px-4 py-2 border rounded-lg" placeholder="Capac." />
                            <button type="button" onClick={() => removeSchedule(index)} className="text-red-500 font-bold text-2xl">&times;</button>
                        </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSchedule} className="mt-2 text-sm text-blue-600 hover:underline">+ Adicionar Horário</button>
              </div>

                {/* Pickup Locations */}
               <div className="border-t pt-4">
                   <label htmlFor="pickupLocationsStr" className="block text-lg font-semibold text-gray-700 mb-2">Locais de Embarque</label>
                   <p className="text-sm text-gray-500 mb-2">Separe os locais por vírgula. Ex: Trapiche de Brasília, Trapiche de Encantadas</p>
                   <input type="text" id="pickupLocationsStr" value={pickupLocationsStr} onChange={e => setPickupLocationsStr(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
               </div>

              <div className="flex justify-end mt-6 space-x-3 border-t pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Passeio</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
};

export default ManageTours;