"use client";

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';
import { Activity } from '@/types/activity';

export default function Dashboard() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const handleActivitySelect = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    return (
        <div className="flex">
            <ActivitySidebar  onActivitySelect={handleActivitySelect}/>
            <main className="flex-1 p-6">
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                {selectedActivity && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Activity Details</Typography>
                        <Typography>Name: {selectedActivity.name}</Typography>
                        <Typography>Description: {selectedActivity.description}</Typography>
                        <Typography>Goal: {selectedActivity.goal} {selectedActivity.unit}</Typography>
                        <Typography>Count: {selectedActivity.count} {selectedActivity.unit}</Typography>
                        {/* Add more details as needed */}
                    </Box>
                )}
             </main>
        </div>
    );
}
