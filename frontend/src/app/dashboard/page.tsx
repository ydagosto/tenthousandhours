"use client";

import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddActivity from '../../components/AddActivity'; // Adjust path as needed
import { fetcher } from '../../utils/api'; // Adjust path as needed
import ActivitySidebar from '@/components/ActivitySidebar';

interface Activity {
    ID: number;
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
}


export default function Dashboard() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [activities, setActivities] = useState<Activity[]>([]);


    const fetchActivities = async () => {
        setError('');
        setLoading(true);

        try {
            var data = await fetcher('/protected/get-activities', {
                method: 'GET'
            });
            setActivities(data)

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

    // Fetch activities when component mounts
    useEffect(() => {
        fetchActivities();
    }, []); // Empty dependency array ensures it runs only once after initial render

    // Callback for when an activity is added
    const handleActivityAdded = () => {
        fetchActivities(); // Refresh activities list
    };


    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <AddActivity onActivityAdded={handleActivityAdded} />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                </Typography>
            </Box>
            <ActivitySidebar activities={activities} />
        </Container>
    );
}
