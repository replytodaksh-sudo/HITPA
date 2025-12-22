// import { useTheme } from '@mui/material/styles';
// import { alpha } from '@mui/material';
// import type { Theme } from '@mui/material';

// /**
//  * Custom hook to access modern theme colors easily
//  * Usage: const colors = useThemeColors();
//  */
// export const useThemeColors = () => {
//   const theme = useTheme();
  
//   return {
//     // Modern Case Types with gradients
//     retailCashless: {
//       main: '#FF6B9D',
//       light: '#FFB3D9',
//       dark: '#C91C65',
//       gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
//     },
//     groupCashless: {
//       main: '#9C6DD9',
//       light: '#C9A6E8',
//       dark: '#6842A6',
//       gradient: 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
//     },
//     retailReimbursement: {
//       main: '#FFA726',
//       light: '#FFD180',
//       dark: '#F57C00',
//       gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
//     },
//     groupReimbursement: {
//       main: '#26C281',
//       light: '#81E9C1',
//       dark: '#1E8E65',
//       gradient: 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
//     },
    
//     // Dashboard Status
//     freshCase: '#FF4757',
//     underQC: '#FF6348',
//     onField: '#26C281',
//     completed: '#7F56D9',
    
//     // Standard palette
//     primary: theme.palette.primary.main,
//     secondary: theme.palette.secondary.main,
//     success: theme.palette.success.main,
//     warning: theme.palette.warning.main,
//     error: theme.palette.error.main,
//     info: theme.palette.info.main,
    
//     // Background
//     background: theme.palette.background.default,
//     paper: theme.palette.background.paper,
    
//     // Text
//     textPrimary: theme.palette.text.primary,
//     textSecondary: theme.palette.text.secondary,
//   };
// };

// /**
//  * Get modern gradient by case type
//  */
// export const getCaseTypeGradient = (caseType: string): string => {
//   const gradientMap: Record<string, string> = {
//     'retailCashless': 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
//     'groupCashless': 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
//     'retailReimbursement': 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
//     'groupReimbursement': 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
//   };
  
//   return gradientMap[caseType] || 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';
// };

// /**
//  * Get color by case type
//  */
// export const getCaseTypeColor = (theme: Theme, caseType: string): string => {
//   const colorMap: Record<string, string> = {
//     'retailCashless': '#FF6B9D',
//     'groupCashless': '#9C6DD9',
//     'retailReimbursement': '#FFA726',
//     'groupReimbursement': '#26C281',
//   };
  
//   return colorMap[caseType] || theme.palette.primary.main;
// };

// /**
//  * Get modern color by status
//  */
// export const getStatusColor = (theme: Theme, status: string): string => {
//   const colorMap: Record<string, string> = {
//     'fresh': '#FF4757',
//     'qc': '#FF6348',
//     'field': '#26C281',
//     'completed': '#7F56D9',
//     'new': '#3B82F6',
//     'active': '#F59E0B',
//     'denied': '#EF4444',
//     'approved': '#10B981',
//     'pending': '#F59E0B',
//     'inProgress': '#06B6D4',
//   };
  
//   return colorMap[status.toLowerCase()] || theme.palette.text.secondary;
// };

// /**
//  * Get modern status chip props with gradient
//  */
// export const getStatusChipProps = (theme: Theme, status: string) => {
//   const color = getStatusColor(theme, status);
  
//   return {
//     sx: {
//       background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
//       color: 'white',
//       fontWeight: 700,
//       borderRadius: 2,
//       px: 1.5,
//       boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
//     }
//   };
// };

// /**
//  * Modern glassmorphism card effect
//  */
// export const glassmorphismCard = (theme: Theme) => ({
//   background: alpha(theme.palette.background.paper, 0.8),
//   backdropFilter: 'blur(20px)',
//   border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//   borderRadius: 4,
// });

