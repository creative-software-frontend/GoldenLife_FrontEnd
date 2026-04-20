// Fake data for image search functionality
// This simulates backend responses until the actual API is ready

export interface FakeProduct {
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

export const fakeProducts: FakeProduct[] = [
  // Food Items
  {
    id: '1',
    name: 'Biryani Special',
    price: 350,
    oldPrice: 450,
    image: '/images/biryani.jpg',
    rating: 4.5,
    reviewCount: 234,
    category: 'Food',
    tags: ['rice', 'spicy', 'main course', 'chicken'],
    colors: ['orange', 'yellow'],
    matchScore: 95
  },
  {
    id: '2',
    name: 'Kacchi Biryani',
    price: 420,
    oldPrice: 550,
    image: '/images/kacchi.jpg',
    rating: 4.7,
    reviewCount: 312,
    category: 'Food',
    tags: ['rice', 'mutton', 'traditional', 'spicy'],
    colors: ['orange', 'brown'],
    matchScore: 93
  },
  {
    id: '3',
    name: 'Chicken Curry',
    price: 280,
    oldPrice: 350,
    image: '/images/curry.jpg',
    rating: 4.4,
    reviewCount: 189,
    category: 'Food',
    tags: ['curry', 'chicken', 'spicy', 'main course'],
    colors: ['red', 'brown'],
    matchScore: 90
  },

  // Drinks
  {
    id: '4',
    name: 'Mango Lassi',
    price: 120,
    oldPrice: 150,
    image: '/images/lassi.jpg',
    rating: 4.6,
    reviewCount: 156,
    category: 'Beverages',
    tags: ['drink', 'sweet', 'mango', 'cold'],
    colors: ['yellow', 'orange'],
    matchScore: 92
  },
  {
    id: '5',
    name: 'Fresh Juice Orange',
    price: 100,
    oldPrice: 130,
    image: '/images/juice.jpg',
    rating: 4.5,
    reviewCount: 142,
    category: 'Beverages',
    tags: ['juice', 'fresh', 'citrus', 'healthy'],
    colors: ['orange', 'yellow'],
    matchScore: 89
  },
  {
    id: '6',
    name: 'Iced Coffee',
    price: 150,
    oldPrice: 180,
    image: '/images/coffee.jpg',
    rating: 4.7,
    reviewCount: 198,
    category: 'Beverages',
    tags: ['coffee', 'cold', 'iced', 'caffeine'],
    colors: ['brown', 'white'],
    matchScore: 88
  },

  // Snacks
  {
    id: '7',
    name: 'Samosa Plate',
    price: 80,
    oldPrice: 100,
    image: '/images/samosa.jpg',
    rating: 4.3,
    reviewCount: 167,
    category: 'Snacks',
    tags: ['snack', 'fried', 'spicy', 'vegetarian'],
    colors: ['golden', 'brown'],
    matchScore: 87
  },
  {
    id: '8',
    name: 'Pakora Mix',
    price: 90,
    oldPrice: 120,
    image: '/images/pakora.jpg',
    rating: 4.4,
    reviewCount: 145,
    category: 'Snacks',
    tags: ['snack', 'fried', 'crispy', 'spicy'],
    colors: ['brown', 'golden'],
    matchScore: 86
  },
  {
    id: '9',
    name: 'Spring Rolls',
    price: 110,
    oldPrice: 140,
    image: '/images/spring-roll.jpg',
    rating: 4.5,
    reviewCount: 178,
    category: 'Snacks',
    tags: ['snack', 'chinese', 'crispy', 'roll'],
    colors: ['golden', 'brown'],
    matchScore: 85
  },

  // Desserts
  {
    id: '10',
    name: 'Rasmalai',
    price: 180,
    oldPrice: 220,
    image: '/images/rasmalai.jpg',
    rating: 4.8,
    reviewCount: 267,
    category: 'Desserts',
    tags: ['sweet', 'dessert', 'traditional', 'milk'],
    colors: ['white', 'cream'],
    matchScore: 91
  },
  {
    id: '11',
    name: 'Gulab Jamun',
    price: 160,
    oldPrice: 200,
    image: '/images/gulab-jamun.jpg',
    rating: 4.7,
    reviewCount: 234,
    category: 'Desserts',
    tags: ['sweet', 'dessert', 'syrup', 'traditional'],
    colors: ['brown', 'golden'],
    matchScore: 90
  },
  {
    id: '12',
    name: 'Ice Cream Sundae',
    price: 200,
    oldPrice: 250,
    image: '/images/sundae.jpg',
    rating: 4.6,
    reviewCount: 189,
    category: 'Desserts',
    tags: ['ice cream', 'cold', 'sweet', 'chocolate'],
    colors: ['brown', 'white', 'red'],
    matchScore: 88
  },

  // Fast Food
  {
    id: '13',
    name: 'Beef Burger',
    price: 250,
    oldPrice: 320,
    image: '/images/burger.jpg',
    rating: 4.5,
    reviewCount: 312,
    category: 'Fast Food',
    tags: ['burger', 'beef', 'fast food', 'grilled'],
    colors: ['brown', 'green', 'red'],
    matchScore: 94
  },
  {
    id: '14',
    name: 'Chicken Pizza',
    price: 450,
    oldPrice: 550,
    image: '/images/pizza.jpg',
    rating: 4.6,
    reviewCount: 423,
    category: 'Fast Food',
    tags: ['pizza', 'cheese', 'chicken', 'italian'],
    colors: ['red', 'yellow', 'green'],
    matchScore: 93
  },
  {
    id: '15',
    name: 'French Fries',
    price: 120,
    oldPrice: 150,
    image: '/images/fries.jpg',
    rating: 4.4,
    reviewCount: 278,
    category: 'Fast Food',
    tags: ['fries', 'potato', 'fried', 'snack'],
    colors: ['yellow', 'golden'],
    matchScore: 86
  },

  // Healthy Options
  {
    id: '16',
    name: 'Caesar Salad',
    price: 220,
    oldPrice: 280,
    image: '/images/salad.jpg',
    rating: 4.5,
    reviewCount: 156,
    category: 'Healthy',
    tags: ['salad', 'healthy', 'vegetables', 'fresh'],
    colors: ['green', 'white', 'red'],
    matchScore: 89
  },
  {
    id: '17',
    name: 'Grilled Chicken',
    price: 320,
    oldPrice: 400,
    image: '/images/grilled-chicken.jpg',
    rating: 4.7,
    reviewCount: 198,
    category: 'Healthy',
    tags: ['grilled', 'protein', 'healthy', 'chicken'],
    colors: ['brown', 'golden'],
    matchScore: 91
  },
  {
    id: '18',
    name: 'Fruit Bowl',
    price: 180,
    oldPrice: 220,
    image: '/images/fruit-bowl.jpg',
    rating: 4.6,
    reviewCount: 134,
    category: 'Healthy',
    tags: ['fruit', 'healthy', 'fresh', 'vitamins'],
    colors: ['red', 'yellow', 'green', 'orange'],
    matchScore: 87
  },

  // Breakfast
  {
    id: '19',
    name: 'Paratha with Curry',
    price: 150,
    oldPrice: 190,
    image: '/images/paratha.jpg',
    rating: 4.5,
    reviewCount: 212,
    category: 'Breakfast',
    tags: ['breakfast', 'paratha', 'traditional', 'spicy'],
    colors: ['brown', 'golden'],
    matchScore: 88
  },
  {
    id: '20',
    name: 'Egg Toast',
    price: 130,
    oldPrice: 160,
    image: '/images/egg-toast.jpg',
    rating: 4.4,
    reviewCount: 178,
    category: 'Breakfast',
    tags: ['breakfast', 'egg', 'toast', 'protein'],
    colors: ['yellow', 'brown'],
    matchScore: 86
  }
];

// Simulated search results based on image analysis
export const fakeSearchResults: Record<string, string[]> = {
  'food': ['1', '2', '3', '13', '14'],
  'rice': ['1', '2'],
  'curry': ['3', '19'],
  'drink': ['4', '5', '6'],
  'snack': ['7', '8', '9', '15'],
  'dessert': ['10', '11', '12'],
  'fast food': ['13', '14', '15'],
  'healthy': ['16', '17', '18'],
  'breakfast': ['19', '20'],
  'default': ['1', '4', '7', '10', '13', '16', '19']
};

// Enhanced function that accepts image data and attempts to identify content
export function simulateImageSearch(imageData: string | null): Promise<{
  detectedTags: string[];
  detectedCategory: string;
  detectedColors: string[];
  products: FakeProduct[];
}> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real application, this would be handled by an AI service
      // For this demo, we'll simulate content recognition based on various factors
      
