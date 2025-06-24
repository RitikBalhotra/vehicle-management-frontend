import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import pageNotFoundGif from "./images/page-not-found.png"
import { useEffect } from 'react';

const PageNotFound = () => {
  const navigate = useNavigate();
   useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); 
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // p: 3,
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box
          component="img"
          src={pageNotFoundGif}
          alt="404 Not Found"
          sx={{ maxWidth: 400, width: '100%' }}
        />

        <Typography variant="body1" color="text.secondary">
          Oops! The page you're looking for doesn’t exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ borderRadius: 5, px: 4, py: 1 }}
        >
          Go back!
        </Button>
      </Stack>
    </Box>
  );
};

export default PageNotFound;
