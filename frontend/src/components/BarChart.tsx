import React from 'react';
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
import { Card, CardContent } from '@mui/material';

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
    const groupedLogs = logs.reduce((acc, log) => {
        const date = new Date(log.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = 0;
        acc[date] += log.count;
        return acc;
    }, {} as Record<string, number>);

    const dates = Object.keys(groupedLogs).sort();
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
    const { dates, hours, cumulativeHours } = formatDataForChart(practiceLogs);

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
            },
        ],
    };

    // Define the options with mixed chart types
    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw} hours`;
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
            },
            y: {
                title: {
                    display: true,
                    text: 'Hours',
                },
                beginAtZero: true,
                position: 'left',
            },
            y1: {
                title: {
                    display: true,
                    text: 'Cumulative Hours',
                },
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="flex justify-center p-4">
            <Card className="shadow-lg w-full max-w-4xl">
                <CardContent>
                    <div className="w-full">
                        <Chart<'bar' | 'line'>
                            type='bar'
                            data={chartData}
                            options={options}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
