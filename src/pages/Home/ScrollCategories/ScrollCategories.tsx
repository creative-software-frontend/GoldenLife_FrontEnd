'use client'

import Marquee from "react-fast-marquee";
import { 
    ShoppingBag, Bike, Store, Building2, Gift, 
    Car, Smartphone, Package, Plane, Activity, Store as StoreIcon 
} from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function CompactIconScroll() {
    const { t } = useTranslation("global");

    const items = [
        { icon: ShoppingBag, label: "Shopping", color: "#0ea5e9" },
        { icon: Bike, label: "Food", color: "#f97316" },
        { icon: Store, label: "Grocery", color: "#65a30d" },
        { icon: Building2, label: "Pharmacy", color: "#dc2626" },
        { icon: Gift, label: "Gift", color: "#9333ea" },
        { icon: Car, label: "Ride Share", color: "#059669" },
        { icon: Smartphone, label: "Top Up", color: "#d97706" },
        { icon: Package, label: "Parcel", color: "#374151" },
        { icon: Plane, label: "Air Ticket", color: "#db2777" },
        { icon: Activity, label: "Blood Bank", color: "#be123c" },
        { icon: StoreIcon, label: "Local Outlet", color: "#1d4ed8" },
    ];

    const IconItem = ({ item }: { item: typeof items[0] }) => (
        <div className="group relative flex flex-col items-center justify-center w-full cursor-pointer px-1">
            
            {/* INCREASED container size and added rounding */}
            <div 
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 
                           rounded-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1 overflow-hidden" 
            >
                {/* NEW: Light background color layer (15% opacity of the icon's base color) */}
                <div 
                    className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-300"
                    style={{ backgroundColor: item.color }}
                />

                {/* INCREASED icon size */}
                <item.icon 
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 relative z-10 transition-transform duration-300 
                               group-hover:scale-110 will-change-transform drop-shadow-sm" 
                    style={{ color: item.color }} 
                />
            </div>

            {/* INCREASED font size and slightly darkened the default text color to slate-500 */}
            <span className="mt-2 text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-tight 
                             group-hover:text-slate-900 transition-colors duration-300 text-center leading-tight">
                {t(`label.${item.label}`, item.label)}
            </span>
        </div>
    );

    return (
        <section className="w-full py-4 md:py-6 bg-white">
            <div className="container mx-auto px-4 max-w-[1440px]">
                <div className="py-2 md:py-4">
                    
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-6 lg:hidden">
                        {items.map((item, idx) => (
                            <IconItem key={`grid-${idx}`} item={item} />
                        ))}
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="absolute left-0 inset-y-0 w-20 z-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                        <div className="absolute right-0 inset-y-0 w-20 z-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

                        <Marquee speed={35} gradient={false} pauseOnHover className="overflow-visible">
                            {items.map((item, idx) => (
                                <div key={`marquee-${idx}`} className="mx-6 py-2"> 
                                    <IconItem item={item} />
                                </div>
                            ))}
                        </Marquee>
                    </div>

                </div>
            </div>
        </section>
    );
}