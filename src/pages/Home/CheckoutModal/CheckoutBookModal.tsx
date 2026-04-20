import { useState, useEffect, useCallback } from 'react';

import axios from 'axios';

// Sub-components
import CheckSummaryBookView from './CheckSummaryBookView';
import AddressListView from './AddressListView';
import AddAddressForm from './AddAddressFormView';
import { Address, ViewState, PaymentMethod } from './CheckoutModal';
import useModalStore from '@/store/modalStore';

const CheckoutBookModal = () => {
    const { isCheckoutBookModalOpen, closeBuyNow, buyNowProduct } = useModalStore();

    // Config
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        return session ? JSON.parse(session).token : null;
    };

    const [view, setView] = useState<ViewState>('CHECKOUT');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');

    // --- State ---
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // 1. API: Select Address & Fetch Fee
    const handleSelectAddress = async (addr: Address, switchView: boolean = true) => {
        setSelectedAddress(addr);
        if (switchView) setView('CHECKOUT');

        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post(`${baseURL}/api/student/address/select`, {
                address_id: addr.id,
                id: addr.id
            }, config);
        } catch (error: any) {
            console.error("Select Address API Failed:", error.response?.data || error.message);
        }

        try {
            const feeResponse = await axios.post(
                `${baseURL}/api/getDeliveryCharge?address_id=${addr.id}`,
                {},
                config
            );
            const charge = feeResponse.data?.data?.delivery_charge;
            setDeliveryFee(charge !== undefined && charge !== null ? Number(charge) : 60);
        } catch (error: any) {
            console.error("Fetch Fee API Failed:", error.response?.data || error.message);
            setDeliveryFee(60);
        }
    };

    // 2. API: Fetch Addresses List
    const fetchAddresses = useCallback(async () => {
        setLoadingAddresses(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${baseURL}/api/student/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const apiAddresses = response.data?.addresses || [];
            setAddresses(apiAddresses);

            if (apiAddresses.length > 0 && !selectedAddress) {
                const defaultAddr = apiAddresses.find((a: any) => Number(a.is_default) === 1 || String(a.is_default).toLowerCase() === 'true');
                handleSelectAddress(defaultAddr || apiAddresses[0], false);
            }
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoadingAddresses(false);
        }
    }, [baseURL, selectedAddress]);

    // 3. Load Data on Open
    useEffect(() => {
        if (isCheckoutBookModalOpen) {
            fetchAddresses();
        }
    }, [isCheckoutBookModalOpen, fetchAddresses]);

    // 4. Handle New Address Saved
    const handleSaveNewAddress = async (newAddr: Address) => {
        await handleSelectAddress(newAddr, true);
        fetchAddresses();
    };

    if (!isCheckoutBookModalOpen || !buyNowProduct) return null;

    const handleClose = () => {
        setView('CHECKOUT');
        closeBuyNow();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[420px] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
                {view === 'CHECKOUT' && (
                    <CheckSummaryBookView
                        selectedAddress={selectedAddress}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        onClose={handleClose}
                        onChangeAddress={() => setView('ADDRESS_LIST')}
                        onConfirm={handleClose}
                        deliveryFee={deliveryFee}
                    />
                )}

                {view === 'ADDRESS_LIST' && (
                    <AddressListView
                        addresses={addresses}
                        selectedId={selectedAddress?.id}
                        onBack={() => setView('CHECKOUT')}
                        onClose={handleClose}
                        onSelect={(addr) => handleSelectAddress(addr, true)}
                        onAddNew={() => setView('ADD_ADDRESS')}
                        loading={loadingAddresses}
                    />
                )}

                {view === 'ADD_ADDRESS' && (
                    <AddAddressForm
                        onClose={() => setView('ADDRESS_LIST')}
                        onBack={() => setView('ADDRESS_LIST')}
                        onSave={handleSaveNewAddress}
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutBookModal;
