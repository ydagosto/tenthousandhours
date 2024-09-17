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
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Convert minutes to hours (e.g., 30 minutes => 0.5 hours)
        const hoursValue = parseFloat(hours) || 0;
        const minutesValue = parseFloat(minutes) || 0;
        const totalHours = hoursValue + minutesValue / 60;

        if (totalHours < 0 || totalHours > 24) {
            setError("Total practice time must be between 0 and 24 hours.");
            setLoading(false);
            return;
        }

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
                        count: totalHours,
                        date,
                    }),
                });

                // Reset form
                setDate(new Date().toISOString().split('.')[0] + 'Z');
                setHours('');
                setMinutes('');
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

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHours(e.target.value);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(e.target.value);
    };

    return (
        <>
            <Tooltip  
                title={activity ? <Typography sx={{ fontSize: '1rem' }}>Add practice hours for {activity.name}</Typography> : <Typography sx={{ fontSize: '1rem' }}>Select or add an activity to log practice</Typography>}
                placement="left"  
                arrow
            >
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
                        disabled={!activity} // Disable the button if activity is null
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
                        Add <strong>{activity ? activity.name : ''}</strong> Practice Time
                    </Typography>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={date.split('T')[0]} // Display date only
                        onChange={(e) => setDate(e.target.value + 'T00:00:00Z')}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            max: new Date().toISOString().split('T')[0], // Disable future dates
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                    />
                    <TextField
                        label="Hours"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={hours}
                        onChange={handleHoursChange}
                        error={!!error}
                    />
                    <TextField
                        label="Minutes"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={minutes}
                        onChange={handleMinutesChange}
                        error={!!error}
                        helperText={error}
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
