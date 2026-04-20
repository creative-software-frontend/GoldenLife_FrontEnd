import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  isLoading, 
  onPageChange 
}) => {
  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`p-3 rounded-full border-2 transition-all duration-300 ${
          currentPage === 1 || isLoading
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
              currentPage === page
                ? "bg-primary text-white shadow-md scale-110"
                : "bg-white text-gray-600 hover:bg-orange-50 hover:text-primary"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`p-3 rounded-full border-2 transition-all duration-300 ${
          currentPage === totalPages || isLoading
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md"
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;