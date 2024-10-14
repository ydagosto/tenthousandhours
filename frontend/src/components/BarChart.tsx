import React, { useState } from 'react';
import { useTheme, useMediaQuery, Card, CardContent, Typography, ButtonGroup, Button } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { PracticeLog } from '@/types/practiceLog';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Helper to subtract months from a date
const subtractMonths = (date: Date, months: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
};

// Helper to subtract weeks from a date
const subtractWeeks = (date: Date, weeks: number) => {
    const newDate = new Date(date.getTime()); // Create a copy of the original date
    const daysToSubtract = weeks * 8; // Convert weeks to days
    newDate.setDate(newDate.getDate() - daysToSubtract); // Subtract the days
    console.log(newDate)
    return newDate;
};

const filterLogsByRange = (logs: PracticeLog[], range: string) => {
    const today = new Date();
    let filteredLogs = logs;

    switch (range) {
        case '1W':
            filteredLogs = logs.filter(log => new Date(log.date) >= subtractWeeks(today, 1));
            break;
        case '1M':
            filteredLogs = logs.filter(log => new Date(log.date) >= subtractMonths(today, 1));
            break;
        case '3M':
            filteredLogs = logs.filter(log => new Date(log.date) >= subtractMonths(today, 3));
            break;
        case '6M':
            filteredLogs = logs.filter(log => new Date(log.date) >= subtractMonths(today, 6));
            break;
        case '1Y':
            filteredLogs = logs.filter(log => new Date(log.date) >= subtractMonths(today, 12));
            break;
        case 'Max':
        default:
            filteredLogs = logs;
            break;
    }

    return filteredLogs;
};

const formatDataForChart = (logs: PracticeLog[]) => {
    // Sort logs by date in ascending order
    logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const groupedLogs = logs.reduce((acc, log) => {
        const date = new Date(log.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = 0;
        acc[date] += log.count;
        return acc;
    }, {} as Record<string, number>);

    const firstDate = logs.length > 0 ? new Date(logs[0].date) : new Date();
    const today = new Date();

    // Generate all dates between firstDate and today
    const dates: string[] = [];
    for (let d = firstDate; d <= today; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
    }

    // Ensure all dates are present in groupedLogs, even if they have 0 hours
    dates.forEach(date => {
        if (!groupedLogs[date]) {
            groupedLogs[date] = 0;
        }
    });

    const hours = dates.map(date => groupedLogs[date]);

    // Calculate cumulative sum
    const cumulativeHours = hours.reduce((acc, value) => {
        const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
        acc.push(lastValue + value);
        return acc;
    }, [] as number[]);

    return { dates, hours, cumulativeHours };
};

interface BarChartProps {
    practiceLogs: PracticeLog[];
}

export default function BarChart({ practiceLogs }: BarChartProps) {
    // State for selected range, default to "3M"
    const [selectedRange, setSelectedRange] = useState('3M');

    // Filter logs based on selected range
    const filteredLogs = filterLogsByRange(practiceLogs, selectedRange);

    // Use the MUI theme to detect mobile view
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile

    const { dates, hours, cumulativeHours } = formatDataForChart(filteredLogs);

    // Determine the interval for displaying points
    const totalPoints = dates.length;
    let pointInterval = isMobile ? Math.ceil(totalPoints / 20) : Math.ceil(totalPoints / 45); // Adjust this based on total points
    if (pointInterval < 1) pointInterval = 1;

    // Define the chart data with mixed types
    const chartData: ChartData<'bar' | 'line', number[], string> = {
        labels: dates,
        datasets: [
            {
                type: 'bar',
                label: 'Hours Practiced',
                data: hours,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'Cumulative Hours',
                data: cumulativeHours,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: false,
                yAxisID: 'y1',
                pointRadius: cumulativeHours.map((_, index) => (index % pointInterval === 0 ? 3 : 0)), // Show points at intervals
            },
        ],
    };

    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        maintainAspectRatio: false,  // Allow chart to take full height
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const rawValue = parseFloat(context.raw as string);
                        const roundedValue = rawValue.toFixed(2);
                        return `${context.dataset.label}: ${roundedValue} hours`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
                grid: {
                    display: false,  // Remove gridlines on x-axis
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Hours',
                },
                beginAtZero: true,
                position: 'left',
                grid: {
                    display: false,  // Remove gridlines on y-axis
                },
            },
            y1: {
                title: {
                    display: true,
                    text: 'Cumulative Hours',
                },
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,  // Ensure no gridlines overlap with the y-axis
                },
            },
        },
    };

    return (
        <div className="flex flex-col justify-center p-2">
            <Card className="shadow-lg w-full max-w-4xl">
                <Typography className="p-2" variant='h6' align="center">
                    Practice Hours and Cumulative Progress
                </Typography>
                <div className="flex justify-center mb-4">
                    <ButtonGroup variant="text">
                        {['Max', '1Y', '6M', '3M', '1M', '1W'].map((range) => (
                            <Button
                                key={range}
                                onClick={() => setSelectedRange(range)}
                                color={selectedRange === range ? 'primary' : 'secondary'}
                            >
                                {range}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
                <CardContent style={{ padding: 10 }}>
                    <div
                        className="w-full"
                        style={{
                            height: isMobile ? '300px' : '400px', // Set height based on screen size
                            width: '100%',
                        }}
                    >
                        <Chart<'bar' | 'line'>
                            type='bar'
                            data={chartData}
                            options={options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
