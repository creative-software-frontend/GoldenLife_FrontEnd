import { Shirt, Laptop, Pizza, Car, Home, Dumbbell, Smartphone, Watch, Headphones, Camera, Book, Gamepad } from 'lucide-react'

export default function ProductCategories() {
    const products = [
        // Row 1
        { name: "Clothing", icon: <Shirt className="w-6 h-6" /> },
        { name: "Electronics", icon: <Laptop className="w-6 h-6" /> },
        { name: "Food & Grocery", icon: <Pizza className="w-6 h-6" /> },
        { name: "Automotive", icon: <Car className="w-6 h-6" /> },
        { name: "Home & Garden", icon: <Home className="w-6 h-6" /> },
        { name: "Sports & Fitness", icon: <Dumbbell className="w-6 h-6" /> },
        { name: "Mobile Phones", icon: <Smartphone className="w-6 h-6" /> },
        // Row 2
        { name: "Watches", icon: <Watch className="w-6 h-6" /> },
        { name: "Audio", icon: <Headphones className="w-6 h-6" /> },
        { name: "Cameras", icon: <Camera className="w-6 h-6" /> },
        { name: "Books", icon: <Book className="w-6 h-6" /> },
        { name: "Gaming", icon: <Gamepad className="w-6 h-6" /> },
        { name: "Clothing", icon: <Shirt className="w-6 h-6" /> },
        { name: "Electronics", icon: <Laptop className="w-6 h-6" /> },
        // Row 3
        { name: "Food & Grocery", icon: <Pizza className="w-6 h-6" /> },
        { name: "Automotive", icon: <Car className="w-6 h-6" /> },
        { name: "Home & Garden", icon: <Home className="w-6 h-6" /> },
        { name: "Sports & Fitness", icon: <Dumbbell className="w-6 h-6" /> },
        { name: "Mobile Phones", icon: <Smartphone className="w-6 h-6" /> },
        { name: "Watches", icon: <Watch className="w-6 h-6" /> },
        // { name: "Audio", icon: <Headphones className="w-6 h-6" /> },
    ]

    return (
        <div className="mt-4">
            <h1 className="text-2xl font-bold mb-2 mt-4 text-center">Product Category</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 border rounded-md bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="mb-2 text-primary">{product.icon}</div>
                        <span className="text-sm font-medium text-gray-700 text-center">{product.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

