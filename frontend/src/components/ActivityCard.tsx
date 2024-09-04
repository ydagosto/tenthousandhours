import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ActivityCardProps {
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
    onClick: () => void;
    isSelected: boolean; // New prop to track if this card is selected
}

export default function ActivityCard({
    name,
    description,
    unit,
    goal,
    count,
    onClick,
    isSelected,
}: ActivityCardProps) {
    const [isPressed, setIsPressed] = useState(false);

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
            <CardContent>
                <Typography variant="h6" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="body2">
                    Count: {count}
                </Typography>
            </CardContent>
        </Card>
    );
}
