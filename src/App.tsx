import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalNotification from './components/GlobalNotification';
import { theme } from './theme';
import Dashboard from './pages/dashboard/dashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalNotification />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;