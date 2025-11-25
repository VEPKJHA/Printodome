import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Skeleton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { Product, PaginatedResult, ProductFilterParams } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  pagination: PaginatedResult<Product> | null;
  loading: boolean;
  params: ProductFilterParams;
  onFilterChange: (newParams: Partial<ProductFilterParams>) => void;
  onPageChange: (page: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  pagination,
  loading,
  params,
  onFilterChange,
  onPageChange,
  onSelectProduct,
}) => {
  const handleSortChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    if (val === 'price_asc') {
      onFilterChange({ sortBy: 'price', sortDescending: false });
    } else if (val === 'price_desc') {
      onFilterChange({ sortBy: 'price', sortDescending: true });
    } else if (val === 'stock_desc') {
      onFilterChange({ sortBy: 'stock', sortDescending: true });
    } else {
      onFilterChange({ sortBy: 'name', sortDescending: false });
    }
  };

  const currentSortKey = params.sortBy === 'price'
    ? params.sortDescending ? 'price_desc' : 'price_asc'
    : params.sortBy === 'stock'
    ? 'stock_desc'
    : 'name_asc';

  return (
    <Box sx={{ width: '100%' }}>
      {/* Grid Subheader (Result count & Sorting) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
          {loading ? (
            'Searching inventory...'
          ) : (
            `Showing ${products.length} of ${pagination?.totalCount ?? 0} enterprise items`
          )}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="sort-label">Sort Products</InputLabel>
          <Select
            labelId="sort-label"
            value={currentSortKey}
            label="Sort Products"
            onChange={handleSortChange}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="name_asc">Alphabetical (A - Z)</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="stock_desc">Highest Stock First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid Content */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Box sx={{ p: 1, border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1.5 }} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="90%" height={32} />
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="rectangular" height={38} sx={{ borderRadius: 2, mt: 2 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px dashed #cbd5e1',
          }}
        >
          <Typography variant="h6" sx={{ color: '#334155', fontWeight: 700, mb: 1 }}>
            No Matching Equipment Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450, mx: 'auto' }}>
            We could not find items matching your search criteria. Try relaxing your price filters or
            verifying the cartridge SKU.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} onSelect={onSelectProduct} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.pageNumber}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};
