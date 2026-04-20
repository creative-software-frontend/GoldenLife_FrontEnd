export interface ProductCategory {
  id: number;
  name: string;
  image: string;
  category: "Electronics" | "Food & Grocery" | "Health" | "Fashion"; // Added Category type
}

export const productsData: ProductCategory[] = [
  // Electronics
  { id: 1, name: "Airpods", image: "/image/products/airpods.jpg", category: "Electronics" },
  { id: 2, name: "Beats", image: "/image/products/beats.jpg", category: "Electronics" },
  { id: 5, name: "Headphone", image: "/image/products/headphone.jpg", category: "Electronics" },

  // Food & Grocery
  { id: 3, name: "Bread", image: "/image/products/bread.jpg", category: "Food & Grocery" },
  { id: 4, name: "Egg", image: "/image/products/egg.jpg", category: "Food & Grocery" },
  { id: 6, name: "Honey", image: "/image/products/honey.jpg", category: "Food & Grocery" },
  { id: 7, name: "Maggi", image: "/image/products/maggi.webp", category: "Food & Grocery" },

  // Health
  { id: 8, name: "Pulse Oximeter", image: "/image/products/pulseoximeter.jpg", category: "Health" },

  // Fashion
  { id: 9, name: "Sharee 1", image: "/image/products/sharee.jpg", category: "Fashion" },
  { id: 10, name: "Sharee 2", image: "/image/products/sharee2.jpg", category: "Fashion" },
];