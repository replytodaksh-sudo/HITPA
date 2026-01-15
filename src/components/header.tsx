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
  Divider,
  ListItemIcon,
  alpha,
  useTheme,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardService from '../services/dashboard.service';
import logService from '../services/log.service';
import SearchLog from './sharedComponents/components/SearchLog';

interface ModernHeaderProps {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
  drawerWidth?: number;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  onMenuClick,
  onSidebarToggle,
  sidebarCollapsed,
  drawerWidth = 240,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [userName, setUserName] = useState('');
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchType, setSearchType] = useState("global");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const name = sessionStorage.getItem('name') || 'User';
    setUserName(name);
    fetchUserInfo()
  }, []);

  const fetchUserInfo = () => {
    const name = sessionStorage.getItem("name") || "User";
    const role = sessionStorage.getItem("roleName") || "Role";
    setUserName(name);
    setRoleName(role);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Do you want to logout?');
    if (confirmed) {
      logout();
      setProfileAnchor(null);
    }
  };

  const handleInputChange = (field: any, value: any) => {
    setShowResults(false);
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSearch = async () => {
    try {
      let response: any;

      // if (searchType === "corporate") {
      //   response = await DashboardService.corporateSearch(formData);
      // } else if (searchType === "provider") {
      //   response = await DashboardService.providerSearch(formData);
      // } else if (searchType === "policyholder") {
      //   response = await DashboardService.policySearch(formData);
      // }
      console.log("formData", formData);
      response = await logService.getSbigLogDetails(formData.searchid, formData.claimType);

      if (response && response.statusCode === 0) {
        if (response.payload.length) {
          setSearchResults(response.payload);
          setShowResults(true);
        } else {
          setSearchResults(null);
          setShowResults(false);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
    setFormData({});
  };

  const handleClose = () => {
    setSearchDialogOpen(false)
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };


  return (
    <>
      <Paper elevation={6}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'white',
            height: "60px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "0",
            borderColor: 'divider',
            zIndex: (theme) => theme.zIndex.drawer + 1, // Above drawer
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
            {/* Left Side - Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile Menu Toggle */}
              <IconButton
                color="default"
                edge="start"
                onClick={onMenuClick}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  color: 'text.primary',
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/logo.png"
                  alt="logo"
                  style={{ height: '36px' }}
                />
              </Box>
            </Box>

            {/* Center - Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Right Side - Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title="Search">
                <IconButton
                  color="inherit"
                  onClick={() => setSearchDialogOpen(true)}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 20, color: "#2E5A96" }} />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Notifications">
                <IconButton
                  onClick={(e) => setNotificationAnchor(e.currentTarget)}
                  sx={{
                    // color: 'white',
                    // background: "linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)",
                    width: 40,
                    height: 40,
                    // '&:hover': {
                    //   bgcolor: theme.palette.primary.dark,
                    // },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 20, color: "#2E5A96" }} />
                </IconButton>
              </Tooltip> */}

              {/* User Profile */}
              <Box
                onClick={(e) => setProfileAnchor(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                    Hello, {userName.split(' ')[0]}
                  </Typography>
                  {/* <Typography variant="caption" color="text.secondary">
                  +1
                </Typography> */}
                </Box>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#2E5A96',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {userInitials}
                </Avatar>
              </Box>
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
              minWidth: 220,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sessionStorage.getItem('roleName') || 'User'}
            </Typography>
          </Box>
          <Divider />
          {/* <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem> */}
          {/* <MenuItem onClick={() => { setProfileAnchor(null); navigate('/change-password'); }}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            Change Password
          </MenuItem> */}
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
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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
          </Box>
        </Menu>
      </Paper>
      <Dialog open={searchDialogOpen} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Search</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Search Type Selection */}
          <Box mb={3}>
            <RadioGroup row value={searchType} onChange={handleSearchTypeChange}>
              <FormControlLabel
                value="global"
                control={<Radio />}
                label="Claim Search"
              />
            </RadioGroup>
          </Box>

          {/* Global/Claim Search Fields */}
          {searchType === 'global' && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Claim Type</InputLabel>
                  <Select
                    value={formData.claimType || ''}
                    onChange={(e) => handleInputChange('claimType', e.target.value)}
                    label="Claim Type"
                  >
                    <MenuItem value="">-- Select Claim type --</MenuItem>
                    <MenuItem value="Cashless">Cashless</MenuItem>
                    <MenuItem value="Reimbursement">Reimbursement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Claim No"
                  value={formData.searchid || ''}
                  onChange={(e) => handleInputChange('searchid', e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Search Results - Global Search */}
          {showResults ? (
            <SearchLog data={searchResults} />
          ) : <Box sx={{ p: 3 }}>
            <Alert severity="info">No activity logs found</Alert>
          </Box>}

          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default ModernHeader;