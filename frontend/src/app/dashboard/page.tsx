"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';
import { Activity } from '@/types/activity';
import { PracticeLog } from '@/types/practiceLog';
import AddPracticeButton from '@/components/AddPracticeButton';
import ViewPracticeButton from '@/components/ViewPracticeButton';
import { fetcher } from '@/utils/api';
import { useRouter } from 'next/navigation';
import BarChart from '@/components/BarChart';
import ContributionChart from '@/components/ContributionChart';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { isLoggedIn, validateToken } = useAuth();
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
    const [hasCheckedLoginStatus, setHasCheckedLoginStatus] = useState(false);
    const router = useRouter();

    // Get the theme and media query for responsive layout
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Validate token and handle login redirection
    useEffect(() => {
        const checkLoginStatus = async () => {
            await validateToken(); // Validate the token
            setHasCheckedLoginStatus(true); // Only check login status after validation is done
        };

        checkLoginStatus();
    }, []);

    // Redirect to login if not logged in after the login check
    useEffect(() => {
        if (hasCheckedLoginStatus && !isLoggedIn) {
            router.push('/login'); // Redirect to login if not logged in
        }
    }, [isLoggedIn, hasCheckedLoginStatus, router]);

    const fetchActivities = async () => {
        try {
            const activitiesData = await fetcher('/protected/get-activities', {
                method: 'GET'
            });

            if (activitiesData.length > 0) {
                setSelectedActivity(activitiesData[0]);
            } else {
                setSelectedActivity(null)
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    };

    // Fetch activities on component mount
    useEffect(() => {
        if (hasCheckedLoginStatus && isLoggedIn) {
            fetchActivities();
        }
    }, [isLoggedIn, hasCheckedLoginStatus]);

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

    const handleActivityDelete = () => {
        fetchActivities();
    };

    // Handle deletion of selected logs by calling the delete endpoint and then refetching practice logs
    const handlePracticeLogsDelete = async (logIds: number[]) => {
        try {
            if (selectedActivity) {
                // Call the delete endpoint with a list of selected log IDs
                await fetcher('/protected/delete-practice', {
                    method: 'DELETE',
                    body: JSON.stringify({ 
                        logIds,
                        activityId: selectedActivity.ID
                    }),
                });

                // Refetch updated practice logs after deletion
                fetchPracticeLogs();
            }
        } catch (error) {
            console.error('Failed to delete practice logs:', error);
        }
    };

    return (
        <div className={`flex-1 flex justify-center ${isMobile? 'pb-20': 'h-screen'}`}>
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
                        onActivityDelete={handleActivityDelete}
                        selectedActivity={selectedActivity}
                    />
                    <main className="flex-1 p-2 overflow-hidden">
                        <AddPracticeButton 
                            activity={selectedActivity} 
                            onPracticeAdded={fetchPracticeLogs}
                        />
                        <ViewPracticeButton 
                            activity={selectedActivity}
                            practiceLogs={practiceLogs}
                            onDelete={handlePracticeLogsDelete}
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
