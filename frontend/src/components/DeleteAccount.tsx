import { useState } from 'react';
import { Alert, Button, Typography, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import { fetcher } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

export default function DeleteAccount() {
  const { setIsLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };

  // Handle delete account confirmation
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await fetcher('/protected/delete-user-data', {
        method: 'DELETE',
      });
      setSuccess('Account deleted successfully');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/');
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6">Security & Privacy</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Delete Account Button */}
      <Button variant="outlined" color="error" onClick={handleClickOpen}>
        Delete Account
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Are you sure you want to delete your account? This action is irreversible and will delete all of your data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error or Success Feedback */}
      {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
      )}
    </Box>
  );
}
