// src/pages/WorkerManagement.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Mock worker data
const workerData = [
  {
    id: 1,
    name: 'John Smith',
    employeeId: 'MIN001',
    avatar: 'JS',
    department: 'Excavation',
    shift: 'Morning (6AM-2PM)',
    todayCompliance: 95,
    weeklyAvg: 92,
    monthlyAvg: 94,
    totalViolations: 1,
    lastCheck: '10:30 AM',
    status: 'compliant',
    ppeItems: ['Helmet', 'Boots', 'Vest', 'Lamp', 'Detector', 'Rescuer']
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    employeeId: 'MIN002',
    avatar: 'SJ',
    department: 'Transport',
    shift: 'Evening (2PM-10PM)',
    todayCompliance: 88,
    weeklyAvg: 85,
    monthlyAvg: 87,
    totalViolations: 3,
    lastCheck: '10:15 AM',
    status: 'warning',
    ppeItems: ['Boots', 'Vest', 'Lamp', 'Detector']
  },
  {
    id: 3,
    name: 'Mike Williams',
    employeeId: 'MIN003',
    avatar: 'MW',
    department: 'Maintenance',
    shift: 'Night (10PM-6AM)',
    todayCompliance: 100,
    weeklyAvg: 98,
    monthlyAvg: 99,
    totalViolations: 0,
    lastCheck: '09:45 AM',
    status: 'compliant',
    ppeItems: ['Helmet', 'Boots', 'Vest', 'Lamp', 'Detector', 'Rescuer']
  },
  {
    id: 4,
    name: 'Emma Davis',
    employeeId: 'MIN004',
    avatar: 'ED',
    department: 'Safety',
    shift: 'Morning (6AM-2PM)',
    todayCompliance: 92,
    weeklyAvg: 90,
    monthlyAvg: 91,
    totalViolations: 2,
    lastCheck: '10:00 AM',
    status: 'compliant',
    ppeItems: ['Helmet', 'Boots', 'Vest', 'Lamp', 'Rescuer']
  },
  {
    id: 5,
    name: 'Robert Brown',
    employeeId: 'MIN005',
    avatar: 'RB',
    department: 'Excavation',
    shift: 'Evening (2PM-10PM)',
    todayCompliance: 85,
    weeklyAvg: 82,
    monthlyAvg: 84,
    totalViolations: 5,
    lastCheck: '09:30 AM',
    status: 'non-compliant',
    ppeItems: ['Helmet', 'Vest', 'Lamp']
  },
  {
    id: 6,
    name: 'Lisa Wilson',
    employeeId: 'MIN006',
    avatar: 'LW',
    department: 'Transport',
    shift: 'Morning (6AM-2PM)',
    todayCompliance: 96,
    weeklyAvg: 94,
    monthlyAvg: 95,
    totalViolations: 1,
    lastCheck: '09:15 AM',
    status: 'compliant',
    ppeItems: ['Helmet', 'Boots', 'Vest', 'Lamp', 'Detector', 'Rescuer']
  },
  {
    id: 7,
    name: 'David Miller',
    employeeId: 'MIN007',
    avatar: 'DM',
    department: 'Maintenance',
    shift: 'Night (10PM-6AM)',
    todayCompliance: 89,
    weeklyAvg: 87,
    monthlyAvg: 88,
    totalViolations: 4,
    lastCheck: '08:45 AM',
    status: 'warning',
    ppeItems: ['Boots', 'Vest', 'Lamp', 'Detector']
  },
  {
    id: 8,
    name: 'Maria Garcia',
    employeeId: 'MIN008',
    avatar: 'MG',
    department: 'Safety',
    shift: 'Evening (2PM-10PM)',
    todayCompliance: 94,
    weeklyAvg: 92,
    monthlyAvg: 93,
    totalViolations: 2,
    lastCheck: '08:30 AM',
    status: 'compliant',
    ppeItems: ['Helmet', 'Boots', 'Vest', 'Lamp', 'Rescuer']
  }
];

const WorkerManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerMenuAnchor, setWorkerMenuAnchor] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleWorkerMenuClick = (event, worker) => {
    setSelectedWorker(worker);
    setWorkerMenuAnchor(event.currentTarget);
  };

  const handleWorkerMenuClose = () => {
    setWorkerMenuAnchor(null);
    setSelectedWorker(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'default';
    }
  };

  const getComplianceColor = (percentage) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#ff9800';
    return '#f44336';
  };

  // Filter workers based on search
  const filteredWorkers = workerData.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalWorkers = workerData.length;
  const avgCompliance = Math.round(workerData.reduce((sum, worker) => sum + worker.todayCompliance, 0) / totalWorkers);
  const compliantWorkers = workerData.filter(w => w.status === 'compliant').length;
  const warningWorkers = workerData.filter(w => w.status === 'warning').length;
  const nonCompliantWorkers = workerData.filter(w => w.status === 'non-compliant').length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Worker Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor and manage worker PPE compliance records
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ bgcolor: '#1a237e' }}
        >
          Export Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Workers
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totalWorkers}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ color: '#2196f3', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Compliance
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: getComplianceColor(avgCompliance) }}>
                    {avgCompliance}%
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: getComplianceColor(avgCompliance), fontSize: 40 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={avgCompliance} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Compliant Workers
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#4caf50' }}>
                    {compliantWorkers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((compliantWorkers / totalWorkers) * 100)}% of total
                  </Typography>
                </Box>
                <CheckIcon sx={{ color: '#4caf50', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Need Attention
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#f44336' }}>
                    {nonCompliantWorkers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {warningWorkers} warnings
                  </Typography>
                </Box>
                <WarningIcon sx={{ color: '#f44336', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search workers by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={handleFilterClose}>All Workers</MenuItem>
              <MenuItem onClick={handleFilterClose}>Compliant Only</MenuItem>
              <MenuItem onClick={handleFilterClose}>Need Attention</MenuItem>
              <MenuItem onClick={handleFilterClose}>By Department</MenuItem>
              <MenuItem onClick={handleFilterClose}>By Shift</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Paper>

      {/* Workers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Today's Compliance</TableCell>
                <TableCell>Weekly Avg</TableCell>
                <TableCell>Violations</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Check</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((worker) => (
                  <TableRow key={worker.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#1a237e' }}>
                          {worker.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {worker.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {worker.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={worker.department} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{worker.shift}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={worker.todayCompliance} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getComplianceColor(worker.todayCompliance)
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: getComplianceColor(worker.todayCompliance) }}>
                          {worker.todayCompliance}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{worker.weeklyAvg}%</TableCell>
                    <TableCell>
                      <Chip
                        icon={worker.totalViolations > 0 ? <WarningIcon /> : <CheckIcon />}
                        label={worker.totalViolations}
                        color={worker.totalViolations > 0 ? 'error' : 'success'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={worker.status.replace('-', ' ')}
                        color={getStatusColor(worker.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{worker.lastCheck}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleWorkerMenuClick(e, worker)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWorkers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Worker Actions Menu */}
      <Menu
        anchorEl={workerMenuAnchor}
        open={Boolean(workerMenuAnchor)}
        onClose={handleWorkerMenuClose}
      >
        <MenuItem onClick={handleWorkerMenuClose}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleWorkerMenuClose}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleWorkerMenuClose}>
          <WarningIcon sx={{ mr: 1 }} fontSize="small" />
          Flag for Review
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkerManagement;