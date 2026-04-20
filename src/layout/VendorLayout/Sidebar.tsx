import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package,
    BarChart3, LogOut, Store, X,
    ClipboardList,
} from 'lucide-react';
import Logo from '@/pages/common/Logo';
import { useVendorAuth } from '@/hooks/useVendorAuth';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleLogout } = useVendorAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/vendor/dashboard/products', icon: Package },
        { name: 'Orders', path: '/vendor/dashboard/orders', icon: ClipboardList },
        // { name: 'Pickup Parcel', path: '/vendor/pickup', icon: Package },
        // { name: 'Delivery Parcel', path: '/vendor/delivery', icon: Truck },
        // { name: 'Transfer Order', path: '/vendor/transfer', icon: ArrowRightLeft },
        // { name: 'Return Parcel', path: '/vendor/return', icon: Undo2 },
        // { name: 'Reschedule Order', path: '/vendor/reschedule', icon: CalendarClock },
        { name: 'Report', path: '/vendor/report', icon: BarChart3 },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={toggleSidebar}
            />

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed md:relative top-0 left-0 z-50 flex flex-col h-full
                    bg-secondary text-secondary-foreground
                    border-r border-border shadow-2xl
                    transition-all duration-300 ease-in-out overflow-hidden
                    
                    /* THE BULLETPROOF RESPONSIVE LOGIC: */
                    /* Mobile: slides off-screen when closed (-translate-x-full) */
                    /* Desktop: stays on screen (translate-x-0) but shrinks to w-20 when closed */
                    ${isOpen
                        ? 'w-64 translate-x-0'
                        : 'w-64 -translate-x-full md:w-20 md:translate-x-0'
                    }
                `}
            >
                <div className="px-6 py-4 border-b border-secondary-foreground/20 bg-white whitespace-nowrap overflow-hidden">
                    <div className="flex flex-col items-start gap-1">
                        {!isOpen ? (
                            // Collapsed state - only icon
                            <img
                                src="/image/logo/icon.png"
                                alt="Icon"
                                className="h-8 w-8 mx-auto"
                            />
                        ) : (
                            // Expanded state - full logo
                            <Logo />
                        )}
                    </div>

                    {/* Mobile Close Button */}
                    {isOpen && (
                        <button onClick={toggleSidebar} className="absolute top-4 right-4 md:hidden p-1 hover:bg-background/20 rounded-lg">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-4 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
                                }}
                                className={`
                                    relative flex items-center gap-4 px-3 py-3 rounded-xl 
                                    transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-background text-foreground shadow-md font-bold'
                                        : 'text-secondary-foreground/80 hover:bg-background/20 hover:text-secondary-foreground'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl" />
                                )}

                                <item.icon size={22} className="flex-shrink-0" />

                                <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                                    {item.name}
                                </span>

                                {/* Floating Tooltip for Desktop when collapsed */}
                                {!isOpen && (
                                    <div className="hidden md:block absolute left-14 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-secondary-foreground/20 mt-auto overflow-hidden">
                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center gap-4 px-3 py-3.5 w-full rounded-xl 
                            transition-all duration-300 group relative
                            bg-foreground text-background hover:bg-background hover:text-foreground font-bold shadow-lg
                            ${!isOpen ? 'md:justify-center' : ''}
                        `}
                    >
                        <LogOut size={22} className="flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;