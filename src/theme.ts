import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Modern, vibrant color palette with gradients and depth
const colors = {
  // Modern Case Type Colors with depth
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
  
  // Modern Dashboard Status Colors
  dashboardStatus: {
    freshCase: '#FF4757',
    underQC: '#FF6348',
    onField: '#26C281',
    completed: '#7F56D9',
  },
  
  // Modern Primary & Secondary
  primary: {
    main: '#7F56D9',
    light: '#9B7FE8',
    dark: '#5B3BA8',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  },
  secondary: {
    main: '#06B6D4',
    light: '#22D3EE',
    dark: '#0891B2',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  },
  
  // Modern neutrals with warmth
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    elevated: '#FAFBFC',
  },
  
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    disabled: '#94A3B8',
  },
  
  // Modern accent colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Extend theme types
declare module '@mui/material/styles' {
  interface Palette {
    caseTypes: {
      retailCashless: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      groupCashless: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      retailReimbursement: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      groupReimbursement: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
    };
    dashboardStatus: {
      freshCase: string;
      underQC: string;
      onField: string;
      completed: string;
    };
  }
  interface PaletteOptions {
    caseTypes?: {
      retailCashless?: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      groupCashless?: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      retailReimbursement?: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
      groupReimbursement?: {
        main: string;
        light: string;
        dark: string;
        gradient: string;
      };
    };
    dashboardStatus?: {
      freshCase?: string;
      underQC?: string;
      onField?: string;
      completed?: string;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: '#FFFFFF',
    },
    success: {
      main: colors.success,
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: colors.warning,
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: colors.error,
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: colors.info,
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: '#E2E8F0',
    caseTypes: colors.retailCashless as any,
    dashboardStatus: colors.dashboardStatus,
  },
  
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  
  shape: {
    borderRadius: 12,
  },
  
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.02)',
    '0px 4px 8px rgba(0, 0, 0, 0.04)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 24px 48px rgba(0, 0, 0, 0.14)',
    '0px 2px 4px rgba(0, 0, 0, 0.02)',
    '0px 4px 8px rgba(0, 0, 0, 0.04)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 24px 48px rgba(0, 0, 0, 0.14)',
    '0px 2px 4px rgba(0, 0, 0, 0.02)',
    '0px 4px 8px rgba(0, 0, 0, 0.04)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 24px 48px rgba(0, 0, 0, 0.14)',
    '0px 2px 4px rgba(0, 0, 0, 0.02)',
    '0px 4px 8px rgba(0, 0, 0, 0.04)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 24px 48px rgba(0, 0, 0, 0.14)',
  ],
  
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid #F1F5F9',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.light,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
          height: '28px',
        },
        colorPrimary: {
          background: colors.primary.gradient,
        },
        colorSecondary: {
          background: colors.secondary.gradient,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: colors.primary.gradient,
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderBottom: 'none',
        },
        root: {
          borderColor: '#F1F5F9',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);

// Export colors with correct structure
export { colors };