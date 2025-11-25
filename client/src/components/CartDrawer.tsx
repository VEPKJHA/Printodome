import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  ButtonGroup,
} from '@mui/material';
import {
  Close as CloseIcon,
  DeleteOutlined as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  onProceedToCheckout,
}) => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItemsCount } =
    useCart();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 440 }, p: 3, display: 'flex', flexDirection: 'column' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingBagIcon sx={{ color: '#0f3460' }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Enterprise Cart ({totalItemsCount})
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Cart Items List */}
      {items.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 60, mb: 2, color: '#cbd5e1' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, maxWidth: 280 }}>
            Browse our catalog to add enterprise printers, high-yield toner cartridges, and supplies.
          </Typography>
        </Box>
      ) : (
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {items.map(({ product, quantity }) => (
            <ListItem
              key={product.id}
              alignItems="flex-start"
              sx={{
                px: 0,
                py: 2,
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Avatar
                variant="rounded"
                src={product.imageUrl}
                alt={product.name}
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  p: 0.5,
                }}
              />

              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {product.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      SKU: {product.sku}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <ButtonGroup size="small" variant="outlined">
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            px: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {quantity}
                        </Box>
                        <IconButton
                          size="small"
                          disabled={quantity >= product.stockQuantity}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </ButtonGroup>

                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f3460' }}>
                        ${(product.price * quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                }
              />

              <IconButton
                edge="end"
                size="small"
                onClick={() => removeFromCart(product.id)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Cart Footer */}
      {items.length > 0 && (
        <Box sx={{ pt: 2, borderTop: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Subtotal
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Tax & expedited freight calculated at checkout
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#16a34a', fontWeight: 700, cursor: 'pointer' }}
              onClick={clearCart}
            >
              Clear Cart
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              onClose();
              onProceedToCheckout();
            }}
            sx={{
              backgroundColor: '#0f3460',
              py: 1.5,
              fontWeight: 800,
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#1a4f8a' },
            }}
          >
            Checkout (${totalPrice.toFixed(2)})
          </Button>
        </Box>
      )}
    </Drawer>
  );
};
