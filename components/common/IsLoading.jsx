'use client';

import { useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function IsLoading({ isLoading }) {
    // Suppress Next.js scroll restoration warning when backdrop is shown
    useEffect(() => {
        if (isLoading && typeof window !== 'undefined') {
            // Add data attribute to body to tell Next.js to skip scroll restoration
            document.body.setAttribute('data-nextjs-scroll-lock', 'true');
            return () => {
                document.body.removeAttribute('data-nextjs-scroll-lock');
            };
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
                invisible={false}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
}
