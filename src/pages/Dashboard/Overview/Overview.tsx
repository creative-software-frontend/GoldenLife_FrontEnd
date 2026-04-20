import {
    ArrowRightIcon,
    ArrowUpIcon,
    BarChart3Icon,
    PackageIcon,
    Users2Icon,
} from 'lucide-react'

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LineProps,
} from 'recharts'

type DataType = {
    month: string
    LoyalCustomers: number
    NewCustomers: number
    UniqueCustomers: number
}

const data: DataType[] = [
    { month: 'Jan', LoyalCustomers: 300, NewCustomers: 250, UniqueCustomers: 280 },
    { month: 'Feb', LoyalCustomers: 320, NewCustomers: 220, UniqueCustomers: 330 },
    { month: 'Mar', LoyalCustomers: 280, NewCustomers: 210, UniqueCustomers: 310 },
    { month: 'Apr', LoyalCustomers: 250, NewCustomers: 160, UniqueCustomers: 290 },
    { month: 'May', LoyalCustomers: 200, NewCustomers: 130, UniqueCustomers: 220 },
    { month: 'Jun', LoyalCustomers: 220, NewCustomers: 240, UniqueCustomers: 180 },
    { month: 'Jul', LoyalCustomers: 280, NewCustomers: 340, UniqueCustomers: 250 },
    { month: 'Aug', LoyalCustomers: 300, NewCustomers: 320, UniqueCustomers: 300 },
    { month: 'Sep', LoyalCustomers: 320, NewCustomers: 310, UniqueCustomers: 310 },
    { month: 'Oct', LoyalCustomers: 300, NewCustomers: 280, UniqueCustomers: 290 },
    { month: 'Nov', LoyalCustomers: 240, NewCustomers: 220, UniqueCustomers: 250 },
    { month: 'Dec', LoyalCustomers: 200, NewCustomers: 170, UniqueCustomers: 190 },
]

const Overview: React.FC = () => {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Today's Sales</h2>
                    <p className="text-muted-foreground">Sales Summary</p>
                </div>
                <button className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center">
                    Export
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-pink-50 p-4 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Total Sales</div>
                        <BarChart3Icon className="h-4 w-4 text-pink-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">$1k</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-500">Last day +8%</span>
                        </p>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Total Order</div>
                        <PackageIcon className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">300</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-500">Last day +5%</span>
                        </p>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Sold</div>
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-500">Last day +1.2%</span>
                        </p>
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Customers</div>
                        <Users2Icon className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-500">Last day +0.5%</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="pb-2">
                    <h3 className="text-lg font-semibold">Visitor Insights</h3>
                </div>
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="LoyalCustomers" stroke="#8884d8" />
                            <Line type="monotone" dataKey="NewCustomers" stroke="#ff0000" />
                            <Line type="monotone" dataKey="UniqueCustomers" stroke="#00ff00" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Overview
