import { useState, useEffect } from 'react';
import { Box, Card, Typography, useMediaQuery, useTheme, IconButton, Popover } from '@mui/material';
import ActivityCard from './ActivityCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for "+" card
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Anchor for Popover

    // Fetch activities
    const fetchActivities = async () => {
        setError('');
        setLoading(true);

        try {
            var data = await fetcher('/protected/get-activities', {
                method: 'GET',
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

    // Fetch activities when component mounts
    useEffect(() => {
        fetchActivities();
    }, []);

    // Handle when an activity is added
    const handleActivityAdded = () => {
        fetchActivities(); // Refresh activities list
        setAnchorEl(null); // Close the popover after adding activity
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget); // Set the "+" button as the anchor for the popover
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the popover
    };

    const open = Boolean(anchorEl); // Whether the popover is open

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                width: isMobile ? '100%' : '20vw',
                height: isMobile ? 'auto' : '100vh',
                overflowX: isMobile ? 'auto' : 'hidden',
                overflowY: isMobile ? 'hidden' : 'auto',
                padding: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    overflowX: isMobile ? 'auto' : 'hidden',
                    overflowY: isMobile ? 'hidden' : 'auto',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                }}
            >
                {/* Activities List */}
                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                {activities.map((activity) => (
                    <Box
                        key={activity.ID}
                        sx={{
                            display: isMobile ? 'inline-block' : 'block',
                            minWidth: isMobile ? '200px' : 'auto', // Increased width for mobile
                            maxWidth: isMobile ? '250px' : 'auto', // Restrict max width for mobile
                            mr: isMobile ? 2 : 0,
                        }}
                    >
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

                {/* "+" Card */}
                <Box
                    sx={{
                        display: 'inline-block',
                        minWidth: isMobile ? '200px' : 'auto', // Same width as other cards on mobile
                        maxWidth: isMobile ? '250px' : 'auto', // Same max width as other cards on mobile
                        cursor: 'pointer',
                        textAlign: 'center',
                        border: '2px dashed gray',
                        borderRadius: 1,
                        padding: 2,
                        mr: isMobile ? 2 : 0,
                    }}
                    onClick={handleClick} // Open popover on click
                >
                    <IconButton>
                        <AddCircleOutlineIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="body2">Add New Activity</Typography>
                </Box>

                {/* Popover for Adding Activity */}
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    PaperProps={{
                        style: { maxHeight: '300px', maxWidth: '300px', overflow: 'auto' }, // Control size of popover
                    }}
                >
                    <Box sx={{ p: 2, width: '300px' }}>
                        <AddActivity onActivityAdded={handleActivityAdded} />
                    </Box>
                </Popover>
            </Box>
        </Card>
    );
}
