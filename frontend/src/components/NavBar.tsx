import React from 'react';
import { Avatar } from '@mui/material';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-2">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left side - Home link */}
                <div className="text-white text-lg font-semibold">
                    <a href="/">Home</a>
                </div>

                {/* Right side - Profile avatar */}
                <div className="flex items-center space-x-4">
                    <Avatar
                        alt="User Avatar"
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </nav>
    );
}