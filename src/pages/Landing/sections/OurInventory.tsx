import React from 'react';
// TEMPORARY: Using demo hook until API issue is resolved
// Switch back to useEcommerceCategories when API is working
import { useEcommerceCategoriesDemo as useEcommerceCategories } from '../../../hooks/useEcommerceCategoriesDemo';
import CategoryCard from '../../../components/CategoryCard/CategoryCard';

// Temporary product count mapping (replace with real API later)
const productCountMap: Record<number, number> = {
  1: 24,   // Books & eBook
  2: 18,   // Health & Beauty
  3: 32,   // Home & Kitchen
  4: 12,   // Jewellery & Watches
  5: 8,    // Livestock & Animals
  6: 45,   // Men's & Boys' Fashion
  7: 15,   // Mother & Baby Fashion
  8: 22,   // Sports & Out Doors
  9: 19,   // Bags & Accessories
  10: 28,  // Personal & Lifestyle
  11: 28,  // Women's & Girls' Fashion
};

const getProductCount = (categoryId: number, categoryName: string): number => {
  return productCountMap[categoryId] || Math.floor(Math.random() * 30) + 5;
};

// Loading skeleton component
const CategorySkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
    <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-3 rounded-full"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
  </div>
);

const OurInventory: React.FC = () => {
  const { categories, loading, error } = useEcommerceCategories();

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
            {Array.from({ length: 5 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-bold text-red-800 mb-2">Unable to Load Categories</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 max-w-2xl mx-auto shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Categories Available</h3>
            <p className="text-gray-500">We're currently updating our inventory. Please check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-orange-400 rounded-full"></div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Our Inventory</span>
            <div className="w-8 h-0.5 bg-orange-400 rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse by Product Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.category_name}
              slug={category.category_slug}
              productCount={getProductCount(category.id, category.category_name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurInventory;
