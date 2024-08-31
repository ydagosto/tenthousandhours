// apiUtils.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface FetcherOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

export const fetcher = async (url: string, options: FetcherOptions) => {
    // Function to safely get the token from localStorage
    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
        }
        return '';
    };
    
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`, // Retrieve the token
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unexpected error occurred');
    }

    return response.json();
};
