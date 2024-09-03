"use client";

import { useState, useEffect } from 'react';
import { Box,  Typography } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';
import { Activity } from '@/types/activity';
import { PracticeLog } from '@/types/practiceLog';
import AddPracticeButton from '@/components/AddPracticeButton';
import { fetcher } from '@/utils/api';
import BarChart from '@/components/BarChart';
import ContributionChart from '@/components/ContributionChart';

export default function Dashboard() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);

    // Fetch activities on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Replace with your API endpoint
                const activitiesData = await fetcher('/protected/get-activities', {
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

    // Fetch practice logs when selectedActivity changes
    useEffect(() => {
        fetchPracticeLogs();
    }, [selectedActivity]);

    const handleActivitySelect = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-7xl px-4 overflow-hidden">
                <div className="flex overflow-hidden">
                    <ActivitySidebar onActivitySelect={handleActivitySelect} />
                    <main className="flex-1 p-6 overflow-hidden">
                        <AddPracticeButton 
                            activity={selectedActivity} 
                            onPracticeAdded={fetchPracticeLogs}/>
                        {selectedActivity && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6">{selectedActivity.name} - {selectedActivity.description}</Typography>
                                <Box>
                                    {practiceLogs.length > 0 ? (
                                        <>
                                            <ContributionChart practiceLogs={practiceLogs} />
                                            <BarChart practiceLogs={practiceLogs} />
                                        </>
                                    ) : (
                                        <Typography>No practice logs available.</Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}