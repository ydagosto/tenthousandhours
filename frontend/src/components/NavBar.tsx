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

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        handleMenuClose();
        router.push('/login');
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

    // Validate if the user is logged in based on token
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

    useEffect(() => {
        // Initial token validation on mount
        validateToken();
        
        window.addEventListener('storage', validateToken);

        return () => {
            window.removeEventListener('storage', validateToken);
        };
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
                    <>
                        <Avatar alt="User Avatar" className="cursor-pointer"  onClick={handleMenuClick}>
                            U {/* You can add user's initial here if available */}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            slotProps={menuProps}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleMenuClose}>
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