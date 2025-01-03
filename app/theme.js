'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'var(--font-vazir), sans-serif',
        body1: {
            lineHeight: 1.8,
            fontSize: '1rem',
        },
        body2: {
            lineHeight: 1.6,
            fontSize: '0.8rem',
        },
        h1: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '2rem',
            fontWeight: '600',
        },
        h2: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '1.85rem',
            fontWeight: '600',
        },
        h3: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '1.7rem',
            fontWeight: '600',
        },
        h4: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '1.5rem',
            fontWeight: '600',
        },
        h5: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '1.25rem',
            fontWeight: '600',
        },
        h6: {
            fontFamily: 'var(--font-vazir-bold), sans-serif',
            fontSize: '1.1rem',
            fontWeight: '600',
        },
    },
    palette: {
        primary: {
            main: '#003399',
        },
        secondary: {
            main: '#FF7A00',
        },
    },
});

export default theme;
