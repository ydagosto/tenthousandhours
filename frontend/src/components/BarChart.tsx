import React from 'react';
import { useTheme, useMediaQuery, Card, CardContent, Typography } from '@mui/material';
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

    // Use the MUI theme to detect mobile view
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile

    const { dates, hours, cumulativeHours } = formatDataForChart(practiceLogs);

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
        <div className="flex justify-center p-2">
            <Card className="shadow-lg w-full max-w-4xl">
                <Typography className="p-2" variant='h6' align="center">
                    Practice Hours and Cumulative Progress
                </Typography>
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
};
