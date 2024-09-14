import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';

const HomeButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <IconButton onClick={handleClick}  
    sx={{ paddingTop: 0,
        paddingBottom: 0
     }}
    >
      <img src="logo-light/logo-192x192.png" alt="Home" width={40} height={40} />
    </IconButton>
  );
};

export default HomeButton;
