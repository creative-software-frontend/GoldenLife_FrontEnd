import React, { useState, useEffect } from 'react';
import {
    Package,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Wallet,
    ShoppingCart,
    Star,
    Plus,
    FileText,
    Headphones,
    Phone,
    HelpCircle,
    Ticket as TicketIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatBDT } from '@/utils/currencyFormatter';
import { useAppStore } from '@/store/useAppStore';
import type { OverviewStats } from '@/store/slices/vendorDashboardSlice';
import { cn } from "@/lib/utils";
import useModalStore from '@/store/modalStore';

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }: any) => {
    const baseClass = "w-full px-3 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-2 text-center";
    const variants: Record<string, string> = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground"
    };
    return (
        <button onClick={onClick} className={`${baseClass} ${variants[variant as keyof typeof variants] || variants.primary}`}>
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
};

// Recent Orders Component
const RecentOrdersStack = ({ orders }: { orders: any[] }) => {
    return (
        <div className="space-y-3">
            {orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors border-b border-border last:border-0">
                    <div>
                        <p className="font-medium text-sm text-foreground">{order.order_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.status}</p>
                    </div>
                    <p className="font-semibold text-sm text-foreground">{formatBDT(order.total, { compact: true })}</p>
                </div>
            ))}
            <button
                onClick={() => window.location.href = '/vendor/dashboard/orders'}
                className="w-full text-center text-xs text-primary hover:underline mt-2 pt-2 border-t border-border"
            >
                View All Orders →
            </button>
        </div>
    );
};

