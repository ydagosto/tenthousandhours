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
    const [updatedLogs, setUpdatedLogs] = useState<{ date: string, count: number }[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [activeDays, setActiveDays] = useState(0);

    useEffect(() => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const oneYearAgoDateStr = oneYearAgo.toISOString().split('T')[0]; // Convert one year ago to YYYY-MM-DD format
        const todayDateStr = today.toISOString().split('T')[0]; // Convert today to YYYY-MM-DD format

        // 1. Group logs by date and sum the counts
        const logsByDate = practiceLogs.reduce((acc, log) => {
            const date = log.date.split('T')[0]; // Normalize date to YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += log.count; // Sum the counts for the same day
            return acc;
        }, {} as Record<string, number>);

        // 2. Check if there is an entry for one year ago, if not, add a log with count = 0
        if (!logsByDate[oneYearAgoDateStr]) {
            logsByDate[oneYearAgoDateStr] = 0;
        }

        // 3. Check if there is an entry for today, if not, add a log with count = 0
        if (!logsByDate[todayDateStr]) {
            logsByDate[todayDateStr] = 0;
        }

        // 3. Transform logsByDate back into an array of objects
        let summedLogs = Object.keys(logsByDate).map(date => ({
            date,
            count: logsByDate[date],
        }));

        // 4. Sort the logs by date
        summedLogs = summedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setUpdatedLogs(summedLogs);

        // 4. Calculate total hours of practice in the last year
        const total = summedLogs.reduce((sum, log) => sum + log.count, 0);
        setTotalHours(total);

        // 5. Calculate max streak and total active days
        let streak = 0;
        let maxStreak = 0;
        let activeDays = 0;
        let lastDate = oneYearAgo;

        summedLogs.forEach(log => {
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
        date: log.date, // Ensure the date format is YYYY-MM-DD
        count: log.count,
        level: Math.min(log.count, 4), // Adjust level to control color intensity
    }));

    return (
        <div className="w-full flex justify-center p-2">
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
                                blockRadius={2} // Rounded corners for blocks
                                fontSize={13} // Font size for labels
                                showWeekdayLabels={false} // Hide weekday labels
                                hideColorLegend={true} // Hide color legend
                                hideTotalCount={true} // Hide total count
                                labels={{
                                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                                }}
                                theme={{
                                    light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'], // Correct theme colors for light mode
                                    dark: ['#1e1e1e', '#2e2e2e', '#216e39', '#30a14e', '#40c463'], // Adjusted dark mode theme to 5 colors
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
