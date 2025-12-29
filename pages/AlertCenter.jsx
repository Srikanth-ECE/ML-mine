// src/pages/AlertCenter.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const AlertCenter = () => {
  const [alertType, setAlertType] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    critical: true,
    warning: true,
    info: false
  });

  // Alert Data
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Missing Helmet Detected',
      description: 'Worker MIN002 entered without helmet',
      location: 'Gate 1',
      worker: 'Sarah Johnson',
      time: '10:15 AM',
      date: 'Today',
      status: 'active',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low RFID Reader Battery',
      description: 'RFID Reader #3 battery at 15%',
      location: 'Gate 2',
      time: '09:30 AM',
      date: 'Today',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'Camera System maintenance scheduled',
      location: 'Camera #4',
      time: '2:00 PM',
      date: 'Today',
      status: 'scheduled',
      priority: 'low'
    },
    {
      id: 4,
      type: 'critical',
      title: 'Gas Detector Missing',
      description: 'Worker MIN005 without gas detector',
      location: 'Gate 3',
      worker: 'Robert Brown',
      time: '09:15 AM',
      date: 'Today',
      status: 'resolved',
      priority: 'high'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Network Connectivity Issue',
      description: 'Camera feed interrupted for 5 minutes',
      location: 'Sector B',
      time: '08:45 AM',
      date: 'Today',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 6,
      type: 'critical',
      title: 'Multiple PPE Violations',
      description: '3 workers non-compliant in last hour',
      location: 'All Gates',
      time: '08:30 AM',
      date: 'Today',
      status: 'active',
      priority: 'high'
    },
  ];

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <NotificationsIcon />;
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'critical': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#757575';
    }
  };

  const getPriorityChip = (priority) => {
    switch(priority) {
      case 'high': return <Chip label="High" size="small" color="error" />;
      case 'medium': return <Chip label="Medium" size="small" color="warning" />;
      case 'low': return <Chip label="Low" size="small" color="info" />;
      default: return <Chip label="Normal" size="small" />;
    }
  };

  const filteredAlerts = alertType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === alertType);

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;

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
            Alert Center
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor and manage safety alerts and notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#1a237e' }}
          >
            Create Alert
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid #f44336' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Alerts
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#f44336' }}>
                    {activeAlerts}
                  </Typography>
                </Box>
                <NotificationsActiveIcon sx={{ color: '#f44336', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Critical Alerts
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#ff9800' }}>
                    {criticalAlerts}
                  </Typography>
                </Box>
                <ErrorIcon sx={{ color: '#ff9800', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid #4caf50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Resolved Today
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: '#4caf50' }}>
                    8
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Response Time
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    4.2m
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ color: '#2196f3', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <ToggleButtonGroup
              value={alertType}
              exclusive
              onChange={(e, newType) => newType && setAlertType(newType)}
              size="small"
            >
              <ToggleButton value="all">All Alerts</ToggleButton>
              <ToggleButton value="critical">Critical</ToggleButton>
              <ToggleButton value="warning">Warnings</ToggleButton>
              <ToggleButton value="info">Info</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" startIcon={<ArchiveIcon />}>
              Archive All
            </Button>
            <Button variant="outlined" startIcon={<FilterIcon />}>
              Advanced Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Alerts List */}
      <Paper sx={{ mb: 3 }}>
        <List>
          {filteredAlerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {getAlertIcon(alert.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {alert.title}
                      </Typography>
                      {getPriorityChip(alert.priority)}
                      {alert.status === 'resolved' && (
                        <Chip label="Resolved" size="small" color="success" />
                      )}
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {alert.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Chip 
                          icon={<LocationIcon />} 
                          label={alert.location} 
                          size="small" 
                          variant="outlined" 
                        />
                        {alert.worker && (
                          <Chip 
                            icon={<PersonIcon />} 
                            label={alert.worker} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {alert.date} • {alert.time}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton edge="end" size="small">
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton edge="end" size="small">
                      <ArchiveIcon />
                    </IconButton>
                    <IconButton edge="end" size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              {index < filteredAlerts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Notification Settings Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notification Settings</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Notification Channels
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    email: e.target.checked
                  })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon />
                  <span>Email Notifications</span>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    sms: e.target.checked
                  })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmsIcon />
                  <span>SMS Notifications</span>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.push}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    push: e.target.checked
                  })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon />
                  <span>Push Notifications</span>
                </Box>
              }
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Alert Types
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.critical}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    critical: e.target.checked
                  })}
                />
              }
              label="Critical Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.warning}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    warning: e.target.checked
                  })}
                />
              }
              label="Warning Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.info}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    info: e.target.checked
                  })}
                />
              }
              label="Information Alerts"
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Escalation Rules
            </Typography>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Critical Alert Escalation</InputLabel>
              <Select defaultValue="immediate" label="Critical Alert Escalation">
                <MenuItem value="immediate">Immediate (All Managers)</MenuItem>
                <MenuItem value="30min">Within 30 minutes</MenuItem>
                <MenuItem value="1hour">Within 1 hour</MenuItem>
                <MenuItem value="2hours">Within 2 hours</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertCenter;