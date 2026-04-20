import { useState, useEffect } from 'react';

export interface EcommerceCategory {
  id: number;
  category_name: string;
  category_slug: string;
  category_discription: string;
  category_image: string;
  category_icon: string;
  status: string;
}

interface UseCategoriesReturn {
  categories: EcommerceCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Demo categories for fallback
const getDemoCategories = (): EcommerceCategory[] => {
  return [
    { id: 1, category_name: "Books & eBook", category_slug: "books-ebook", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 2, category_name: "Health & Beauty", category_slug: "health-beauty", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 3, category_name: "Home & Kitchen", category_slug: "home-kitchen", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 4, category_name: "Jewellery & Watches", category_slug: "jewellery-watches", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 5, category_name: "Livestock & Animals", category_slug: "livestock-animals", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 6, category_name: "Men's & Boys' Fashion", category_slug: "mens-fashion", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 7, category_name: "Mother & Baby Fashion", category_slug: "mother-baby", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 8, category_name: "Sports & Out Doors", category_slug: "sports-outdoors", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 9, category_name: "Bags & Accessories", category_slug: "bags-accessories", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 10, category_name: "Personal & Lifestyle", category_slug: "personal-lifestyle", category_discription: "", category_image: "", category_icon: "", status: "Active" },
    { id: 11, category_name: "Women's & Girls' Fashion", category_slug: "womens-fashion", category_discription: "", category_image: "", category_icon: "", status: "Active" },
  ];
};

export const useEcommerceCategoriesDemo = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<EcommerceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setCategories(getDemoCategories());
      setLoading(false);
      setError(null);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setCategories(getDemoCategories());
        setLoading(false);
        setError(null);
      }, 500);
    }
  };
};
