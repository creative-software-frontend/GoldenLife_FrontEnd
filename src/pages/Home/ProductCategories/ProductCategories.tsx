import { ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductSection() {
  const products = [
    { id: 1, title: "One piece gown", price: "$59.99", image: "../../../../public/image/categories/c2.jpg" },
    { id: 2, title: "Smart Watch & Device", price: "$129.99", image: "../../../../public/image/categories/c1.jpg" },
    { id: 3, title: "Snap and Grip", price: "$19.99", image: "../../../../public/image/categories/c12.png" },
    { id: 4, title: "Ladies Winter Overcoat", price: "$89.99", image: "../../../../public/image/categories/c3.jpg" },
    { id: 5, title: "Attractive Stylish Shirt", price: "$39.99", image: "../../../../public/image/categories/c13.png" },
    { id: 6, title: "M19 100% Original", price: "$49.99", image: "../../../../public/image/categories/c4.jpg" },
  ];

  return (
    <section className="py-8 md:py-12 mt-4 w-full conatiner mx-auto px-4 sm:px-6 lg:px-8">
      {/* Container with shadow and background */}
      <div className="bg-primary-default rounded-2xl shadow-xl overflow-hidden p-4 sm:p-6 md:p-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="bg-primary-light text-white px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-sm w-fit">
              Special Products
            </div>
            <p className="hidden md:block text-white/80 text-xs font-medium">
              New arrivals for you
            </p>
          </div>
          <Link 
            to="/dashboard/allProducts" 
            className="group text-white text-[10px] sm:text-sm font-bold flex items-center bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition-all"
          >
            All Products
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive Grid Area */}
        {/* Mobile: grid-cols-2 | Tablet: sm:grid-cols-3 | Desktop: lg:grid-cols-6 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {products.map((product) => (
            <Link 
              key={product.id}
              to="/dashboard"
              className="group flex flex-col bg-white/5 border border-white/10 rounded-xl p-2 sm:p-3 transition-all hover:bg-white/10 hover:border-white/30 h-full"
            >
              {/* Image Wrap */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative shadow-inner">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Price Overlay on Hover - Visible on larger screens */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                  <span className="text-white text-base sm:text-lg lg:text-xl font-black">{product.price}</span>
                </div>

                {/* Mobile Price Badge - Since hover isn't natural on touch devices */}
                <div className="absolute bottom-2 right-2 bg-primary-light text-white text-[10px] px-2 py-0.5 rounded md:hidden">
                  {product.price}
                </div>
              </div>

              {/* Info Area */}
              <div className="mt-3 flex flex-col justify-between flex-grow">
                <h3 className="text-[11px] sm:text-xs md:text-sm font-semibold text-white line-clamp-2 group-hover:text-primary-light transition-colors min-h-[2.5rem] leading-tight">
                  {product.title}
                </h3>
                
                <button className="flex items-center justify-center gap-2 w-full mt-2 sm:mt-3 bg-white text-primary-default hover:bg-primary-light hover:text-white transition-all font-bold py-2 rounded-lg text-[10px] sm:text-xs shadow-md active:scale-95">
                  <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}