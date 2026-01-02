// src/pages/Settings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CameraAlt as CameraIcon,
  QrCodeScanner as RFIDIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Smartphone as MobileIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Safety Manager',
    email: user?.email || 'manager@miningcompany.com',
    phone: '+1 (555) 123-4567',
    department: 'Safety Department',
    position: 'Safety Manager',
    avatar: user?.avatar || 'M'
  });

  // Detection settings
  const [detectionSettings, setDetectionSettings] = useState({
    helmetDetection: true,
    vestDetection: true,
    bootsDetection: true,
    lampDetection: true,
    gasDetectorDetection: true,
    selfRescuerDetection: false,
    confidenceThreshold: 0.75,
    alertDelay: 5,
    autoSaveImages: true
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false
  });

  // RFID settings
  const [rfidSettings, setRfidSettings] = useState({
    readerType: 'uhf',
    readRange: 10,
    autoRefresh: true,
    refreshInterval: 5,
    buzzerEnabled: true,
    ledEnabled: true
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = (section) => {
    setSnackbar({
      open: true,
      message: `${section} settings saved successfully!`,
      severity: 'success'
    });
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetectionChange = (field, value) => {
    setDetectionSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRfidChange = (field, value) => {
    setRfidSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const tabs = [
    { label: 'Profile', icon: <PersonIcon /> },
    { label: 'PPE Detection', icon: <SecurityIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'RFID Settings', icon: <RFIDIcon /> },
    { label: 'Camera', icon: <CameraIcon /> },
    { label: 'System', icon: <SettingsIcon /> }
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
            Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configure your PPE compliance system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => handleSaveSettings('All')}
          sx={{ bgcolor: '#1a237e' }}
        >
          Save All Changes
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Profile Tab Content - Profile on LEFT, Info & Password side-by-side on RIGHT */}
      {activeTab === 0 && (
        <Card>
          <CardHeader title="Profile Settings" />
          <CardContent>
            <Grid container spacing={4}>
              {/* LEFT COLUMN - Profile Avatar & Info */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#1a237e',
                      fontSize: 48,
                      mb: 3
                    }}
                  >
                    {profileData.avatar}
                  </Avatar>
                  
                  <Typography variant="h6" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {profileData.email}
                  </Typography>
                  
                  <Box sx={{ mt: 3, width: '100%' }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Upload Photo
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth
                    >
                      Remove Photo
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* RIGHT COLUMN - Split into Info (LEFT) and Password (RIGHT) */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  {/* LEFT SIDE - Personal Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        margin="normal"
                      />
                      
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Department</InputLabel>
                        <Select
                          value={profileData.department}
                          label="Department"
                          onChange={(e) => handleProfileChange('department', e.target.value)}
                        >
                          <MenuItem value="Safety Department">Safety Department</MenuItem>
                          <MenuItem value="Excavation">Excavation</MenuItem>
                          <MenuItem value="Transport">Transport</MenuItem>
                          <MenuItem value="Maintenance">Maintenance</MenuItem>
                          <MenuItem value="Administration">Administration</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        label="Position"
                        value={profileData.position}
                        onChange={(e) => handleProfileChange('position', e.target.value)}
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Employee ID"
                        value="MIN001"
                        margin="normal"
                        disabled
                      />
                    </Box>
                  </Grid>

                  {/* RIGHT SIDE - Change Password */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Change Password
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        margin="normal"
                      />
                    </Box>

                    {/* Buttons aligned to bottom */}
                    <Box sx={{ 
                      mt: 6, 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      gap: 2 
                    }}>
                      <Button variant="outlined">
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveSettings('Profile')}
                        sx={{ bgcolor: '#1a237e' }}
                      >
                        Save Profile
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* PPE Detection Tab Content */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="PPE Detection Settings" />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.helmetDetection}
                        onChange={(e) => handleDetectionChange('helmetDetection', e.target.checked)}
                      />
                    }
                    label="Helmet Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.vestDetection}
                        onChange={(e) => handleDetectionChange('vestDetection', e.target.checked)}
                      />
                    }
                    label="Reflective Vest Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.bootsDetection}
                        onChange={(e) => handleDetectionChange('bootsDetection', e.target.checked)}
                      />
                    }
                    label="Safety Boots Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.lampDetection}
                        onChange={(e) => handleDetectionChange('lampDetection', e.target.checked)}
                      />
                    }
                    label="Cap Lamp Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.gasDetectorDetection}
                        onChange={(e) => handleDetectionChange('gasDetectorDetection', e.target.checked)}
                      />
                    }
                    label="Gas Detector Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={detectionSettings.selfRescuerDetection}
                        onChange={(e) => handleDetectionChange('selfRescuerDetection', e.target.checked)}
                      />
                    }
                    label="Self-Rescuer Detection"
                  />
                </FormGroup>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Confidence Threshold</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={detectionSettings.confidenceThreshold}
                      onChange={(e) => handleDetectionChange('confidenceThreshold', parseFloat(e.target.value))}
                      inputProps={{ min: 0.1, max: 1, step: 0.05 }}
                      helperText="Higher values = more accurate but fewer detections"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Alert Delay (seconds)</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={detectionSettings.alertDelay}
                      onChange={(e) => handleDetectionChange('alertDelay', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 60 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={detectionSettings.autoSaveImages}
                          onChange={(e) => handleDetectionChange('autoSaveImages', e.target.checked)}
                        />
                      }
                      label="Automatically save violation images"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Camera Zones" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CameraIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gate 1 - Main Entrance"
                      secondary="Camera #001 • Active"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CameraIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gate 2 - Secondary Entrance"
                      secondary="Camera #002 • Active"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CameraIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Underground - Level 1"
                      secondary="Camera #003 • Maintenance"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add New Camera Zone
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings('Detection')}
              >
                Save Detection Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab Content */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Notification Channels" />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailAlerts}
                        onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon />
                        <span>Email Alerts</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.smsAlerts}
                        onChange={(e) => handleNotificationChange('smsAlerts', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon />
                        <span>SMS Alerts</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MobileIcon />
                        <span>Push Notifications</span>
                      </Box>
                    }
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Alert Types" />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.criticalAlerts}
                        onChange={(e) => handleNotificationChange('criticalAlerts', e.target.checked)}
                      />
                    }
                    label="Critical Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.warningAlerts}
                        onChange={(e) => handleNotificationChange('warningAlerts', e.target.checked)}
                      />
                    }
                    label="Warning Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.infoAlerts}
                        onChange={(e) => handleNotificationChange('infoAlerts', e.target.checked)}
                      />
                    }
                    label="Information Alerts"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Reports" />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onChange={(e) => handleNotificationChange('dailyReports', e.target.checked)}
                      />
                    }
                    label="Daily Compliance Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                      />
                    }
                    label="Weekly Summary Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.monthlyReports}
                        onChange={(e) => handleNotificationChange('monthlyReports', e.target.checked)}
                      />
                    }
                    label="Monthly Performance Reports"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings('Notifications')}
              >
                Save Notification Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* RFID Settings Tab Content */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="RFID Reader Configuration" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Reader Type</InputLabel>
                      <Select
                        value={rfidSettings.readerType}
                        label="Reader Type"
                        onChange={(e) => handleRfidChange('readerType', e.target.value)}
                      >
                        <MenuItem value="uhf">UHF Reader (Long Range)</MenuItem>
                        <MenuItem value="hf">HF Reader (Short Range)</MenuItem>
                        <MenuItem value="lf">LF Reader (Proximity)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Read Range (meters)</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={rfidSettings.readRange}
                      onChange={(e) => handleRfidChange('readRange', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 20 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Refresh Interval (seconds)</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={rfidSettings.refreshInterval}
                      onChange={(e) => handleRfidChange('refreshInterval', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 60 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Reader Features" />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rfidSettings.autoRefresh}
                        onChange={(e) => handleRfidChange('autoRefresh', e.target.checked)}
                      />
                    }
                    label="Auto Refresh Tags"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rfidSettings.buzzerEnabled}
                        onChange={(e) => handleRfidChange('buzzerEnabled', e.target.checked)}
                      />
                    }
                    label="Buzzer Sound"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rfidSettings.ledEnabled}
                        onChange={(e) => handleRfidChange('ledEnabled', e.target.checked)}
                      />
                    }
                    label="LED Indicator"
                  />
                </FormGroup>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Refresh RFID Readers
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Last refreshed: 10:30 AM
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSettings('RFID')}
              >
                Save RFID Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Camera Settings Tab Content */}
      {activeTab === 4 && (
        <Card>
          <CardHeader title="Camera Configuration" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Video Quality</InputLabel>
                  <Select defaultValue="hd">
                    <MenuItem value="low">Low (480p)</MenuItem>
                    <MenuItem value="medium">Medium (720p)</MenuItem>
                    <MenuItem value="hd">High (1080p)</MenuItem>
                    <MenuItem value="ultra">Ultra (4K)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Frame Rate</InputLabel>
                  <Select defaultValue="30">
                    <MenuItem value="15">15 FPS</MenuItem>
                    <MenuItem value="24">24 FPS</MenuItem>
                    <MenuItem value="30">30 FPS</MenuItem>
                    <MenuItem value="60">60 FPS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Night Vision Mode"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Motion Detection"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Record 24/7"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('Camera')}
                >
                  Save Camera Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* System Settings Tab Content */}
      {activeTab === 5 && (
        <Card>
          <CardHeader title="System Configuration" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dashboard Refresh Rate"
                  type="number"
                  defaultValue="30"
                  helperText="Seconds"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Data Retention Period</InputLabel>
                  <Select defaultValue="30">
                    <MenuItem value="7">7 days</MenuItem>
                    <MenuItem value="30">30 days</MenuItem>
                    <MenuItem value="90">90 days</MenuItem>
                    <MenuItem value="365">1 year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Automatic System Updates"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send Usage Statistics"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Enable API Access"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="error">
                    Reset All Settings
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveSettings('System')}
                  >
                    Save System Settings
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;