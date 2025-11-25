import { useState, useEffect, useCallback } from 'react';
import { Product, PaginatedResult, ProductFilterParams } from '../types';
import { productService } from '../services/api';

export const useProducts = (initialParams: ProductFilterParams = {}) => {
  const [params, setParams] = useState<ProductFilterParams>({
    pageNumber: 1,
    pageSize: 8,
    sortBy: 'name',
    sortDescending: false,
    ...initialParams,
  });

  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(params);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    productService.getBrands().then(setBrands).catch(console.error);
  }, []);

  const updateFilters = (newParams: Partial<ProductFilterParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      pageNumber: newParams.pageNumber !== undefined ? newParams.pageNumber : 1, // reset page on filter change
    }));
  };

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, pageNumber: page }));
  };

  const resetFilters = () => {
    setParams({
      pageNumber: 1,
      pageSize: 8,
      sortBy: 'name',
      sortDescending: false,
    });
  };

  return {
    products: data?.items ?? [],
    pagination: data,
    brands,
    loading,
    error,
    params,
    updateFilters,
    setPage,
    resetFilters,
    refetch: fetchProducts,
  };
};

