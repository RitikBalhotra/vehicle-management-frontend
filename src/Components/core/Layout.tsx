import React, { useCallback, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import StorageService from '../../Service/StorageService';
import logo from '../../images/logo.png';
import { GETBYID } from '../../Service/APIService';
import AppButton from '../UI/AppButton';
import ToasterService from '../../Service/ToastService';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  interface LoginUser {
    id?: string;
    profilePic?: string;
    firstName?: string;
    // add other properties as needed
  }
  const [loginUser, setLoginUser] = useState<LoginUser>({})
  const navigate = useNavigate();

  const user = StorageService.getUser();
  const open = Boolean(anchorEl);

  const location = useLocation();

  const isMenuActive = ["/myprofile", "/changepassword"].includes(location.pathname);

  useEffect(() => {
    findUser();
    if (user) {
      setIsLogin(true);
    }
  }, []);

  const findUser = useCallback(async () => {
    try {
      const res = await GETBYID({ url: `/user/${user.id}` })
      setLoginUser(res)
    }
    catch {
      ToasterService.showtoast({message:"User not Found", type:'error'})
    }
  }, [loginUser])


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleLogo = () => {
    navigate("/dashboard")
  }

  const handleMenuSelect = (path: string) => {
    navigate(`/${path}`);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component="img" onClick={handleLogo} src={logo} alt="Logo" sx={{ height: 80, ml: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {isMenuActive && (
              <AppButton
               onClick={()=>navigate("/dashboard")}
               text='Dashboard'
               variant='outlined'
               color='inherit'/>
            )}



            {/* Profile Avatar Dropdown */}
            <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1, p: 0 }}>
              {menuOpen || isMenuActive ? (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2, // Square with slight rounding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fff',
                    boxShadow: '0 0 10px 3px rgba(0, 123, 255, 0.5)', // Strong blue shadow
                    transition: 'box-shadow 0.3s ease-in-out',
                  }}
                >
                  <Avatar
                    alt="Profile"
                    src={loginUser.profilePic || ''}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid #1976d2',
                    }}
                  >
                    {loginUser?.firstName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </Box>
              ) : (
                <Avatar
                  alt="Profile"
                  src={loginUser.profilePic || ''}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                >
                  {loginUser?.firstName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              )}
            </IconButton>



            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose} // ✅ only close when clicked outside
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleMenuSelect('myprofile')}>My Profile</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('changepassword')}>Change Password</MenuItem>
              <MenuItem onClick={() => handleLogout()}> {isLogin ? 'Logout' : 'Login'}</MenuItem>
            </Menu>

          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
