import { useState } from 'react';
import { IconButton, Button, Box, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';


export default function AddPracticeButton() {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        // Submit the hours
        console.log(`Date: ${date}, Hours: ${hours}`);
        // Reset form
        setDate(new Date().toISOString().split('T')[0]);
        setHours('');
        handleClose();
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
                        top: 16,
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
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Hours"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
