// pages/profile.tsx
"use client";

import { useState } from 'react';
import { Box, Typography, Container, Divider, Link } from '@mui/material';
import UpdateUserInfo from '@/components/UpdateUserInfo';
import UpdatePassword from '@/components/UpdatePassword';
import DeleteAccount from '@/components/DeleteAccount';

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
      <UpdateUserInfo />
      <UpdatePassword />
      <DeleteAccount />

      {/* Support Section */}
      <Box className={'pb-20'} sx={{ mt: 6 }}>
        <Typography variant="h6">Support</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Need help? Contact me directly at{' '}
            <Link href="mailto:ydagosto@gmail.com" color="primary" underline="hover">
              ydagosto@gmail.com
            </Link>
        </Typography>
      </Box>
    </Container>
  );
}