// /**
//  * Modern card hover effect with lift
//  */
// export const modernCardHover = {
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   cursor: 'pointer',
//   '&:hover': {
//     transform: 'translateY(-8px)',
//     boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
//   },
//   '&:active': {
//     transform: 'translateY(-4px)',
//   },
// };

// /**
//  * Gradient text effect
//  */
// export const gradientText = (gradient: string) => ({
//   background: gradient,
//   WebkitBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
//   backgroundClip: 'text',
//   fontWeight: 800,
// });

// /**
//  * Modern link style with gradient hover
//  */
// export const modernLinkStyle = (theme: Theme) => ({
//   color: theme.palette.secondary.main,
//   textDecoration: 'none',
//   fontWeight: 600,
//   cursor: 'pointer',
//   position: 'relative' as const,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     color: theme.palette.primary.main,
//     '&::after': {
//       width: '100%',
//     },
//   },
//   '&::after': {
//     content: '""',
//     position: 'absolute' as const,
//     bottom: -2,
//     left: 0,
//     width: 0,
//     height: '2px',
//     background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 100%)',
//     transition: 'width 0.3s ease',
//   },
// });

// /**
//  * Modern button styles with gradients
//  */
// export const modernButtonStyles = {
//   primary: {
//     background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//     color: 'white',
//     px: 4,
//     py: 1.5,
//     fontWeight: 700,
//     borderRadius: 3,
//     textTransform: 'none' as const,
//     boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-2px)',
//       boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
//     },
//   },
//   secondary: {
//     background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
//     color: 'white',
//     px: 3,
//     py: 1.25,
//     fontWeight: 600,
//     borderRadius: 3,
//     textTransform: 'none' as const,
//     boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-2px)',
//       boxShadow: '0 10px 28px rgba(6, 182, 212, 0.5)',
//     },
//   },
//   outlined: {
//     borderWidth: '2px',
//     borderColor: 'primary.main',
//     color: 'primary.main',
//     px: 3,
//     py: 1,
//     fontWeight: 600,
//     borderRadius: 3,
//     textTransform: 'none' as const,
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       borderWidth: '2px',
//       background: alpha('#667EEA', 0.1),
//       transform: 'translateY(-2px)',
//     },
//   },
// };

// /**
//  * Get gradient background with overlay
//  */
// export const getGradientBackground = (color1: string, color2: string, angle = 135) => ({
//   background: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`,
//   position: 'relative' as const,
//   overflow: 'hidden' as const,
//   '&::before': {
//     content: '""',
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
//     pointerEvents: 'none' as const,
//   },
// });

// /**
//  * Modern scrollbar styles
//  */
// export const modernScrollbar = (theme: Theme) => ({
//   '&::-webkit-scrollbar': {
//     width: '8px',
//     height: '8px',
//   },
//   '&::-webkit-scrollbar-track': {
//     background: alpha(theme.palette.grey[200], 0.5),
//     borderRadius: '8px',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//     borderRadius: '8px',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
//     },
//   },
// });

// /**
//  * Animated gradient border
//  */
// export const animatedGradientBorder = (theme: Theme) => ({
//   position: 'relative' as const,
//   '&::before': {
//     content: '""',
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: 'inherit',
//     padding: '2px',
//     background: 'linear-gradient(135deg, #667EEA, #764BA2, #F093FB, #4FACFE)',
//     WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
//     WebkitMaskComposite: 'xor',
//     maskComposite: 'exclude',
//     animation: 'gradient 3s ease infinite',
//     backgroundSize: '300% 300%',
//   },
//   '@keyframes gradient': {
//     '0%': {
//       backgroundPosition: '0% 50%',
//     },
//     '50%': {
//       backgroundPosition: '100% 50%',
//     },
//     '100%': {
//       backgroundPosition: '0% 50%',
//     },
//   },
// });

// /**
//  * Shimmer loading effect
//  */
// export const shimmerEffect = {
//   background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
//   backgroundSize: '200% 100%',
//   animation: 'shimmer 1.5s infinite',
//   '@keyframes shimmer': {
//     '0%': {
//       backgroundPosition: '-200% 0',
//     },
//     '100%': {
//       backgroundPosition: '200% 0',
//     },
//   },
// };

