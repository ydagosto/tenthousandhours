"use client";

import { Container, Typography } from '@mui/material';
import ActivitySidebar from '@/components/ActivitySidebar';

export default function Dashboard() {

    return (
        <div className="flex">
            <ActivitySidebar />
            <main className="flex-1 p-6">
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                {/* Other content for the dashboard */}
            </main>
        </div>
    );
}
