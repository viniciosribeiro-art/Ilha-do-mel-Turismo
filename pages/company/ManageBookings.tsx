import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, TOURS, SELLERS } from '../../constants';
import { Booking } from '../../types';

type BookingStatus = 'Confirmada' | 'Pendente' | 'Cancelada';

const statusColors: Record<BookingStatus, string> = {
    'Confirmada': 'bg-green-100 text-green-800',
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'Cancelada': 'bg-red-100 text-red-800',
};

const ManageBookings: React.FC = () => {
    const { user } = useAuth();
    
    // Use local state to manage bookings so we can simulate updates
    const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
    
    const companyBookings = useMemo(() => {
        return bookings
            .filter(b => b.companyId === user?.companyId)
            .map(booking => {
                const tour = TOURS.find(t => t.id === booking.tourId);
                const seller = SELLERS.find(s => s.id === booking.sellerId);
                return {
                    ...booking,
                    tourName: tour?.name || 'N/A',
                    sellerName: seller?.name,
                };
            })
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    }, [user, bookings]);
    
    const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
        setBookings(prevBookings => prevBookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        ));
        console.log(`Simulating status update for booking ${bookingId} to ${newStatus}`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Reservas</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Cliente</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Passeio</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Data</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Vendedor</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Valor</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{booking.customerName}</td>
                                <td className="py-3 px-4 border-b">{booking.tourName}</td>
                                <td className="py-3 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString('pt-BR')} {booking.selectedTime}</td>
                                <td className="py-3 px-4 border-b">{booking.sellerName || '-'}</td>
                                <td className="py-3 px-4 border-b">R$ {booking.totalPrice.toFixed(2)}</td>
                                <td className="py-3 px-4 border-b">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                    <select 
                                        value={booking.status} 
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                        className="p-1 border rounded-md text-sm"
                                    >
                                        <option value="Confirmada">Confirmar</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Cancelada">Cancelar</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {companyBookings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Nenhuma reserva encontrada para sua empresa.</p>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
