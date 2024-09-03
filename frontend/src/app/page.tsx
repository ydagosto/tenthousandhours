"use client";
import { useEffect } from 'react';

export default function Home() {
  return (
    <div className="bg-lightblue-500 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-4xl font-bold mb-4">Welcome to Tenthousandhours</h1>
      <p className="text-white text-lg mb-6">This is the homepage of your application.</p>
      <div className="flex space-x-4">
        <a href="/register" className="text-white underline">Register</a>
        <a href="/login" className="text-white underline">Login</a>
        <a href="/dashboard" className="text-white underline">Dashboard</a>
      </div>
    </div>
  );
}
