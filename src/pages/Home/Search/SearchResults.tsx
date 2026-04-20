'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Grid, List } from 'lucide-react';
import { fakeProducts } from '@/lib/imageSearchData';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  colors: string[];
  matchScore: number;
}

export default function SearchResults() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');
  
  // Helper function to parse query parameters
  const getSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      searchType: searchParams.get('type'),
      tags: searchParams.get('tags')?.split(',') || [],
      category: searchParams.get('category') || ''
    };
  };
  
  const { searchType, tags, category } = getSearchParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let results: Product[] = [];
        
        if (searchType === 'image') {
          // For image search, filter by category and tags
          results = fakeProducts.filter(product => {
            const categoryMatch = category ? 
              product.category.toLowerCase().includes(category.toLowerCase()) : true;
            
            const tagsMatch = tags.length > 0 ? 
              tags.some(tag => product.tags.some(productTag => 
                productTag.toLowerCase().includes(tag.toLowerCase())
              )) : true;
            
            return categoryMatch && tagsMatch;
          });
          
          // Sort by match score for image search
          results.sort((a, b) => b.matchScore - a.matchScore);
        } else {
          // For text search, you would implement text-based search logic here
          results = fakeProducts.slice(0, 12);
        }
        
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'relevance':
      default:
        return sorted;
    }
  };

  const sortedResults = sortProducts(searchResults);

  const renderProductCard = (product: Product) => (
    <div 
      key={product.id}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
        {searchType === 'image' && (
          <div className="absolute top-2 right-2 bg-primary-default text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.matchScore}% match
          </div>
        )}
        {product.oldPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-medium text-gray-700 ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-default">
              ৳{product.price}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                ৳{product.oldPrice}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <button className="bg-primary-default hover:bg-primary-dark text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-default border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {searchType === 'image' ? 'Image Search Results' : 'Search Results'}
              </h1>
              {searchType === 'image' && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>Found {sortedResults.length} products</span>
                  {category && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Category: {category}
                    </span>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-default"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-default text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-default text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {sortedResults.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {sortedResults.map(renderProductCard)}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchType === 'image' 
                ? 'Try searching with a different image or check if the image is clear and recognizable.'
                : 'Try adjusting your search terms or browse our categories.'
              }
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-primary-default hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Back to Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}