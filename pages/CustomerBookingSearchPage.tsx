import React, { useState } from 'react';
import { BOOKINGS, TOURS, COMPANIES, SELLERS } from '../constants';
import { Booking } from '../types';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

type EnrichedBooking = Booking & {
    tourName: string;
    companyName: string;
    companyContactEmail: string;
    sellerName?: string;
};

const CustomerBookingSearchPage: React.FC = () => {
    const [cpf, setCpf] = useState('');
    const [foundBookings, setFoundBookings] = useState<EnrichedBooking[]>([]);
    const [searched, setSearched] = useState(false);
    
    // Use a separate state to manage statuses locally for updates
    const [bookingStatuses, setBookingStatuses] = useState<Record<string, 'Confirmada' | 'Pendente' | 'Cancelada'>>({});

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const bookings = BOOKINGS.filter(b => b.customerCpf === cpf.trim());
        const enriched = bookings.map(booking => {
            const tour = TOURS.find(t => t.id === booking.tourId);
            const company = COMPANIES.find(c => c.id === booking.companyId);
            const seller = SELLERS.find(s => s.id === booking.sellerId);
            return {
                ...booking,
                tourName: tour?.name || 'N/A',
                companyName: company?.name || 'N/A',
                companyContactEmail: company?.contactEmail || '',
                sellerName: seller?.name,
            };
        });
        setFoundBookings(enriched);
        
        // Initialize local statuses
        const initialStatuses = enriched.reduce((acc, b) => ({ ...acc, [b.id]: b.status }), {});
        setBookingStatuses(initialStatuses);

        setSearched(true);
    };
    
    const handleCancelBooking = (bookingId: string) => {
        if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
            // In a real app, this would be an API call.
            // Here we just update the global mock data and local state.
            const bookingIndex = BOOKINGS.findIndex(b => b.id === bookingId);
            if (bookingIndex !== -1) {
                BOOKINGS[bookingIndex].status = 'Cancelada';
            }
            setBookingStatuses(prev => ({...prev, [bookingId]: 'Cancelada'}));
            alert('Sua reserva foi cancelada.');
        }
    };
    
    const statusColors = {
        'Confirmada': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Cancelada': 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Gerencie Suas Reservas</h1>
                        <p className="text-center text-gray-600 mb-6">Digite seu CPF para encontrar todas as suas reservas em nossa plataforma.</p>
                        <form onSubmit={handleSearch}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="Digite seu CPF (pode incluir pontos/traço)"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>

                    {searched && (
                        <div className="max-w-5xl mx-auto mt-10">
                            <h2 className="text-2xl font-bold mb-4">Resultados da Busca</h2>
                            {foundBookings.length > 0 ? (
                                <div className="space-y-6">
                                    {foundBookings.map(booking => (
                                        <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{booking.tourName}</h3>
                                                    <p className="text-sm text-gray-500">com {booking.companyName}</p>
                                                </div>
                                                 <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[bookingStatuses[booking.id]]}`}>
                                                    {bookingStatuses[booking.id]}
                                                </span>
                                            </div>
                                            <div className="border-t my-4"></div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                                                <div><strong>Data:</strong> {new Date(booking.bookingDate).toLocaleDateString('pt-BR')}</div>
                                                <div><strong>Hora:</strong> {booking.selectedTime}</div>
                                                <div><strong>Embarque:</strong> {booking.selectedPickupLocation}</div>
                                                <div><strong>Valor:</strong> R$ {booking.totalPrice.toFixed(2)}</div>
                                            </div>
                                             {bookingStatuses[booking.id] !== 'Cancelada' && (
                                                <div className="mt-4 flex gap-2">
                                                    <button onClick={() => handleCancelBooking(booking.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Cancelar Reserva</button>
                                                    <a href={`mailto:${booking.companyContactEmail}`} className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">Contato da Empresa</a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">Nenhuma reserva encontrada para o CPF informado.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default CustomerBookingSearchPage;