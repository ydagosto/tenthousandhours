import { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { fetcher } from '../utils/api'; 

interface AddActivityProps {
    onActivityAdded: () => void; 
}

export default function AddActivity({ onActivityAdded }: AddActivityProps) {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await fetcher('/protected/create-activity', {
                method: 'POST',
                body: JSON.stringify({ name, description }),
            });
            setName('');
            setDescription('');
            onActivityAdded(); // Trigger callback after adding
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to add activity');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Add New Activity
            </Typography>
            <form onSubmit={handleAddActivity}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                    {loading ? 'Adding...' : 'Add Activity'}
                </Button>
            </form>
        </Box>
    );
}