// /**
//  * Floating animation
//  */
// export const floatingAnimation = {
//   animation: 'floating 3s ease-in-out infinite',
//   '@keyframes floating': {
//     '0%, 100%': {
//       transform: 'translateY(0px)',
//     },
//     '50%': {
//       transform: 'translateY(-10px)',
//     },
//   },
// };

// /**
//  * Pulse animation for notifications
//  */
// export const pulseAnimation = (color: string) => ({
//   animation: 'pulse 2s infinite',
//   '@keyframes pulse': {
//     '0%, 100%': {
//       boxShadow: `0 0 0 0 ${alpha(color, 0.7)}`,
//     },
//     '50%': {
//       boxShadow: `0 0 0 10px ${alpha(color, 0)}`,
//     },
//   },
// });

// /**
//  * Responsive font sizes for modern design
//  */
// export const responsiveFontSize = {
//   xs: '0.8125rem',  // 13px
//   sm: '0.9375rem',  // 15px
//   md: '1.0625rem',  // 17px
//   lg: '1.25rem',    // 20px
//   xl: '1.5rem',     // 24px
//   xxl: '2rem',      // 32px
//   xxxl: '3rem',     // 48px
// };

// /**
//  * Modern spacing values
//  */
// export const spacing = {
//   xs: 0.5,
//   sm: 1,
//   md: 2,
//   lg: 3,
//   xl: 4,
//   xxl: 6,
//   xxxl: 8,
// };
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import type { Theme } from '@mui/material';

/**
 * Custom hook to access theme colors easily (matching dashboard image)
 * Usage: const colors = useThemeColors();
 */
export const useThemeColors = () => {
  const theme = useTheme();
  
  return {
    // Primary & Secondary from dashboard
    primary: theme.palette.primary.main,       // #2563EB (blue)
    primaryLight: theme.palette.primary.light, // #60A5FA
    primaryDark: theme.palette.primary.dark,   // #1E40AF
    
    secondary: theme.palette.secondary.main,   // #64748B (gray-blue)
    
    // Sidebar colors
    sidebarBg: '#1E3A8A',     // Dark blue sidebar
    sidebarText: '#FFFFFF',
    sidebarIcon: '#93C5FD',   // Light blue icons
    sidebarHover: '#2563EB',
    sidebarActive: '#3B82F6',
    
    // Case Types (adjusted to dashboard theme)
    retailCashless: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1E40AF',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    groupCashless: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      dark: '#6D28D9',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    },
    retailReimbursement: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
    },
    groupReimbursement: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#059669',
      gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
    },
    
    // Priority colors from dashboard
    priorityHigh: '#EF4444',    // Red
    priorityMedium: '#F59E0B',  // Orange/Yellow
    priorityLow: '#94A3B8',     // Gray
    
    // Dashboard Status
    freshCase: '#EF4444',   // Red
    underQC: '#F59E0B',     // Orange
    onField: '#10B981',     // Green
    completed: '#8B5CF6',   // Purple
    
    // Standard palette
    success: theme.palette.success.main,   // #10B981
    warning: theme.palette.warning.main,   // #F59E0B
    error: theme.palette.error.main,       // #EF4444
    info: theme.palette.info.main,         // #3B82F6
    
    // Background
    background: theme.palette.background.default,  // #F8FAFC
    paper: theme.palette.background.paper,         // #FFFFFF
    
    // Text
    textPrimary: theme.palette.text.primary,       // #1E293B
    textSecondary: theme.palette.text.secondary,   // #64748B
    textDisabled: theme.palette.text.disabled,     // #94A3B8
    
    // Table colors
    tableHeader: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
    tableHeaderText: '#FFFFFF',
    tableRowHover: '#F8FAFC',
    tableBorder: '#E2E8F0',
  };
};

