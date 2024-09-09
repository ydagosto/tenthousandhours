import { useState } from 'react';
import { 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActivityCardProps {
    name: string;
    description: string;
    count: number;
    onClick: () => void;
    onDelete: () => void;
    isSelected: boolean; // New prop to track if this card is selected
}

export default function ActivityCard({
    name,
    description,
    count,
    onClick,
    onDelete,
    isSelected,
}: ActivityCardProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // State for opening the confirmation dialog

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from triggering
        setOpenDialog(true); // Open the confirmation dialog
    };

    const handleConfirmDelete = () => {
        setOpenDialog(false);
        onDelete(); // Call the delete handler after confirmation
    };

    const handleCancelDelete = () => {
        setOpenDialog(false); // Close the dialog if the user cancels
    };

    return (
        <Card
            onClick={onClick}
            onMouseDown={() => setIsPressed(true)} // Apply press effect on mouse down
            onMouseUp={() => setIsPressed(false)} // Remove press effect on mouse up
            onMouseLeave={() => setIsPressed(false)} // Ensure press effect is removed if the mouse leaves the card
            onTouchStart={() => setIsPressed(true)} // Handle touch devices
            onTouchEnd={() => setIsPressed(false)} // Handle touch devices
            sx={{
                mb: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
                transform: isPressed || isSelected ? 'scale(0.95)' : 'scale(1)', // Shrink when pressed or selected
                boxShadow: isPressed || isSelected ? '0 2px 6px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)', // Change box shadow on press or when selected
                backgroundColor: isPressed || isSelected ? '#f0f0f0' : 'white', // Change background color when pressed or selected
                '&:hover': {
                    transform: 'scale(1.05)', // Slightly scale up on hover
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow on hover
                },
            }}
        >
            <IconButton
                    aria-label="delete"
                    onClick={handleDeleteClick}
                    size='small'
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                    }}
                >
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableEnforceFocus
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this activity? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <CardContent>
                <Typography 
                    variant="h6" 
                    component="div" 
                    className="truncate"
                >
                    {name}
                </Typography>
                <Typography 
                    color="text.secondary" 
                    className="truncate text-gray-500"
                >
                    {description}
                </Typography>
                <Typography variant="body2">
                    Count: {count}
                </Typography>
            </CardContent>
        </Card>
    );
}
