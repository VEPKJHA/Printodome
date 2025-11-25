import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Print as PrintIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { useReports } from '../hooks/useReports';

interface AnalyticsDashboardModalProps {
  open: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({ open, onClose }) => {
  const { report, topPrinters, loading, error } = useReports();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrendingUpIcon sx={{ color: '#00b4d8', fontSize: 30 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Enterprise Sales & Equipment Demand Insights
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Real-time fulfillment metrics, top-performing equipment lines, and category procurement trends
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* KPI Summary Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#16a34a' }}>
                    <MoneyIcon fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                      TOTAL REVENUE
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    ${report?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Aggregated across all completed orders
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#0284c7' }}>
                    <CartIcon fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                      TOTAL ORDERS
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {report?.totalOrders}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Active & fulfilled purchase requests
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#9333ea' }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                      AVERAGE ORDER VALUE
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    ${report?.averageOrderValue.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Average corporate cart spend
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#ea580c' }}>
                    <PrintIcon fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                      UNITS DISPATCHED
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {report?.totalItemsSold}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Printers, toners & accessory units
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Top Selling Printers Table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f3460', mb: 1.5 }}>
              Top-Selling Commercial Printers & Plotters
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: '1px solid #e2e8f0', borderRadius: 3, mb: 4 }}
            >
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Model / Equipment Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Units Sold
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Gross Revenue (USD)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPrinters.map((item, index) => (
                    <TableRow key={item.productId} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              backgroundColor: index === 0 ? '#fef08a' : '#e2e8f0',
                            }}
                          />
                          {item.productName}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{item.sku}</TableCell>
                      <TableCell>
                        <Chip label={item.categoryName} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#0f3460' }}>
                        {item.unitsSold} units
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#16a34a' }}>
                        ${item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Category Performance Breakdown */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f3460', mb: 1.5 }}>
              Revenue Contribution by Product Line
            </Typography>

            <Grid container spacing={2}>
              {report?.categoryBreakdown.map((cat) => (
                <Grid size={{ xs: 12, sm: 6 }} key={cat.categoryName}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {cat.categoryName}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f3460' }}>
                        ${cat.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} (
                        {cat.percentageOfTotal}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, cat.percentageOfTotal)}
                      sx={{ height: 8, borderRadius: 4, backgroundColor: '#e2e8f0' }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                      {cat.itemsSold} items sold in category
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Corporate Telemetry Note */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <VerifiedUserIcon sx={{ color: '#0f3460', mt: 0.3 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f3460', display: 'block' }}>
                  Audited Fulfillment & Volume Discount Program
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Telemetry reflects active corporate contract fulfillment. For bulk workgroup deployments exceeding 25 units, contact corporate sales for custom contract pricing.
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
