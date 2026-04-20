import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface CategoryCardProps {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  icon?: string;
  image?: string;
}

const CategoryCard = ({ id, name, slug, productCount, image }: CategoryCardProps) => {
  const navigate = useNavigate();
  const IconComponent = getCategoryIcon(id);

  const handleClick = () => {
    navigate(`/dashboard/category/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100 hover:border-orange-200 text-center overflow-hidden"
    >
      {/* Background gradient effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Icon Circle Background */}
      <div className="relative w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
        <IconComponent 
          size={40} 
          className="text-orange-500 group-hover:text-orange-600 transition-colors duration-300"
          strokeWidth={1.5}
        />
      </div>

      {/* Category Name */}
      <h3 className="relative font-bold text-gray-800 text-lg mb-3 line-clamp-2">
        {name}
      </h3>

      {/* Decorative Line */}
      <div className="relative w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto mb-3 rounded-full group-hover:w-20 transition-all duration-300" />

      {/* Product Count */}
      <div className="relative mb-4">
        <span className="text-orange-500 font-semibold text-sm">
          {productCount} Products
        </span>
      </div>

      {/* Explore Link */}
      <div className="relative inline-flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all duration-300">
        Explore Now
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default CategoryCard;
