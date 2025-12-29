// src/pages/Reports.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [reportType, setReportType] = useState('compliance');

  // Bar Chart Data
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Compliance Rate',
        data: [88, 92, 90, 95, 93, 89, 91],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: '#4caf50',
        borderWidth: 1,
      },
      {
        label: 'Violations',
        data: [12, 8, 10, 5, 7, 11, 9],
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: '#f44336',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Compliance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        }
      }
    }
  };

  // Department-wise Data
  const departmentData = [
    { department: 'Excavation', compliance: 91, workers: 45, violations: 8 },
    { department: 'Transport', compliance: 88, workers: 32, violations: 12 },
    { department: 'Maintenance', compliance: 95, workers: 28, violations: 3 },
    { department: 'Safety', compliance: 93, workers: 18, violations: 5 },
    { department: 'Administration', compliance: 98, workers: 12, violations: 1 },
  ];

  // Recent Reports
  const reportHistory = [
    { id: 1, name: 'Daily Compliance Report', date: '2024-01-15', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Weekly Safety Analysis', date: '2024-01-14', type: 'Excel', size: '3.1 MB' },
    { id: 3, name: 'Monthly Compliance Summary', date: '2024-01-10', type: 'PDF', size: '4.2 MB' },
    { id: 4, name: 'PPE Audit Report', date: '2024-01-05', type: 'PDF', size: '1.8 MB' },
    { id: 5, name: 'Violation Trends', date: '2024-01-01', type: 'Excel', size: '2.7 MB' },
  ];

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
            Compliance Reports
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Generate and analyze PPE compliance reports
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ bgcolor: '#1a237e' }}
          >
            Export All
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="compliance">Compliance Report</MenuItem>
                <MenuItem value="violations">Violation Report</MenuItem>
                <MenuItem value="ppe">PPE Usage Report</MenuItem>
                <MenuItem value="worker">Worker Performance</MenuItem>
                <MenuItem value="department">Department Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              defaultValue="2024-01-08"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              defaultValue="2024-01-15"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<FilterIcon />}>
                Apply Filters
              </Button>
              <Button variant="outlined" startIcon={<EmailIcon />}>
                Email Report
              </Button>
              <Button variant="contained" sx={{ bgcolor: '#4caf50' }}>
                Generate Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Compliance
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#4caf50' }}>
                    92.5%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    +2.3% from last week
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Violations
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#f44336' }}>
                    48
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    -12% from last week
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ color: '#f44336', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Reports Generated
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    156
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This month
                  </Typography>
                </Box>
                <PdfIcon sx={{ color: '#ff9800', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Scheduled Reports
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    8
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Auto-generated
                  </Typography>
                </Box>
                <CalendarIcon sx={{ color: '#2196f3', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Bar data={barChartData} options={chartOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Department Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Compliance</TableCell>
                    <TableCell align="right">Violations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentData.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell>{dept.department}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${dept.compliance}%`} 
                          size="small"
                          color={dept.compliance >= 90 ? 'success' : dept.compliance >= 80 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="text.secondary">
                          {dept.violations}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Report History */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recent Reports
          </Typography>
          <TextField
            size="small"
            placeholder="Search reports..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Date Generated</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportHistory.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={report.type === 'PDF' ? <PdfIcon /> : <ExcelIcon />}
                      label={report.type}
                      size="small"
                      color={report.type === 'PDF' ? 'error' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EmailIcon />
                    </IconButton>
                    <IconButton size="small">
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Reports;