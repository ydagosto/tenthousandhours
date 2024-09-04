import { useState } from 'react';
import { IconButton, Button, Box, Modal, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Activity } from '@/types/activity';
import { fetcher } from '@/utils/api';

// Define the props interface
interface AddPracticeButtonProps {
    activity: Activity | null;
    onPracticeAdded: () => void; // Callback to refresh or handle state after adding an activity
}

export default function AddPracticeButton({ activity, onPracticeAdded }: AddPracticeButtonProps) {
    const [error, setError] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('.')[0] + 'Z');
    const [count, setCount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (activity) {
            try {
                const response = await fetcher('/protected/log-practice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ 
                        activityId: activity.ID, 
                        count: parseFloat(count as string), 
                        date }),
                });

                // Reset form
                setDate(new Date().toISOString().split('.')[0] + 'Z');
                setCount('');
                handleClose();
                onPracticeAdded();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Failed to add activity count');
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Tooltip  
                title={<Typography sx={{ fontSize: '1rem' }}>Add practice hours</Typography>}
                placement="left"  
                arrow>
                <IconButton
                    sx={{
                        position: 'fixed',
                        top: isMobile ? 'auto' : 70, // Adjust position for mobile
                        bottom: isMobile ? 16 : 'auto', // Position it at the bottom on mobile
                        right: 16,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                        width: 60,
                        height: 60,
                    }}
                    onClick={handleOpen}
                >
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Add Practice Hours
                    </Typography>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={date.split('T')[0]} // Display date only
                        onChange={(e) => setDate(e.target.value + 'T00:00:00Z')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Hours"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
