import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Paper,
  Link,
} from '@mui/material';
import { theme } from './theme';
import { CartProvider } from './context/CartContext';
import { useProducts } from './hooks/useProducts';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AnalyticsDashboardModal } from './components/AnalyticsDashboardModal';

function StorefrontContent() {
  const {
    products,
    pagination,
    brands,
    loading,
    params,
    updateFilters,
    setPage,
    resetFilters,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Navigation */}
      <Navbar
        onSearch={(term) => updateFilters({ searchTerm: term })}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Main Catalog Workspace */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {/* Hero Title & Filter Active Tags */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Commercial Printers & High-Yield Supplies
            </Typography>
            <Chip
              label="B2B Verified Inventory"
              size="small"
              color="primary"
              sx={{ fontWeight: 700, backgroundColor: '#0f3460' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Enterprise catalog for monochrome workgroup laser printers, supertank plotters, and OEM replacement toners.
          </Typography>
        </Box>

        {/* 2-Column Responsive Layout */}
        <Grid container spacing={4}>
          {/* Left Column: Filter Sidebar */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
            <FilterSidebar
              params={params}
              brands={brands}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </Grid>

          {/* Right Column: Product Cards Grid */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
            <ProductGrid
              products={products}
              pagination={pagination}
              loading={loading}
              params={params}
              onFilterChange={updateFilters}
              onPageChange={setPage}
              onSelectProduct={handleSelectProduct}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Paper
        elevation={0}
        component="footer"
        sx={{
          mt: 'auto',
          py: 5,
          backgroundColor: '#0a192f',
          color: '#94a3b8',
          borderTop: '1px solid #1e293b',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Brand & About */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800, mb: 1.5, letterSpacing: '0.04em' }}>
                PRINTODOME
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 360, lineHeight: 1.7, color: '#94a3b8', mb: 2 }}>
                Printodome is a premier commercial printing supplier delivering OEM-certified office laser printers,
                enterprise high-yield toners, wide-format plotters, and maintenance equipment with guaranteed next-day logistics.
              </Typography>
              <Typography variant="caption" sx={{ color: '#00d2d3', fontWeight: 600, display: 'block' }}>
                Authorized Partner: HP • Brother • Canon • Epson • Zebra
              </Typography>
            </Grid>

            {/* Column 2: Equipment & Supplies */}
            <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, letterSpacing: '0.02em' }}>
                Equipment & Supplies
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Workgroup Laser Printers</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>High-Yield Toner Cartridges</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>OEM Maintenance Kits</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Heavy-Duty Barcode Printers</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Laser Paper & Media</Typography>
            </Grid>

            {/* Column 3: Corporate Services */}
            <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, letterSpacing: '0.02em' }}>
                Corporate Services
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Managed Print Services (MPS)</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Volume Procurement & Net 30</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Scheduled Toner Auto-Ship</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Toner Recycling & Take-Back</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>Expedited Freight Logistics</Typography>
            </Grid>

            {/* Column 4: Customer Care & Warranty */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, letterSpacing: '0.02em' }}>
                Customer Care & SLA
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Order Tracking & Freight Dispatch
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                3-Year Enterprise Hardware Warranty
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Direct Returns & OEM Exchange Policy
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#38bdf8' }}>
                Dedicated Support: corporate@printodome.com
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Toll-Free Dispatch: +1 (800) 555-PRNT (7768)
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              © {new Date().getFullYear()} Printodome Inc. All rights reserved. Recognized OEM commercial printing supplier.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#94a3b8' } }}>Privacy Notice</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#94a3b8' } }}>Terms of Supply</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#94a3b8' } }}>ISO 9001 Compliance</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#94a3b8' } }}>Security Statement</Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AnalyticsDashboardModal
        open={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <StorefrontContent />
      </CartProvider>
    </ThemeProvider>
  );
}
