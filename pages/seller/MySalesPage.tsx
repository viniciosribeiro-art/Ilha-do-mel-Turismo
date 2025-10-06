import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, SELLERS, TOURS, COMPANIES } from '../../constants';

const MySalesPage: React.FC = () => {
    const { user } = useAuth();
    const seller = SELLERS.find(s => s.name === user?.name);

    const sellerBookings = useMemo(() => {
        if (!seller) return [];
        return BOOKINGS.filter(b => b.sellerId === seller.id)
            .map(booking => {
                const tour = TOURS.find(t => t.id === booking.tourId);
                const company = COMPANIES.find(c => c.id === booking.companyId);
                return {
                    ...booking,
                    tourName: tour?.name || 'N/A',
                    companyName: company?.name || 'N/A',
                };
            })
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    }, [user, seller]);

    const commissionRate = 0.10; // 10%

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Minhas Vendas Realizadas</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Data</th>
                            <th className="py-3 px-4 border-b text-left">Cliente</th>
                            <th className="py-3 px-4 border-b text-left">Passeio</th>
                            <th className="py-3 px-4 border-b text-left">Empresa</th>
                            <th className="py-3 px-4 border-b text-left">Valor da Venda</th>
                            <th className="py-3 px-4 border-b text-left">Minha Comissão</th>
                            <th className="py-3 px-4 border-b text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString('pt-BR')}</td>
                                <td className="py-2 px-4 border-b">{booking.customerName}</td>
                                <td className="py-2 px-4 border-b">{booking.tourName}</td>
                                <td className="py-2 px-4 border-b">{booking.companyName}</td>
                                <td className="py-2 px-4 border-b">R$ {booking.totalPrice.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b font-semibold text-green-600">R$ {(booking.totalPrice * commissionRate).toFixed(2)}</td>
                                <td className="py-2 px-4 border-b">{booking.status}</td>
                            </tr>
                        ))}
                         {sellerBookings.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-4 text-gray-500">Você ainda não realizou nenhuma venda.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MySalesPage;
