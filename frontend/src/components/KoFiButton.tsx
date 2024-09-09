'use client';
import { Button } from '@mui/material';
import { Coffee as CoffeeIcon } from '@mui/icons-material';

export default function KoFiButton() {
    const handleKoFiClick = () => {
        window.open('https://ko-fi.com/yuridagosto', '_blank');
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            startIcon={<CoffeeIcon />}
            onClick={handleKoFiClick}
            sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                backgroundColor: '#29ABE0',
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#227BA8',
                },
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '0px',
            }}
        >
            Buy Me a Coffee
        </Button>
    );
}