/**
 * Get gradient by case type (updated to dashboard theme)
 */
export const getCaseTypeGradient = (caseType: string): string => {
  const gradientMap: Record<string, string> = {
    'retailCashless': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    'groupCashless': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    'retailReimbursement': 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
    'groupReimbursement': 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
  };
  
  return gradientMap[caseType] || 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)';
};

/**
 * Get color by case type (updated colors)
 */
export const getCaseTypeColor = (theme: Theme, caseType: string): string => {
  const colorMap: Record<string, string> = {
    'retailCashless': '#3B82F6',
    'groupCashless': '#8B5CF6',
    'retailReimbursement': '#F59E0B',
    'groupReimbursement': '#10B981',
  };
  
  return colorMap[caseType] || theme.palette.primary.main;
};

/**
 * Get color by status (matching dashboard)
 */
export const getStatusColor = (theme: Theme, status: string): string => {
  const colorMap: Record<string, string> = {
    'fresh': '#EF4444',      // Red
    'qc': '#F59E0B',         // Orange
    'field': '#10B981',      // Green
    'completed': '#8B5CF6',  // Purple
    'new': '#3B82F6',        // Blue
    'active': '#F59E0B',     // Orange
    'denied': '#EF4444',     // Red
    'approved': '#10B981',   // Green
    'pending': '#F59E0B',    // Orange
    'inProgress': '#3B82F6', // Blue
    'submitted': '#8B5CF6',  // Purple
  };
  
  return colorMap[status.toLowerCase()] || theme.palette.text.secondary;
};

/**
 * Get priority color (from dashboard)
 */
export const getPriorityColor = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'high': '#EF4444',
    'medium': '#F59E0B',
    'low': '#94A3B8',
  };
  
  return priorityMap[priority.toLowerCase()] || '#94A3B8';
};

/**
 * Get status chip props (updated styling)
 */
export const getStatusChipProps = (theme: Theme, status: string) => {
  const color = getStatusColor(theme, status);
  
  return {
    sx: {
      backgroundColor: color,
      color: 'white',
      fontWeight: 600,
      fontSize: '0.75rem',
      borderRadius: 1.5,
      px: 1.5,
      py: 0.5,
      height: 'auto',
      boxShadow: `0 2px 8px ${alpha(color, 0.3)}`,
    }
  };
};

/**
 * Get priority chip props (dashboard style)
 */
export const getPriorityChipProps = (priority: string) => {
  const color = getPriorityColor(priority);
  
  return {
    sx: {
      backgroundColor: color,
      color: 'white',
      fontWeight: 600,
      fontSize: '0.75rem',
      borderRadius: 1.5,
      px: 1.5,
      py: 0.5,
      height: 'auto',
    }
  };
};

/**
 * Sidebar menu item styles (matching dashboard)
 */
export const sidebarMenuItemStyles = (theme: Theme, active: boolean = false) => ({
  borderRadius: 2,
  mx: 1,
  my: 0.5,
  px: 2,
  py: 1.25,
  color: '#FFFFFF',
  backgroundColor: active ? '#2563EB' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: active ? '#2563EB' : '#1E40AF',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#FFFFFF' : '#93C5FD',
    minWidth: 40,
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: active ? 600 : 500,
  },
});

/**
 * Modern card styles (dashboard compatible)
 */
export const dashboardCardStyles = (theme: Theme) => ({
  borderRadius: 3,
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #F1F5F9',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
});

/**
 * Insurance company card with circular progress (from dashboard)
 */
export const insuranceCompanyCardStyles = (theme: Theme, hasData: boolean) => ({
  ...dashboardCardStyles(theme),
  padding: 3,
  textAlign: 'center' as const,
  '& .company-name': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    mb: 2,
  },
  '& .circular-progress': {
    position: 'relative' as const,
    display: 'inline-flex',
    mb: 2,
  },
  '& .claims-count': {
    fontSize: '2rem',
    fontWeight: 700,
    color: hasData ? theme.palette.primary.main : theme.palette.text.disabled,
  },
});

