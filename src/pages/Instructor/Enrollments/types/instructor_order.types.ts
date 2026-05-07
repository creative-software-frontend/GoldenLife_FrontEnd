export type OrderStatus = 
  | 'Order Placed' 
  | 'Pending' 
  | 'Processing' 
  | 'Packaging' 
  | 'Sent To Courier' 
  | 'Ready To Courier' 
  | 'On The Way' 
  | 'Delivered' 
  | 'Returned' 
  | 'Cancelled';

export interface OrderProduct {
  id: number;
  order_id: number;
  vendor_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_no: string;
  user_id: number;
  vendor_id: string;
  user_name: string;
  user_phone: string;
  user_address: string | null;
  total: string;
  delivery_charge: string;
  status: string;
  created_at: string;
  updated_at: string;
  products: OrderProduct[];
}

export interface OrdersApiResponse {
  status: boolean;
  message: string;
  orders: Order[];
}

export interface OrderTrackingApiResponse {
  status: boolean;
  message: string;
  order: Order;
}

export interface UpdateStatusApiResponse {
  success: boolean;
  message: string;
  status?: boolean;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | 'All' | 'today';
  page?: number;
  limit?: number;
}
