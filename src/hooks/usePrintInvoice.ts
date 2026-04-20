import { useCallback } from 'react';

/**
 * Order data interface for printing
 */
export interface OrderForPrint {
  invoice_no?: string;
  order_no: string;
  created_at: string;
  status: string;
  total: number | string;
  delivery_charge: number | string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  user_address?: string;
  products: Array<{
    id?: string | number;
    product_name: string;
    quantity: string | number;
    price?: string | number;
    subtotal: string | number;
  }>;
  payment?: {
    payment_method: string;
    transaction_number?: string;
  } | null;
}

/**
 * Custom hook for printing invoices
 * Provides a simple interface to trigger browser print
 */
export const usePrintInvoice = () => {
  const printInvoice = useCallback((order: OrderForPrint) => {
    // Validate order data
    if (!order || !order.order_no) {
      console.error('Invalid order data for printing');
      return;
    }

    // Validate products array
    if (!order.products || order.products.length === 0) {
      console.warn('Order has no products to print');
    }

    // Trigger browser print
    // The actual print styling is handled by @media print CSS in PrintInvoice component
    window.print();
  }, []);

  return { printInvoice };
};
