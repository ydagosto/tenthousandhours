"use client";

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';
import { Activity } from '@/types/activity';
import { PracticeLog } from '@/types/practiceLog';
import AddPracticeButton from '@/components/AddPracticeButton';
import { fetcher } from '@/utils/api';
import BarChart from '@/components/BarChart';

export default function Dashboard() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);

    // Fetch activities on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Replace with your API endpoint
                var activitiesData = await fetcher('/protected/get-activities', {
                    method: 'GET'
                });

                // Set the first activity as selected if available
                if (activitiesData.length > 0) {
                    setSelectedActivity(activitiesData[0]);
                }
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            }
        };

        fetchActivities();
    }, []);

    // Fetch practice logs when selectedActivity changes
    useEffect(() => {
        const fetchPracticeLogs = async () => {
            if (selectedActivity) {
                try {
                    // Replace with your API endpoint
                    const practiceLogsData = await fetcher(`/protected/get-practice?activityID=${selectedActivity.ID}`, {
                        method: 'GET'
                    });

                    console.log(practiceLogsData);
                    setPracticeLogs(practiceLogsData);
                } catch (error) {
                    console.error('Failed to fetch practice logs:', error);
                }
            }
        };

        fetchPracticeLogs();
    }, [selectedActivity]);

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
                <AddPracticeButton activity={selectedActivity}/>
                {selectedActivity && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Activity Details</Typography>
                        <Typography>Name: {selectedActivity.name}</Typography>
                        <Typography>Description: {selectedActivity.description}</Typography>
                        <Typography>Goal: {selectedActivity.goal} {selectedActivity.unit}</Typography>
                        <Typography>Count: {selectedActivity.count} {selectedActivity.unit}</Typography>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Practice Logs</Typography>
                            {practiceLogs.length > 0 ? (
                                <BarChart practiceLogs={practiceLogs} />
                            ) : (
                                <Typography>No practice logs available.</Typography>
                            )}
                        </Box>
                    </Box>
                )}
             </main>
        </div>
    );
}
