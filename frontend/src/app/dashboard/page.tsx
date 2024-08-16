"use client";

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddActivity from '../../components/AddActivity'; // Adjust path as needed

export default function Dashboard() {
    const [activities, setActivities] = useState<any[]>([]);

    const handleActivityAdded = () => {
        console.log("added activity")
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <AddActivity onActivityAdded={handleActivityAdded} />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Activities
                </Typography>
                <ul>
                    {activities.map((activity) => (
                        <li key={activity.id}>{activity.title} - {activity.description}</li>
                    ))}
                </ul>
            </Box>
        </Container>
    );
}
