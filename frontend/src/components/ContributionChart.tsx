import React, { useEffect, useState } from 'react';
import ActivityCalendar from 'react-activity-calendar';
import { Tooltip as MuiTooltip, Card, CardContent, Typography, Box } from '@mui/material';

interface ContributionChartProps {
    practiceLogs: {
        date: string;
        count: number;
    }[];
}

export default function ContributionChart({ practiceLogs }: ContributionChartProps) {
    const [updatedLogs, setUpdatedLogs] = useState(practiceLogs);
    const [totalHours, setTotalHours] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [activeDays, setActiveDays] = useState(0);

    useEffect(() => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const oneYearAgoDateStr = oneYearAgo.toISOString().split('T')[0];

        // Check if the date from one year ago exists
        const dateExists = practiceLogs.some(log => log.date === oneYearAgoDateStr);

        // If it doesn't exist, add it with count = 0
        if (!dateExists) {
            setUpdatedLogs([
                { date: oneYearAgoDateStr, count: 0 },
                ...practiceLogs,
            ]);
        } else {
            setUpdatedLogs(practiceLogs);
        }

        // Calculate total hours of practice in the last year
        const total = practiceLogs.reduce((sum, log) => sum + log.count, 0);
        setTotalHours(total);

        // Calculate max streak and total active days
        let streak = 0;
        let maxStreak = 0;
        let activeDays = 0;
        let lastDate = new Date(oneYearAgoDateStr);

        practiceLogs.forEach(log => {
            const logDate = new Date(log.date);
            if (log.count > 0) {
                activeDays++;
                if ((logDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24) === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
                maxStreak = Math.max(maxStreak, streak);
            }
            lastDate = logDate;
        });

        setMaxStreak(maxStreak);
        setActiveDays(activeDays);
    }, [practiceLogs]);

    const values = updatedLogs.map(log => ({
        date: log.date.split('T')[0], // Ensure the date format is YYYY-MM-DD
        count: log.count,
        level: Math.min(log.count, 4), // Adjust level to control color intensity
    }));

    return (
        <div className="w-full flex justify-center p-4">
            <Card className="w-full shadow-lg">
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1">
                            <strong>{totalHours}</strong> hours of practice in the last year
                        </Typography>
                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                            <Typography variant="subtitle2" mr={2}>
                                Total Active Days: <strong>{activeDays}</strong>
                            </Typography>
                            <Typography variant="subtitle2">
                                Max Streak: <strong>{maxStreak}</strong> days
                            </Typography>
                        </Box>
                    </Box>
                    <div className="w-full flex justify-center">
                        <div className="w-full justify-end overflow-x-auto" style={{ textAlign: 'right', direction: 'rtl' }}>
                            <ActivityCalendar
                                data={values}
                                renderBlock={(block, activity) => (
                                    <MuiTooltip title={`${activity.count} hours on ${activity.date}`}>
                                        {block}
                                    </MuiTooltip>
                                )}
                                blockSize={15} // Size of each block
                                blockMargin={4} // Margin between blocks
                                blockRadius={8} // Rounded corners for blocks
                                fontSize={13} // Font size for labels
                                showWeekdayLabels={false} // Show labels for weekdays
                                hideColorLegend={true}
                                hideTotalCount={true}
                                labels={{
                                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                                }}
                                theme={{
                                    light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'], // Correct way to define colors
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
