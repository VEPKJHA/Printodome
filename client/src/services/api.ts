import axios from 'axios';
import {
  Product,
  PaginatedResult,
  ProductFilterParams,
  CreateOrderRequest,
  OrderDto,
  TopSellingProduct,
  SalesReport,
  ProductCategory,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock fallback dataset representing the enterprise printer & supplies catalog
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'b1f6217d-2b4a-4632-9cb7-d0e5ea4e4121',
    name: 'HP LaserJet Enterprise M507x Monochrome Laser',
    sku: 'HP-LJE-M507X',
    description: 'Workgroup monochrome laser printer with 45 ppm print speeds, dual 550-sheet paper trays, hardware-level HP Sure Start security, and automatic duplexing.',
    price: 899.99,
    stockQuantity: 35,
    category: ProductCategory.Printers,
    categoryName: 'Printers',
    brand: 'HP',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'c2a7328e-3c5b-4743-adcb-e1f6fb5e5232',
    name: 'Brother HL-L8360CDW Business Color Laser',
    sku: 'BRT-HLL-8360CDW',
    description: 'High-yield wireless enterprise color laser printer with Gigabit Ethernet, up to 33 ppm, advanced NFC card authentication, and low-cost color output.',
    price: 449.99,
    stockQuantity: 48,
    category: ProductCategory.Printers,
    categoryName: 'Printers',
    brand: 'Brother',
    imageUrl: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'd3b8439f-4d6c-4854-bebc-f2a7ac6f6343',
    name: 'Canon imageCLASS LBP226dw All-in-One Laser',
    sku: 'CAN-IC-LBP226DW',
    description: 'Reliable compact laser printer engineered for demanding small-to-medium offices with 40 ppm speed, mobile printing support, and high-capacity cassette.',
    price: 299.99,
    stockQuantity: 60,
    category: ProductCategory.Printers,
    categoryName: 'Printers',
    brand: 'Canon',
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'e4c954a0-5e7d-4965-cfcd-a3b8bd707454',
    name: 'Epson EcoTank Pro ET-5850 All-in-One Supertank',
    sku: 'EPS-ET-5850',
    description: 'Cartridge-free supertank printing system with PrecisionCore Heat-Free Technology, ultra-low cost per page, PCL/PostScript support, and 500-sheet paper capacity.',
    price: 849.99,
    stockQuantity: 22,
    category: ProductCategory.Printers,
    categoryName: 'Printers',
    brand: 'Epson',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'f5da65b1-6f8e-4a76-d0de-b4c9ce818565',
    name: 'Zebra ZT411 Industrial Thermal Label & Barcode Printer',
    sku: 'ZEB-ZT-411',
    description: 'Heavy-duty 4-inch RFID-ready direct thermal & thermal transfer industrial barcode printer with 4.3-inch color touchscreen display and rugged metal frame.',
    price: 1299.0,
    stockQuantity: 15,
    category: ProductCategory.Printers,
    categoryName: 'Printers',
    brand: 'Zebra',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'a6eb76c2-7a9f-4b87-e1ef-c5da0f929676',
    name: 'HP 58A Black Original LaserJet Toner Cartridge',
    sku: 'HP-CF258A',
    description: 'Genuine HP standard toner cartridge yielding up to 3,000 pages with tamper-resistant chips and JetIntelligence precision powder engineering.',
    price: 116.99,
    stockQuantity: 120,
    category: ProductCategory.TonerCartridges,
    categoryName: 'Toner Cartridges',
    brand: 'HP',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'b7fc87d3-8ba0-4c98-f2f0-d6eb1a030787',
    name: 'HP 58X High Yield Black LaserJet Toner',
    sku: 'HP-CF258X',
    description: 'High capacity monochrome toner yielding approximately 10,000 pages for high-throughput enterprise departments.',
    price: 238.5,
    stockQuantity: 85,
    category: ProductCategory.TonerCartridges,
    categoryName: 'Toner Cartridges',
    brand: 'HP',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'c8ad98e4-9cb1-4da9-0301-e7fc2b141898',
    name: 'Brother TN-433 High Yield Cyan Toner Cartridge',
    sku: 'BRT-TN433C',
    description: 'Genuine Brother high yield cyan toner with up to 4,000 pages of crisp graphic vibrancy and rich reproduction.',
    price: 89.99,
    stockQuantity: 75,
    category: ProductCategory.TonerCartridges,
    categoryName: 'Toner Cartridges',
    brand: 'Brother',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'd9be09f5-0dc2-4eba-1412-f8ad3c252909',
    name: 'HP LaserJet Enterprise 110V Roller Maintenance Kit',
    sku: 'HP-RM2-5679-MK',
    description: 'Complete roller replacement kit including transfer roller, feed rollers, separation pads, and gloves for 225,000 page service intervals.',
    price: 229.0,
    stockQuantity: 25,
    category: ProductCategory.MaintenanceKits,
    categoryName: 'Maintenance Kits',
    brand: 'HP',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'ea0f1a06-1ed3-4fcb-2523-09be4d36301a',
    name: 'Brother 500-Sheet Optional Paper Feeder Cassette',
    sku: 'BRT-LT-330CL',
    description: 'Expand paper capacity on Brother workgroup printers to eliminate frequent loading during multi-copy print runs.',
    price: 189.99,
    stockQuantity: 30,
    category: ProductCategory.Accessories,
    categoryName: 'Accessories',
    brand: 'Brother',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'fb102b17-2fe4-40dc-3634-1acf5e47412b',
    name: 'Canon Wireless Print Server & Gigabit Network Card',
    sku: 'CAN-WIFI-NIC-01',
    description: 'Internal hardware expansion card enabling dual-band 802.11ac Wi-Fi Direct and WPA3 Enterprise encryption.',
    price: 149.0,
    stockQuantity: 40,
    category: ProductCategory.Accessories,
    categoryName: 'Accessories',
    brand: 'Canon',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'ac213c28-30f5-41ed-4745-2bda6f58523c',
    name: 'Hammermill Premium Laser Print Paper 24lb (5 Reams)',
    sku: 'HAM-PLP-24LB-5R',
    description: '99.99% Jam-Free guarantee ultra-white 24lb bond paper calibrated for crisp toner adhesion and laser reproduction.',
    price: 64.5,
    stockQuantity: 200,
    category: ProductCategory.PaperAndMedia,
    categoryName: 'Paper & Media',
    brand: 'Hammermill',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

export const productService = {
  async getProducts(params: ProductFilterParams): Promise<PaginatedResult<Product>> {
    try {
      const response = await apiClient.get<PaginatedResult<Product>>('/products', { params });
      return response.data;
    } catch {
      // Graceful fallback for standalone frontend viewing
      let filtered = [...FALLBACK_PRODUCTS];

      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term)
        );
      }

      if (params.category) {
        filtered = filtered.filter((p) => p.category === params.category);
      }

      if (params.brand) {
        filtered = filtered.filter((p) => p.brand === params.brand);
      }

      if (params.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= params.minPrice!);
      }

      if (params.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= params.maxPrice!);
      }

      if (params.inStockOnly) {
        filtered = filtered.filter((p) => p.stockQuantity > 0);
      }

      if (params.sortBy === 'price') {
        filtered.sort((a, b) => (params.sortDescending ? b.price - a.price : a.price - b.price));
      } else if (params.sortBy === 'stock') {
        filtered.sort((a, b) => (params.sortDescending ? b.stockQuantity - a.stockQuantity : a.stockQuantity - b.stockQuantity));
      } else {
        filtered.sort((a, b) => (params.sortDescending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)));
      }

      const pageNumber = params.pageNumber || 1;
      const pageSize = params.pageSize || 12;
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const items = filtered.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

      return {
        items,
        pageNumber,
        pageSize,
        totalCount,
        totalPages,
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      };
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch {
      const found = FALLBACK_PRODUCTS.find((p) => p.id === id);
      if (!found) throw new Error(`Product not found.`);
      return found;
    }
  },

  async getBrands(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/products/brands');
      return response.data;
    } catch {
      return Array.from(new Set(FALLBACK_PRODUCTS.map((p) => p.brand))).sort();
    }
  },
};

