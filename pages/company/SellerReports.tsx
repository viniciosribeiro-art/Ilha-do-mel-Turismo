import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, SELLERS, TOURS } from '../../constants';

interface SellerReportData {
    id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    totalCommission: number;
}

const SellerReports: React.FC = () => {
    const { user } = useAuth();

    const reportData: SellerReportData[] = useMemo(() => {
        if (!user || !user.companyId) return [];

        const commissionRate = 0.10; // 10% commission
        const companyBookings = BOOKINGS.filter(b => b.companyId === user.companyId && b.sellerId);
        const sellerMap: { [key: string]: SellerReportData } = {};

        // Initialize map for all sellers who made sales for this company
        companyBookings.forEach(booking => {
            if (booking.sellerId && !sellerMap[booking.sellerId]) {
                const seller = SELLERS.find(s => s.id === booking.sellerId);
                if (seller) {
                    sellerMap[seller.id] = {
                        id: seller.id,
                        name: seller.name,
                        totalSales: 0,
                        totalRevenue: 0,
                        totalCommission: 0,
                    };
                }
            }
        });

        companyBookings.forEach(booking => {
            if (booking.sellerId && sellerMap[booking.sellerId]) {
                // FIX: Use booking.totalPrice for revenue, not non-existent tour.price.
                const tourPrice = booking.totalPrice;
                sellerMap[booking.sellerId].totalSales++;
                sellerMap[booking.sellerId].totalRevenue += tourPrice;
                sellerMap[booking.sellerId].totalCommission += tourPrice * commissionRate;
            }
        });

        return Object.values(sellerMap)
            .sort((a, b) => b.totalRevenue - a.totalRevenue);

    }, [user]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios de Vendedores</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Vendedor</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Total de Vendas</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Receita Gerada</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Comissão a Pagar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map(seller => (
                            <tr key={seller.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-800">{seller.name}</td>
                                <td className="py-3 px-4 border-b text-gray-700">{seller.totalSales}</td>
                                <td className="py-3 px-4 border-b text-gray-700">R$ {seller.totalRevenue.toFixed(2)}</td>
                                <td className="py-3 px-4 border-b font-semibold text-green-600">R$ {seller.totalCommission.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {reportData.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhuma venda por vendedores registrada para sua empresa.</p>
                )}
            </div>
        </div>
    );
};

export default SellerReports;