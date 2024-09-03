"use client";
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 text-center">
        Welcome to tenthousandhours
      </h1>
      <p className="text-white text-base md:text-lg mb-6 text-center">
        Master Your Skills, One Hour at a Time.
      </p>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
        <a href="/register" className="text-white underline">
          Register
        </a>
        <a href="/login" className="text-white underline">
          Login
        </a>
        <a href="/dashboard" className="text-white underline">
          Dashboard
        </a>
      </div>
    </div>
  );
}
