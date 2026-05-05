"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, AlertCircle, Pencil, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CheckoutModal from "../CheckoutModal/CheckoutModal";
import CheckoutBookModal from "../CheckoutModal/CheckoutBookModal";
import useModalStore from "@/store/modalStore";
import { useCartStore } from "@/store/cartStore";
import { useInstructorQuery } from "@/hooks/useInstructor";
import { Link } from "react-router-dom";

const InstructorName: React.FC<{ instructorId: string | number, fallbackName?: string }> = ({ instructorId, fallbackName }) => {
  const { data: instructor, isLoading } = useInstructorQuery(instructorId);

  if (isLoading) return <span className="animate-pulse bg-slate-100 h-3 w-20 rounded inline-block" />;

  // If it's a numeric ID but the name contains "Instructor #", try to show the fetched name
  const displayName = instructor?.name || fallbackName || 'Instructor';

  return (
    <span className="line-clamp-1">
      {displayName}
    </span>
  );
};

export default function Cart() {
  const { t } = useTranslation('global');
  const { changeCheckoutModal, setCheckoutSellerId } = useModalStore();

  // ZUSTAND STORE
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    updatePrice,
    clearCart,
    getTotalItems,
    getSubtotal,
    getCustomerTotal
  } = useCartStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const startEditing = (id: number, price: number) => {
    setEditingId(id);
    setTempPrice(price.toString());
  };

  const savePriceChange = (id: number, merchantPrice: number, originalPrice: number) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice)) {
      setEditingId(null);
      return;
    }

    if (newPrice < merchantPrice) {
      toast.error(`Price cannot be less than Member Price (৳${formatBDT(merchantPrice)})`);
      return;
    }

    if (originalPrice && newPrice > originalPrice) {
      toast.error(`Price cannot be more than Original Price (৳${formatBDT(originalPrice)})`);
      return;
    }

    updatePrice(id, newPrice);
    setEditingId(null);
    toast.success("Price updated successfully");
  };

  const totalItemsCount = getTotalItems();

  return (
    <>
      {/* FLOATING CART BUTTON */}
      {!isCartOpen && (
        <button
          onClick={toggleCart}
          className="fixed right-0 top-[45%] -translate-y-1/2 bg-white border border-gray-100 rounded-l-2xl pl-4 pr-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(92,156,114,0.15)] hover:-translate-x-1 transition-all duration-300 ease-out flex items-center gap-3 z-[50] group"
        >
          <div className="relative flex items-center justify-center p-2.5 bg-[#F0FDF4] rounded-xl text-[#5C9C72] group-hover:bg-[#5C9C72] group-hover:text-white transition-colors duration-300">
            <ShoppingBag className="h-5 w-5 stroke-[2.5px]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 border-2 border-white text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </div>
          <div className="text-left py-1">
            <div className="font-bold text-gray-400 text-[9px] uppercase tracking-widest mb-0.5">
              {totalItemsCount} {t("cart.TotalItems", "Items")}
            </div>
            <div className="text-sm font-black text-gray-900 group-hover:text-[#5C9C72] transition-colors leading-none tracking-tight">
              ৳{formatBDT(getSubtotal())}
            </div>
          </div>
        </button>
      )}

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleCart}
      />

      {/* SIDEBAR */}
      <aside className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[1000] shadow-2xl transition-transform duration-500 ease-in-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans relative">

          {/* HEADER */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#F0FDF4] p-2 rounded-lg text-[#5C9C72]">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('cart.title', 'All carts')}</h2>
                <p className="text-xs text-gray-500 font-medium">{totalItemsCount} active items</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide"
                >
                  Clear All
                </button>
              )}
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
            {cartItems.length > 0 ? (
              Object.entries(
                cartItems.reduce((groups: any, item: any) => {
                  const sellerId = item.seller_id || item.vendor_id || 'default_seller';
                  const sellerName = item.seller_name || 'Instructor';
                  if (!groups[sellerId]) {
                    groups[sellerId] = {
                      name: sellerName,
                      items: []
                    };
                  }
                  groups[sellerId].items.push(item);
                  return groups;
                }, {})
              ).map(([sellerId, group]: [string, any]) => {
                const sellerName = group.name;
                const items = group.items;
                const storeSubtotalMember = items.reduce((acc: number, item: any) => acc + (Number(item.offer_price) || 0) * (item.quantity || 1), 0);
                const storeSubtotalCustomer = items.reduce((acc: number, item: any) => acc + (Number(item.regular_price) || 0) * (item.quantity || 1), 0);
                const storeAdjustment = storeSubtotalCustomer - storeSubtotalMember;

                return (
                  <div key={sellerId} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    {/* Store Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center border border-[#5C9C72]/10">
                          <ShoppingBag className="w-5 h-5 text-[#5C9C72]" />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-[14px] font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">
                            {sellerId === 'default_seller' ? sellerName : (
                              // Check the type of the first item to decide which name component to use
                              items[0]?.type === 'course' ? (
                                <InstructorName instructorId={sellerId} fallbackName={sellerName} />
                              ) : (
                                <span>{sellerName}</span>
                              )
                            )}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Express • <span className="text-emerald-500">Active Order</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          items.forEach((item: any) => removeItem(item.id));
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Remove Store Cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Detailed Item List for this Store */}
                    <div className="space-y-4 pt-2">
                      {items.map((item: any) => {
                        const merchantPrice = Number(item.offer_price) || 0;
                        const customerPrice = Number(item.regular_price) || 0;
                        const originalPrice = Number(item.original_regular_price) || customerPrice;
                        const itemQuantity = Number(item.quantity) || 1;
                        const adjustmentValue = (customerPrice - merchantPrice) * itemQuantity;

                        return (
                          <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm space-y-3 group/item">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </div>

                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight">
                                    {item.product_title_english || item.name}
                                  </h4>
                                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Member Price:</span>
                                    <span className="text-gray-900">৳{formatBDT(merchantPrice)}</span>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Customer Price:</span>
                                    {editingId === item.id ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          value={tempPrice}
                                          onChange={(e) => setTempPrice(e.target.value)}
                                          className="w-16 h-7 text-[12px] font-black text-emerald-600 border border-emerald-100 rounded px-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all bg-emerald-50/20"
                                          autoFocus
                                        />
                                        <button onClick={() => savePriceChange(item.id, merchantPrice, originalPrice)} className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600">
                                          <Check size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 cursor-pointer group/price" onClick={() => startEditing(item.id, customerPrice)}>
                                        <Pencil size={12} className="text-gray-300 group-hover/price:text-emerald-500 transition-colors" />
                                        <span className="text-[13px] text-emerald-600">৳{formatBDT(customerPrice)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Price:</span>
                                <span className="text-[13px] font-black text-emerald-600">
                                  -৳{formatBDT(adjustmentValue)}
                                </span>
                              </div>

                              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl h-9 overflow-hidden">
                                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-white hover:text-emerald-500 transition-all border-r border-gray-100">
                                  <Minus size={14} />
                                </button>
                                <span className="px-4 text-xs font-black text-gray-700">{itemQuantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-white hover:text-emerald-500 transition-all border-l border-gray-100">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Breakdown for this Store */}
                    <div className="pt-4 border-t border-gray-100 space-y-2.5">
                      <div className="flex justify-between items-center text-[11px] font-black text-gray-400">
                        <span className="uppercase tracking-widest">Total Member Price</span>
                        <span>৳{formatBDT(storeSubtotalMember)}</span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-black text-gray-400">
                        <span className="uppercase tracking-widest">Discount Price</span>
                        <span className="text-emerald-600">
                          -{formatBDT(storeAdjustment)}
                        </span>
                      </div>

                      <div className="flex justify-between items-end pt-1">
                        <div>
                          <span className="text-gray-900 text-[11px] font-black uppercase tracking-widest leading-none block mb-1">Grand Total</span>
                          <p className="text-gray-400 text-[9px] font-medium leading-none">VAT & Delivery calculated at checkout</p>
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">৳{formatBDT(storeSubtotalMember)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        setCheckoutSellerId(sellerId);
                        toggleCart();
                        changeCheckoutModal();
                      }}
                      className="w-full bg-[#5C9C72] hover:bg-[#4a855d] h-14 rounded-2xl text-[13px] font-black uppercase shadow-lg shadow-green-100/50 transition-all active:scale-[0.98] text-white flex items-center justify-center gap-3 mt-2"
                    >
                      <span>Go to Checkout</span>
                      <span className="w-px h-5 bg-white/20"></span>

                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="bg-white p-10 rounded-full shadow-sm border border-gray-100">
                  <ShoppingBag size={64} strokeWidth={1.5} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">{t("cart.CartEmpty", "Your cart is empty")}</p>
              </div>
            )}
          </div>

          {/* CLEAR CONFIRMATION MODAL */}
          {showClearConfirm && (
            <div className="absolute inset-0 z-[1100] bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-gray-100 text-center transform animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Clear Your Cart?</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                    }}
                    className="py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                  >
                    Yes, Clear It
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <CheckoutModal />
      <CheckoutBookModal />
    </>
  );
}