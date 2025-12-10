import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  alpha,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Paper,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { useAuth } from '../hooks/useAuth';
import keycloak from '../keycloak.config';

interface SubMenu {
  submenuName: string;
  submenuUrl: string;
}

interface ChildMenu {
  childMenuName: string;
  subMenu: SubMenu[];
}

interface MenuItem {
  menuName: string;
  childMenu: ChildMenu[];
}

interface HeaderProps {
  onMenuClick?: () => void;
}

const ModernHeader: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  // State
  const [userName, setUserName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [menus, setMenus] = useState<any>([]);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [menuAnchors, setMenuAnchors] = useState<{ [key: string]: HTMLElement | null }>({});
  const [submenuAnchors, setSubmenuAnchors] = useState<{ [key: string]: HTMLElement | null }>({});

  // Dialogs
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Search
  const [searchType, setSearchType] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    fetchUserInfo();
    fetchMenus();
  }, []);

  const fetchUserInfo = () => {
    const name = sessionStorage.getItem('name') || 'User';
    const role = sessionStorage.getItem('role') || 'Role';
    setUserName(name);
    setRoleName(role);
  };
  const fetchMenus = async () => {
    // try {
    const response = await authService.getUserMenu();
    console.log("calleddddd", response)
    if (response.statusCode === 0) {
      setMenus(response.payload.accessedItem || []);
    }
    // } catch (error) {
    //   console.error('Failed to fetch menus:', error);
    // }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Do you want to logout?');
    if (confirmed) {
      try {
        await authService.logout();
        logout();
        // navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    setProfileAnchor(null);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password should be same');
      return;
    }

    try {
      const response = await authService.changePassword({
        newPassword,
        confirmPassword,
      });

      if (response.statusCode === 0) {
        alert('Password changed successfully. Please login again.');
        await authService.logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  const handleSearch = async (formData: any) => {
    try {
      let response;

      if (searchType === 'corporate') {
        response = await DashboardService.corporateSearch(formData);
      } else if (searchType === 'provider') {
        response = await DashboardService.providerSearch(formData);
      } else if (searchType === 'policyholder') {
        response = await DashboardService.policySearch(formData);
      }

      if (response && response.statusCode === 0) {
        setSearchResults(response.payload);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleMenuClick = (menuName: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchors(prev => ({
      ...prev,
      [menuName]: event.currentTarget,
    }));
  };

  const handleMenuClose = (menuName: string) => {
    setMenuAnchors(prev => ({
      ...prev,
      [menuName]: null,
    }));
    // Close all submenus when parent menu closes
    setSubmenuAnchors({});
  };

  const handleSubmenuOpen = (key: string, event: React.MouseEvent<HTMLElement>) => {
    setSubmenuAnchors(prev => ({
      ...prev,
      [key]: event.currentTarget,
    }));
  };

  const handleSubmenuClose = (key: string) => {
    setSubmenuAnchors(prev => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSubmenuItemClick = (url: string, menuName: string) => {
    // Remove hash and navigate
    const cleanUrl = url.replace('/healthinv/#', '');
    navigate(cleanUrl);
    handleMenuClose(menuName);
  };

  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.drawer + 1,
          borderRadius: '0',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <img src="/logo.png" alt="logo" style={{ height: "40px" }} />
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {/* Dashboard */}
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Dashboard
            </Button>

            {/* Dynamic Menus */}
            {menus.map((menu: any) => (
              <Box key={menu.menuName} sx={{ position: 'relative' }}>
                <Button
                  color="inherit"
                  endIcon={<ExpandMoreIcon />}
                  onClick={(e) => handleMenuClick(menu.menuName, e)}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {menu.menuName}
                </Button>

                <Menu
                  anchorEl={menuAnchors[menu.menuName]}
                  open={Boolean(menuAnchors[menu.menuName])}
                  onClose={() => handleMenuClose(menu.menuName)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  {menu.childMenu.map((child: any, childIndex: number) => {
                    const submenuKey = `${menu.menuName}-${childIndex}`;

                    return (
                      <Box key={child.childMenuName}>
                        {child.subMenu && child.subMenu.length > 0 ? (
                          <>
                            <MenuItem
                              onMouseEnter={(e) => handleSubmenuOpen(submenuKey, e)}
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                                justifyContent: 'space-between',
                              }}
                            >
                              <ListItemText primary={child.childMenuName} />
                              <ArrowRightIcon fontSize="small" />
                            </MenuItem>

                            {/* Submenu */}
                            <Menu
                              anchorEl={submenuAnchors[submenuKey]}
                              open={Boolean(submenuAnchors[submenuKey])}
                              onClose={() => handleSubmenuClose(submenuKey)}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                              PaperProps={{
                                sx: {
                                  ml: 0.5,
                                  minWidth: 180,
                                  borderRadius: 2,
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                },
                                onMouseLeave: () => handleSubmenuClose(submenuKey),
                              }}
                            >
                              {child.subMenu.map((sub: any) => (
                                <MenuItem
                                  key={sub.submenuName}
                                  onClick={() => handleSubmenuItemClick(sub.submenuUrl, menu.menuName)}
                                  sx={{
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                  }}
                                >
                                  {sub.submenuName}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleMenuClose(menu.menuName);
                            }}
                            sx={{
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            {child.childMenuName}
                          </MenuItem>
                        )}
                      </Box>
                    );
                  })}
                </Menu>
              </Box>
            ))}
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search Button */}
            <Tooltip title="Search">
              <IconButton
                color="inherit"
                onClick={() => setSearchDialogOpen(true)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => setProfileAnchor(e.currentTarget)}
                sx={{ p: 0.5, ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {userInitials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              {userInitials}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Role: {roleName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null);
            setPasswordDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxWidth: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <MenuItem>
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                New case assigned
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Case #12345 has been assigned to you
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem>
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                QC approved
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your investigation report has been approved
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                5 hours ago
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Menu>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Search</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <RadioGroup
              row
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setShowResults(false);
              }}
            >
              {(roleName === 'Super Admin' ||
                roleName === 'Central Manager' ||
                roleName === 'Regional Manager') && (
                  <FormControlLabel
                    value="policyholder"
                    control={<Radio />}
                    label="Policyholder Search"
                  />
                )}
              <FormControlLabel value="provider" control={<Radio />} label="Provider Search" />
              <FormControlLabel value="corporate" control={<Radio />} label="Corporate Search" />
              <FormControlLabel value="global" control={<Radio />} label="Claim Search" />
            </RadioGroup>

            {searchType && (
              <Box sx={{ mt: 3 }}>
                {/* Add search form fields based on searchType */}
                <TextField
                  fullWidth
                  label="Search"
                  placeholder={`Enter ${searchType} details`}
                  margin="normal"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleSearch({})}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModernHeader;