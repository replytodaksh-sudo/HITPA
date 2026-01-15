import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    useTheme,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Assignment as AssignmentIcon,
    ChevronLeft as ChevronLeftIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Settings as SettingsIcon,
    Description as DescriptionIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';


interface ModernSidebarProps {
    mobileOpen: boolean;
    onMobileClose: () => void;
    collapsed: boolean;
    drawerWidth: number;
}

interface MenuItem {
    menuName: string;
    menuIcon?: string;
    menuUrl?: string;
    childMenu: ChildMenu[];
}

interface ChildMenu {
    childMenuName: string;
    childMenuUrl?: string;
    subMenu: SubMenu[];
}

interface SubMenu {
    submenuName: string;
    submenuUrl: string;
}

// Icon mapping
const iconMap: { [key: string]: React.ElementType } = {
    dashboard: DashboardIcon,
    people: PeopleIcon,
    business: BusinessIcon,
    assignment: AssignmentIcon,
    settings: SettingsIcon,
    description: DescriptionIcon,
    assessment: AssessmentIcon,
};

const ModernSidebar: React.FC<ModernSidebarProps> = ({
    mobileOpen,
    onMobileClose,
    collapsed,
    drawerWidth,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response: any = await authService.getUserMenu();
            if (response.statusCode === 0) {
                setMenus(response.payload.accessedItem || []);
            }
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        }
    };

    const handleMenuClick = (menuName: string, url?: string) => {
        if (menuName == "dashboard") {            
            navigate('/admin/dashboard');
         } else {
            if (url) {
                const cleanUrl = url.replace('/healthinv/#', '');
                navigate(cleanUrl);
                if (isMobile) onMobileClose();
            } else {
                setExpandedMenus((prev) => ({
                    ...prev,
                    [menuName]: !prev[menuName],
                }));
            }
        }
    };


    const handleSubmenuClick = (url: string) => {
        const cleanUrl = url.replace('/healthinv/#', '');
        navigate(cleanUrl);
        if (isMobile) onMobileClose();
    };

    const isActive = (url?: string) => {
        if (!url) return false;
        const cleanUrl = url.replace('/healthinv/#', '');
        return location.pathname === cleanUrl;
    };

    const getIcon = (iconName?: string) => {
        const IconComponent = iconName ? iconMap[iconName.toLowerCase()] : DashboardIcon;
        return IconComponent ? <IconComponent /> : <DashboardIcon />;
    };

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                color: 'white',
                borderRadius:"0",
                pt: { xs: 7, sm: 8 }, // Push content below header
            }}
        >
            {/* Logo Section with Back Arrow */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    // borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Back Arrow */}
                <IconButton
                    onClick={onMobileClose}
                    sx={{
                        color: 'white',
                        alignSelf: 'flex-start',
                        p: 0.5,
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </Box>

            {/* Menu Items */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
                <List sx={{ px: 0 }}>
                    <Box>
                        <ListItemButton
                            onClick={() => handleMenuClick("dashboard")}
                            sx={{
                                py: 1.5,
                                px: 3,
                                color: 'white',
                                transition: 'all 0.2s ease',
                                // bgcolor: menuActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {getIcon("Dashboard")}
                            </ListItemIcon>
                            <ListItemText
                                primary="Dashboard"
                                primaryTypographyProps={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    color: "#fff"
                                }}
                            />
                        </ListItemButton>
                    </Box>
                    {/* Dynamic Menus */}
                    {menus.map((menu) => {
                        const hasChildren = menu.childMenu && menu.childMenu.length > 0;
                        const isExpanded = expandedMenus[menu.menuName];
                        const menuActive = isActive(menu.menuUrl);

                        return (
                            <Box key={menu.menuName}>
                                <ListItemButton
                                    onClick={() => handleMenuClick(menu.menuName, menu.menuUrl)}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        color: 'white',
                                        transition: 'all 0.2s ease',
                                        bgcolor: menuActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                        {getIcon(menu.menuIcon)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={menu.menuName}
                                        primaryTypographyProps={{
                                            fontSize: '0.9375rem',
                                            fontWeight: 500,
                                            color: "#fff"
                                        }}
                                    />
                                    {hasChildren && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                color: 'white',
                                                p: 0.5,
                                            }}
                                        >
                                            {isExpanded ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                                        </IconButton>
                                    )}
                                </ListItemButton>

                                {/* Child Menus */}
                                {hasChildren && (
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <List sx={{ pl: 0, bgcolor: 'rgba(0, 0, 0, 0.1)' }}>
                                            {menu.childMenu.map((child) => {
                                                const hasSubMenu = child.subMenu && child.subMenu.length > 0;
                                                const childKey = `${menu.menuName}-${child.childMenuName}`;
                                                const childExpanded = expandedMenus[childKey];
                                                const childActive = isActive(child.childMenuUrl);

                                                return (
                                                    <Box key={child.childMenuName}>
                                                        {/* Child Menu Item */}
                                                        <ListItemButton
                                                            onClick={() => {
                                                                if (hasSubMenu) {
                                                                    setExpandedMenus((prev) => ({
                                                                        ...prev,
                                                                        [childKey]: !prev[childKey],
                                                                    }));
                                                                } else if (child.childMenuUrl) {
                                                                    handleSubmenuClick(child.childMenuUrl);
                                                                }
                                                            }}
                                                            sx={{
                                                                py: 1.25,
                                                                pl: 6,
                                                                pr: 3,
                                                                color: 'white',
                                                                bgcolor: childActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                                                },
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={child.childMenuName}
                                                                primaryTypographyProps={{
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 400,
                                                                    color: "#fff"
                                                                }}
                                                            />
                                                            {hasSubMenu && (
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        color: 'white',
                                                                        p: 0.5,
                                                                    }}
                                                                >
                                                                    {childExpanded ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                                                                </IconButton>
                                                            )}
                                                        </ListItemButton>

                                                        {/* Sub Menus */}
                                                        {hasSubMenu && (
                                                            <Collapse in={childExpanded} timeout="auto" unmountOnExit>
                                                                <List sx={{ pl: 0, bgcolor: 'rgba(0, 0, 0, 0.15)' }}>
                                                                    {child.subMenu.map((sub) => {
                                                                        const subActive = isActive(sub.submenuUrl);
                                                                        return (
                                                                            <ListItemButton
                                                                                key={sub.submenuName}
                                                                                onClick={() => handleSubmenuClick(sub.submenuUrl)}
                                                                                sx={{
                                                                                    py: 1,
                                                                                    pl: 8,
                                                                                    pr: 3,
                                                                                    color: 'white',
                                                                                    bgcolor: subActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                                                                    '&:hover': {
                                                                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={sub.submenuName}
                                                                                    primaryTypographyProps={{
                                                                                        fontSize: '0.8125rem',
                                                                                        fontWeight: 400,
                                                                                        color: "#fff"
                                                                                    }}
                                                                                />
                                                                            </ListItemButton>
                                                                        );
                                                                    })}
                                                                </List>
                                                            </Collapse>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                )}
                            </Box>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
console.log(":123456",mobileOpen, drawerWidth)
    return (
        <>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        // borderRight: 'none',
                        borderRadius:"0",
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        // borderRight: 'none',
                        overflowX: 'hidden',
                        borderRadius:"0",
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default ModernSidebar;