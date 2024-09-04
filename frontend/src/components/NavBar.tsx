"use client";

import { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { fetcher } from '@/utils/api';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Validate if the user is logged in based on token
    useEffect(() => {
      const validateToken = async () => {
        try {
          await fetcher('/validate-token', {
            method: 'GET',
          });
          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
        }
      };
  
      validateToken();
    }, []);
    
    return (
        <nav className="bg-gray-800 p-2">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left side - Home link */}
                <div className="text-white text-lg font-semibold">
                    <a href="/">Home</a>
                </div>

                {/* Right side - Profile avatar */}
                <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <Avatar alt="User Avatar" className="cursor-pointer">
                        U {/* You can add user's initial here if available */}
                    </Avatar>
                    ) : (
                    <IconButton>
                        <MenuIcon className="text-white" />
                    </IconButton>
                )}
                </div>
            </div>
        </nav>
    );
}