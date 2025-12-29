// import type { ThemeOptions } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';

// // Modern, vibrant color palette with gradients and depth
// const colors = {
//   // Modern Case Type Colors with depth
//   retailCashless: {
//     main: '#FF6B9D',
//     light: '#FFB3D9',
//     dark: '#C91C65',
//     gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
//   },
//   groupCashless: {
//     main: '#9C6DD9',
//     light: '#C9A6E8',
//     dark: '#6842A6',
//     gradient: 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
//   },
//   retailReimbursement: {
//     main: '#FFA726',
//     light: '#FFD180',
//     dark: '#F57C00',
//     gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
//   },
//   groupReimbursement: {
//     main: '#26C281',
//     light: '#81E9C1',
//     dark: '#1E8E65',
//     gradient: 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
//   },
  
//   // Modern Dashboard Status Colors
//   dashboardStatus: {
//     freshCase: '#FF4757',
//     underQC: '#FF6348',
//     onField: '#26C281',
//     completed: '#7F56D9',
//   },
  
//   // Modern Primary & Secondary
//   primary: {
//     main: '#7F56D9',
//     light: '#9B7FE8',
//     dark: '#5B3BA8',
//     gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
//   },
//   secondary: {
//     main: '#06B6D4',
//     light: '#22D3EE',
//     dark: '#0891B2',
//     gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
//   },
  
//   // Modern neutrals with warmth
//   background: {
//     default: '#F8FAFC',
//     paper: '#FFFFFF',
//     elevated: '#FAFBFC',
//   },
  
//   text: {
//     primary: '#1E293B',
//     secondary: '#64748B',
//     disabled: '#94A3B8',
//   },
  
//   // Modern accent colors
//   success: '#10B981',
//   warning: '#F59E0B',
//   error: '#EF4444',
//   info: '#3B82F6',
// };

// // Extend theme types
// declare module '@mui/material/styles' {
//   interface Palette {
//     caseTypes: {
//       retailCashless: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       groupCashless: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       retailReimbursement: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       groupReimbursement: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//     };
//     dashboardStatus: {
//       freshCase: string;
//       underQC: string;
//       onField: string;
//       completed: string;
//     };
//   }
//   interface PaletteOptions {
//     caseTypes?: {
//       retailCashless?: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       groupCashless?: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       retailReimbursement?: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//       groupReimbursement?: {
//         main: string;
//         light: string;
//         dark: string;
//         gradient: string;
//       };
//     };
//     dashboardStatus?: {
//       freshCase?: string;
//       underQC?: string;
//       onField?: string;
//       completed?: string;
//     };
//   }
// }

// const themeOptions: ThemeOptions = {
//   palette: {
//     mode: 'light',
//     primary: {
//       main: colors.primary.main,
//       light: colors.primary.light,
//       dark: colors.primary.dark,
//       contrastText: '#FFFFFF',
//     },
//     secondary: {
//       main: colors.secondary.main,
//       light: colors.secondary.light,
//       dark: colors.secondary.dark,
//       contrastText: '#FFFFFF',
//     },
//     success: {
//       main: colors.success,
//       light: '#34D399',
//       dark: '#059669',
//     },
//     warning: {
//       main: colors.warning,
//       light: '#FBBF24',
//       dark: '#D97706',
//     },
//     error: {
//       main: colors.error,
//       light: '#F87171',
//       dark: '#DC2626',
//     },
//     info: {
//       main: colors.info,
//       light: '#60A5FA',
//       dark: '#2563EB',
//     },
//     background: {
//       default: colors.background.default,
//       paper: colors.background.paper,
//     },
//     text: {
//       primary: colors.text.primary,
//       secondary: colors.text.secondary,
//       disabled: colors.text.disabled,
//     },
//     divider: '#E2E8F0',
//     caseTypes: colors.retailCashless as any,
//     dashboardStatus: colors.dashboardStatus,
//   },
  
//   typography: {
//     fontFamily: [
//       'Inter',
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       'Roboto',
//       'sans-serif',
//     ].join(','),
//     h1: {
//       fontSize: '3rem',
//       fontWeight: 700,
//       letterSpacing: '-0.02em',
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontSize: '2.25rem',
//       fontWeight: 700,
//       letterSpacing: '-0.01em',
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontSize: '1.875rem',
//       fontWeight: 600,
//       letterSpacing: '-0.01em',
//       lineHeight: 1.4,
//     },
//     h4: {
//       fontSize: '1.5rem',
//       fontWeight: 600,
//       lineHeight: 1.4,
//     },
//     h5: {
//       fontSize: '1.25rem',
//       fontWeight: 600,
//       lineHeight: 1.5,
//     },
//     h6: {
//       fontSize: '1.125rem',
//       fontWeight: 600,
//       lineHeight: 1.5,
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//       letterSpacing: '0.00938em',
//     },
//     body2: {
//       fontSize: '0.875rem',
//       lineHeight: 1.6,
//       letterSpacing: '0.01071em',
//     },
//     button: {
//       textTransform: 'none',
//       fontWeight: 600,
//       letterSpacing: '0.02em',
//     },
//   },
  
