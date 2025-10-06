import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { COMPANIES, SELLERS, BOOKINGS } from '../../constants';

const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;

const MasterDashboard: React.FC = () => {
    const navigate = useNavigate();
    const totalCompanies = COMPANIES.length;
    const totalSellers = SELLERS.length;
    const totalBookings = BOOKINGS.length;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Master</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Empresas Cadastradas" 
                    value={totalCompanies} 
                    icon={<BuildingIcon />}
                    color="bg-blue-500"
                />
                <StatCard 
                    title="Vendedores Ativos" 
                    value={totalSellers} 
                    icon={<UserGroupIcon />}
                    color="bg-green-500"
                />
                <StatCard 
                    title="Total de Reservas" 
                    value={totalBookings} 
                    icon={<ClipboardListIcon />}
                    color="bg-indigo-500"
                />
            </div>

            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/dashboard/companies')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Gerenciar Empresas</button>
                    <button onClick={() => navigate('/dashboard/sellers')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Gerenciar Vendedores</button>
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;