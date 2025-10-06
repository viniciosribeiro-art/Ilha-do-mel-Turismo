
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, TOURS } from '../../constants';
import StatCard from '../../components/StatCard';
import { Booking } from '../../types';

const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const TourIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;


const CompanyDashboard: React.FC = () => {
    const { user } = useAuth();

    if (!user || !user.companyId) {
        return <div>Usuário da empresa não encontrado.</div>;
    }

    const companyTours = TOURS.filter(t => t.companyId === user.companyId);
    const companyBookings = BOOKINGS.filter(b => b.companyId === user.companyId);

    // FIX: The Booking object already contains totalPrice, so we can use that directly
    // instead of trying to access a non-existent 'price' property on Tour.
    const totalRevenue = companyBookings.reduce((acc, booking) => {
        return acc + booking.totalPrice;
    }, 0);

    const recentBookings = [...companyBookings]
        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 5);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard da Empresa</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total de Passeios"
                    value={companyTours.length}
                    icon={<TourIcon />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total de Reservas"
                    value={companyBookings.length}
                    icon={<ClipboardListIcon />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Receita Total"
                    value={`R$ ${totalRevenue.toFixed(2)}`}
                    icon={<CashIcon />}
                    color="bg-indigo-500"
                />
            </div>
            
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Últimas Reservas</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Cliente</th>
                                <th className="py-2 px-4 border-b text-left">Passeio</th>
                                <th className="py-2 px-4 border-b text-left">Data</th>
                                <th className="py-2 px-4 border-b text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((booking: Booking) => {
                                const tour = companyTours.find(t => t.id === booking.tourId);
                                return (
                                    <tr key={booking.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{booking.customerName}</td>
                                        <td className="py-2 px-4 border-b">{tour?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 text-sm rounded-full ${booking.status === 'Confirmada' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {recentBookings.length === 0 && <p className="text-center py-4 text-gray-500">Nenhuma reserva encontrada.</p>}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;