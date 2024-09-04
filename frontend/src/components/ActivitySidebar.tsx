import { useState, useEffect } from 'react';
import { Box, Card, Typography, useMediaQuery, useTheme } from '@mui/material';
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

    // Fetch activities
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
    }, []); 

    // Callback for when an activity is added
    const handleActivityAdded = () => {
        fetchActivities(); 
    };

    // Responsive layout
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect if screen size is mobile

    return (
        <Card
            className="m-4"
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                width: isMobile ? '100%' : '20vw', // Full width on mobile, fixed width on desktop
                height: isMobile ? 'auto' : '100vh', // Auto height on mobile, full screen height on desktop
                overflowX: isMobile ? 'auto' : 'hidden', // Enable horizontal scroll on mobile
                overflowY: isMobile ? 'hidden' : 'auto', // Enable vertical scroll on desktop
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: isMobile ? 'none' : '1px solid gray',
                    flexBasis: isMobile ? 'auto' : 'auto',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    overflowX: 'auto',
                }}
            >
                <AddActivity onActivityAdded={handleActivityAdded} />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    overflowX: isMobile ? 'auto' : 'hidden',
                    p: 2,
                    width: '100%',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Your Activities
                </Typography>
                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                {activities.map((activity) => (
                    <Box key={activity.ID} sx={{ display: isMobile ? 'inline-block' : 'block', mr: isMobile ? 2 : 0 }}>
                        <ActivityCard
                            key={activity.ID}
                            name={activity.name}
                            description={activity.description}
                            unit={activity.unit}
                            goal={activity.goal}
                            count={activity.count}
                            onClick={() => onActivitySelect(activity)}
                        />
                    </Box>
                ))}
            </Box>
        </Card>
    );
}