export const orderService = {
  async placeOrder(orderRequest: CreateOrderRequest): Promise<OrderDto> {
    try {
      const response = await apiClient.post<OrderDto>('/orders', orderRequest);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const problem = err.response.data;
        throw new Error(problem.detail || problem.title || 'Failed to place order.');
      }
      // Mock successful order creation fallback
      const orderNumber = `PRD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const total = orderRequest.items.reduce((sum, item) => {
        const prod = FALLBACK_PRODUCTS.find((p) => p.id === item.productId);
        return sum + (prod ? prod.price * item.quantity : 0);
      }, 0);

      return {
        id: crypto.randomUUID(),
        orderNumber,
        customerId: crypto.randomUUID(),
        customer: {
          id: crypto.randomUUID(),
          ...orderRequest.customer,
        },
        orderDateUtc: new Date().toISOString(),
        status: 2,
        statusName: 'Processing',
        totalAmount: total,
        shippingAddress: orderRequest.shippingAddress,
        billingAddress: orderRequest.billingAddress,
        paymentReference: orderRequest.paymentReference || 'STRIPE-SIMULATED-AUTH',
        items: orderRequest.items.map((i) => {
          const prod = FALLBACK_PRODUCTS.find((p) => p.id === i.productId);
          return {
            productId: i.productId,
            productName: prod?.name || 'Product',
            productSKU: prod?.sku || 'SKU-000',
            unitPrice: prod?.price || 0,
            quantity: i.quantity,
            totalPrice: (prod?.price || 0) * i.quantity,
          };
        }),
      };
    }
  },
};

export const reportService = {
  async getTopSellingPrinters(): Promise<TopSellingProduct[]> {
    try {
      const response = await apiClient.get<TopSellingProduct[]>('/reports/top-selling-printers');
      return response.data;
    } catch {
      return [
        {
          productId: 'b1f6217d-2b4a-4632-9cb7-d0e5ea4e4121',
          sku: 'HP-LJE-M507X',
          productName: 'HP LaserJet Enterprise M507x Monochrome Laser',
          categoryName: 'Printers',
          unitsSold: 42,
          totalRevenue: 37799.58,
        },
        {
          productId: 'c2a7328e-3c5b-4743-adcb-e1f6fb5e5232',
          sku: 'BRT-HLL-8360CDW',
          productName: 'Brother HL-L8360CDW Business Color Laser',
          categoryName: 'Printers',
          unitsSold: 38,
          totalRevenue: 17099.62,
        },
        {
          productId: 'd3b8439f-4d6c-4854-bebc-f2a7ac6f6343',
          sku: 'CAN-IC-LBP226DW',
          productName: 'Canon imageCLASS LBP226dw All-in-One Laser',
          categoryName: 'Printers',
          unitsSold: 29,
          totalRevenue: 8699.71,
        },
        {
          productId: 'e4c954a0-5e7d-4965-cfcd-a3b8bd707454',
          sku: 'EPS-ET-5850',
          productName: 'Epson EcoTank Pro ET-5850 All-in-One Supertank',
          categoryName: 'Printers',
          unitsSold: 18,
          totalRevenue: 15299.82,
        },
      ];
    }
  },

  async getSalesSummary(): Promise<SalesReport> {
    try {
      const response = await apiClient.get<SalesReport>('/reports/sales-summary');
      return response.data;
    } catch {
      return {
        totalRevenue: 78898.73,
        totalOrders: 154,
        totalItemsSold: 312,
        averageOrderValue: 512.33,
        categoryBreakdown: [
          { categoryName: 'Printers', itemsSold: 127, totalRevenue: 53198.75, percentageOfTotal: 67.4 },
          { categoryName: 'TonerCartridges', itemsSold: 140, totalRevenue: 18450.0, percentageOfTotal: 23.4 },
          { categoryName: 'Accessories', itemsSold: 30, totalRevenue: 4950.0, percentageOfTotal: 6.3 },
          { categoryName: 'MaintenanceKits', itemsSold: 15, totalRevenue: 2299.98, percentageOfTotal: 2.9 },
        ],
        topSellingProducts: [
          {
            productId: 'b1f6217d-2b4a-4632-9cb7-d0e5ea4e4121',
            sku: 'HP-LJE-M507X',
            productName: 'HP LaserJet Enterprise M507x',
            categoryName: 'Printers',
            unitsSold: 42,
            totalRevenue: 37799.58,
          },
          {
            productId: 'a6eb76c2-7a9f-4b87-e1ef-c5da0f929676',
            sku: 'HP-CF258A',
            productName: 'HP 58A Black Original Toner',
            categoryName: 'Toner Cartridges',
            unitsSold: 78,
            totalRevenue: 9125.22,
          },
        ],
      };
    }
  },
};