      let detectedCategory = 'General';
      let detectedTags: string[] = ['general'];
      
      if (imageData) {
        // Simulate different recognition methods
        
        // Method 1: Check if image contains certain visual cues (simulated)
        const lowerData = imageData.toLowerCase();
        
        // Visual pattern recognition simulation
        if (lowerData.includes('headphone') || lowerData.includes('ear') || lowerData.includes('audio')) {
          detectedCategory = 'Electronics';
          detectedTags = ['electronics', 'audio', 'device', 'tech'];
        } else if (lowerData.includes('food') || lowerData.includes('sweet') || lowerData.includes('dessert')) {
          detectedCategory = 'Food';
          detectedTags = ['food', 'sweet', 'dessert', 'traditional'];
        } else if (lowerData.includes('cloth') || lowerData.includes('shirt') || lowerData.includes('dress')) {
          detectedCategory = 'Clothing';
          detectedTags = ['clothing', 'fashion', 'apparel', 'wear'];
        } else if (lowerData.includes('book') || lowerData.includes('study') || lowerData.includes('education')) {
          detectedCategory = 'Education';
          detectedTags = ['education', 'study', 'learning', 'books'];
        } else {
          // If no specific pattern found, use a more intelligent fallback
          // For demo purposes, we'll use a probabilistic approach
          // This ensures we almost always have results
          
          // Random but sensible default category
          const commonCategories = ['Food', 'Beverages', 'Snacks', 'Desserts', 'Fast Food'];
          const randomCategory = commonCategories[Math.floor(Math.random() * commonCategories.length)];
          detectedCategory = randomCategory;
          detectedTags = [randomCategory.toLowerCase(), 'popular', 'common'];
        }
      }

