import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import type { Theme } from '@mui/material';

/**
 * Custom hook to access modern theme colors easily
 * Usage: const colors = useThemeColors();
 */
export const useThemeColors = () => {
  const theme = useTheme();
  
  return {
    // Modern Case Types with gradients
    retailCashless: {
      main: '#FF6B9D',
      light: '#FFB3D9',
      dark: '#C91C65',
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
    },
    groupCashless: {
      main: '#9C6DD9',
      light: '#C9A6E8',
      dark: '#6842A6',
      gradient: 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
    },
    retailReimbursement: {
      main: '#FFA726',
      light: '#FFD180',
      dark: '#F57C00',
      gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
    },
    groupReimbursement: {
      main: '#26C281',
      light: '#81E9C1',
      dark: '#1E8E65',
      gradient: 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
    },
    
    // Dashboard Status
    freshCase: '#FF4757',
    underQC: '#FF6348',
    onField: '#26C281',
    completed: '#7F56D9',
    
    // Standard palette
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    
    // Background
    background: theme.palette.background.default,
    paper: theme.palette.background.paper,
    
    // Text
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
  };
};

/**
 * Get modern gradient by case type
 */
export const getCaseTypeGradient = (caseType: string): string => {
  const gradientMap: Record<string, string> = {
    'retailCashless': 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
    'groupCashless': 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
    'retailReimbursement': 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
    'groupReimbursement': 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
  };
  
  return gradientMap[caseType] || 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';
};

/**
 * Get color by case type
 */
export const getCaseTypeColor = (theme: Theme, caseType: string): string => {
  const colorMap: Record<string, string> = {
    'retailCashless': '#FF6B9D',
    'groupCashless': '#9C6DD9',
    'retailReimbursement': '#FFA726',
    'groupReimbursement': '#26C281',
  };
  
  return colorMap[caseType] || theme.palette.primary.main;
};

/**
 * Get modern color by status
 */
export const getStatusColor = (theme: Theme, status: string): string => {
  const colorMap: Record<string, string> = {
    'fresh': '#FF4757',
    'qc': '#FF6348',
    'field': '#26C281',
    'completed': '#7F56D9',
    'new': '#3B82F6',
    'active': '#F59E0B',
    'denied': '#EF4444',
    'approved': '#10B981',
    'pending': '#F59E0B',
    'inProgress': '#06B6D4',
  };
  
  return colorMap[status.toLowerCase()] || theme.palette.text.secondary;
};

/**
 * Get modern status chip props with gradient
 */
export const getStatusChipProps = (theme: Theme, status: string) => {
  const color = getStatusColor(theme, status);
  
  return {
    sx: {
      background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
      color: 'white',
      fontWeight: 700,
      borderRadius: 2,
      px: 1.5,
      boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
    }
  };
};

/**
 * Modern glassmorphism card effect
 */
export const glassmorphismCard = (theme: Theme) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: 4,
});

/**
 * Modern card hover effect with lift
 */
export const modernCardHover = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
  },
  '&:active': {
    transform: 'translateY(-4px)',
  },
};

/**
 * Gradient text effect
 */
export const gradientText = (gradient: string) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
});

/**
 * Modern link style with gradient hover
 */
export const modernLinkStyle = (theme: Theme) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  position: 'relative' as const,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    '&::after': {
      width: '100%',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute' as const,
    bottom: -2,
    left: 0,
    width: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 100%)',
    transition: 'width 0.3s ease',
  },
});

/**
 * Modern button styles with gradients
 */
export const modernButtonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    color: 'white',
    px: 4,
    py: 1.5,
    fontWeight: 700,
    borderRadius: 3,
    textTransform: 'none' as const,
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
    },
  },
  secondary: {
    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    color: 'white',
    px: 3,
    py: 1.25,
    fontWeight: 600,
    borderRadius: 3,
    textTransform: 'none' as const,
    boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 28px rgba(6, 182, 212, 0.5)',
    },
  },
  outlined: {
    borderWidth: '2px',
    borderColor: 'primary.main',
    color: 'primary.main',
    px: 3,
    py: 1,
    fontWeight: 600,
    borderRadius: 3,
    textTransform: 'none' as const,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderWidth: '2px',
      background: alpha('#667EEA', 0.1),
      transform: 'translateY(-2px)',
    },
  },
};

/**
 * Get gradient background with overlay
 */
export const getGradientBackground = (color1: string, color2: string, angle = 135) => ({
  background: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`,
  position: 'relative' as const,
  overflow: 'hidden' as const,
  '&::before': {
    content: '""',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none' as const,
  },
});

/**
 * Modern scrollbar styles
 */
export const modernScrollbar = (theme: Theme) => ({
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha(theme.palette.grey[200], 0.5),
    borderRadius: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
  },
});

/**
 * Animated gradient border
 */
export const animatedGradientBorder = (theme: Theme) => ({
  position: 'relative' as const,
  '&::before': {
    content: '""',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    padding: '2px',
    background: 'linear-gradient(135deg, #667EEA, #764BA2, #F093FB, #4FACFE)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    animation: 'gradient 3s ease infinite',
    backgroundSize: '300% 300%',
  },
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
});

/**
 * Shimmer loading effect
 */
export const shimmerEffect = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
};

/**
 * Floating animation
 */
export const floatingAnimation = {
  animation: 'floating 3s ease-in-out infinite',
  '@keyframes floating': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
};

/**
 * Pulse animation for notifications
 */
export const pulseAnimation = (color: string) => ({
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      boxShadow: `0 0 0 0 ${alpha(color, 0.7)}`,
    },
    '50%': {
      boxShadow: `0 0 0 10px ${alpha(color, 0)}`,
    },
  },
});

/**
 * Responsive font sizes for modern design
 */
export const responsiveFontSize = {
  xs: '0.8125rem',  // 13px
  sm: '0.9375rem',  // 15px
  md: '1.0625rem',  // 17px
  lg: '1.25rem',    // 20px
  xl: '1.5rem',     // 24px
  xxl: '2rem',      // 32px
  xxxl: '3rem',     // 48px
};

/**
 * Modern spacing values
 */
export const spacing = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
  xxxl: 8,
};