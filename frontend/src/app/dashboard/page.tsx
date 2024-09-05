"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';
import { Activity } from '@/types/activity';
import { PracticeLog } from '@/types/practiceLog';
import AddPracticeButton from '@/components/AddPracticeButton';
import { fetcher } from '@/utils/api';
import { useRouter } from 'next/navigation';
import BarChart from '@/components/BarChart';
import ContributionChart from '@/components/ContributionChart';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { isLoggedIn, validateToken } = useAuth();
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
    const router = useRouter();

    // Get the theme and media query for responsive layout
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, []);

    // Fetch activities on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesData = await fetcher('/protected/get-activities', {
                    method: 'GET'
                });

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
                const practiceLogsData = await fetcher(`/protected/get-practice?activityID=${selectedActivity.ID}`, {
                    method: 'GET'
                });

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
            <div
                className="w-full max-w-7xl overflow-hidden"
                style={{ padding: isMobile ? '0' : '0 16px' }}
            >
                <div
                    className={isMobile ? "flex flex-col" : "flex overflow-hidden"}
                    style={{ flexDirection: isMobile ? 'column' : 'row' }}
                >
                    <ActivitySidebar
                        onActivitySelect={handleActivitySelect}
                        selectedActivity={selectedActivity}
                    />
                    <main className="flex-1 p-2 overflow-hidden">
                        <AddPracticeButton 
                            activity={selectedActivity} 
                            onPracticeAdded={fetchPracticeLogs}
                        />
                        {selectedActivity && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h4" align='center'>{selectedActivity.name}</Typography>
                                <Typography variant="h6" align='center'>{selectedActivity.description}</Typography>
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
