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
    experience: '',
    address: '',
    licenseExpiryDate: '',
    vehicleAssigned: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });


  // handle change 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode === 'signup') {
      setUser(prev => ({ ...prev, [name]: value }));
    } else {
      setLoginData(prev => ({ ...prev, [name]: value }));
    }
  };

  
  // handle login 
  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return alert('Email and password are required');

    try {
      const res = await LOGINAPI({ url: '/login', payload: loginData });
      StorageService.setToken(res.token);
      StorageService.setUser(res.user);

      // Navigate using full role string, not role[0]
      navigate(`/${res.user.role}/dashboard`);
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
    }
  };


  // handle signup
  const handleSignUp = async () => {
    if (!user.role) {
      alert("Please select a role");
      return;
    }

    const payload: Record<string, any> = {
      ...user,
      profileImage,
      licenseFile,
    };

    try {
      const response = await POSTAPI({
        url: "/register",
        payload,
      });

      console.log("✅ Register success:", response);
      alert("User registered successfully!");
      setMode("login"); // switch to login after success
    } catch (error: any) {
      console.error("❌ Register failed:", error.message || error);
      alert("Registration failed: " + (error.message || "Unknown error"));
    }
  };


  const formFields = mode === 'signup'
    ? [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'email', label: 'Email' },
      { name: 'mobile', label: 'Mobile' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'dob', label: 'Date of Birth', type: 'date' },
      { name: 'role', label: 'Role', type: 'select', options: ['admin', 'manager', 'driver'] },
      ...(user.role === 'driver'
        ? [
          { name: 'experience', label: 'Experience (yrs)' },
          { name: 'address', label: 'Address' },
          { name: 'licenseExpiryDate', label: 'License Expiry', type: 'date' },
        ]
        : []),
    ]
    : [
      { name: 'email', label: 'Email' },
      { name: 'password', label: 'Password', type: 'password' },
    ];

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
          <Typography
            variant="h5"
            fontWeight={700}
            mb={2}
            textAlign="center"
            color="primary"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Typography>

          <Stack spacing={2}>
            {formFields.map(field => (
              <Box key={field.name}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  {field.label}
                </Typography>
                {field.type === 'select' ? (
                  <TextField
                    required
                    select
                    fullWidth
                    name={field.name}
                    value={user[field.name as keyof typeof user]}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select a role</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <APPTextField
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={`Enter ${field.label}`}
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

            {mode === 'signup' && (
              <>
                <Typography variant="body2" fontWeight={600}>
                  Upload Profile Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setProfileImage(e.target.files?.[0] ?? null)}
                />

                {user.role === 'driver' && (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      Upload License Document
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => setLicenseFile(e.target.files?.[0] ?? null)}
                    />
                  </>
                )}
              </>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (mode === 'login') {
                  handleLogin();
                } else {
                  handleSignUp();
                }
              }}
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
