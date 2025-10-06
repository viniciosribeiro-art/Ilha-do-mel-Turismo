import React, { useMemo } from 'react';
import { BOOKINGS, COMPANIES, SELLERS, TOURS } from '../../constants';

interface ReportData {
    totalRevenue: number;
    totalBookings: number;
    totalCommission: number;
    bookingsByCompany: {
        companyId: string;
        companyName: string;
        revenue: number;
        bookingsCount: number;
    }[];
     bookingsBySeller: {
        sellerId: string;
        sellerName: string;
        revenue: number;
        bookingsCount: number;
        commission: number;
    }[];
}

const TransactionReports: React.FC = () => {
    
    const reportData: ReportData = useMemo(() => {
        const commissionRate = 0.10; // 10%
        const report: ReportData = {
            totalRevenue: 0,
            totalBookings: BOOKINGS.length,
            totalCommission: 0,
            bookingsByCompany: [],
            bookingsBySeller: [],
        };

        const companyMap: Record<string, { companyName: string; revenue: number; bookingsCount: number; }> = {};
        const sellerMap: Record<string, { sellerName: string; revenue: number; bookingsCount: number; commission: number; }> = {};

        BOOKINGS.forEach(booking => {
            report.totalRevenue += booking.totalPrice;

            // By Company
            const company = COMPANIES.find(c => c.id === booking.companyId);
            if (company) {
                if (!companyMap[company.id]) {
                    companyMap[company.id] = { companyName: company.name, revenue: 0, bookingsCount: 0 };
                }
                companyMap[company.id].revenue += booking.totalPrice;
                companyMap[company.id].bookingsCount++;
            }

            // By Seller
            if (booking.sellerId) {
                const seller = SELLERS.find(s => s.id === booking.sellerId);
                 if (seller) {
                    const commission = booking.totalPrice * commissionRate;
                    report.totalCommission += commission;

                    if (!sellerMap[seller.id]) {
                        sellerMap[seller.id] = { sellerName: seller.name, revenue: 0, bookingsCount: 0, commission: 0 };
                    }
                    sellerMap[seller.id].revenue += booking.totalPrice;
                    sellerMap[seller.id].bookingsCount++;
                    sellerMap[seller.id].commission += commission;
                }
            }
        });

        report.bookingsByCompany = Object.entries(companyMap).map(([companyId, data]) => ({ companyId, ...data }))
            .sort((a, b) => b.revenue - a.revenue);
        
        report.bookingsBySeller = Object.entries(sellerMap).map(([sellerId, data]) => ({ sellerId, ...data }))
            .sort((a, b) => b.revenue - a.revenue);
        
        return report;
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios de Transações</h1>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-gray-500 text-sm font-medium">Receita Bruta Total</p>
                    <p className="text-3xl font-bold text-gray-800">R$ {reportData.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-gray-500 text-sm font-medium">Total de Reservas</p>
                    <p className="text-3xl font-bold text-gray-800">{reportData.totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-gray-500 text-sm font-medium">Comissões Pagas</p>
                    <p className="text-3xl font-bold text-green-600">R$ {reportData.totalCommission.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales by Company */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Vendas por Empresa</h2>
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Empresa</th>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Reservas</th>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Receita</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.bookingsByCompany.map(item => (
                                <tr key={item.companyId} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 border-b">{item.companyName}</td>
                                    <td className="py-2 px-3 border-b">{item.bookingsCount}</td>
                                    <td className="py-2 px-3 border-b font-medium">R$ {item.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sales by Seller */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Vendas por Vendedor</h2>
                     <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Vendedor</th>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Vendas</th>
                                <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Comissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.bookingsBySeller.map(item => (
                                <tr key={item.sellerId} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 border-b">{item.sellerName}</td>
                                    <td className="py-2 px-3 border-b">{item.bookingsCount}</td>
                                    <td className="py-2 px-3 border-b font-medium text-green-600">R$ {item.commission.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default TransactionReports;
