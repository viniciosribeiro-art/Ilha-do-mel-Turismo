import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, SELLERS, TOURS, COMPANIES } from '../../constants';
import StatCard from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';

const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const SellerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const seller = SELLERS.find(s => s.name === user?.name);

    const commissionRate = 0.10; // 10% commission

    const { sellerBookings, totalCommission, commissionByCompany } = useMemo(() => {
        if (!seller) return { sellerBookings: [], totalCommission: 0, commissionByCompany: [] };

        const sellerBookings = BOOKINGS.filter(b => b.sellerId === seller.id);
        
        // FIX: Use booking.totalPrice which is already calculated, instead of a non-existent tour.price.
        const totalCommission = sellerBookings.reduce((acc, booking) => {
            return acc + (booking.totalPrice * commissionRate);
        }, 0);

        const commissionMap = sellerBookings.reduce((acc, booking) => {
            const company = COMPANIES.find(c => c.id === booking.companyId);
            if (!company) return acc;
            
            // FIX: Use booking.totalPrice for commission calculation, not non-existent tour.price.
            const commission = booking.totalPrice * commissionRate;

            if (!acc[company.id]) {
                acc[company.id] = { companyName: company.name, totalSales: 0, totalCommission: 0 };
            }
            acc[company.id].totalSales++;
            acc[company.id].totalCommission += commission;
            return acc;
        }, {} as Record<string, { companyName: string, totalSales: number, totalCommission: number }>);
        
        const commissionByCompany = Object.values(commissionMap).sort((a,b) => b.totalCommission - a.totalCommission);

        return { sellerBookings, totalCommission, commissionByCompany };
    }, [user, seller]);


    if (!seller) {
        return <div>Vendedor não encontrado.</div>;
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard do Vendedor: {seller.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Total de Vendas"
                    value={sellerBookings.length}
                    icon={<ClipboardListIcon />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total de Comissões"
                    value={`R$ ${totalCommission.toFixed(2)}`}
                    icon={<CashIcon />}
                    color="bg-blue-500"
                />
            </div>
            
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/dashboard/my-links')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Gerar Links de Venda</button>
                    <button onClick={() => navigate('/dashboard/my-sales')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Ver Todas as Vendas</button>
                </div>
            </div>

             <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Comissões por Empresa</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Empresa</th>
                                <th className="py-2 px-4 border-b text-left">Nº de Vendas</th>
                                <th className="py-2 px-4 border-b text-left">Comissão a Receber</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissionByCompany.map(item => (
                                <tr key={item.companyName} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{item.companyName}</td>
                                    <td className="py-2 px-4 border-b">{item.totalSales}</td>
                                    <td className="py-2 px-4 border-b font-semibold text-green-600">R$ {item.totalCommission.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {commissionByCompany.length === 0 && <p className="text-center py-4 text-gray-500">Nenhuma comissão registrada.</p>}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;