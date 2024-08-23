import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { PracticeLog } from '@/types/practiceLog';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const formatDataForChart = (logs: PracticeLog[]) => {
    const groupedLogs = logs.reduce((acc, log) => {
        const date = new Date(log.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = 0;
        acc[date] += log.count;
        return acc;
    }, {} as Record<string, number>);

    const dates = Object.keys(groupedLogs).sort();
    const hours = dates.map(date => groupedLogs[date]);

    return { dates, hours };
};

interface BarChartProps {
    practiceLogs: PracticeLog[]
}

export default function BarChart({ practiceLogs }: BarChartProps) {
    
    const { dates, hours } = formatDataForChart(practiceLogs);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Hours Practiced',
                data: hours,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
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
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};
