import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/login-bg.png';
import APPTextField from '../Components/UI/AppTextField';
import { FORGOTPASSWORD, LOGINAPI, POSTAPI } from '../Service/APIService';
import StorageService from '../Service/StorageService';
import ToasterService from '../Service/ToastService';
import Spinnerservice from '../Service/SpinnerService';

const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot password'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '' });
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
  });
  const navigate = useNavigate();


  // handle change 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode === 'signup') {
      setUser(prev => ({ ...prev, [name]: value }));
    } else if (mode === 'forgot password') {
      setForgotData(prev => ({ ...prev, [name]: value }));
    }
    else {
      setLoginData(prev => ({ ...prev, [name]: value }));
    }
  };


  // handle login 
  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return ToasterService.showtoast({ message: "Email and Password are required!", type: "error" });

    try {
      Spinnerservice.showSpinner();
      const res = await LOGINAPI({ url: '/login', payload: loginData });
      StorageService.setToken(res.token);
      StorageService.setUser(res.user);
      ToasterService.showtoast({ message: 'Login Successfully', type: 'success' })
      navigate(`/dashboard`);
    } catch (err: any) {
      Spinnerservice.hideSpinner();
      ToasterService.showtoast({ message: `${err.message}`, type: `error` })
    }
  };

  // handle forgot password 
  const handleForgotPassword = async () => {
    const { email } = forgotData;
    if (!email) return ToasterService.showtoast({ message: "email is required!", type: "info" });

    try {
      Spinnerservice.showSpinner()
      const res = await FORGOTPASSWORD({ url: `/forgot-password`, payload: { email } })
      Spinnerservice.hideSpinner();
      console.log(res);
      if (res) { ToasterService.showtoast({ message: "Reset Password Sent on Email", type: "info" }) }
    }
    catch {
      console.log("User NOt FOund");
    }
  }

  // handle signup
  const handleSignUp = async () => {
    try {
      Spinnerservice.showSpinner();
      await POSTAPI({
        url: "/register",
        payload: user
      });
      ToasterService.showtoast({ message: "User register Succussfully!", type: "success" })
      Spinnerservice.hideSpinner();
      setMode("login");
    } catch (error: any) {
      ToasterService.showtoast({ message: `Registration failed : ${error}`, type: "error" })
    }
  };


  const formFields = mode === 'signup' ? [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    // { name: 'mobile', label: 'Mobile' },
    { name: 'password', label: 'Password', type: 'password' },
  ]
    : mode === 'login' ? [
      { name: 'email', label: 'Email' },
      { name: 'password', label: 'Password', type: 'password' },
    ] : [{ name: 'email', label: 'Enter Email' }]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
          py: { xs: 4, md: 0 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold" color="primary" mb={2}>
          Welcome
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={0}>
          Vehicle Management System
        </Typography>
        <Grid sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }} >
          <Box component="img" src={backgroundImage}
            alt="illustration"
            sx={{ width: '100%', maxWidth: 400 }} />
        </Grid>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 450,
            p: 0,
            borderRadius: 3,
            height: 'auto', // Fixed height for consistency
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              mb={2}
              textAlign="center"
              color="primary"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}
            </Typography>
          </Box>

          {/* Scrollable content */}
          <Box
            sx={{
              px: 3,
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <Stack spacing={2} pb={0}>
              {formFields.map((field) => (
                <Box key={field.name}>
                  <Typography variant="body2" fontWeight={600} mb={0.5}>
                    {field.label}
                  </Typography>
                  <APPTextField
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={`Enter ${field.label}`}
                    onChange={handleChange}
                    value={
                      mode === 'signup'
                        ? user[field.name as keyof typeof user]
                        : mode === 'login'
                          ? loginData[field.name as keyof typeof loginData]
                          : forgotData[field.name as keyof typeof forgotData]
                    }
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Button Section (Sticky footer style) */}
          <Box sx={{ px: 3, pb: 3 }}>
            {mode === 'forgot password' ? (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleForgotPassword}
                  sx={{ py: 1.3, fontWeight: 'bold', borderRadius: 20 }}
                >
                  Reset Password
                </Button>
                <Button
                  onClick={() => setMode('login')}
                  sx={{ textTransform: 'none', fontSize: 14 }}
                >
                  Nevermind, I Got it
                </Button>
              </>
            ) : mode === 'signup' ? (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSignUp}
                  sx={{ py: 1.3, fontWeight: 'bold', borderRadius: 20 }}
                >
                  Register
                </Button>
                <Button
                  onClick={() => setMode('login')}
                  sx={{ textTransform: 'none', fontSize: 14 }}
                >
                  Already have an account? Login
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  sx={{ py: 1.3, fontWeight: 'bold', borderRadius: 20 }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => setMode('forgot password')}
                  sx={{ textTransform: 'none', fontSize: 14 }}
                >
                  Forget password?
                </Button>
                <Button
                  onClick={() =>
                    setMode(mode === 'login' ? 'signup' : 'login')
                  }
                  sx={{ textTransform: 'none', fontSize: 14 }}
                >
                  {mode === 'login'
                    ? "Don't have an account? Create one"
                    : 'Already have an account? Login'}
                </Button>
              </>
            )}
          </Box>
        </Paper>

      </Box>
    </Box >
  );
};

export default LoginPage;
