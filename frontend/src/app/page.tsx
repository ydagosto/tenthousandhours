"use client";
import { useState, useEffect } from 'react';
import { fetcher } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const router = useRouter();
  const [dashboardPage, setDashboardPage] = useState('/login');
  const [loading, setLoading] = useState(true); // New loading state

  // Validate whether the user is logged in or not
  useEffect(() => {
    const validateToken = async () => {
      try {
        await fetcher('/validate-token', {
          method: 'GET'
        });
        setDashboardPage('/dashboard');
        router.push('/dashboard');
      } catch (error) {
        setDashboardPage('/login');
      } finally {
        setLoading(false); // End loading regardless of success or failure
      }
    };

    validateToken();
  }, []);

  // Display loading while validating the token
  if (loading) {
    return (
      <Box className="flex-1 flex flex-col items-center justify-center p-4" style={{ minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <h1 className="text-gray-700 text-3xl md:text-4xl font-bold mb-4 text-center">
        Welcome to tenthousandhours
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-6 text-center">
        Master Your Skills, One Hour at a Time.
      </p>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
        <a href="/register" className="text-gray-700 underline">
          Register
        </a>
        <a href="/login" className="text-gray-700 underline">
          Login
        </a>
        <a href="/about" className="text-gray-700 underline">
          About
        </a>
        <a href={dashboardPage} className="text-gray-700 underline">
          Dashboard
        </a>
      </div>
    </div>
  );
}
