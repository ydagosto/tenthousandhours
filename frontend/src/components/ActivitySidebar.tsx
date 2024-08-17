// components/ActivitySidebar.tsx
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ActivityCard from './ActivityCard';
import { fetcher } from '../utils/api'; // Adjust path as needed

interface Activity {
    ID: number;
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
}

export default function ActivitySidebar() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const data = await fetcher('/protected/get-activities', {
                    method: 'GET'
                });
                setActivities(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Failed to fetch activities');
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Your Activities
            </Typography>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.ID}
                    name={activity.name}
                    description={activity.description}
                    unit={activity.unit}
                    goal={activity.goal}
                    count={activity.count}
                />
            ))}
        </Box>
    );
}