// Sales Chart Component
// Sales Chart Component
const SalesChart = ({ chartData, timeframe }: { chartData: any, timeframe: string }) => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const data = chartData?.[timeframe];
    if (!data || !data.performance || data.performance.length === 0) {
        return (
            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                <Package className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm italic">No chart data available for this period</p>
            </div>
        );
    }

    const performance = data.performance;
    const values = performance.map((p: any) => parseFloat(p.total_sales));

    // Use data.highest/lowest from API if provided
    const highestVal = data.highest || Math.max(...values, 0);
    const lowestVal = data.lowest || Math.min(...values, 0);

    // Vertical scale with 25% headroom for a "wave" aesthetic
    const displayMax = highestVal === 0 ? 1000 : highestVal * 1.25;
    const height = 160;
    const width = 1000;

    // Coordinate helpers
    const getX = (idx: number) => {
        if (performance.length === 1) return width / 2;
        return (idx / (performance.length - 1)) * width;
    };
    const getY = (val: number) => {
        return height - (val / displayMax) * height;
    };

    const points = performance.map((p: any, idx: number) => ({
        x: getX(idx),
        y: getY(parseFloat(p.total_sales)),
        val: p.total_sales,
        label: p.date_label
    }));

    // Generate Smooth Wave Path
    const generatePath = () => {
        if (points.length === 0) return "";
        if (points.length === 1) return `M 0 ${points[0].y} L ${width} ${points[0].y}`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const controlX = (curr.x + next.x) / 2;
            d += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
        }
        return d;
    };

    const pathD = generatePath();
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return (
        <div className="relative h-auto sm:h-60 flex flex-col gap-6">
            <div className="flex gap-2 sm:gap-4 flex-1">
                {/* Y-Axis Labeling */}
                <div className="flex flex-col justify-between text-[9px] text-muted-foreground pb-12 pt-1 w-10 sm:w-12 border-r border-border/50 pr-2 select-none">
                    <span className="font-bold text-right">{formatBDT(displayMax, { compact: true })}</span>
                    <span className="font-bold text-right text-primary/40">{formatBDT(displayMax / 2, { compact: true })}</span>
                    <span className="font-bold text-right">0</span>
                </div>

                <div className="flex-1 relative group/chart min-h-[160px]">
                    {/* SVG Wave Graph */}
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="waveArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Peak/Trough Highlight Lines */}
                        {data.highest > 0 && (
                            <line
                                x1="0" y1={getY(data.highest)} x2={width} y2={getY(data.highest)}
                                className="stroke-primary/40 stroke-[1.5] sm:stroke-[2] stroke-dash transition-all duration-700"
                                strokeDasharray="6 6"
                                style={{ vectorEffect: 'non-scaling-stroke' }}
                            />
                        )}

                        {/* Area Gradient */}
                        <path d={areaD} fill="url(#waveArea)" className="transition-all duration-1000 ease-out" />

                        {/* Smooth Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            style={{ vectorEffect: 'non-scaling-stroke' }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-1000 ease-out drop-shadow-xl"
                        />

                        {/* Interactive Dot Markers */}
                        {points.map((p, idx) => (
                            <g key={idx}>
                                {hoveredIdx === idx && (
                                    <circle cx={p.x} cy={p.y} r="12" className="fill-primary/20 animate-ping" />
                                )}
                                <circle
                                    cx={p.x} cy={p.y}
                                    r={hoveredIdx === idx ? "7" : "5"}
                                    className={cn(
                                        "fill-background stroke-primary transition-all duration-300",
                                        hoveredIdx === idx ? "stroke-[4px]" : "stroke-[3px]"
                                    )}
                                />
                                {/* Broad Hover Target */}
                                <rect
                                    x={idx === 0 ? 0 : p.x - (width / (points.length - 1) / 2)}
                                    y="0" width={points.length === 1 ? width : width / (points.length - 1)} height={height}
                                    fill="transparent" className="cursor-pointer"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Dynamic Tooltip Overlay */}
                    {hoveredIdx !== null && (
                        <div
                            className="absolute bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded-2xl shadow-2xl z-50 pointer-events-none transition-all duration-300 border border-white/20 backdrop-blur-md"
                            style={{
                                left: `${(points[hoveredIdx].x / width) * 100}%`,
                                top: `${(points[hoveredIdx].y / height) * 100}%`,
                                transform: 'translate(-50%, -150%)'
                            }}
                        >
                            <div className="flex flex-col gap-1 min-w-[100px]">
                                <span className="text-white/40 text-[9px] uppercase tracking-[0.2em]">{points[hoveredIdx].label}</span>
                                <span className="text-primary text-sm tracking-tight">{formatBDT(points[hoveredIdx].val)}</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-white/20 rotate-45" />
                        </div>
                    )}

                    {/* X-Axis Data Labels */}
                    <div className="flex justify-between mt-6 px-1">
                        {performance.map((p: any, idx: number) => {
                            // Show fewer labels on mobile to prevent overlapping
                            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                            const showLabel = !isMobile || performance.length <= 5 || idx === 0 || idx === performance.length - 1 || idx === Math.floor(performance.length / 2);

                            if (!showLabel) return <div key={idx} className="flex-1" />;

                            return (
                                <span
                                    key={idx}
                                    className={cn(
                                        "text-[9px] sm:text-[10px] font-black uppercase tracking-tighter transition-all duration-500 flex-1 text-center select-none",
                                        hoveredIdx === idx ? "text-primary scale-125 sm:scale-150 rotate-[-5deg]" : "text-muted-foreground/40"
                                    )}
                                >
                                    {p.date_label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Subtle Grid Background */}
                    <div className="absolute inset-x-0 bottom-6 pointer-events-none -z-10 bg-muted/5 rounded-3xl h-40 border-b border-border/50 items-end flex">
                        <div className="absolute top-0 w-full border-t border-border/10 border-dashed" />
                        <div className="absolute top-1/2 w-full border-t border-border/10 border-dashed" />
                    </div>
                </div>
            </div>

            {/* High/Low Status Badges */}
            <div className="flex flex-col sm:flex-row justify-between px-4 text-[10px] font-black uppercase tracking-[0.15em] py-3 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/20 border border-border/50 gap-3 sm:gap-0">
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-1 bg-primary/40 rounded-full" />
                        <span className="text-muted-foreground">Highest Sale</span>
                    </div>
                    <span className="text-primary text-xs tracking-tighter">{formatBDT(data.highest || highestVal)}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-1 bg-slate-500/40 rounded-full" />
                        <span className="text-muted-foreground">Lowest Sale</span>
                    </div>
                    <span className="text-foreground text-xs tracking-tighter">{formatBDT(data.lowest || lowestVal)}</span>
                </div>
            </div>
        </div>
    );
};

const VendorHome: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Today' | 'Weekly' | 'Monthly' | 'Yearly'>('Today');
    const [chartTimeframe, setChartTimeframe] = useState<'week' | 'month' | 'year'>('week');

    // --- Store Integration ---
    const {
        vendorProfile,
        dashboardData,
        isDashboardLoading: loading,
        fetchProfile,
        fetchVendorDashboard
    } = useAppStore();
    const { setIsAIChatOpen, setIsHotlineModalOpen, setIsFAQModalOpen, setIsTicketModalOpen } = useModalStore();

    const handleManualRefresh = () => {
        fetchVendorDashboard();
    };

    useEffect(() => {
        fetchProfile();
        fetchVendorDashboard();

        // Background polling every 30 seconds for dynamic data
        const interval = setInterval(() => {
            fetchVendorDashboard(true); // silent fetch
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Welcome logic
    const businessName = vendorProfile?.vendor?.business_name || vendorProfile?.user?.name || 'Vendor';
    const tabs: ('Today' | 'Weekly' | 'Monthly' | 'Yearly')[] = ['Today', 'Weekly', 'Monthly', 'Yearly'];

    // Map store data to local variables for component
    const overview = dashboardData?.overview;
    const currentStats: OverviewStats | undefined =
        activeTab === 'Today' ? overview?.today :
            activeTab === 'Weekly' ? overview?.weekly :
                activeTab === 'Monthly' ? overview?.monthly :
                    overview?.yearly;

    const recentOrders = dashboardData?.recent_orders || [];

    if (loading && !dashboardData) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">

            {/* Welcome Section */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Welcome back, <span className="text-primary">{businessName}</span>!
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Showing statistics for {activeTab.toLowerCase()}
                    </p>
                </div>
                <button
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg hover:bg-muted transition-colors text-sm font-semibold disabled:opacity-50"
                >
                    <TrendingUp className={cn("w-4 h-4", loading && "animate-pulse")} />
                    {loading ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

            {/* ========== BOTTOM SECTION - Order Cards with Filters ========== */}
            <div className="mt-8 mb-8 bg-card rounded-xl p-6 shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-foreground">Order Overview</h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Parcel Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Total Parcel</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats?.total_parcel.count || 0}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats?.total_parcel.amount.toFixed(2) || "0.00"} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivered Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats?.delivered.count || 0}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats?.delivered.amount.toFixed(2) || "0.00"} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats?.pending.count || 0}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats?.pending.amount.toFixed(2) || "0.00"} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Cancel</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">
                                    {currentStats?.cancel.count || 0} ({currentStats?.cancel.percentage || 0}%)
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats?.cancel.amount.toFixed(2) || "0.00"} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* ========== LEFT COLUMN (takes 2/3 width) ========== */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Top Stats Cards (3 in a row) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">{formatBDT(dashboardData?.total_revenue || 0)}</p>
                                    <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Verified Revenue
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                                    <Wallet className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Active Orders</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {dashboardData?.active_orders || 0}
                                    </p>
                                    <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Active orders
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Store Rating</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">{dashboardData?.store_rating.toFixed(1) || "0.0"}</p>
                                    <div className="flex text-yellow-500 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${(i < (dashboardData?.store_rating || 0)) ? 'fill-current' : 'stroke-current'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                                    <Star className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Chart */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h3 className="font-semibold text-lg text-foreground">Sales Performance</h3>
                            <div className="flex gap-1 bg-muted p-1 rounded-lg w-full sm:w-auto overflow-x-auto scrollbar-none">
                                {(['week', 'month', 'year'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setChartTimeframe(t)}
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                            chartTimeframe === t
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Revenue Tracking (BDT)</span>
                                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-md", chartTimeframe === 'week' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary')}>
                                    {chartTimeframe}ly view
                                </span>
                            </div>
                            <SalesChart chartData={dashboardData?.sales_charts} timeframe={chartTimeframe} />
                        </div>
                    </div>
                </div>

                {/* ========== RIGHT COLUMN (takes 1/3 width) ========== */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickActionButton
                                icon={Plus}
                                label="Add Product"
                                onClick={() => navigate('/vendor/dashboard/products/add')}
                                variant="primary"
                            />
                            <QuickActionButton
                                icon={FileText}
                                label="Report"
                                onClick={() => console.log('Generate Report')}
                                variant="outline"
                            />
                            <QuickActionButton
                                icon={Headphones}
                                label="Support AI"
                                onClick={() => setIsAIChatOpen(true)}
                                variant="outline"
                            />
                            <QuickActionButton
                                icon={Phone}
                                label="Hotline"
                                onClick={() => setIsHotlineModalOpen(true)}
                                variant="outline"
                            />
                            <QuickActionButton
                                icon={HelpCircle}
                                label="FAQ"
                                onClick={() => setIsFAQModalOpen(true)}
                                variant="outline"
                            />
                            <QuickActionButton
                                icon={TicketIcon}
                                label="Ticket"
                                onClick={() => setIsTicketModalOpen(true)}
                                variant="outline"
                            />
                        </div>
                    </div>

                    {/* Inventory Status */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-foreground">Inventory Status</h3>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="space-y-3">
                            <div className={cn(
                                "flex items-center justify-between p-3 rounded-lg border",
                                (dashboardData?.inventory.low_stock_count || 0) > 0
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            )}>
                                <div>
                                    <p className={cn(
                                        "text-sm font-semibold",
                                        (dashboardData?.inventory.low_stock_count || 0) > 0 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
                                    )}>
                                        {(dashboardData?.inventory.low_stock_count || 0) > 0 ? "Low Stock Alert" : "Inventory Status"}
                                    </p>
                                    <p className={cn(
                                        "text-xs",
                                        (dashboardData?.inventory.low_stock_count || 0) > 0 ? "text-red-500" : "text-green-500"
                                    )}>
                                        {(dashboardData?.inventory.low_stock_count || 0) > 0 ? "Items need restocking" : "All items in stock"}
                                    </p>
                                </div>
                                <p className={cn(
                                    "text-xl font-bold",
                                    (dashboardData?.inventory.low_stock_count || 0) > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                )}>
                                    {dashboardData?.inventory.low_stock_count || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Orders</h3>
                        <span className="text-xs text-muted-foreground">{recentOrders.length} recent orders</span>
                        <RecentOrdersStack orders={recentOrders} />
                    </div>
                </div>
            </div>


        </div>
    );
};

export default VendorHome;