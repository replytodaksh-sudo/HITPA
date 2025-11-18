import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/MainLayout';
import GlobalNotification from './components/GlobalNotification';
// import Login from './components/Login'; // You'll create this
import { authService } from './services/auth.service';
import Dashboard from './pages/dashboard/dashboard';
import { theme } from './theme';
import AssignedFo from './pages/AssignedFo/AssignedFo';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <GlobalNotification />
    //   <Router>
    //     <Routes>
    //       {/* Public Routes */}
    //       {/* <Route path="/login" element={<Login />} /> */}

    //       {/* Protected Routes */}
    //       <Route
    //         path="/*"
    //         element={
    //           // <ProtectedRoute>
    //             <MainLayout>
    //               <Routes>
    //                 <Route path="/dashboard" element={<Dashboard />} />
    //                 <Route path="/" element={<Navigate to="/dashboard" replace />} />
    //                 {/* Add more routes here */}
    //               </Routes>
    //             </ >
    //           // </ProtectedRoute>
    //         }
    //       />
    //     </Routes>
    //   </Router>
    // </ThemeProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalNotification />
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/foAssignedToFO" element={<AssignedFo />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;