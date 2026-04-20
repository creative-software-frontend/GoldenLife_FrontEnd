'use client'

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import useModalStore from '@/store/modalStore'
import { Icon } from "./Icon"
import { Button } from "./Button"
import { Select } from "./Select"
import { Switch } from "./Switch"
import { Input } from "./Input"
import { Textarea } from "./Textarea"
import { Label } from "./Label"
import { AddressManager } from "./AddressManager"

interface Address {
    label: "home" | "work" | "partner" | "other"
    name: string
    district: string
    address: string
    phone: string
    notes?: string
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    pack: string;
}

export default function CheckoutModal() {
    const { isCheckoutModalOpen, closeCheckoutModal } = useModalStore();
    const [currentStep, setCurrentStep] = React.useState<"address" | "delivery">("address")
    const [currentAddress, setCurrentAddress] = React.useState<Address | null>(null);
    const [items, setItems] = React.useState<CartItem[]>([]);
    const navigate = useNavigate();
    const { t } = useTranslation("global");

    React.useEffect(() => {
        try {
            const storedItems = localStorage.getItem("cart");
            if (storedItems) {
                const parsedItems = JSON.parse(storedItems);
                if (Array.isArray(parsedItems)) {
                    setItems(parsedItems);
                } else {
                    console.warn('Invalid cart data in localStorage');
                    setItems([]);
                }
            }
        } catch (error) {
            console.error('Error parsing cart data:', error);
            setItems([]);
        }
    }, []);

    const updateQuantity = (id: number, quantity: number) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + quantity) } : item
        );
        setItems(updatedItems);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
    };

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    const subtotal = totalPrice;

    const CheckoutContent = () => {
        const [selectedPayment, setSelectedPayment] = React.useState("wallet");
        const [termsAccepted, setTermsAccepted] = React.useState(false);
        const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

        const handleSubmit = () => {
            if (!termsAccepted) {
                setErrorMessage(t("checkoutModal.errorMessage"));
                return;
            }
            setErrorMessage(null);
            console.log("Submitting the checkout with payment method:", selectedPayment);
            navigate("/orderdetails");
        };

        const deliveryCharge = 50;
        const total = subtotal + deliveryCharge;

        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
                <div className="p-4 border-b flex items-center gap-2 bg-white z-10">
                    <Icon name="mapPin" />
                    <div className="flex-1">
                        <h4 className="font-semibold">{currentAddress?.name}</h4>
                        <p>{currentAddress?.address}, {currentAddress?.district}</p>
                    </div>
                    <button
                        onClick={() => setCurrentStep("address")}
                        className="text-primary hover:text-primary-light"
                    >
                        {t("checkoutModal.address.change")}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                    <div className="divide-y space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className="m-2 flex gap-6">
                                <div className="w-8 h-8 bg-red-500">
                                    <img
                                        alt={item?.name || t("checkoutModal.product.unknownProduct")}
                                        className="h-10 w-10 object-cover"
                                        src="/image/products/maggi.webp"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-medium text-sm text-start">
                                        {item?.name ? (item.name.length > 40 ? `${item.name.slice(0, 30)}...` : item.name) : t("checkoutModal.product.unknownProduct")}
                                    </h3>
                                    <p className="text-sm font-medium text-start">
                                        {t("checkoutModal.product.priceCalculation", { price: item.price || 0, quantity: item.quantity || 0, totalPrice: (item.price || 0) * (item.quantity || 0) })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 space-y-4 bg-white border-t">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>{t("checkoutModal.cart.totalItems")}</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("checkoutModal.cart.subtotal")}</span>
                            <span>৳{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("checkoutModal.cart.deliveryCharge")}</span>
                            <span>৳{deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>{t("checkoutModal.cart.totalPrice")}</span>
                            <span>৳{total}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">{t("checkoutModal.payment.paymentOption")}</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedPayment("wallet")}
                                className={`w-1/3 p-2 border rounded text-center ${selectedPayment === "wallet" ? "bg-primary-default text-white" : "bg-gray-200"}`}
                            >
                                {t("checkoutModal.payment.wallet")}
                            </button>
                            <button
                                onClick={() => setSelectedPayment("bkash")}
                                className={`w-1/3 p-2 border rounded text-center ${selectedPayment === "bkash" ? "bg-primary-default text-white" : "bg-gray-200"}`}
                            >
                                {t("checkoutModal.payment.bkash")}
                            </button>
                            <button
                                onClick={() => setSelectedPayment("nogod")}
                                className={`w-1/3 p-2 border rounded text-center ${selectedPayment === "nogod" ? "bg-primary-default text-white" : "bg-gray-200"}`}
                            >
                                {t("checkoutModal.payment.nogod")}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-sm space-x-2">
                            {t("checkoutModal.terms.accept")}{" "}
                            <Link
                                to="/help/privacy-policy"
                                target=""
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                {t("checkoutModal.terms.privacyPolicy")},
                            </Link>
                            <Link
                                to="/help/terms"
                                target=""
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                {t("checkoutModal.terms.termsAndConditions")}.
                            </Link>
                        </label>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-white z-10">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-primary-default text-white rounded"
                    >
                        {t("checkoutModal.confirm")}
                    </button>
                </div>
            </div>
        );
    };

    const handleSaveAddress = (address: Address, isDefault: boolean) => {
        setCurrentAddress(address);
        setCurrentStep("delivery");
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50 ${isCheckoutModalOpen ? '' : 'hidden'}`}>
            <div className="max-w-md w-full h-[680px] mt-2 bg-white p-4 rounded-md shadow-lg">
                <div className="flex justify-between items-center">
                    <button onClick={closeCheckoutModal}>
                        <Icon name="x" />
                    </button>
                </div>
                {currentStep === "address" ? (
                    <AddressManager onSaveAddress={handleSaveAddress} />
                ) : (
                    <CheckoutContent />
                )}
            </div>
        </div>
    );
}

