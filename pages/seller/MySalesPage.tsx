import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, SELLERS, TOURS, COMPANIES } from '../../constants';
import { Booking } from '../../types';

const MySalesPage: React.FC = () => {
    const { user } = useAuth();
    const seller = SELLERS.find(s => s.name === user?.name);

    const salesDetails = useMemo(() => {
        if (!seller) return [];
        
        const commissionRate = 0.10; // 10% commission
        
        return BOOKINGS
            .filter(b => b.sellerId === seller.id)
            .map(booking => {
                const tour = TOURS.find(t => t.id === booking.tourId);
                const company = COMPANIES.find(c => c.id === booking.companyId);
                const commission = booking.totalPrice * commissionRate;
                
                const passengerStr = [
                    booking.passengers.adults > 0 ? `${booking.passengers.adults}A` : '',
                    booking.passengers.children > 0 ? `${booking.passengers.children}C` : '',
                    booking.passengers.infants > 0 ? `${booking.passengers.infants}I` : '',
                ].filter(Boolean).join(', ');

                return {
                    ...booking,
                    tourName: tour?.name || 'N/A',
                    companyName: company?.name || 'N/A',
                    passengerDetails: passengerStr,
                    commission,
                };
            })
            .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    }, [seller]);

    if (!seller) {
        return <div>Vendedor não encontrado.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Histórico Detalhado de Vendas</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Cliente</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Passeio</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Data</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Passageiros</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Valor Total</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Minha Comissão</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesDetails.map(sale => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{sale.customerName}</td>
                                <td className="py-3 px-4 border-b">{sale.tourName}</td>
                                <td className="py-3 px-4 border-b">{new Date(sale.bookingDate).toLocaleDateString('pt-BR')} {sale.selectedTime}</td>
                                <td className="py-3 px-4 border-b">{sale.passengerDetails}</td>
                                <td className="py-3 px-4 border-b">R$ {sale.totalPrice.toFixed(2)}</td>
                                <td className="py-3 px-4 border-b font-semibold text-green-600">R$ {sale.commission.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {salesDetails.length === 0 && <p className="text-center text-gray-500 py-4">Você ainda não registrou nenhuma venda.</p>}
            </div>
        </div>
    );
};

export default MySalesPage;