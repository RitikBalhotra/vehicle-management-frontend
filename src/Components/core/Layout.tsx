import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  // Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import StorageService from '../../Service/StorageService';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [islogin, setIsLogin] = useState("false");
  const [role, setRole] = useState("")
  const [barButton, setbarButton] = useState<string[]>([])
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //Handle login and logout 
  const checkUser = () => {
    const user = StorageService.getUser();
    setRole(user.role)
    if (user !== null) {
      setIsLogin("true");
      if (user.role == 'admin') {
        const btns = ["Dashboard","Managers", "Vehicles", "Drivers"];
        setbarButton(btns)
      }
      else if (user.role == 'manager') {
        const btns = ["Vehicles", "Drivers"];
        setbarButton(btns)
      }
      else if (user.role == 'driver') {
        setbarButton([])
      }
    }
    else {
      setIsLogin("false");
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  // handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };


  // handle profile
  const handleProfile = () => {
    navigate("/myprofile")
  }


  // handle Bar 
  const handleBar = (btn: string) => {
    switch (btn.toLowerCase()) {
      case "dashboard":
        navigate(`${role}/dashboard`);
        break;
      case "managers":
        navigate("/admin/managers");
        break;
      case "vehicles":
        navigate(`${role}/vehicles`);
        break;
      case "drivers":
        navigate(`${role}/drivers`);
        break;

    }

  }


  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6">Admin Panel</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate(`/${role}dashboard`)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={`${role} Dashboard`} />
          </ListItemButton>
        </ListItem>
        {/* Add more menu items as needed */}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            VMS
          </Typography>


          {barButton.map((btn) => {
            return <Button key={btn} color="inherit" onClick={() => handleBar(btn)}>
              {btn}
            </Button>
          })}
          <Button color="inherit" onClick={handleProfile}>
            My Profile
          </Button>
          <Button color="inherit" onClick={handleProfile}>
            Change Password
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            {islogin ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer
      {
        role == 'admin' ?
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="sidebar"
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>

            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box> :
          null

      } */}


      {/* Main Content */}
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
