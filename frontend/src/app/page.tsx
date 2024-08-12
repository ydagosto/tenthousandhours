"use client";
import { useEffect } from 'react';

export default function Home() {
  return (
      <div>
        <h1>Welcome to Tenthousandhours</h1>
        <p>This is the homepage of your application.</p>
        <a href="/register">Register</a>
        <a href="/login">Login</a>
      </div>);
}