      // Get products based on detected category
      const productIds = fakeSearchResults[detectedCategory.toLowerCase()] || 
                        fakeSearchResults[detectedCategory] || 
                        fakeSearchResults['default'];
      
      const products = productIds
        .map(id => fakeProducts.find(p => p.id === id))
        .filter((p): p is FakeProduct => p !== undefined)
        .sort((a, b) => b.matchScore - a.matchScore);

      // Always ensure we have some products to show
      if (products.length === 0) {
        // Fallback to default products if no matches found
        const defaultIds = fakeSearchResults['default'];
        const fallbackProducts = defaultIds
          .map(id => fakeProducts.find(p => p.id === id))
          .filter((p): p is FakeProduct => p !== undefined);
        
        resolve({
          detectedTags: ['fallback', 'recommended'],
          detectedCategory: 'Recommended',
          detectedColors: fallbackProducts[0]?.colors || [],
          products: fallbackProducts
        });
      } else {
        resolve({
          detectedTags: detectedTags,
          detectedCategory: detectedCategory,
          detectedColors: products[0]?.colors || [],
          products: products
        });
      }
    }, 1500); // 1.5 second delay to simulate processing
  });
}

// Keep the specific type function for backward compatibility
// Note: imageData parameter is kept for API compatibility but not used in simulation
export function simulateImageSearchWithSpecificType(_imageData: string | null, specificCategory: string): Promise<{
  detectedTags: string[];
  detectedCategory: string;
  detectedColors: string[];
  products: FakeProduct[];
}> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const productIds = fakeSearchResults[specificCategory.toLowerCase()] || 
                        fakeSearchResults[specificCategory] || 
                        fakeSearchResults['default'];
      
      const products = productIds
        .map(id => fakeProducts.find(p => p.id === id))
        .filter((p): p is FakeProduct => p !== undefined)
        .sort((a, b) => b.matchScore - a.matchScore);

      // Get tags and category based on the specific category
      let detectedTags: string[] = ['generic'];
      let detectedCategory = 'General';
      
      if (products.length > 0) {
        detectedTags = products[0]?.tags || [specificCategory];
        detectedCategory = products[0]?.category || specificCategory.charAt(0).toUpperCase() + specificCategory.slice(1);
      }

      resolve({
        detectedTags: detectedTags,
        detectedCategory: detectedCategory,
        detectedColors: products[0]?.colors || [],
        products: products
      });
    }, 1500); // 1.5 second delay to simulate processing
  });
}
