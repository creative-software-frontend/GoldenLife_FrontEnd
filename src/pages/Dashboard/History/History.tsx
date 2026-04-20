'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { formatBDT } from '@/utils/currencyFormatter';

// Transaction Type definition
type TransactionType = 'wallet' | 'voucher' | 'recharge'

interface Transaction {
    id: string
    name: string
    status: string
    transactionId: string
    amount: number
    timestamp: string
    type: TransactionType  // Now properly typed as union of literal types
}

// Helper function to create transactions with correct typing
const createTransaction = (
    id: string,
    name: string,
    status: string,
    transactionId: string,
    amount: number,
    timestamp: string,
    type: TransactionType
): Transaction => ({
    id,
    name,
    status,
    transactionId,
    amount,
    timestamp,
    type
});

// Generate wallet transactions
const walletTransactions: Transaction[] = Array(9).fill(null).map((_, i) => 
    createTransaction(
        `wallet-${i}`,
        "Bkash",
        "Received",
        "3434635234345",
        500,
        "02:12pm 03/12/24",
        'wallet'
    )
);

// Generate voucher transactions
const voucherTransactions: Transaction[] = Array(9).fill(null).map((_, i) => 
    createTransaction(
        `voucher-${i}`,
        "Gift Voucher",
        "Redeemed",
        "7834635234345",
        250,
        "03:15pm 03/12/24",
        'voucher'
    )
);

// Generate recharge transactions
const rechargeTransactions: Transaction[] = Array(9).fill(null).map((_, i) => 
    createTransaction(
        `recharge-${i}`,
        "Mobile Recharge",
        "Completed",
        "9934635234345",
        100,
        "04:20pm 03/12/24",
        'recharge'
    )
);

// Combine all transactions
const allTransactions: Transaction[] = [
    ...walletTransactions,
    ...voucherTransactions,
    ...rechargeTransactions
];

// Transaction Item Component for reusability
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    // Get status color based on status text
    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'received':
            case 'completed':
                return 'text-green-600';
            case 'redeemed':
                return 'text-blue-600';
            case 'pending':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    // Get amount color (positive = green, negative/expense = red)
    const getAmountColor = (type: TransactionType, status: string) => {
        if (type === 'voucher' && status === 'Redeemed') return 'text-red-500';
        if (type === 'recharge') return 'text-red-500';
        if (status === 'Received') return 'text-green-500';
        return 'text-gray-700';
    };

    const getAmountPrefix = (type: TransactionType, status: string) => {
        if (type === 'voucher' && status === 'Redeemed') return '-';
        if (type === 'recharge') return '-';
        if (status === 'Received') return '+';
        return '';
    };

    // Get avatar background color based on type
    const getAvatarBgColor = (type: TransactionType) => {
        switch(type) {
            case 'wallet':
                return 'bg-orange-100';
            case 'voucher':
                return 'bg-purple-100';
            case 'recharge':
                return 'bg-blue-100';
            default:
                return 'bg-gray-100';
        }
    };

    // Get icon/letter based on type
    const getAvatarContent = (type: TransactionType, name: string) => {
        switch(type) {
            case 'wallet':
                return '💰';
            case 'voucher':
                return '🎁';
            case 'recharge':
                return '📱';
            default:
                return name.charAt(0);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-3">
                <Avatar className={`h-12 w-12 ${getAvatarBgColor(transaction.type)} flex items-center justify-center text-xl`}>
                    {getAvatarContent(transaction.type, transaction.name)}
                </Avatar>
                <div>
                    <h3 className="font-semibold text-gray-900">{transaction.name}</h3>
                    <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                    </p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">
                        TXN: {transaction.transactionId}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold ${getAmountColor(transaction.type, transaction.status)}`}>
                    {getAmountPrefix(transaction.type, transaction.status)}{formatBDT(transaction.amount, { compact: true })}
                </p>
                <p className="text-gray-500 text-xs mt-1">{transaction.timestamp}</p>
            </div>
        </div>
    );
};

// Empty state component
const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">
                {type === 'wallet' && '💳'}
                {type === 'voucher' && '🎫'}
                {type === 'recharge' && '📱'}
            </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No {type} transactions</h3>
        <p className="text-gray-500 text-sm mt-1">
            {type === 'wallet' && "You haven't made any wallet transactions yet"}
            {type === 'voucher' && "You haven't redeemed any vouchers yet"}
            {type === 'recharge' && "You haven't made any recharges yet"}
        </p>
    </div>
);

export default function History() {
    const walletData = allTransactions.filter(t => t.type === 'wallet');
    const voucherData = allTransactions.filter(t => t.type === 'voucher');
    const rechargeData = allTransactions.filter(t => t.type === 'recharge');

    return (
        <div className="w-full max-w-2xl mx-auto bg-white min-h-screen shadow-sm">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
                <div className="text-xs text-gray-500">
                    {allTransactions.length} total
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent sticky top-[73px] z-10 bg-white">
                    <TabsTrigger
                        value="wallet"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none data-[state=active]:text-orange-600"
                    >
                        <span className="flex items-center gap-2">
                            <span>💰</span>
                            <span>Wallet</span>
                            {walletData.length > 0 && (
                                <span className="text-xs text-gray-400">({walletData.length})</span>
                            )}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="voucher"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none data-[state=active]:text-orange-600"
                    >
                        <span className="flex items-center gap-2">
                            <span>🎁</span>
                            <span>Voucher</span>
                            {voucherData.length > 0 && (
                                <span className="text-xs text-gray-400">({voucherData.length})</span>
                            )}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="recharge"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none data-[state=active]:text-orange-600"
                    >
                        <span className="flex items-center gap-2">
                            <span>📱</span>
                            <span>Recharge</span>
                            {rechargeData.length > 0 && (
                                <span className="text-xs text-gray-400">({rechargeData.length})</span>
                            )}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="mt-0">
                    <div className="divide-y divide-gray-100">
                        {walletData.length > 0 ? (
                            walletData.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))
                        ) : (
                            <EmptyState type="wallet" />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="voucher" className="mt-0">
                    <div className="divide-y divide-gray-100">
                        {voucherData.length > 0 ? (
                            voucherData.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))
                        ) : (
                            <EmptyState type="voucher" />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="recharge" className="mt-0">
                    <div className="divide-y divide-gray-100">
                        {rechargeData.length > 0 ? (
                            rechargeData.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))
                        ) : (
                            <EmptyState type="recharge" />
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}