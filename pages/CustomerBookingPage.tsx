import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { TOURS, COMPANIES, VOUCHERS, BOOKINGS } from '../constants';
import { Booking, BookingPassengers } from '../types';

const CustomerBookingPage: React.FC = () => {
    const { tourId } = useParams<{ tourId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const sellerId = queryParams.get('sellerId');

    const tour = TOURS.find(t => t.id === tourId);
    const company = tour ? COMPANIES.find(c => c.id === tour.companyId) : null;
    
    const [passengers, setPassengers] = useState<BookingPassengers>({ adults: 1, children: 0, infants: 0 });
    const [customerName, setCustomerName] = useState('');
    const [customerCpf, setCustomerCpf] = useState('');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(tour?.schedules[0]?.time || '');
    const [selectedPickup, setSelectedPickup] = useState(tour?.pickupLocations[0] || '');
    const [voucherCode, setVoucherCode] = useState('');
    const [error, setError] = useState('');
    
    const totalPrice = useMemo(() => {
        if (!tour) return 0;
        return (
            passengers.adults * tour.pricing.adult +
            passengers.children * tour.pricing.child +
            passengers.infants * tour.pricing.infant
        );
    }, [passengers, tour]);

    const handlePassengerChange = (type: keyof BookingPassengers, value: number) => {
        setPassengers(prev => ({ ...prev, [type]: Math.max(0, value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!tour || !company) return;
        if (passengers.adults === 0 && passengers.children === 0) {
            setError('É necessário pelo menos 1 adulto ou criança.');
            return;
        }
        
        // Voucher validation
        let effectiveSellerId = sellerId;
        if (voucherCode) {
            const voucher = VOUCHERS.find(v => v.code.toLowerCase() === voucherCode.trim().toLowerCase() && v.companyId === company.id);
            if (!voucher) {
                setError('Voucher inválido ou não aplicável para esta empresa.');
                return;
            }
            effectiveSellerId = voucher.sellerId;
        }

        // In a real app, this would be an API call and would return a booking confirmation.
        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            tourId: tour.id,
            companyId: company.id,
            customerName,
            customerCpf,
            bookingDate,
            selectedTime,
            selectedPickupLocation: selectedPickup,
            passengers,
            totalPrice,
            sellerId: effectiveSellerId || undefined,
            status: 'Pendente', // Or 'Confirmada' if payment is integrated
        };

        BOOKINGS.push(newBooking);
        console.log("Simulating booking creation:", newBooking);
        alert(`Reserva para ${customerName} realizada com sucesso! ID da Reserva: ${newBooking.id}. Em breve você receberá a confirmação.`);
        navigate(`/manage-booking`);
    };

    if (!tour || !company) {
        return <div>Passeio não encontrado.</div>;
    }

    return (
         <div className="bg-gray-50 min-h-screen flex flex-col">
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Finalizar Reserva</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Booking Form */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Detalhes do Responsável</h2>
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
                                </div>
                                 <div>
                                    <label htmlFor="customerCpf" className="block text-sm font-medium text-gray-700">CPF</label>
                                    <input type="text" id="customerCpf" value={customerCpf} onChange={e => setCustomerCpf(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
                                </div>
                                <h2 className="text-2xl font-semibold mb-4 pt-4 border-b pb-2">Detalhes da Reserva</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Data do Passeio</label>
                                        <input type="date" id="bookingDate" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label htmlFor="selectedTime" className="block text-sm font-medium text-gray-700">Horário</label>
                                        <select id="selectedTime" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="mt-1 w-full p-2 border rounded" required>
                                            {tour.schedules.map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
                                        </select>
                                    </div>
                                     <div>
                                        <label htmlFor="selectedPickup" className="block text-sm font-medium text-gray-700">Local de Embarque</label>
                                        <select id="selectedPickup" value={selectedPickup} onChange={e => setSelectedPickup(e.target.value)} className="mt-1 w-full p-2 border rounded" required>
                                            {tour.pickupLocations.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold mb-4 pt-4 border-b pb-2">Passageiros</h2>
                                 <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(tour.pricing).map(([type, price]) => (
                                        <div key={type}>
                                            <label className="block text-sm font-medium text-gray-700 capitalize">{type} (R$ {price.toFixed(2)})</label>
                                            <input type="number" value={passengers[type as keyof BookingPassengers]} onChange={e => handlePassengerChange(type as keyof BookingPassengers, parseInt(e.target.value))} className="mt-1 w-full p-2 border rounded" min="0" />
                                        </div>
                                    ))}
                                </div>
                                <h2 className="text-2xl font-semibold mb-4 pt-4 border-b pb-2">Voucher / Código de Vendedor</h2>
                                <div>
                                    <label htmlFor="voucherCode" className="block text-sm font-medium text-gray-700">Código (Opcional)</label>
                                    <input type="text" id="voucherCode" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} placeholder="Ex: JOAO-GOLFINHOS-123" className="mt-1 w-full p-2 border rounded" disabled={!!sellerId} />
                                    {sellerId && <p className="text-sm text-green-600 mt-1">Venda rastreada para vendedor.</p>}
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                 <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">Confirmar Reserva</button>
                            </form>
                        </div>
                        {/* Summary */}
                        <div className="bg-white p-8 rounded-lg shadow-lg h-fit">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Resumo do Pedido</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold">{tour.name}</h3>
                                    <p className="text-sm text-gray-600">por {company.name}</p>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p><strong>Data:</strong> {new Date(bookingDate).toLocaleDateString('pt-BR')}</p>
                                    <p><strong>Hora:</strong> {selectedTime}</p>
                                    <p><strong>Embarque:</strong> {selectedPickup}</p>
                                </div>
                                <div className="border-t pt-2 text-sm">
                                    {passengers.adults > 0 && <p>{passengers.adults} x Adulto(s)</p>}
                                    {passengers.children > 0 && <p>{passengers.children} x Criança(s)</p>}
                                    {passengers.infants > 0 && <p>{passengers.infants} x Bebê(s)</p>}
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-lg font-bold flex justify-between">
                                        <span>Total</span>
                                        <span>R$ {totalPrice.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                             <Link to={`/company/${company.slug}`} className="text-sm text-blue-600 hover:underline mt-6 block text-center">
                                &larr; Voltar para os passeios da empresa
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerBookingPage;
