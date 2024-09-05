import { useState } from 'react';
import { Alert, TextField, Button, Box, Typography, Divider } from '@mui/material';
import { fetcher } from '@/utils/api';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const minPasswordLength = 6;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    try {
      // Call the password update API endpoint
      await fetcher('/protected/update-user-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setSuccess('Password updated successfully');
      setNewPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
    } catch (err) {
      setError("Failed to update password " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6">Account Security</Typography>
      <Divider sx={{ mb: 2 }} />
      <form onSubmit={handleChangePassword}>
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          variant="outlined"
          inputProps={{ minLength: minPasswordLength }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          variant="outlined"
          inputProps={{ minLength: minPasswordLength }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </Box>
  );
}
