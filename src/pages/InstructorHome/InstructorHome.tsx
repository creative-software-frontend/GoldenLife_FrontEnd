import React, { useState } from 'react';
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
import { formatBDT } from '@/utils/currencyFormatter';
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
            {orders.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">No recent enrollments</div>
            )}
            {orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors border-b border-border last:border-0">
                    <div>
                        <p className="font-medium text-sm text-foreground">{order.order_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.status}</p>
                    </div>
                    <p className="font-semibold text-sm text-foreground">{formatBDT(order.total, { compact: true })}</p>
                </div>
            ))}
            {orders.length > 0 && (
                <button
                    className="w-full text-center text-xs text-primary hover:underline mt-2 pt-2 border-t border-border"
                >
                    View All Enrollments →
                </button>
            )}
        </div>
    );
};

const InstructorHome: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Today' | 'Weekly' | 'Monthly' | 'Yearly'>('Today');
    const [chartTimeframe, setChartTimeframe] = useState<'week' | 'month' | 'year'>('week');

    const { setIsAIChatOpen, setIsHotlineModalOpen, setIsFAQModalOpen, setIsTicketModalOpen } = useModalStore();

    const businessName = 'Instructor Name';
    const tabs: ('Today' | 'Weekly' | 'Monthly' | 'Yearly')[] = ['Today', 'Weekly', 'Monthly', 'Yearly'];

    // STATIC DUMMY DATA FOR UI ONLY
    const currentStats = {
        total_parcel: { count: 0, amount: 0 },
        delivered: { count: 0, amount: 0 },
        pending: { count: 0, amount: 0 },
        cancel: { count: 0, amount: 0, percentage: 0 }
    };
    const total_revenue = 40377.00;
    const active_orders = 1;
    const store_rating = 4.8;
    const inventory = { low_stock_count: 0 };
    const recentOrders: any[] = [];

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">

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
                    className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg hover:bg-muted transition-colors text-sm font-semibold"
                >
                    <TrendingUp className="w-4 h-4" />
                    Refresh Data
                </button>
            </div>

            {/* ========== BOTTOM SECTION - Order Cards with Filters ========== */}
            <div className="mt-8 mb-8 bg-card rounded-xl p-6 shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-foreground">Enrollment Overview</h2>
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
                            <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats.total_parcel.count}</span>
                                <p className="text-xs text-muted-foreground mt-1">Students</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats.total_parcel.amount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivered Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats.delivered.count}</span>
                                <p className="text-xs text-muted-foreground mt-1">Students</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats.delivered.amount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{currentStats.pending.count}</span>
                                <p className="text-xs text-muted-foreground mt-1">Students</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats.pending.amount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Dropped</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">
                                    {currentStats.cancel.count} ({currentStats.cancel.percentage}%)
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">Students</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{currentStats.cancel.amount.toFixed(2)} BDT</span>
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
                                    <p className="text-muted-foreground text-sm font-medium">Total Earnings</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">{formatBDT(total_revenue)}</p>
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
                                    <p className="text-muted-foreground text-sm font-medium">Active Courses</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {active_orders}
                                    </p>
                                    <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Published courses
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
                                    <p className="text-muted-foreground text-sm font-medium">Student Rating</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">{store_rating.toFixed(1)}</p>
                                    <div className="flex text-yellow-500 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${(i < store_rating) ? 'fill-current' : 'stroke-current'}`}
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

                    {/* Sales Chart Proxy */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border h-[400px] flex items-center justify-center text-muted-foreground flex-col">
                        <TrendingUp className="w-16 h-16 opacity-20 mb-4" />
                        <h3 className="font-semibold text-lg text-foreground mb-1">Performance Chart</h3>
                        <p className="text-sm">Graph will populate when course data is ready!</p>
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
                                label="Create Course"
                                variant="primary"
                            />
                            <QuickActionButton
                                icon={FileText}
                                label="Report"
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

                    {/* Inventory Status Proxy */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-foreground">Course Status</h3>
                            <AlertCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <div>
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                        All Courses Active
                                    </p>
                                    <p className="text-xs text-green-500">
                                        No pending issues
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                    0
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Enrollments</h3>
                        <RecentOrdersStack orders={recentOrders} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InstructorHome;
