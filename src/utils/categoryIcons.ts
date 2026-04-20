import {
  BookOpen,
  Heart,
  Home,
  Gem,
  PawPrint,
  Shirt,
  Baby,
  Bike,
  ShoppingBag,
  Smile,
  Drama,
  Package,
  type LucideIcon
} from 'lucide-react';

interface CategoryIconMap {
  [key: number]: LucideIcon;
}

export const categoryIcons: CategoryIconMap = {
  1: BookOpen,     // Books & eBook
  2: Heart,        // Health & Beauty
  3: Home,         // Home & Kitchen
  4: Gem,          // Jewellery & Watches
  5: PawPrint,     // Livestock & Animals
  6: Shirt,        // Men's & Boys' Fashion
  7: Baby,         // Mother & Baby Fashion
  8: Bike,         // Sports & Out Doors
  9: ShoppingBag,  // Bags & Accessories
  10: Smile,       // Parsonal & Lifestyle
  11: Drama,       // Women's & Girls' Fashion
};

export const getCategoryIcon = (id: number): LucideIcon => {
  return categoryIcons[id] || Package;
};

export const getCategoryIconByName = (name: string): LucideIcon => {
  const nameMap: Record<string, LucideIcon> = {
    'Book': BookOpen,
    'Health': Heart,
    'Beauty': Heart,
    'Home': Home,
    'Kitchen': Home,
    'Jewellery': Gem,
    'Watch': Gem,
    'Livestock': PawPrint,
    'Animal': PawPrint,
    'Men': Shirt,
    'Boy': Shirt,
    'Fashion': Shirt,
    'Mother': Baby,
    'Baby': Baby,
    'Sport': Bike,
    'Outdoor': Bike,
    'Bag': ShoppingBag,
    'Accessorie': ShoppingBag,
    'Personal': Smile,
    'Lifestyle': Smile,
    'Women': Drama,
    'Girl': Drama,
  };
  
  for (const [key, icon] of Object.entries(nameMap)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  return Package;
};
