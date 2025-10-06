import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { TOURS, COMPANIES, VOUCHERS, BOOKINGS } from '../constants';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { Booking, BookingPassengers, TourPricing } from '../types';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CustomerBookingPage: React.FC = () => {
    const { tourId } = useParams<{ tourId: string }>();
    const query = useQuery();
    const navigate = useNavigate();
    const sellerId = query.get('sellerId');

    const tour = TOURS.find(t => t.id === tourId);
    const company = tour ? COMPANIES.find(c => c.id === tour.companyId) : undefined;

    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(tour?.schedules[0]?.time || '');
    const [selectedPickup, setSelectedPickup] = useState(tour?.pickupLocations[0] || '');
    const [passengers, setPassengers] = useState<BookingPassengers>({ adults: 1, children: 0, infants: 0 });
    const [customerName, setCustomerName] = useState('');
    const [customerCpf, setCustomerCpf] = useState('');
    const [voucherInput, setVoucherInput] = useState('');
    const [voucherError, setVoucherError] = useState('');
    const [isBooked, setIsBooked] = useState(false);
    
    // Map plural passenger keys to singular pricing keys
    const passengerTypeToPricingKey: { [key in keyof BookingPassengers]: keyof TourPricing } = {
        adults: 'adult',
        children: 'child',
        infants: 'infant',
    };

    const resolvedSellerId = useMemo(() => {
        if (sellerId) return sellerId; // From referral link
        if (voucherInput) {
            const voucher = VOUCHERS.find(v => v.code.toUpperCase() === voucherInput.toUpperCase());
            if (voucher) {
                // Critical Check: Ensure voucher is for the correct company
                if (voucher.companyId === tour?.companyId) {
                    setVoucherError('');
                    return voucher.sellerId;
                } else {
                    setVoucherError('Voucher inválido para esta empresa.');
                    return undefined;
                }
            } else {
                setVoucherError('Voucher não encontrado.');
                return undefined;
            }
        }
        return undefined;
    }, [sellerId, voucherInput, tour]);

    const totalPrice = useMemo(() => {
        if (!tour) return 0;
        return (
            (passengers.adults * tour.pricing.adult) +
            (passengers.children * tour.pricing.child) +
            (passengers.infants * tour.pricing.infant)
        );
    }, [passengers, tour]);

    if (!tour || !company) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (voucherInput && !resolvedSellerId) {
            alert('Por favor, corrija o voucher ou remova-o antes de continuar.');
            return;
        }

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
            sellerId: resolvedSellerId,
            status: 'Pendente',
        };
        
        BOOKINGS.push(newBooking);
        console.log("New Booking created:", newBooking);
        setIsBooked(true);
    };

    if (isBooked) {
        return (
             <div className="bg-gray-100 min-h-screen flex flex-col">
                <PublicHeader />
                <main className="flex-grow flex items-center justify-center py-12">
                    <div className="container mx-auto px-6 text-center bg-white p-12 rounded-lg shadow-xl">
                        <h1 className="text-3xl font-bold text-green-600 mb-4">Reserva Enviada!</h1>
                        <p className="text-gray-700 mb-2">Obrigado, {customerName}! Sua solicitação de reserva para o passeio <strong>{tour.name}</strong> foi enviada.</p>
                        <p className="text-gray-600 mb-6">A empresa entrará em contato para confirmar. Você pode gerenciar sua reserva na página "Minha Reserva".</p>
                        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                            Voltar para a Página Inicial
                        </Link>
                    </div>
                </main>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Finalize sua Reserva</h1>
                    <p className="text-center text-gray-600 mb-8">Você está reservando o passeio <strong>{tour.name}</strong> com a <strong>{company.name}</strong>.</p>
                    
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Booking Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-700">1. Data e Hora</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                                    <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full p-2 border rounded-md" required>
                                        {tour.schedules.map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-700">2. Local de Embarque</h3>
                                <select value={selectedPickup} onChange={e => setSelectedPickup(e.target.value)} className="w-full p-2 border rounded-md" required>
                                    {tour.pickupLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-700">3. Passageiros</h3>
                                <div className="space-y-2">
                                    {Object.entries({ adults: 'Adultos', children: 'Crianças', infants: 'De Colo' }).map(([key, label]) => {
                                        const pricingKey = passengerTypeToPricingKey[key as keyof BookingPassengers];
                                        const price = tour.pricing[pricingKey];
                                        return (
                                            <div key={key} className="flex justify-between items-center">
                                                <label>{label} (R$ {price.toFixed(2)})</label>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={passengers[key as keyof BookingPassengers]} 
                                                    onChange={e => setPassengers(p => ({...p, [key]: parseInt(e.target.value) || 0}))} 
                                                    className="w-20 p-2 border rounded-md text-center"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customer & Payment */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-700">4. Seus Dados</h3>
                                 <div className="space-y-4">
                                    <input type="text" placeholder="Nome Completo" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2 border rounded-md" required />
                                    <input type="text" placeholder="CPF" value={customerCpf} onChange={e => setCustomerCpf(e.target.value)} className="w-full p-2 border rounded-md" required />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-700">Voucher de Vendedor</h3>
                                <input 
                                    type="text" 
                                    placeholder="Insira o código do voucher (opcional)" 
                                    value={voucherInput} 
                                    onChange={e => setVoucherInput(e.target.value)}
                                    className={`w-full p-2 border rounded-md ${voucherError ? 'border-red-500' : ''}`}
                                    disabled={!!sellerId}
                                />
                                {voucherError && <p className="text-red-500 text-sm mt-1">{voucherError}</p>}
                                {resolvedSellerId && !sellerId && <p className="text-green-600 text-sm mt-1">Voucher aplicado!</p>}
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-bold text-2xl text-gray-800 text-right">Total: R$ {totalPrice.toFixed(2)}</h3>
                                <button type="submit" className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 text-lg">
                                    Confirmar Reserva
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
};

export default CustomerBookingPage;