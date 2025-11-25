import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  RadioGroup,
  Radio,
  FormControl,
} from '@mui/material';
import {
  Print as PrintIcon,
  ColorLens as ColorLensIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { ProductCategory, ProductFilterParams } from '../types';

interface FilterSidebarProps {
  params: ProductFilterParams;
  brands: string[];
  onFilterChange: (newParams: Partial<ProductFilterParams>) => void;
  onReset: () => void;
}

const CATEGORY_ITEMS: { label: string; value: ProductCategory; icon: React.ReactElement }[] = [
  { label: 'All Equipment', value: undefined as unknown as ProductCategory, icon: <InventoryIcon fontSize="small" /> },
  { label: 'Printers & Plotters', value: ProductCategory.Printers, icon: <PrintIcon fontSize="small" /> },
  { label: 'Toner Cartridges', value: ProductCategory.TonerCartridges, icon: <ColorLensIcon fontSize="small" /> },
  { label: 'Maintenance Kits', value: ProductCategory.MaintenanceKits, icon: <BuildIcon fontSize="small" /> },
  { label: 'Accessories', value: ProductCategory.Accessories, icon: <BuildIcon fontSize="small" /> },
  { label: 'Paper & Media', value: ProductCategory.PaperAndMedia, icon: <DescriptionIcon fontSize="small" /> },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  params,
  brands,
  onFilterChange,
  onReset,
}) => {
  const currentCategory = params.category;
  const minPrice = params.minPrice ?? 0;
  const maxPrice = params.maxPrice ?? 1500;

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFilterChange({
        minPrice: newValue[0],
        maxPrice: newValue[1],
      });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 90,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: '#0f3460' }} />
          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Catalog Filters
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<RestartAltIcon fontSize="small" />}
          onClick={onReset}
          sx={{ color: '#64748b', fontSize: '0.78rem' }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Category List */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
        Categories
      </Typography>
      <List dense sx={{ mb: 2 }}>
        {CATEGORY_ITEMS.map((cat, idx) => {
          const isSelected = (!cat.value && !currentCategory) || currentCategory === cat.value;
          return (
            <ListItemButton
              key={idx}
              selected={isSelected}
              onClick={() => onFilterChange({ category: cat.value })}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(15, 52, 96, 0.08)',
                  color: '#0f3460',
                  fontWeight: 700,
                  '& .MuiListItemIcon-root': { color: '#0f3460' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: '#64748b' }}>{cat.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500 }}>
                    {cat.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mb: 2.5 }} />

      {/* Price Slider */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
        Price Range ($)
      </Typography>
      <Box sx={{ px: 1.5, mb: 2 }}>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1500}
          step={25}
          sx={{ color: '#0f3460' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            ${minPrice}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            ${maxPrice}+
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Brand Selection */}
      {brands.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
            Manufacturer Brand
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              value={params.brand || ''}
              onChange={(e) => onFilterChange({ brand: e.target.value || undefined })}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '0.85rem' }}>All Brands</Typography>}
              />
              {brands.map((b) => (
                <FormControlLabel
                  key={b}
                  value={b}
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>{b}</Typography>}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider sx={{ mb: 2.5 }} />
        </>
      )}

      {/* Stock Availability */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
        Inventory Availability
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={!!params.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
          />
        }
        label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>In-Stock Units Only</Typography>}
      />
    </Paper>
  );
};
