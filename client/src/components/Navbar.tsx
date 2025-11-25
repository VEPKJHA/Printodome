import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Box,
  Button,
  Container,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Print as PrintIcon,
  BarChart as BarChartIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';

interface NavbarProps {
  onSearch: (term: string) => void;
  onOpenCart: () => void;
  onOpenAnalytics: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenCart, onOpenAnalytics }) => {
  const { totalItemsCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#0f3460' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70, gap: 2 }}>
          {/* Logo & Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}>
            <PrintIcon sx={{ fontSize: 34, mr: 1, color: '#00d2d3' }} />
            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                PRINTODOME
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  mt: -0.5,
                }}
              >
                Enterprise Print & Supplies
              </Typography>
            </Box>
          </Box>

          {/* Search Box */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              maxWidth: 580,
              borderRadius: 3,
              backgroundColor: '#ffffff',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
              placeholder="Search printers, toner SKUs (e.g. HP-CF258A), maintenance kits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <IconButton size="small" onClick={handleClear} sx={{ p: 0.5 }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton type="submit" sx={{ p: '8px', color: '#0f3460' }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* Navigation Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
            <Tooltip title="View Executive Sales & Equipment Insights">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<BarChartIcon sx={{ color: '#00d2d3' }} />}
                onClick={onOpenAnalytics}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Analytics
              </Button>
            </Tooltip>

            <Tooltip title="View Shopping Cart">
              <IconButton
                color="inherit"
                onClick={onOpenCart}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <Badge badgeContent={totalItemsCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

