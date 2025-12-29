// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { 
  Grid, Paper, Typography, Box, 
  Card, CardContent, LinearProgress,
  IconButton, Tooltip, Button, Chip,
  List, ListItem, ListItemText, ListItemIcon,
  Avatar, Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Security as SecurityIcon,
  DirectionsWalk as WalkIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const stats = {
    overallCompliance: 92,
    activeWorkers: 156,
    workersUnderground: 42,
    nonComplianceCount: 8,
    todayEntries: 89,
    yesterdayCompliance: 88
  };

  // Chart Data
  const chartData = {
    labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    datasets: [
      {
        label: 'Compliance Rate',
        data: [85, 88, 92, 95, 90, 87, 85],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Violations',
        data: [15, 12, 8, 5, 10, 13, 15],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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

  // PPE Items Status
  const ppeItems = [
    { name: 'Helmet', compliance: 98, color: '#4caf50' },
    { name: 'Safety Boots', compliance: 95, color: '#4caf50' },
    { name: 'Reflective Vest', compliance: 96, color: '#4caf50' },
    { name: 'Cap Lamp', compliance: 99, color: '#4caf50' },
    { name: 'Gas Detector', compliance: 92, color: '#ff9800' },
    { name: 'Self-Rescuer', compliance: 90, color: '#ff9800' },
  ];

  // Recent Events
  const recentEvents = [
    { id: 1, worker: 'John Smith', status: 'compliant', time: '10:30 AM', gate: 'Gate 1' },
    { id: 2, worker: 'Sarah Johnson', status: 'non-compliant', time: '10:15 AM', gate: 'Gate 1', missing: 'Helmet' },
    { id: 3, worker: 'Mike Williams', status: 'compliant', time: '09:45 AM', gate: 'Gate 2' },
    { id: 4, worker: 'Emma Davis', status: 'compliant', time: '09:30 AM', gate: 'Gate 3' },
    { id: 5, worker: 'Robert Brown', status: 'warning', time: '09:15 AM', gate: 'Gate 2', missing: 'Gas Detector' },
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
            Smart PPE Compliance Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Underground Coal Mine Safety Monitoring System
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            icon={<ArrowUpwardIcon />} 
            label={`+${stats.overallCompliance - stats.yesterdayCompliance}% from yesterday`}
            color="success" 
            variant="outlined"
          />
          <Tooltip title="Refresh Data">
            <IconButton color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #4caf50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Overall Compliance
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#4caf50' }}>
                    {stats.overallCompliance}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.todayEntries} entries today
                  </Typography>
                </Box>
                <Box sx={{ color: '#4caf50' }}>
                  <DashboardIcon fontSize="large" />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.overallCompliance} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Workers
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#2196f3' }}>
                    {stats.activeWorkers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.workersUnderground} underground
                  </Typography>
                </Box>
                <Box sx={{ color: '#2196f3' }}>
                  <PeopleIcon fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #f44336' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Non-Compliance
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#f44336' }}>
                    {stats.nonComplianceCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Today • 2 repeat offenders
                  </Typography>
                </Box>
                <Box sx={{ color: '#f44336' }}>
                  <WarningIcon fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Alerts & Warnings
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#ff9800' }}>
                    5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3 critical • 2 warnings
                  </Typography>
                </Box>
                <Box sx={{ color: '#ff9800' }}>
                  <NotificationsIcon fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Real-Time Monitoring */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: '#1a237e' }} />
              <Typography variant="h6">Real-Time Compliance Monitoring</Typography>
              <Chip label="Live" color="error" size="small" sx={{ ml: 2 }} />
            </Box>
            
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem
                    secondaryAction={
                      <Chip
                        icon={event.status === 'compliant' ? <CheckCircleIcon /> : <CancelIcon />}
                        label={event.status === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                        color={event.status === 'compliant' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: event.status === 'compliant' ? '#4caf50' : 
                                 event.status === 'warning' ? '#ff9800' : '#f44336'
                      }}>
                        {event.worker.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={event.worker}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {event.gate} • {event.time}
                          </Typography>
                          {event.missing && (
                            <Typography component="span" variant="caption" color="error" display="block">
                              Missing: {event.missing}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentEvents.length - 1 && <Divider variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Compliance Trends Chart */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ mr: 1, color: '#1a237e' }} />
              <Typography variant="h6">Compliance Trends - Today</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Active Alerts */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              Active Alerts
            </Typography>
            <List dense>
              <ListItem sx={{ bgcolor: '#fff3e0', borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="Critical: Missing Helmet" 
                  secondary="Gate 1 • 10:15 AM • MIN002"
                />
              </ListItem>
              <ListItem sx={{ bgcolor: '#fff3e0', borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="Warning: Low RFID Battery" 
                  secondary="Gate 2 • 09:30 AM"
                />
              </ListItem>
              <ListItem sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <SecurityIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Info: System Maintenance" 
                  secondary="Camera #4 • 2:00 PM Today"
                />
              </ListItem>
            </List>
            <Button fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
              View All Alerts
            </Button>
          </Paper>

          {/* PPE Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              PPE Compliance by Item
            </Typography>
            <Grid container spacing={1}>
              {ppeItems.map((item) => (
                <Grid item xs={6} key={item.name}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: item.color }}>
                      {item.compliance}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.compliance} 
                      sx={{ height: 4, mt: 0.5 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Gate Status */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WalkIcon sx={{ mr: 1 }} />
              Entry Gate Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip label="Gate 1" color="success" sx={{ mb: 1 }} />
                  <Typography variant="h4">48</Typography>
                  <Typography variant="caption">Entries Today</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip label="Gate 2" color="success" sx={{ mb: 1 }} />
                  <Typography variant="h4">32</Typography>
                  <Typography variant="caption">Entries Today</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip label="RFID" color="success" sx={{ mb: 1 }} />
                  <Typography variant="caption">All Active</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip label="Cameras" color="warning" sx={{ mb: 1 }} />
                  <Typography variant="caption">1 Maintenance</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;