// components/ActivitySidebar.tsx
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ActivityCard from './ActivityCard';

interface Activity {
    ID: number;
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
}

interface ActivitySidebarProps {
    activities: Activity[];
}

export default function ActivitySidebar({ activities }: ActivitySidebarProps) {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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
