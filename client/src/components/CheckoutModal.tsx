import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/api';
import { CreateOrderRequest, OrderDto } from '../types';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderDto | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'eleanor.vance@enterprise-corp.com',
    phoneNumber: '+1 (415) 555-0199',
    address: '100 Montgomery St, Suite 1800',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94104',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const orderPayload: CreateOrderRequest = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`,
        billingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`,
        paymentReference: `PAY-CORP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      };

      const result = await orderService.placeOrder(orderPayload);
      setCompletedOrder(result);
      clearCart();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected transaction error occurred during order placement.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      setCompletedOrder(null);
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      {completedOrder ? (
        // Order Confirmation Screen
        <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: '#16a34a', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
            Thank you for ordering with Printodome Enterprise.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              textAlign: 'left',
              my: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  ORDER REFERENCE NUMBER
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f3460' }}>
                  {completedOrder.orderNumber}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  TOTAL CHARGED (AUDITED)
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16a34a' }}>
                  ${completedOrder.totalAmount.toFixed(2)} USD
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  SHIPPING DESTINATION
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {completedOrder.shippingAddress}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Button
            variant="contained"
            size="large"
            onClick={handleModalClose}
            sx={{
              backgroundColor: '#0f3460',
              px: 4,
              py: 1.2,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#1a4f8a' },
            }}
          >
            Return to Storefront
          </Button>
        </Box>
      ) : (
        // Checkout Form
        <form onSubmit={handlePlaceOrder}>
          <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ color: '#0f3460' }} />
            Secure Enterprise Checkout
          </DialogTitle>

          <DialogContent dividers>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f3460', mb: 2 }}>
                  1. Corporate Buyer & Delivery Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      type="email"
                      label="Corporate Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Phone"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Street Address / Suite"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="State / Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    p: 1.5,
                    backgroundColor: '#f1f5f9',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <ShippingIcon sx={{ color: '#0f3460' }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                      Carrier-Audited Freight Dispatch
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Dispatched from Printodome fulfillment center with tracking confirmation.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Order Summary Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    p: 2.5,
                    backgroundColor: '#f8fafc',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f3460', mb: 1 }}>
                    2. Order Summary ({items.length} items)
                  </Typography>

                  <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {items.map(({ product, quantity }) => (
                      <ListItem key={product.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                          }
                          secondary={`Qty: ${quantity} × $${product.price.toFixed(2)}`}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ${(product.price * quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ${totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Estimated Tax
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      $0.00 (Exempt)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Freight Shipping
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 700 }}>
                      FREE
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Total Due
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f3460' }}>
                      ${totalPrice.toFixed(2)} USD
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, px: 3 }}>
            <Button onClick={handleModalClose} disabled={loading} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || items.length === 0}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ReceiptIcon />}
              sx={{
                backgroundColor: '#0f3460',
                px: 3.5,
                fontWeight: 700,
                '&:hover': { backgroundColor: '#1a4f8a' },
              }}
            >
              {loading ? 'Committing Transaction...' : `Authorize & Place Order ($${totalPrice.toFixed(2)})`}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};
