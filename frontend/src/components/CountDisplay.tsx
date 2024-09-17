import { Box, LinearProgress, Typography } from '@mui/material';

export default function CountDisplay({ count }: { count: number }) {
    const maxHours = 10000; // Set the goal for 10,000 hours
    const progress = (count / maxHours) * 100; // Calculate progress

    return (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
                {`Total Hours: ${Math.round(count * 100) / 100}`} {/* Display the total count */}
            </Typography>

            {/* Linear Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={progress} // Progress based on the count
                sx={{
                    height: 10, // Adjust the height of the progress bar
                    borderRadius: 5, // Round the edges of the bar
                    mt: 1, // Add some space above the bar
                    backgroundColor: 'lightgray', // Color of the unfilled bar
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: progress > 50 ? 'primary.main' : 'secondary.main', // Change color based on progress
                    },
                }}
            />
            <Typography variant="caption" color="textSecondary">
                {`${progress.toFixed(1)}% towards 10,000 hours`}
            </Typography>
        </Box>
    );
}
