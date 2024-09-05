import { useEffect, useState } from 'react';
import { Alert, TextField, Button, Box, Typography, Divider } from '@mui/material';
import { fetcher } from '@/utils/api';

export default function UpdateUserInfo() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                // Try to validate the token
                const data = await fetcher('/protected/get-user-info', {
                    method: 'GET',
                });
                setUsername(data.username);
                setEmail(data.email);
            } catch (error) {
                console.error("user not validated", error);
            }
        };

        getUserInfo();
    }, []);

    // Validate email format
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!username || !email) {
            setError("Both username and email are required");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        try {
            // Try to validate the token
            const response = await fetcher('/protected/update-user-info', {
                method: 'POST',
                body: JSON.stringify({ username, email }),
            });
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

  return (
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSaveProfile}>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Profile Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    color="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </Button>
            </Box>
        </form>
      </Box>
  );
}
