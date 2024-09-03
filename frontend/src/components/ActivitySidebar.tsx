import { useState, useEffect } from 'react';
import { Box, Card, Typography } from '@mui/material';
import ActivityCard from './ActivityCard';
import AddActivity from './AddActivity';
import { Activity } from '@/types/activity';
import { fetcher } from '@/utils/api';

interface ActivitySidebarProps {
    onActivitySelect: (activity: Activity) => void;
}

export default function ActivitySidebar({ onActivitySelect }: ActivitySidebarProps) {
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
            <Card className="flex w-[20vw] h-screen flex flex-col m-4">
                <Box className="p-4 border-b border-gray-300 m-1">
                    <AddActivity onActivityAdded={handleActivityAdded} />
                </Box>
                <Box className="flex-1 overflow-y-auto p-4 m-1">
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
                            onClick={() => onActivitySelect(activity)}
                        />
                    ))}
                </Box>
            </Card>
    );
}
