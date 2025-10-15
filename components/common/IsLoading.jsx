'use client';

import { memo } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const IsLoading = memo(function IsLoading({ isLoading, size = 40 }) {
    if (!isLoading) return null;

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isLoading}
        >
            <CircularProgress color="inherit" size={size} />
        </Backdrop>
    );
});

export default IsLoading;
