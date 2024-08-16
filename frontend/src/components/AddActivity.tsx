// components/AddActivity.tsx
import { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { fetcher } from '../utils/api'; // Adjust path as needed

interface AddActivityProps {
    onActivityAdded: () => void; // Callback to refresh or handle state after adding an activity
}

export default function AddActivity({ onActivityAdded }: AddActivityProps) {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [unit, setUnit] = useState<string>('hours')
    const [goal, setGoal] = useState<number>(0)
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log(JSON.stringify({ name, description, unit, goal, count }))
            await fetcher('/protected/create-activity', {
                method: 'POST',
                body: JSON.stringify({ name, description, unit, goal, count }),
            });

            // Refresh or handle state after adding an activity
            onActivityAdded();
            setName('');
            setDescription('');
        } catch (err) {
             // Check if err is an instance of Error
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
        <Box sx={{ mt: 4 }}>
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
                        required
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
