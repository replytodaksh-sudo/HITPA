import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[]; // Optional: Required roles to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { initialized, authenticated, hasAnyRole } = useAuth();

  // Loading state
  if (!initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#2E5A96' }} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
//   if (roles && roles.length > 0 && !hasAnyRole(roles)) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Alert severity="error">
//           <Typography variant="h6">Access Denied</Typography>
//           <Typography>
//             You don't have permission to access this page.
//             Required roles: {roles.join(', ')}
//           </Typography>
//         </Alert>
//       </Box>
//     );
//   }

  return children;
};

export default ProtectedRoute;