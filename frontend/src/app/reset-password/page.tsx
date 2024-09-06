"use client";

import { useState, Suspense } from 'react';
import { Box, TextField, Button, Container, Alert, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetcher } from '@/utils/api';

function ResetPasswordComponent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get('token');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetcher('/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, new_password: password }),
            });

            setMessage('Password reset successful. Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            setError('Failed to reset password');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleResetPassword}>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Reset Password
                    </Button>
                </form>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Container>
    );
}

// Use Suspense to handle client-side rendering for useSearchParams
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordComponent />
        </Suspense>
    );
}
