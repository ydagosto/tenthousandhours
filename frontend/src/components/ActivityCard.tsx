// components/ActivityCard.tsx
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

interface ActivityCardProps {
    name: string;
    description: string;
    unit: string;
    goal: number;
    count: number;
}

export default function ActivityCard({
    name,
    description,
    unit,
    goal,
    count,
}: ActivityCardProps) {
    return (
        <Card sx={{ mb: 2 }}>
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
