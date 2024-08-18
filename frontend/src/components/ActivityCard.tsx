// components/ActivityCard.tsx
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

interface ActivityCardProps {
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
    onClick: () => void;
}

export default function ActivityCard({
    name,
    description,
    unit,
    goal,
    count,
    onClick
}: ActivityCardProps) {
    return (
        <Card onClick={onClick} 
        
        sx={{
            mb: 2,
            cursor: 'pointer', // Make cursor a pointer to indicate it's clickable
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)', // Slightly scale up on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow on hover
            },
        }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary">
                    {description}
                </Typography>
                {/* <Typography variant="body2">
                    Unit: {unit}
                </Typography>
                <Typography variant="body2">
                    Goal: {goal}
                </Typography> */}
                <Typography variant="body2">
                    Count: {count}
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">Delete</Button>
            </CardActions> */}
        </Card>
    );
}
