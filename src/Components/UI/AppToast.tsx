import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import ToasterService from '../../Service/ToastService';

const AppToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    text: '',
    type: 'success',
  });

  useEffect(() => {
    ToasterService.register(({ message, type }: { message: string; type: string }) => {
      console.log(message);
      if (
        type === 'success' ||
        type === 'error' ||
        type === 'info' ||
        type === 'warning'
      ) {
        setOpen(true);
        setMessage({ text: message, type });
      }
    });
  }, []);

  return (
    open && (
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={''}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
         sx={{ mt: 6 }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={message.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    )
  );
};

export default AppToast;
