import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";

interface Product {
    id: number;
    name: string;
    image: string;
    weight: string;
    price: number;
    mrp: number;
    description?: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "Potato Regular",
        image: "../../../../public/image/products/sharee3.jpg",
        weight: "600 gm",
        price: 39,
        mrp: 45,
        description: "Regular potatoes, perfect for home cooking. Rich in carbohydrates and minerals."
    },
    {
        id: 2,
        name: "Lal Alu (Red Potato Cardinal)",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 65,
        mrp: 70,
        description: "Red Potatoes Cardinal, mainly used for home cooking. Rich in vitamins and minerals."
    },
    {
        id: 3,
        name: "Roshun (Garlic Imported)",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 119,
        mrp: 125,
        description: "Imported garlic, known for its strong flavor and health benefits."
    },
    {
        id: 4,
        name: "Lal Peyaj (Onion Red Imported)",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 119,
        mrp: 130,
        description: "Imported red onions, essential for everyday cooking."
    },
    {
        id: 5,
        name: "Tomato",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 30,
        mrp: 35,
        description: "Fresh, ripe tomatoes perfect for salads and cooking."
    },
    {
        id: 6,
        name: "Carrot",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 40,
        mrp: 45,
        description: "Crunchy carrots loaded with vitamins, perfect for snacking and cooking."
    },
    {
        id: 7,
        name: "Cucumber",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 25,
        mrp: 30,
        description: "Fresh cucumbers, great for salads and hydration."
    },
    {
        id: 8,
        name: "Spinach",
        image: "../../../public/image/maggi.webp",
        weight: "250 gm",
        price: 15,
        mrp: 20,
        description: "Fresh spinach packed with iron and nutrients."
    },
    {
        id: 9,
        name: "Broccoli",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 80,
        mrp: 90,
        description: "Fresh broccoli, rich in fiber and antioxidants."
    },
    {
        id: 10,
        name: "Cauliflower",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 50,
        mrp: 60,
        description: "Fresh cauliflower, great for stir-fries and curries."
    },
    {
        id: 11,
        name: "Green Beans",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 40,
        mrp: 45,
        description: "Tender green beans, perfect for salads and side dishes."
    },
    {
        id: 12,
        name: "Capsicum",
        image: "../../../public/image/maggi.webp",
        weight: "250 gm",
        price: 25,
        mrp: 30,
        description: "Fresh capsicum, perfect for adding flavor to dishes."
    },
    {
        id: 13,
        name: "Pumpkin",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 30,
        mrp: 35,
        description: "Pumpkin rich in vitamins, ideal for soups and curries."
    },
    {
        id: 14,
        name: "Ginger",
        image: "../../../public/image/maggi.webp",
        weight: "250 gm",
        price: 30,
        mrp: 35,
        description: "Fresh ginger, a must-have for aromatic dishes."
    },
    {
        id: 15,
        name: "Garlic Local",
        image: "../../../public/image/maggi.webp",
        weight: "250 gm",
        price: 45,
        mrp: 50,
        description: "Locally sourced garlic with a mild flavor."
    },
    {
        id: 16,
        name: "Beetroot",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 35,
        mrp: 40,
        description: "Nutritious beetroots, perfect for salads and juices."
    },
    {
        id: 17,
        name: "Lettuce",
        image: "../../../public/image/maggi.webp",
        weight: "250 gm",
        price: 20,
        mrp: 25,
        description: "Fresh lettuce for healthy salads."
    },
    {
        id: 18,
        name: "Green Chilies",
        image: "../../../public/image/maggi.webp",
        weight: "100 gm",
        price: 10,
        mrp: 12,
        description: "Spicy green chilies to add heat to your dishes."
    },
    {
        id: 19,
        name: "Bitter Gourd",
        image: "../../../public/image/maggi.webp",
        weight: "500 gm",
        price: 30,
        mrp: 35,
        description: "Bitter gourd with unique taste and health benefits."
    },
    {
        id: 20,
        name: "Brinjal",
        image: "../../../public/image/maggi.webp",
        weight: "1 kg",
        price: 40,
        mrp: 45,
        description: "Fresh brinjal, perfect for curries and stir-fries."
    }
]

export default function ProductPage() {
    const { id } = useParams<{ id: string }>(); // Retrieve the id from the URL
    const productId = Number(id); // Convert id to a number if needed

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        products.find((product) => product.id === productId) || null
    );

    const [quantities, setQuantities] = useState<Record<number, number>>(
        Object.fromEntries(products.map((p) => [p.id, 1]))
    );

    const updateQuantity = (productId: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta),
        }));
    };

    const discount = (mrp: number, price: number) => {
        return Math.round(((mrp - price) / mrp) * 100);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Fresh Vegetables</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg shadow-sm relative">
                        <button
                            className="absolute right-2 top-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                            onClick={() => console.log('Add to wishlist')}
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                        </button>

                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg p-4" // Image spans full width and fills container
                        />
                        {/* <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-contain mb-4"
                        /> */}

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.weight}</p> {/* Title and weight in one line */}
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl font-bold">₹{product.price}</span>
                                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                                <span className="text-sm text-red-500">{discount(product.mrp, product.price)}% OFF</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    Show
                                </button>
                                <button className="flex-1 px-4 py-2 bg-primary-default text-white rounded-md ">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full rounded-lg"
                                />

                                <div className="space-y-4">
                                    <p className="text-lg">{selectedProduct.weight}</p>

                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">₹{selectedProduct.price}</span>
                                        <span className="text-gray-500 line-through">₹{selectedProduct.mrp}</span>
                                        <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">
                                            {discount(selectedProduct.mrp, selectedProduct.price)}% OFF
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 border rounded-md p-2 w-fit">
                                        <button
                                            onClick={() => updateQuantity(selectedProduct.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center">
                                            {quantities[selectedProduct.id]} in bag
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(selectedProduct.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-gray-600">{selectedProduct.description}</p>

                                    <button className="w-full px-4 py-2 bg-primary-default text-white rounded-md ">
                                        Buy Now
                                    </button>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">🚚</span>
                                            30 minute delivery
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">💰</span>
                                            Cash on delivery
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-6 py-3 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}