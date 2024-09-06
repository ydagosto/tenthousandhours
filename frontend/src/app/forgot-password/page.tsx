"use client";

import { useState } from 'react';
import { Box, TextField, Button, Container, Alert, Typography } from '@mui/material';
import { fetcher } from '@/utils/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetcher('/send-password-reset', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            setMessage('If your email exists in our system, a password reset link will be sent to your inbox.');
        } catch (err) {
            setError('Failed to send reset link');
        }
    };

    return (
        <Container maxWidth="sm">
             <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Forgot Password
                </Typography>
                <form onSubmit={handleRequestReset}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Reset Link
                    </Button>
                </form>
                {message && <Alert severity="info">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Container>
    );
}
