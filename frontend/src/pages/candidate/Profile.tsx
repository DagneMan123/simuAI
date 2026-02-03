import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  CalendarToday,
  Security,
  Notifications,
} from '@mui/icons-material';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    assessmentReminders: true,
    resultNotifications: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = async () => {
    // የይለፍ ቃል ማረጋገጫ
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      // የማዘመን API ጥሪ
      // await authService.updateProfile(formData);
      
      // በአካባቢ ማዘመን
      updateUser({
        ...user!,
        fullName: formData.fullName,
        phone: formData.phone,
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      
      // የይለፍ ቃል ከተቀየረ ንጹህ
      if (formData.newPassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          onClose={() => setMessage(null)}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Personal Information
                </Typography>
                <Button
                  startIcon={editing ? <Cancel /> : <Edit />}
                  onClick={() => setEditing(!editing)}
                  variant="outlined"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Edit fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled // ኢሜል መቀየር አይቻልም
                    InputProps={{
                      startAdornment: <Email fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Phone fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Member Since"
                    value={new Date().toLocaleDateString()}
                    disabled
                    InputProps={{
                      startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Password Change Section */}
              {editing && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Typography variant="h6" gutterBottom>
                    <Security sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Change Password
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {editing && (
                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <Button
                    startIcon={<Save />}
                    onClick={handleSave}
                    variant="contained"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary & Settings */}
        <Grid item xs={12} md={4}>
          {/* Profile Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                  fontSize: 40,
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6">{user?.fullName}</Typography>
              <Typography color="textSecondary" gutterBottom>{user?.email}</Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Role: <strong>{user?.role}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Account Status: <strong style={{ color: 'green' }}>Active</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Notifications sx={{ verticalAlign: 'middle', mr: 1 }} />
                Notification Settings
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.assessmentReminders}
                      onChange={() => handleSettingChange('assessmentReminders')}
                    />
                  }
                  label="Assessment Reminders"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.resultNotifications}
                      onChange={() => handleSettingChange('resultNotifications')}
                    />
                  }
                  label="Result Notifications"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;