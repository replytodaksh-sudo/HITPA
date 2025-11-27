import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import type { SlideProps, AlertColor } from '@mui/material';

interface NotificationDetail {
  message: string;
  type: AlertColor;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

/**
 * Global Notification Component
 * Listens to custom events from API interceptor and shows notifications
 */
const GlobalNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationDetail>({
    message: '',
    type: 'info',
  });

  useEffect(() => {
    // Listen for notification events from API interceptor
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationDetail>;
      setNotification(customEvent.detail);
      setOpen(true);
    };

    window.addEventListener('showNotification', handleNotification);

    return () => {
      window.removeEventListener('showNotification', handleNotification);
    };
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: '300px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;