import { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const OptimizedLoading = memo(function OptimizedLoading({ 
    size = 40, 
    color = 'primary', 
    text = 'در حال بارگذاری...',
    fullScreen = false 
}) {
    const containerStyle = fullScreen 
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
        }
        : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        };

    return (
        <Box sx={containerStyle}>
            <CircularProgress size={size} color={color} />
            {text && (
                <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                    {text}
                </Box>
            )}
        </Box>
    );
});

export default OptimizedLoading;