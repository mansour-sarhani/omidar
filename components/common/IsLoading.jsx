'use client';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function IsLoading({ isLoading }) {
    if (isLoading) {
        return (
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
}
