"use client";

import { useState, useEffect, MouseEvent } from 'react';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { fetcher } from '@/utils/api';
import { useRouter } from 'next/navigation'; 
import { User } from '@/types/user';
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, username, setIsLoggedIn } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    

    // Close the menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle menu item click (navigate to the respective page)
    const handleMenuItemClick = (path: string) => {
        router.push(path);
        handleMenuClose();
    };

    const menuProps = {
        paper: {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
            },
            '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            },
        },
        },
    }

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        handleMenuClose();
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 p-2 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left side - Home link */}
                <div className="text-white text-lg font-semibold">
                    <a href="/">Home</a>
                </div>

                {/* Right side - Profile avatar */}
                <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <Avatar alt="User Avatar" className="cursor-pointer"  onClick={handleMenuClick}>
                            {username ? username.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            slotProps={menuProps}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => handleMenuItemClick('/profile')}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                    ) : (
                    <>
                        <IconButton onClick={handleMenuClick}>
                            <MenuIcon className="text-white" />
                        </IconButton>
                        {/* Menu component that opens on MenuIcon click */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            slotProps={menuProps}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => handleMenuItemClick('/login')}>
                                <ListItemIcon>
                                    <Login fontSize="small" />
                                </ListItemIcon> 
                                Login
                            </MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('/register')}>
                                <ListItemIcon>
                                    <HowToRegIcon fontSize="small" />
                                </ListItemIcon>
                                Register
                            </MenuItem>
                        </Menu>
                    </>
                )}
                </div>
            </div>
        </nav>
    );
}