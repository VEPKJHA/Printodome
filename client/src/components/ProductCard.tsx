import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  CheckCircleOutlined as CheckCircleIcon,
  WarningAmber as WarningIcon,
  HighlightOff as OutOfStockIcon,
} from '@mui/icons-material';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 25;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(product)}
    >
      {/* Brand & Stock Status Header */}
      <Box
        sx={{
          position: 'relative',
          height: 190,
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt={product.name}
          sx={{
            maxHeight: 180,
            maxWidth: '90%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          loading="lazy"
        />

        {/* Stock Badge */}
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          {isOutOfStock ? (
            <Chip
              icon={<OutOfStockIcon sx={{ fontSize: '14px !important' }} />}
              label="Out of Stock"
              size="small"
              color="error"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          ) : isLowStock ? (
            <Chip
              icon={<WarningIcon sx={{ fontSize: '14px !important' }} />}
              label={`${product.stockQuantity} left`}
              size="small"
              color="warning"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          ) : (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
              label="In Stock"
              size="small"
              color="success"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          )}
        </Box>

        {/* Brand Tag */}
        <Chip
          label={product.brand}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            fontSize: '0.68rem',
            height: 22,
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, p: 2, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '0.04em',
            display: 'block',
            mb: 0.5,
          }}
        >
          SKU: {product.sku}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: '0.96rem',
            lineHeight: 1.35,
            color: '#0f172a',
            height: 42,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            height: 38,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>

        {/* Pricing */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3460' }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            USD / unit
          </Typography>
        </Box>
      </CardContent>

      {/* Action Footer */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isOutOfStock}
          startIcon={<AddShoppingCartIcon />}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          sx={{
            backgroundColor: '#0f3460',
            py: 1,
            '&:hover': { backgroundColor: '#1a4f8a' },
          }}
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};
