// import React, { useState } from 'react';
// import { Box, useTheme, useMediaQuery } from '@mui/material';
// import ModernHeader from './header';
// import { Outlet } from 'react-router-dom';

// const MainLayout: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       {/* Header */}
//       <ModernHeader onMenuClick={handleDrawerToggle} />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           pt: { xs: 7, sm: 8 },
//           minHeight: '100vh',
//           bgcolor: 'background.default',
//         }}
//       >
//         <Outlet />   {/* ⬅ This is where your pages will render */}
//       </Box>
//     </Box>
//   );
// };

// export default MainLayout;


import React, { useState, useCallback, useMemo } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import ModernHeader from './header';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Memoize the callback to prevent header re-renders
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // ✅ Memoize layout styles to prevent recalculation
  const mainContentStyles = useMemo(
    () => ({
      flexGrow: 1,
      pt: { xs: 7, sm: 8 },
      minHeight: '100vh',
      bgcolor: 'background.default',
    }),
    []
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ✅ Header - Memoized, won't re-render on route changes */}
      <ModernHeader onMenuClick={handleDrawerToggle} />

      {/* Main Content */}
      <Box component="main" sx={mainContentStyles}>
        <Outlet /> {/* Routes render here */}
      </Box>
    </Box>
  );
};

export default MainLayout;