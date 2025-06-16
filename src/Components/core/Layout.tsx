import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import StorageService from '../../Service/StorageService';
import logo from '../../images/logo.png';
import { GETBYID } from '../../Service/APIService';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('');
  const [navButtons, setNavButtons] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  interface LoginUser {
    id?: string;
    profilePic?: string;
    // add other properties as needed
  }
  const [loginUser, setLoginUser] = useState<LoginUser>({})
  const navigate = useNavigate();

  const user = StorageService.getUser();
  const open = Boolean(anchorEl);

  useEffect(() => {
    findUser();
    if (user) {
      setIsLogin(true);
      setRole(user.role);
      if (user.role == 'admin') {
        setNavButtons(['Dashboard', 'Managers', 'Vehicles', 'Drivers']);
      } else if (user.role == 'manager') {
        setNavButtons(['Dashboard', 'Vehicles', 'Drivers']);
      } else {
        setNavButtons(['Dashboard']);
      }
    }
  }, []);

  const findUser= async()=>{
    try{
        const res = await GETBYID ({url: `/user/${user.id}`})
        setLoginUser(res)
    }
    catch{
      console.log("GETBYID is not working");
    }
  }

  const handleNavigation = (label: string) => {
    const path = label.toLowerCase();
    if (path === 'managers') {
      navigate('/admin/managers');
    } else {
      navigate(`/${role}/${path}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (path: string) => {
    navigate(`/${path}`);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 60, ml: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navButtons.map((btn) => (
              <Button key={btn} color="inherit" onClick={() => handleNavigation(btn)}>
                {btn}
              </Button>
            ))}

            {/* Profile Avatar Dropdown */}
            <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1 }}>
              <Avatar
                alt="Profile"
                src={loginUser.profilePic||''}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleMenuSelect('myprofile')}>My Profile</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('changepassword')}>Change Password</MenuItem>
            </Menu>

            <Button color="inherit" onClick={handleLogout}>
              {isLogin ? 'Logout' : 'Login'}
            </Button>
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
