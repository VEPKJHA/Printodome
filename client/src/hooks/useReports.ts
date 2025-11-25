import { useState, useEffect } from 'react';
import { SalesReport, TopSellingProduct } from '../types';
import { reportService } from '../services/api';

export const useReports = () => {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [topPrinters, setTopPrinters] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [salesData, printersData] = await Promise.all([
        reportService.getSalesSummary(),
        reportService.getTopSellingPrinters(),
      ]);
      setReport(salesData);
      setTopPrinters(printersData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    report,
    topPrinters,
    loading,
    error,
    refetch: fetchReports,
  };
};