/**
 * Table header gradient (matching dashboard)
 */
export const tableHeaderGradient = {
  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  padding: '12px 16px',
};

/**
 * Modern button styles (dashboard compatible)
 */
export const modernButtonStyles = {
  primary: {
    background: '#2563EB',
    color: 'white',
    px: 3,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#1E40AF',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
    },
  },
  secondary: {
    background: 'transparent',
    color: '#64748B',
    border: '1px solid #E2E8F0',
    px: 3,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#F8FAFC',
      borderColor: '#2563EB',
      color: '#2563EB',
    },
  },
  outlined: {
    borderWidth: '1px',
    borderColor: '#E2E8F0',
    color: '#1E293B',
    px: 3,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#2563EB',
      background: alpha('#2563EB', 0.04),
    },
  },
  filter: {
    background: '#2563EB',
    color: 'white',
    px: 2.5,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    minWidth: 120,
    '&:hover': {
      background: '#1E40AF',
    },
  },
  reset: {
    background: 'transparent',
    color: '#64748B',
    border: '1px solid #E2E8F0',
    px: 2.5,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    minWidth: 120,
    '&:hover': {
      background: '#F8FAFC',
      color: '#1E293B',
    },
  },
  export: {
    background: 'transparent',
    color: '#2563EB',
    border: '1px solid #E2E8F0',
    px: 2,
    py: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    textTransform: 'none' as const,
    '&:hover': {
      background: alpha('#2563EB', 0.04),
      borderColor: '#2563EB',
    },
  },
};

/**
 * Date picker styles (from dashboard)
 */
export const datePickerStyles = (theme: Theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },
});

/**
 * Modern scrollbar styles (matching dashboard)
 */
export const modernScrollbar = (theme: Theme) => ({
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#F1F5F9',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#CBD5E1',
    borderRadius: '3px',
    transition: 'background 0.2s ease',
    '&:hover': {
      background: '#94A3B8',
    },
  },
});

/**
 * Glass card effect (subtle for dashboard)
 */
export const glassCardEffect = (theme: Theme) => ({
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  borderRadius: 3,
});

/**
 * Modern card hover effect
 */
export const modernCardHover = {
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
  },
  '&:active': {
    transform: 'translateY(-2px)',
  },
};

/**
 * Gradient text effect (using primary blue)
 */
export const gradientText = (gradient?: string) => ({
  background: gradient || 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
});

/**
 * Modern link style
 */
export const modernLinkStyle = (theme: Theme) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
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
      transform: 'translateY(-8px)',
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
      boxShadow: `0 0 0 8px ${alpha(color, 0)}`,
    },
  },
});

/**
 * Responsive font sizes (dashboard optimized)
 */
export const responsiveFontSize = {
  xs: '0.75rem',   // 12px - Table headers, small labels
  sm: '0.8125rem', // 13px - Table cells, body text
  md: '0.875rem',  // 14px - Default body, buttons
  lg: '1rem',      // 16px - Headings, important text
  xl: '1.25rem',   // 20px - Card titles
  xxl: '1.5rem',   // 24px - Page titles
  xxxl: '2rem',    // 32px - Large numbers, hero text
};

/**
 * Modern spacing values (8px base)
 */
export const spacing = {
  xs: 0.5,   // 4px
  sm: 1,     // 8px
  md: 2,     // 16px
  lg: 3,     // 24px
  xl: 4,     // 32px
  xxl: 6,    // 48px
  xxxl: 8,   // 64px
};

/**
 * Container max widths (dashboard layout)
 */
export const containerMaxWidth = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  full: '100%',
};

/**
 * Sidebar width constants
 */
export const sidebarWidth = {
  expanded: 240,
  collapsed: 64,
};

/**
 * Z-index layers
 */
export const zIndex = {
  drawer: 1200,
  appBar: 1100,
  modal: 1300,
  tooltip: 1500,
  notification: 1400,
};