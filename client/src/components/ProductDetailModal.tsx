import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  AddShoppingCart as AddShoppingCartIcon,
  VerifiedUser as VerifiedUserIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  open,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setQty(1);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1, backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Image Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 340,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Box
                  component="img"
                  src={product.imageUrl}
                  alt={product.name}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>

            {/* Info Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <Chip label={product.brand} size="small" color="primary" sx={{ fontWeight: 700 }} />
                <Chip label={`SKU: ${product.sku}`} size="small" variant="outlined" />
                <Chip
                  label={product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  size="small"
                  color={product.stockQuantity > 0 ? 'success' : 'error'}
                />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                {product.name}
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3460', mb: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 3 }}>
                {product.description}
              </Typography>

              {/* Inventory Guarantee Notice */}
              <Alert
                icon={<VerifiedUserIcon fontSize="inherit" />}
                severity="info"
                sx={{ mb: 3, fontSize: '0.8rem', borderRadius: 2 }}
              >
                <strong>Guaranteed Stock Allocation:</strong> Units are reserved in real time upon order checkout with certified OEM authenticity and 3-year warranty protection.
              </Alert>

              {/* Quantity selector and Cart button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    p: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    disabled={qty <= 1 || isOutOfStock}
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700 }}>{qty}</Typography>
                  <IconButton
                    size="small"
                    disabled={qty >= product.stockQuantity || isOutOfStock}
                    onClick={() => setQty((prev) => Math.min(product.stockQuantity, prev + 1))}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={isOutOfStock}
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{
                    py: 1.2,
                    backgroundColor: '#0f3460',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#1a4f8a' },
                  }}
                >
                  {isOutOfStock ? 'Sold Out' : `Add ${qty} to Order ($${(product.price * qty).toFixed(2)})`}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 3, color: '#64748b' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ShippingIcon fontSize="small" />
                  <Typography variant="caption">Next-Day Logistics Delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon fontSize="small" color="success" />
                  <Typography variant="caption">Genuine OEM Certified</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
