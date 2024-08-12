"use client";
import { useEffect } from 'react';

export default function Home() {

    useEffect(() => {
        const testFetch = async () => {
            try {
                const response = await fetch(`http://localhost:8080/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: 'test', email: 'test@example.com', password: 'password' }),
                });
                console.log('Response:', response);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        testFetch();
    }, []);

    return (
        <div>
        <h1>Welcome to Tenthousandhours</h1>
        <p>This is the homepage of your application.</p>
        <a href="/register">Register</a>
        <a href="/login">Login</a>
    </div>);
}