//   shape: {
//     borderRadius: 12,
//   },
  
//   shadows: [
//     'none',
//     '0px 2px 4px rgba(0, 0, 0, 0.02)',
//     '0px 4px 8px rgba(0, 0, 0, 0.04)',
//     '0px 8px 16px rgba(0, 0, 0, 0.08)',
//     '0px 12px 24px rgba(0, 0, 0, 0.1)',
//     '0px 16px 32px rgba(0, 0, 0, 0.12)',
//     '0px 24px 48px rgba(0, 0, 0, 0.14)',
//     '0px 2px 4px rgba(0, 0, 0, 0.02)',
//     '0px 4px 8px rgba(0, 0, 0, 0.04)',
//     '0px 8px 16px rgba(0, 0, 0, 0.08)',
//     '0px 12px 24px rgba(0, 0, 0, 0.1)',
//     '0px 16px 32px rgba(0, 0, 0, 0.12)',
//     '0px 24px 48px rgba(0, 0, 0, 0.14)',
//     '0px 2px 4px rgba(0, 0, 0, 0.02)',
//     '0px 4px 8px rgba(0, 0, 0, 0.04)',
//     '0px 8px 16px rgba(0, 0, 0, 0.08)',
//     '0px 12px 24px rgba(0, 0, 0, 0.1)',
//     '0px 16px 32px rgba(0, 0, 0, 0.12)',
//     '0px 24px 48px rgba(0, 0, 0, 0.14)',
//     '0px 2px 4px rgba(0, 0, 0, 0.02)',
//     '0px 4px 8px rgba(0, 0, 0, 0.04)',
//     '0px 8px 16px rgba(0, 0, 0, 0.08)',
//     '0px 12px 24px rgba(0, 0, 0, 0.1)',
//     '0px 16px 32px rgba(0, 0, 0, 0.12)',
//     '0px 24px 48px rgba(0, 0, 0, 0.14)',
//   ],
  
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: `
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         body {
//           overflow-x: hidden;
//         }
        
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #F1F5F9;
//           border-radius: 4px;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #CBD5E1;
//           border-radius: 4px;
//           transition: background 0.2s ease;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94A3B8;
//         }
//       `,
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           padding: '10px 24px',
//           fontSize: '0.9375rem',
//           fontWeight: 600,
//           textTransform: 'none',
//           boxShadow: 'none',
//           transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//           '&:hover': {
//             transform: 'translateY(-2px)',
//             boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
//           },
//           '&:active': {
//             transform: 'translateY(0px)',
//           },
//         },
//         contained: {
//           '&:hover': {
//             boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
//           },
//         },
//         outlined: {
//           borderWidth: '2px',
//           '&:hover': {
//             borderWidth: '2px',
//           },
//         },
//         sizeLarge: {
//           padding: '12px 32px',
//           fontSize: '1rem',
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
//           border: '1px solid #F1F5F9',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           overflow: 'hidden',
//           '&:hover': {
//             boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.08)',
//             transform: 'translateY(-4px)',
//           },
//         },
//       },
//     },
//     MuiCardContent: {
//       styleOverrides: {
//         root: {
//           padding: '24px',
//           '&:last-child': {
//             paddingBottom: '24px',
//           },
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 10,
//             transition: 'all 0.2s ease',
//             '&:hover': {
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: colors.primary.light,
//               },
//             },
//             '&.Mui-focused': {
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderWidth: '2px',
//               },
//             },
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           fontWeight: 600,
//           fontSize: '0.8125rem',
//           height: '28px',
//         },
//         colorPrimary: {
//           background: colors.primary.gradient,
//         },
//         colorSecondary: {
//           background: colors.secondary.gradient,
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//         },
//         elevation1: {
//           boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
//         },
//         elevation2: {
//           boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
//         },
//       },
//     },
//     MuiTableCell: {
//       styleOverrides: {
//         head: {
//           background: colors.primary.gradient,
//           color: '#FFFFFF',
//           fontWeight: 700,
//           fontSize: '0.875rem',
//           letterSpacing: '0.05em',
//           textTransform: 'uppercase',
//           borderBottom: 'none',
//         },
//         root: {
//           borderColor: '#F1F5F9',
//         },
//       },
//     },
//     MuiTableRow: {
//       styleOverrides: {
//         root: {
//           transition: 'background-color 0.2s ease',
//           '&:hover': {
//             backgroundColor: '#F8FAFC',
//           },
//         },
//       },
//     },
//   },
// };

// export const theme = createTheme(themeOptions);

// // Export colors with correct structure
// export { colors };

