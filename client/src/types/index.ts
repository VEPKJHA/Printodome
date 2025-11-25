export enum ProductCategory {
  Printers = 'Printers',
  TonerCartridges = 'TonerCartridges',
  InkCartridges = 'InkCartridges',
  Accessories = 'Accessories',
  MaintenanceKits = 'MaintenanceKits',
  PaperAndMedia = 'PaperAndMedia',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: ProductCategory;
  categoryName: string;
  brand: string;
  imageUrl: string;
  isActive: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProductFilterParams {
  searchTerm?: string;
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'name' | 'price' | 'stock';
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customer: CustomerRequest;
  items: OrderItemRequest[];
  shippingAddress: string;
  billingAddress: string;
  paymentReference?: string;
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  productSKU: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: CustomerDto;
  orderDateUtc: string;
  status: number;
  statusName: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentReference?: string;
  items: OrderItemDto[];
}

export interface TopSellingProduct {
  productId: string;
  sku: string;
  productName: string;
  categoryName: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface CategorySalesSummary {
  categoryName: string;
  itemsSold: number;
  totalRevenue: number;
  percentageOfTotal: number;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  averageOrderValue: number;
  categoryBreakdown: CategorySalesSummary[];
  topSellingProducts: TopSellingProduct[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

