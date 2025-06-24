import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Spinnerservice from '../../Service/SpinnerService';

const Spinner: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Register should accept a callback with a boolean parameter
    const unregister = Spinnerservice.register((loading: boolean) => {
      setOpen(loading);
    });

    // Optional: Clean up on unmount if service supports it
    return () => {
      if (typeof unregister === 'function') {
        unregister();
      }
    };
  }, []);

  return (
    open ? (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(1px)',
          backgroundColor: 'rgba(0, 0, 255, 0.3)', // semi-transparent blue
          zIndex: 13000,
          pointerEvents: 'all',
          overflow: 'hidden',
        }}
      >
        <CircularProgress size={50} color="primary" thickness={4.5} />
      </Box>
    ) : null
  );
};

export default Spinner;
