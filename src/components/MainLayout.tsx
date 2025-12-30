// import React, { useState, useCallback, useMemo } from 'react';
// import { Box, useTheme, useMediaQuery } from '@mui/material';
// import ModernHeader from './header';
// import { Outlet } from 'react-router-dom';

// const MainLayout: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // ✅ Memoize the callback to prevent header re-renders
//   const handleDrawerToggle = useCallback(() => {
//     setMobileOpen((prev) => !prev);
//   }, []);

//   // ✅ Memoize layout styles to prevent recalculation
//   const mainContentStyles = useMemo(
//     () => ({
//       flexGrow: 1,
//       pt: { xs: 7, sm: 8 },
//       minHeight: '100vh',
//       bgcolor: 'background.default',
//     }),
//     []
//   );

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       {/* ✅ Header - Memoized, won't re-render on route changes */}
//       <ModernHeader onMenuClick={handleDrawerToggle} />

//       {/* Main Content */}
//       <Box component="main" sx={mainContentStyles}>
//         <Outlet /> {/* Routes render here */}
//       </Box>
//     </Box>
//   );
// };

// export default MainLayout;

import React, { useState, useCallback, useMemo } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import ModernHeader from './header';
// import ModernSidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import ModernSidebar from './sidebar';

// ==================== CONSTANTS ====================
const DRAWER_WIDTH = 240;      // Expanded sidebar width
const DRAWER_WIDTH_COLLAPSED = 64; // Collapsed sidebar width

// ==================== MAIN LAYOUT ====================
const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Toggle mobile drawer
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, []);
  console.log("pppppp", isMobile)
  
  // ✅ Toggle sidebar collapse (desktop only)
  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // ✅ Calculate current drawer width
  const currentDrawerWidth = useMemo(() => {
    if (isMobile) return DRAWER_WIDTH;
    return sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;
  }, [isMobile, sidebarCollapsed]);

  // ✅ Main content styles with dynamic padding
  const mainContentStyles = useMemo(
    () => ({
      flexGrow: 1,
      // Padding top for header
      pt: { xs: 8, sm: 9 },
      // Padding left for sidebar (only on desktop)
      pl: isMobile ? 0 : `${currentDrawerWidth}px`,
      minHeight: '100vh',
      width:"60%",
      bgcolor: 'background.default',
      transition: theme.transitions.create(['padding-left'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
    [isMobile, currentDrawerWidth, theme]
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ==================== HEADER ==================== */}
      <ModernHeader 
        onMenuClick={handleDrawerToggle}
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
        drawerWidth={currentDrawerWidth}
      />

      {/* ==================== SIDEBAR ==================== */}
      <ModernSidebar
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerToggle}
        collapsed={sidebarCollapsed}
        drawerWidth={currentDrawerWidth}
      />

      {/* ==================== MAIN CONTENT ==================== */}
      <Box component="main" sx={mainContentStyles}>
        <Outlet /> {/* Routes render here */}
      </Box>
    </Box>
  );
};

export default MainLayout;