import React from 'react';
import { MoreVertical, Eye, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ProductActionsProps } from '../types';

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onView,
  onEdit,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 hover:bg-secondary/20 hover:text-secondary transition-all"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border">
        <DropdownMenuItem 
          onClick={() => onView(product)} 
          className="cursor-pointer py-2.5 gap-2.5 hover:bg-secondary/10 focus:bg-secondary/10"
        >
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="font-medium">View Details</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        {product.status === '0' && (
          <DropdownMenuItem 
            onClick={() => onEdit(product)} 
            className="cursor-pointer py-2.5 gap-2.5 hover:bg-secondary/10 focus:bg-secondary/10"
          >
            <Pencil className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">Edit Product</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
