import React, { useEffect, useState } from 'react';
import ActivityCalendar from 'react-activity-calendar';
import { Tooltip as MuiTooltip } from '@mui/material';

interface ContributionChartProps {
    practiceLogs: {
        date: string;
        count: number;
    }[];
}

export default function ContributionChart({ practiceLogs }: ContributionChartProps) {
    const [updatedLogs, setUpdatedLogs] = useState(practiceLogs);

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
        console.log(updatedLogs);
    }, [practiceLogs]);

    const values = updatedLogs.map(log => ({
        date: log.date.split('T')[0], // Ensure the date format is YYYY-MM-DD
        count: log.count,
        level: Math.min(log.count, 4), // Adjust level to control color intensity
    }));

    return (
        <div className="w-full overflow-x-auto">
            <ActivityCalendar
                data={values}
                renderBlock={(block, activity) => (
                    <MuiTooltip title={`${activity.count} activities on ${activity.date}`}>
                    {block}
                    </MuiTooltip>
                )}
                blockSize={14} // Size of each block
                blockMargin={5} // Margin between blocks
                fontSize={12} // Font size for labels
                showWeekdayLabels={true} // Show labels for weekdays
                labels={{
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                    totalCount: '{{count}} contributions in {{year}}',
                    legend: {
                        less: 'Less',
                        more: 'More',
                    },
                }}
                theme={{
                    light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'], // Correct way to define colors
                }}
            />
        </div>
    );
}