import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Colors extracted from the dashboard image
const colors = {
  // Primary blue from sidebar
  primary: {
    main: '#2563EB', // Bright blue from sidebar
    light: '#60A5FA',
    dark: '#1E40AF',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
  },
  
  // Secondary colors
  secondary: {
    main: '#64748B', // Gray-blue from text
    light: '#94A3B8',
    dark: '#475569',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
  },
  
  // Sidebar colors
  sidebar: {
    background: '#1E3A8A', // Dark blue sidebar background
    hover: '#2563EB',
    active: '#3B82F6',
    text: '#FFFFFF',
    icon: '#93C5FD',
  },
  
  // Insurance Company Card Colors (from the dashboard cards)
  insuranceCompanies: {
    newIndia: {
      primary: '#1E40AF', // Deep blue
      secondary: '#3B82F6',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    },
    national: {
      primary: '#E5E7EB', // Gray (no data)
      secondary: '#F3F4F6',
      gradient: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)',
    },
    unitedIndia: {
      primary: '#1E40AF', // Deep blue
      secondary: '#3B82F6',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    },
    oriental: {
      primary: '#1E40AF', // Deep blue
      secondary: '#3B82F6',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    },
  },
  
  // Case Type Colors (keeping your existing ones but adjusted)
  caseTypes: {
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
  },
  
  // Priority/Status Colors from dashboard
  priority: {
    high: '#EF4444',    // Red
    medium: '#F59E0B',  // Orange
    low: '#94A3B8',     // Gray
  },
  
  // Dashboard Status Colors
  dashboardStatus: {
    freshCase: '#EF4444',
    underQC: '#F59E0B',
    onField: '#10B981',
    completed: '#8B5CF6',
  },
  
  // Background colors from image
  background: {
    default: '#F8FAFC',  // Light gray background
    paper: '#FFFFFF',
    elevated: '#FAFBFC',
    sidebar: '#1E3A8A',  // Dark blue sidebar
  },
  
  // Text colors from image
  text: {
    primary: '#1E293B',   // Dark text
    secondary: '#64748B', // Medium gray text
    disabled: '#94A3B8',  // Light gray
    white: '#FFFFFF',
  },
  
  // Button colors from image
  button: {
    primary: '#2563EB',   // Blue button
    secondary: '#FFFFFF', // White button
    outline: '#E2E8F0',   // Border color
  },
  
  // Table colors
  table: {
    header: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
    headerText: '#FFFFFF',
    row: '#FFFFFF',
    rowHover: '#F8FAFC',
    border: '#E2E8F0',
  },
  
  // Status/semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Extend theme types
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      background: string;
      hover: string;
      active: string;
      text: string;
      icon: string;
    };
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
    priority: {
      high: string;
      medium: string;
      low: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      background?: string;
      hover?: string;
      active?: string;
      text?: string;
      icon?: string;
    };
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
    priority?: {
      high?: string;
      medium?: string;
      low?: string;
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
    sidebar: colors.sidebar,
    caseTypes: colors.caseTypes as any,
    dashboardStatus: colors.dashboardStatus,
    priority: colors.priority,
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
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
      color: colors.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontSize: '0.875rem',
    },
  },
  
  shape: {
    borderRadius: 8, // Slightly less rounded based on the image
  },
  
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
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
          background-color: ${colors.background.default};
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
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
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)',
          },
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: colors.text.white,
          '&:hover': {
            backgroundColor: colors.primary.dark,
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.3)',
          },
        },
        outlined: {
          borderColor: colors.button.outline,
          color: colors.text.primary,
          borderWidth: '1px',
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
            borderWidth: '1px',
          },
        },
        text: {
          color: colors.text.secondary,
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #F1F5F9',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            // transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: colors.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            color: colors.text.secondary,
          },
        },
      },
    },
    
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.875rem',
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: colors.text.white,
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.text.white,
        },
        colorSuccess: {
          backgroundColor: colors.success,
          color: colors.text.white,
        },
        colorWarning: {
          backgroundColor: colors.warning,
          color: colors.text.white,
        },
        colorError: {
          backgroundColor: colors.error,
          color: colors.text.white,
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: colors.table.header,
          color: colors.table.headerText,
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderBottom: 'none',
          padding: '12px 16px',
        },
        root: {
          borderColor: colors.table.border,
          fontSize: '0.875rem',
          padding: '12px 16px',
          color: colors.text.primary,
        },
      },
    },
    
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: colors.table.rowHover,
          },
        },
      },
    },
    
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
          backgroundColor: colors.primary.main,
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.sidebar.background,
          color: colors.sidebar.text,
          borderRight: 'none',
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '10px 16px',
          color: colors.sidebar.text,
          '&:hover': {
            backgroundColor: colors.sidebar.hover,
          },
          '&.Mui-selected': {
            backgroundColor: colors.sidebar.active,
            '&:hover': {
              backgroundColor: colors.sidebar.active,
            },
          },
        },
      },
    },
    
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: colors.sidebar.icon,
          minWidth: '40px',
        },
      },
    },
    
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 700,
          color: colors.text.primary,
          padding: '20px 24px',
        },
      },
    },
    
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
        },
      },
    },
    
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `2px solid ${colors.table.border}`,
        },
        indicator: {
          backgroundColor: colors.primary.main,
          height: 3,
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: colors.text.secondary,
          padding: '12px 16px',
          minHeight: 48,
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);

// Export colors with correct structure
export { colors };