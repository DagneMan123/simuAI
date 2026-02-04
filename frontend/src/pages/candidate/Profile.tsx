import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../lib/authService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Stack
} from '@mui/material';

// Use Grid2 for MUI v6 to support the 'size' prop correctly
import Grid from '@mui/material/Grid'; 

import {
  Edit,
  Save,
  Cancel,
  CalendarToday,
  Security,
  Notifications,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Interface to ensure 'phone' and other properties are recognized by TypeScript
interface ExtendedUser {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const safeUser = user as ExtendedUser; 

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    setLoading(true);
    if (safeUser) {
      setFormData(prev => ({
        ...prev,
        fullName: safeUser.fullName || '',
        email: safeUser.email || '',
        phone: safeUser.phone || '', // Fixed: Ensuring phone is mapped correctly from user object
      }));
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [safeUser]);

  // Fix for setSettings warning: Added a handler to actually use setSettings
  const handleToggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (authService && typeof authService.updateProfile === 'function') {
        await authService.updateProfile({
          fullName: formData.fullName,
          phone: formData.phone, // Passing phone to the API service
        });
      }
      
      updateUser({
        fullName: formData.fullName,
        phone: formData.phone, // Updating phone in the local context
      } as any);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Update failed' });
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="800" gutterBottom>
        Account Settings
      </Typography>
      
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h6" fontWeight="700">Personal Information</Typography>
                <Button
                  startIcon={editing ? <Cancel /> : <Edit />}
                  onClick={() => setEditing(!editing)}
                  variant={editing ? "text" : "outlined"}
                  color={editing ? "error" : "primary"}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email" value={formData.email} disabled />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Member Since"
                    value={new Date().toLocaleDateString()}
                    disabled
                    InputProps={{ startAdornment: <CalendarToday sx={{ mr: 1, opacity: 0.5 }} /> }}
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box mt={4}>
                  <Divider sx={{ mb: 4 }} />
                  <Typography variant="subtitle1" fontWeight="700" mb={2} display="flex" alignItems="center">
                    <Security sx={{ mr: 1 }} /> Security Update
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField fullWidth type="password" label="Current Password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} />
                    </Grid>
                    <Grid size={6}>
                      <TextField fullWidth type="password" label="New Password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} />
                    </Grid>
                    <Grid size={6}>
                      <TextField fullWidth type="password" label="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 3, mb: 3, borderRadius: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
                fontSize: 40,
                fontWeight: 'bold'
              }}
            >
              {safeUser.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight="700">{safeUser.fullName}</Typography>
            <Typography color="textSecondary" mb={2}>{safeUser.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="textSecondary" fontWeight="700">
              ROLE: {safeUser.role?.toUpperCase()}
            </Typography>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom display="flex" alignItems="center">
                <Notifications sx={{ mr: 1 }} /> Preferences
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel 
                  control={<Switch checked={settings.emailNotifications} onChange={() => handleToggleSetting('emailNotifications')} />} 
                  label="Email Alerts" 
                />
                <FormControlLabel 
                  control={<Switch checked={settings.assessmentReminders} onChange={() => handleToggleSetting('assessmentReminders')} />} 
                  label="Reminders" 
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;