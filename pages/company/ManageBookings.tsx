import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, TOURS } from '../../constants';
import { Booking } from '../../types';

const ManageBookings: React.FC = () => {
    const { user } = useAuth();
    // In a real app, this would be fetched from an API
    const [bookings, setBookings] = useState(BOOKINGS);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmada' | 'Pendente' | 'Cancelada'>('All');

    const companyBookings = useMemo(() => {
        let filtered = bookings.filter(b => b.companyId === user?.companyId);
        if (filterStatus !== 'All') {
            filtered = filtered.filter(b => b.status === filterStatus);
        }
        return filtered.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    }, [bookings, user, filterStatus]);
    
    const handleStatusChange = (bookingId: string, newStatus: 'Confirmada' | 'Pendente' | 'Cancelada') => {
        // This would be a PATCH/PUT request in a real app
        setBookings(prevBookings => prevBookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        ));
    };
    
    const statusColors: Record<string, string> = {
        'Confirmada': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Cancelada': 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Reservas</h1>
            
            <div className="mb-4">
                <label className="mr-2">Filtrar por Status:</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="p-2 border rounded">
                    <option value="All">Todos</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Cliente</th>
                            <th className="py-2 px-4 border-b text-left">Passeio</th>
                            <th className="py-2 px-4 border-b text-left">Data</th>
                            <th className="py-2 px-4 border-b text-left">Valor</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyBookings.map((booking: Booking) => {
                            const tour = TOURS.find(t => t.id === booking.tourId);
                            return (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{booking.customerName}</td>
                                    <td className="py-2 px-4 border-b">{tour?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-2 px-4 border-b">R$ {booking.totalPrice.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${statusColors[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {booking.status !== 'Confirmada' && <button onClick={() => handleStatusChange(booking.id, 'Confirmada')} className="text-xs bg-green-500 text-white px-2 py-1 rounded mr-1 hover:bg-green-600">Confirmar</button>}
                                        {booking.status !== 'Cancelada' && <button onClick={() => handleStatusChange(booking.id, 'Cancelada')} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Cancelar</button>}
                                    </td>
                                </tr>
                            );
                        })}
                         {companyBookings.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-4 text-gray-500">Nenhuma reserva encontrada com este filtro.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
