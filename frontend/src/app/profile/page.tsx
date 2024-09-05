// pages/profile.tsx
"use client";

import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Divider, Link } from '@mui/material';
import UpdateUserInfo from '@/components/UpdateUserInfo';

export default function ProfilePage() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // Handle change password logic
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>
      
      {/* Profile Information Section */}
      <UpdateUserInfo />

      {/* Account Security Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6">Account Security</Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="secondary" onClick={handleChangePassword}>
          Change Password
        </Button>
      </Box>

      {/* Security and Privacy Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6">Security & Privacy</Typography>
        <Divider sx={{ mb: 2 }} />
        <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Box>

      {/* Support Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6">Support</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Need help? Visit our <Link href="/support">Support Center</Link> or contact us directly.
        </Typography>
      </Box>
    </Container>
  );
}
