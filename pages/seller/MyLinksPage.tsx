import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SELLERS, COMPANIES, VOUCHERS } from '../../constants';
import { Voucher } from '../../types';

const MyLinksPage: React.FC = () => {
    const { user } = useAuth();
    const seller = SELLERS.find(s => s.name === user?.name);
    
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(COMPANIES[0]?.id || '');
    const [copied, setCopied] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const { fullReferralLink, qrCodeApiUrl } = useMemo(() => {
        if (!seller || !selectedCompanyId) {
            return { fullReferralLink: '', qrCodeApiUrl: '' };
        }
        const company = COMPANIES.find(c => c.id === selectedCompanyId);
        if (!company) {
             return { fullReferralLink: '', qrCodeApiUrl: '' };
        }
        
        // Use hash-based routing compatible path
        const path = `#/company/${company.slug}?sellerId=${seller.id}`;
        // Construct the full URL for sharing and QR code
        const fullLink = `${window.location.origin}${window.location.pathname}${path}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(fullLink)}`;

        return { fullReferralLink: fullLink, qrCodeApiUrl: qrUrl };
    }, [seller, selectedCompanyId]);

    const sellerVouchersForCompany = useMemo(() => {
        return VOUCHERS.filter(v => v.sellerId === seller?.id && v.companyId === selectedCompanyId);
    }, [seller, selectedCompanyId, updateTrigger]);

    if (!seller) {
        return <div>Vendedor não encontrado.</div>;
    }

    const handleCopy = () => {
        if (!fullReferralLink) return;
        navigator.clipboard.writeText(fullReferralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleGenerateVoucher = () => {
        if (!seller || !selectedCompanyId) return;
        const company = COMPANIES.find(c => c.id === selectedCompanyId);
        if (!company) return;

        const newCode = `${seller.name.split(' ')[0].toUpperCase()}-${company.name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        
        const newVoucher: Voucher = {
            code: newCode,
            sellerId: seller.id,
            companyId: selectedCompanyId,
        };
        // Simulate adding to a global/database list of vouchers
        VOUCHERS.push(newVoucher); 
        setUpdateTrigger(v => v + 1); // Force re-render to show the new voucher
        console.log("Simulating global voucher creation:", newVoucher);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Minha Central de Vendas</h1>

            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <div className="mb-6">
                    <label htmlFor="company-select" className="block text-lg font-medium text-gray-700 mb-2">Selecione uma Empresa para Gerar as Ferramentas</label>
                    <select
                        id="company-select"
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {COMPANIES.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t pt-8">
                    {/* Left Column: Link & QR */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Link de Venda para {COMPANIES.find(c => c.id === selectedCompanyId)?.name}</h2>
                            <div className="flex items-stretch gap-2">
                                <input type="text" value={fullReferralLink} readOnly className="w-full px-4 py-2 border rounded-md bg-gray-100 truncate" />
                                <button onClick={handleCopy} disabled={!fullReferralLink} className={`px-6 py-2 text-white font-semibold rounded-md shadow-sm whitespace-nowrap ${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code</h2>
                            <div className="inline-block p-4 border rounded-lg shadow-md bg-white">
                                {qrCodeApiUrl ? <img src={qrCodeApiUrl} alt="QR Code" className="w-48 h-48" /> : <div className="w-48 h-48 bg-gray-200" />}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Vouchers */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Códigos de Voucher</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border h-full flex flex-col">
                           <div className="flex-grow">
                                {sellerVouchersForCompany.length > 0 ? (
                                    <ul className="space-y-2">
                                        {sellerVouchersForCompany.map(voucher => (
                                            <li key={voucher.code} className="bg-blue-100 text-blue-800 font-mono text-center py-1 px-2 rounded-md">{voucher.code}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">Nenhum voucher gerado para esta empresa.</p>
                                )}
                           </div>
                            <button onClick={handleGenerateVoucher} className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                                Gerar Novo Voucher
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLinksPage;