import type { SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    OutlinedInput,
    TextField,
    Stack,
    Avatar,
    useTheme,
    alpha,
    IconButton,
    Fade,
    Zoom,
} from '@mui/material';
import {
    AccountBalance as AccountBalanceIcon,
    Business as BusinessIcon,
    Payment as PaymentIcon,
    Receipt as ReceiptIcon,
    FilterList as FilterListIcon,
    Clear as ClearIcon,
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
    KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboard.service';
import { authService } from '../../services/auth.service';
import { CircularProgress, Backdrop } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

// Types
interface Zone {
    zoneCode: string;
    zoneName: string;
}

interface State {
    stateCode: string;
    stateName: string;
}

interface City {
    cityCode: string;
    cityName: string;
}

interface Agency {
    agencyCode: string;
    agencyName: string;
}

interface TeamMember {
    userCode: string;
    name: string;
}

interface SubTypeMenu {
    label: string;
    value: number;
}

interface DashboardData {
    dashBoardInvestigationDTO: Array<{
        subTypeMenu: SubTypeMenu[];
    }>;
    dashBoardQCDTO: Array<{
        subTypeMenu: SubTypeMenu[];
    }>;
    totalCount?: number; // Added to match API response for counts
}

interface StatCard {
    type: string;
    title: string;
    count: number;
    icon: React.ReactElement;
    gradient: string;
    change: string;
}

const Dashboard: React.FC = () => {
    const theme = useTheme();

    // State management
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [selectedCaseType, setSelectedCaseType] = useState<string>('');
    const [roleName, setRoleName] = useState<string>('Central Manager');
    const [loading, setLoading] = useState(false);

    // Filter states
    const [zones, setZones] = useState<Zone[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [regionalManagers, setRegionalManagers] = useState<TeamMember[]>([]);
    const [fieldOfficers, setFieldOfficers] = useState<TeamMember[]>([]);

    // Selected filters
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
    const [selectedRegionalManagers, setSelectedRegionalManagers] = useState<string[]>([]);
    const [selectedFieldOfficers, setSelectedFieldOfficers] = useState<string[]>([]);

    // Date filters
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    // UI states
    const [showClearFilter, setShowClearFilter] = useState<boolean>(false);

    // Counts
    const [retailCashlessCount, setRetailCashlessCount] = useState<number>(0);
    const [groupCashlessCount, setGroupCashlessCount] = useState<number>(0);
    const [retailReimbursementCount, setRetailReimbursementCount] = useState<number>(0);
    const [groupReimbursementCount, setGroupReimbursementCount] = useState<number>(0);

    // Chart data with modern colors
    const [chartData, setChartData] = useState({
        labels: ['Active Cases', 'Completed Cases'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                'rgba(127, 86, 217, 0.8)',
                'rgba(38, 194, 129, 0.8)',
            ],
            borderWidth: 0,
            hoverOffset: 15,
            hoverBorderWidth: 3,
            hoverBorderColor: '#fff',
        }]
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 25,
                    font: {
                        size: 14,
                        weight: 600,
                        family: 'Inter',
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: theme.palette.text.primary,
                }
            },
            tooltip: {
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 16,
                displayColors: true,
                boxPadding: 8,
                titleFont: {
                    size: 14,
                    weight: 700,
                },
                bodyFont: {
                    size: 13,
                    weight: 500,
                },
                cornerRadius: 12,
            }
        }
    };

    useEffect(() => {
        initializeDashboard();
    }, []);

    const initializeDashboard = async () => {
        await fetchRoleName();
        await fetchZones();
        await getDashboardCounts();
        await fetchAllDashboardDetails();
    };

    const fetchRoleName = async () => {
        try {
            const response = await authService.getUserMenu();
            if (response.statusCode === 0) {
                sessionStorage.setItem("roleName", response.payload.roleName);
                setRoleName(response.payload.roleName);

                const role = response.payload.roleName;

                if (role === 'Central Manager' || role === 'Agency Spoc') {
                    await fetchRegionalManagers();
                }
                if (role === 'Agency Spoc') {
                    await fetchFieldOfficers();
                }
                if (role === 'Regional Manager') {
                    await fetchAgencies();
                }
                if (role === 'Field Officer') {
                    await fetchStates();
                }
            }
        } catch (error) {
            console.error('Failed to fetch role:', error);
            setRoleName(sessionStorage.getItem('roleName') || 'Central Manager');
        }
    };

    const fetchZones = async () => {
        try {
            const response = await dashboardService.getUserZones();
            if (response.statusCode === 0) {
                setZones(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch zones:', error);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await dashboardService.getStates();
            if (response.statusCode === 0) {
                setStates(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch states:', error);
        }
    };

    const fetchAgencies = async () => {
        try {
            const response = await dashboardService.getAllAgencies();
            if (response.statusCode === 0) {
                setAgencies(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch agencies:', error);
        }
    };

    const fetchRegionalManagers = async () => {
        try {
            const response = await dashboardService.getRegionalUsers();
            if (response.statusCode === 0) {
                setRegionalManagers(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch regional managers:', error);
        }
    };

    const fetchFieldOfficers = async () => {
        try {
            const response = await dashboardService.getFieldOfficers();
            if (response.statusCode === 0) {
                setFieldOfficers(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch field officers:', error);
        }
    };

    const getDashboardCounts = async () => {
        try {
            // Fetch individual counts
            const retailCashless = await dashboardService.getAllDashboardDetails('cashless', 1);
            const groupCashless = await dashboardService.getAllDashboardDetails('cashless', 0);
            const retailReimbursement = await dashboardService.getAllDashboardDetails('reimbursement', 1);
            const groupReimbursement = await dashboardService.getAllDashboardDetails('reimbursement', 0);

            // payload may not be typed as an object with totalCount, so cast to any (or a narrow type) when reading totalCount
            if (retailCashless.statusCode === 0) {
                setRetailCashlessCount(((retailCashless.payload) as any).totalCount ?? 0);
            }
            if (groupCashless.statusCode === 0) {
                setGroupCashlessCount(((groupCashless.payload) as any).totalCount ?? 0);
            }
            if (retailReimbursement.statusCode === 0) {
                setRetailReimbursementCount(((retailReimbursement.payload) as any).totalCount ?? 0);
            }
            if (groupReimbursement.statusCode === 0) {
                setGroupReimbursementCount(((groupReimbursement.payload) as any).totalCount ?? 0);
            }
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const fetchAllDashboardDetails = async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getAllDashboard();

            if (response.statusCode === 0) {
                setDashboardData(response.payload);
                updateChartData(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = (data: DashboardData) => {
        if (!data) return;

        const investigationData = data.dashBoardInvestigationDTO;
        const qcData = data.dashBoardQCDTO;

        const activeCase = sumCaseData(investigationData[0].subTypeMenu) +
            sumCaseData(investigationData[1].subTypeMenu) +
            (qcData.length > 0 ? sumCaseData(qcData[0].subTypeMenu) : 0);

        const completedCase = sumCaseData(investigationData[2].subTypeMenu);

        setChartData({
            ...chartData,
            datasets: [{
                ...chartData.datasets[0],
                data: [activeCase, completedCase]
            }]
        });
    };

    const sumCaseData = (list: SubTypeMenu[]) => {
        return list.reduce((total, item) => total + Math.round(item.value), 0);
    };

    const handleCaseTypeChange = async (caseType: string) => {
        setSelectedCaseType(caseType);
        setLoading(true);

        try {
            let response;

            if (caseType === 'retailCashless') {
                response = await dashboardService.getAllDashboardDetails('cashless', 1);
            } else if (caseType === 'groupCashless') {
                response = await dashboardService.getAllDashboardDetails('cashless', 0);
            } else if (caseType === 'retailReimbursement') {
                response = await dashboardService.getAllDashboardDetails('reimbursement', 1);
            } else if (caseType === 'groupReimbursement') {
                response = await dashboardService.getAllDashboardDetails('reimbursement', 0);
            }

            if (response && response.statusCode === 0) {
                setDashboardData(response.payload);
                updateChartData(response.payload);
            }
        } catch (error) {
            console.error('Failed to change case type:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleZoneChange = async (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        const selectedZoneCodes = typeof value === 'string' ? value.split(',') : value;
        setSelectedZones(selectedZoneCodes);

        if (selectedZoneCodes.length === 0) {
            setStates([]);
            return;
        }

        try {
            const response = roleName === 'Central Manager'
                ? await dashboardService.getStatesByZones(selectedZoneCodes)
                : await dashboardService.getUserStatesByZones(selectedZoneCodes);

            if (response.statusCode === 0) {
                setStates(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch states:', error);
        }
    };

    const handleStateChange = async (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        const selectedStateCodes = typeof value === 'string' ? value.split(',') : value;
        setSelectedStates(selectedStateCodes);

        if (selectedStateCodes.length === 0) {
            setCities([]);
            return;
        }

        try {
            const response = roleName === 'Central Manager'
                ? await dashboardService.getCitiesByStates(selectedStateCodes)
                : await dashboardService.getUserCitiesByStates(selectedStateCodes);

            if (response.statusCode === 0) {
                setCities(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const applyFilter = async () => {
        if (selectedZones.length > 0 && selectedStates.length === 0) {
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: {
                    message: 'Please select states for the selected zones',
                    type: 'warning'
                }
            }));
            return;
        }

        setShowClearFilter(true);
        setLoading(true);

        try {
            const filters = {
                caseType: selectedCaseType || 'cashless',
                retailType: selectedCaseType.includes('retail') ? 1 : 0,
                stateCodes: selectedStates,
                cityCodes: selectedCities,
                agencyCodes: roleName === 'Central Manager'
                    ? selectedRegionalManagers
                    : selectedAgencies,
                maxTat: '15',
                fromDate,
                toDate,
            };

            const response = await dashboardService.getDashboardWithFilters(filters);

            if (response.statusCode === 0) {
                setDashboardData(response.payload);
                updateChartData(response.payload);

                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                        message: 'Filters applied successfully',
                        type: 'success'
                    }
                }));
            }
        } catch (error) {
            console.error('Failed to apply filters:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        setSelectedZones([]);
        setSelectedStates([]);
        setSelectedCities([]);
        setSelectedAgencies([]);
        setSelectedRegionalManagers([]);
        setSelectedFieldOfficers([]);
        setFromDate('');
        setToDate('');
        setShowClearFilter(false);

        fetchAllDashboardDetails();

        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: {
                message: 'Filters cleared',
                type: 'info'
            }
        }));
    };

    const statCards: StatCard[] = [
        {
            type: 'retailCashless',
            title: 'Retail Cashless',
            count: retailCashlessCount,
            icon: <PaymentIcon sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
            change: '+12.5%',
        },
        {
            type: 'groupCashless',
            title: 'Group Cashless',
            count: groupCashlessCount,
            icon: <BusinessIcon sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #9C6DD9 0%, #6842A6 100%)',
            change: '+8.3%',
        },
        {
            type: 'retailReimbursement',
            title: 'Retail Reimbursement',
            count: retailReimbursementCount,
            icon: <ReceiptIcon sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
            change: '+5.7%',
        },
        {
            type: 'groupReimbursement',
            title: 'Group Reimbursement',
            count: groupReimbursementCount,
            icon: <AccountBalanceIcon sx={{ fontSize: 32 }} />,
            gradient: 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)',
            change: '+15.2%',
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            p: 4,
        }}>
            {loading && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(5px)',
                    }}
                    open={loading}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                            Loading...
                        </Typography>
                    </Box>
                </Backdrop>
            )}
            {/* Header */}
            <Fade in timeout={500}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'white',
                                fontWeight: 800,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            Dashboard Overview
                        </Typography>
                        <IconButton
                            onClick={fetchAllDashboardDetails}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    transform: 'rotate(180deg)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Welcome back! Here's what's happening with your cases today.
                    </Typography>
                </Box>
            </Fade>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.type}>
                        <Zoom in timeout={300 + index * 100}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    background: card.gradient,
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: selectedCaseType === card.type ? '3px solid white' : 'none',
                                    transform: selectedCaseType === card.type ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '150px',
                                        height: '150px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        transform: 'translate(50%, -50%)',
                                    }
                                }}
                                onClick={() => handleCaseTypeChange(card.type)}
                            >
                                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                                                {card.title}
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
                                                {card.count}
                                            </Typography>
                                            <Chip
                                                icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                                                label={card.change}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.25)',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        </Box>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                            }}
                                        >
                                            {card.icon}
                                        </Avatar>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                ))}
            </Grid>

            {/* Filters */}
            <Fade in timeout={700}>
                <Card sx={{ mb: 4, overflow: 'visible' }}>
                    <CardContent sx={{ pb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <FilterListIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Filters
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Refine your dashboard data
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            {roleName !== 'Field Officer' && (
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Zone</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedZones}
                                            onChange={handleZoneChange}
                                            input={<OutlinedInput label="Zone" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const zone = zones.find(z => z.zoneCode === value);
                                                        return <Chip key={value} label={zone?.zoneName} size="small" />;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {zones.map((zone) => (
                                                <MenuItem key={zone.zoneCode} value={zone.zoneCode}>
                                                    {zone.zoneName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        multiple
                                        value={selectedStates}
                                        onChange={handleStateChange}
                                        input={<OutlinedInput label="State" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const state = states.find(s => s.stateCode === value);
                                                    return <Chip key={value} label={state?.stateName} size="small" />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state.stateCode} value={state.stateCode}>
                                                {state.stateName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        multiple
                                        value={selectedCities}
                                        onChange={(e) => setSelectedCities(e.target.value as string[])}
                                        input={<OutlinedInput label="City" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const city = cities.find(c => c.cityCode === value);
                                                    return <Chip key={value} label={city?.cityName} size="small" />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {cities.map((city) => (
                                            <MenuItem key={city.cityCode} value={city.cityCode}>
                                                {city.cityName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {roleName === 'Central Manager' && (
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Regional Manager</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedRegionalManagers}
                                            onChange={(e) => setSelectedRegionalManagers(e.target.value as string[])}
                                            input={<OutlinedInput label="Regional Manager" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const manager = regionalManagers.find(m => m.userCode === value);
                                                        return <Chip key={value} label={manager?.name} size="small" />;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {regionalManagers.map((manager) => (
                                                <MenuItem key={manager.userCode} value={manager.userCode}>
                                                    {manager.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {roleName === 'Regional Manager' && (
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Agency</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedAgencies}
                                            onChange={(e) => setSelectedAgencies(e.target.value as string[])}
                                            input={<OutlinedInput label="Agency" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const agency = agencies.find(a => a.agencyCode === value);
                                                        return <Chip key={value} label={agency?.agencyName} size="small" />;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {agencies.map((agency) => (
                                                <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                                                    {agency.agencyName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {roleName === 'Agency Spoc' && (
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Field Officer</InputLabel>
                                        <Select
                                            multiple
                                            value={selectedFieldOfficers}
                                            onChange={(e) => setSelectedFieldOfficers(e.target.value as string[])}
                                            input={<OutlinedInput label="Field Officer" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const officer = fieldOfficers.find(o => o.userCode === value);
                                                        return <Chip key={value} label={officer?.name} size="small" />;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {fieldOfficers.map((officer) => (
                                                <MenuItem key={officer.userCode} value={officer.userCode}>
                                                    {officer.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {roleName === 'Field Officer' && (
                                <>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="From Date"
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="To Date"
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<FilterListIcon />}
                                        onClick={applyFilter}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                            px: 4,
                                        }}
                                    >
                                        Apply Filters
                                    </Button>
                                    {showClearFilter && (
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<ClearIcon />}
                                            onClick={clearFilter}
                                            sx={{ px: 4 }}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>

            {/* Dashboard Content */}
            {dashboardData && (
                <Grid container spacing={3}>
                    {/* Fresh Cases & Under QC */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Fade in timeout={900}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #FF4757 0%, #FF6348 100%)', color: 'white' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                            <PaymentIcon />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Fresh Cases
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 2.5, borderRadius: 3, backdropFilter: 'blur(10px)', mb: 3 }}>
                                        {dashboardData.dashBoardInvestigationDTO[0]?.subTypeMenu.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    '&:last-child': { mb: 0 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        borderRadius: 2,
                                                        px: 1.5,
                                                        py: 1,
                                                        ml: -1.5,
                                                        mr: -1.5,
                                                        cursor: 'pointer',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.label}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={item.value}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.25)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    <ArrowRightIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                            <BusinessIcon />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Under QC
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 2.5, borderRadius: 3, backdropFilter: 'blur(10px)' }}>
                                        {dashboardData.dashBoardQCDTO[0]?.subTypeMenu.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    '&:last-child': { mb: 0 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        borderRadius: 2,
                                                        px: 1.5,
                                                        py: 1,
                                                        ml: -1.5,
                                                        mr: -1.5,
                                                        cursor: 'pointer',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.label}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={item.value}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.25)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    <ArrowRightIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    {/* Chart */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Fade in timeout={1100}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                            <TrendingUpIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                Case Summary
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Overall performance
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <Box sx={{ width: '100%', height: '380px', position: 'relative' }}>
                                            <Doughnut data={chartData} options={chartOptions} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                    {sumCaseData(dashboardData.dashBoardInvestigationDTO[0].subTypeMenu) +
                                                        sumCaseData(dashboardData.dashBoardInvestigationDTO[1].subTypeMenu) +
                                                        sumCaseData(dashboardData.dashBoardInvestigationDTO[2].subTypeMenu) +
                                                        sumCaseData(dashboardData.dashBoardQCDTO[0].subTypeMenu)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    Total Cases
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    {/* On Field & Completed */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Fade in timeout={1300}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #26C281 0%, #1ABC9C 100%)', color: 'white' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                            <ReceiptIcon />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            On Field
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 2.5, borderRadius: 3, backdropFilter: 'blur(10px)', mb: 3 }}>
                                        {dashboardData.dashBoardInvestigationDTO[1]?.subTypeMenu.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    '&:last-child': { mb: 0 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        borderRadius: 2,
                                                        px: 1.5,
                                                        py: 1,
                                                        ml: -1.5,
                                                        mr: -1.5,
                                                        cursor: 'pointer',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.label}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={item.value}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.25)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    <ArrowRightIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                            <AccountBalanceIcon />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Completed
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 2.5, borderRadius: 3, backdropFilter: 'blur(10px)' }}>
                                        {dashboardData.dashBoardInvestigationDTO[2]?.subTypeMenu.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    '&:last-child': { mb: 0 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        borderRadius: 2,
                                                        px: 1.5,
                                                        py: 1,
                                                        ml: -1.5,
                                                        mr: -1.5,
                                                        cursor: 'pointer',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.label}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={item.value}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.25)',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    <ArrowRightIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;