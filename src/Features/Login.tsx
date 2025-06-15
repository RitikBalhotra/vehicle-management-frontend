import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/login-bg.png';
import APPTextField from '../Components/UI/AppTextField';
import { LOGINAPI, POSTAPI } from '../Service/APIService';
import StorageService from '../Service/StorageService';

const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
    role: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode === 'signup') {
      setUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignUp = async () => {
    const { firstName, lastName, dob, role, email, mobile, password } = user;
    if (!firstName || !lastName || !dob || !role || !email || !mobile || !password) {
      return alert('Please fill all fields');
    }
    try {
      const response = await POSTAPI({ url: '/register', payload: user });
      StorageService.setToken(response.token);
      StorageService.setUser(response.user);
      alert("signUp successfully!")
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
        dob: '',
        role: '',
      })
      setMode("login")
    } catch (err) {
      alert('Signup failed. Please try again.');
      console.error(err);
    }
  };

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) {
      return alert('Please fill all fields');
    }
    try {
      const response = await LOGINAPI({ url: '/login', payload: loginData });
      StorageService.setToken(response.token);
      StorageService.setUser(response.user);
      if (response.user.role === 'admin') navigate('/admin/dashboard');
      else if (response.user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/driver/dashboard');
    } catch (err) {
      alert('Invalid email or password');
      console.error(err);
    }
  };

  const formFields = mode === 'signup'
    ? [
      { name: 'firstName', label: 'First Name', placeholder: 'Enter First Name' },
      { name: 'lastName', label: 'Last Name', placeholder: 'Enter Last Name' },
      { name: 'email', label: 'Email', placeholder: 'Enter email' },
      { name: 'mobile', label: 'Mobile', placeholder: 'Enter Mobile no' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
      { name: 'dob', label: 'Date of Birth', type: 'date' },
      { name: 'role', label: 'Select Role', type: 'select', options: ['admin', 'manager', 'driver'] },
    ]
    : [
      { name: 'email', label: 'Email', placeholder: 'Enter your email' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
    ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#f8f9fa',
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
        <Typography variant="h6" color="text.secondary" mb={3}>
          Vehicle Management System
        </Typography>
        <Box
          component="img"
          src={backgroundImage}
          alt="illustration"
          sx={{ width: '100%', maxWidth: 400 }}
        />
      </Box>

      {/* Right Section (Form) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 450, p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2} textAlign="center" color="primary">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Typography>

          <Stack spacing={2}>
            {formFields.map((field) => (
              <Box key={field.name}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  {field.label}
                </Typography>
                {field.type === 'select' ? (
                  <TextField
                    select
                    fullWidth
                    name={field.name}
                    value={user[field.name as keyof typeof user]}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select a role</option>
                    {field.options?.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <APPTextField
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type || 'text'}
                    onChange={handleChange}
                    value={
                      mode === 'signup'
                        ? user[field.name as keyof typeof user]
                        : loginData[field.name as keyof typeof loginData]
                    }
                  />
                )}
              </Box>
            ))}

            <Button
              variant="contained"
              fullWidth
              onClick={mode === 'login' ? handleLogin : handleSignUp}
              sx={{ py: 1.3, fontWeight: 'bold', borderRadius: 20 }}
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </Button>

            <Button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              sx={{ textTransform: 'none', fontSize: 14 }}
            >
              {mode === 'login'
                ? "Don't have an account? Create one"
                : 'Already have an account? Login'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
