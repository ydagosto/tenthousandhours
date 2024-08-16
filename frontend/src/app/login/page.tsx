"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // store token
                localStorage.setItem('token', data.token);
                // Handle success, e.g., redirect to dashboard or home page
                router.push('/dashboard'); // Change to your desired path
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
