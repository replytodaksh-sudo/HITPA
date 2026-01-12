import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    InputAdornment,
    Grid,
    useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import tatRuleService from '../../services/tatRuleService';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const TatRuleComponent = () => {
    const theme = useTheme();
    const [tatTableData, setTatTableData] = useState([]);
    const [caseTypeOptions, setCaseTypeOptions] = useState([]);
    const [tatRangeOptions, setTatRangeOptions] = useState([]);
    const [userTypeOptions, setUserTypeOptions] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTatCode, setSelectedTatCode] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        ctype: '',
        range1: '',
        range2: '',
        rangetype: '',
        color: '#000000',
        status: false,
        escalation: [''],
    });

    // Initialize component
    useEffect(() => {
        getCaseType();
        getUserType();
        getTatRangeType();
        getTatTableData();
    }, []);

    // Fetch functions
    const getCaseType = async () => {
        const response = await tatRuleService.getCodeType('caseType');
        setCaseTypeOptions(response.payload);
    };

    const getTatRangeType = async () => {
        const response = await tatRuleService.getCodeType('tatRangeType');
        setTatRangeOptions(response.payload);
    };

    const getUserType = async () => {
        const response = await tatRuleService.getCodeType('userType');
        setUserTypeOptions(response.payload);
    };

    const getTatTableData = async () => {
        const response = await tatRuleService.getTats();
        setTatTableData(response.payload);
    };

    // Form handlers
    const handleInputChange = (field: any, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEscalationChange = (index: any, value: any) => {
        const newEscalation = [...formData.escalation];
        newEscalation[index] = value;
        setFormData((prev) => ({ ...prev, escalation: newEscalation }));
    };

    const addEscalation = () => {
        setFormData((prev) => ({
            ...prev,
            escalation: [...prev.escalation, ''],
        }));
    };

    const removeEscalation = (index: any) => {
        const newEscalation = formData.escalation.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, escalation: newEscalation }));
    };

    // Modal handlers
    const openAddModal = () => {
        setFormData({
            title: '',
            ctype: '',
            range1: '',
            range2: '',
            rangetype: '',
            color: '#000000',
            status: false,
            escalation: [''],
        });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setSelectedTatCode('');
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedTatCode('');
    };

    // CRUD operations
    const handleSubmit = async () => {
        const payload: any = {
            caseType: formData.ctype,
            colorCode: formData.color,
            escalation: formData.escalation.filter((e) => e !== ''),
            status: formData.status ? 1 : 0,
            tatRange1: formData.range1,
            tatRange2: formData.range2,
            tatRangeType: formData.rangetype,
            tatRuleName: formData.title,
        };

        if (!isEdit) {
            const response = await tatRuleService.submitTatRule(payload);
            if (response.statusCode === 0) {
                getTatTableData();
            }
        } else {
            payload.tatCode = selectedTatCode;
            await tatRuleService.updateTat(selectedTatCode, payload);
            getTatTableData();
        }

        closeModal();
    };

    const handleEdit = async (tatCode: any) => {
        setSelectedTatCode(tatCode);
        setIsEdit(true);

        const response = await tatRuleService.getTatDetails(tatCode);
        const data = response.payload;

        setFormData({
            title: data.tatRuleName,
            ctype: data.caseTypeCode,
            range1: data.tatRange1,
            range2: data.tatRange2,
            rangetype: data.tatRangeType,
            color: data.colorCode,
            status: data.status === 1,
            escalation: data.escalation && data.escalation.length > 0 ? data.escalation : [''],
        });

        setIsModalOpen(true);
    };

    const handleDelete = (tatCode: any) => {
        setSelectedTatCode(tatCode);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        await tatRuleService.deleteTat(selectedTatCode);
        getTatTableData();
        closeDeleteModal();
    };

    const columns: GridColDef[] = [
        {
            field: 'tatCode',
            headerName: '#',
            width: 80,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'tatRuleName',
            headerName: 'TAT Rule Title',
            width: 250,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'caseType',
            headerName: 'Case Type',
            width: 250,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'tatDescription',
            headerName: 'TAT Day/Hrs Range',
            width: 150,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'colorCode',
            headerName: 'Color Code',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: any) => (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: params.colorCode,
                        borderRadius: 1,
                        margin: '0 auto',
                        border: '1px solid #ddd',
                    }}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: any) => (
                <Box>{params.status ? 'Active' : 'Inactive'}</Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params: any) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEdit(params.tatCode)}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.tatCode)}
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openAddModal}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                        },
                    }}
                >
                    Add New TAT
                </Button>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={tatTableData}
                    columns={columns}
                    // loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            borderColor: theme.palette.divider,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                            color: '#7a7a7a',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            borderRadius: 0,
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 700,
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.08)',
                        },
                    }}
                />
            </Box>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            {isEdit ? 'Edit TAT Rule' : 'New TAT Rule'}
                        </Typography>
                        <IconButton onClick={closeModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* TAT Rule Title */}
                        <TextField
                            fullWidth
                            label="TAT Rule Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter Title"
                        />

                        {/* Case Type */}
                        <FormControl fullWidth>
                            <InputLabel>Case Type</InputLabel>
                            <Select
                                value={formData.ctype}
                                onChange={(e) => handleInputChange('ctype', e.target.value)}
                                label="Case Type"
                            >
                                <MenuItem value="">--- Case Type ---</MenuItem>
                                {caseTypeOptions.map((option: any) => (
                                    <MenuItem key={option.code} value={option.code}>
                                        {option.codeDescription}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* TAT Range */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>TAT Range</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={formData.range1}
                                        onChange={(e) => handleInputChange('range1', e.target.value)}
                                        placeholder="Min"
                                    />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={formData.range2}
                                        onChange={(e) => handleInputChange('range2', e.target.value)}
                                        placeholder="Max"
                                    />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={formData.rangetype}
                                            onChange={(e) => handleInputChange('rangetype', e.target.value)}
                                        >
                                            {tatRangeOptions.map((option: any) => (
                                                <MenuItem key={option.code} value={option.code}>
                                                    {option.codeDescription}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Color Code */}
                        <TextField
                            fullWidth
                            label="Color Code"
                            type="color"
                            value={formData.color}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">#</InputAdornment>,
                            }}
                        />

                        {/* Escalation */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Escalation to</Typography>
                            {formData.escalation.map((escal, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ minWidth: 30 }}>{index + 1}.</Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            value={escal}
                                            onChange={(e) => handleEscalationChange(index, e.target.value)}
                                        >
                                            {userTypeOptions.map((option: any) => (
                                                <MenuItem key={option.code} value={option.code}>
                                                    {option.codeDescription}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {formData.escalation.length > 1 && (
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeEscalation(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            <Button
                                variant="text"
                                startIcon={<AddIcon />}
                                onClick={addEscalation}
                                sx={{ mt: 1 }}
                            >
                                Add More
                            </Button>
                        </Box>

                        {/* Status */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.checked)}
                                />
                            }
                            label="Enable Rule"
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={closeModal}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Confirm Delete</Typography>
                        <IconButton onClick={closeDeleteModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Typography>Are you sure you want to delete this TAT rule?</Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
                    <Button variant="contained" color="error" onClick={confirmDelete}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TatRuleComponent;