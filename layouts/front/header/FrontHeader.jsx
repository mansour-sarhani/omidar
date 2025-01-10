import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import useCommonHooks from '@/hooks/useCommonHooks';
import WebFrontHeader from '@/layouts/front/header/_webFrontHeader';

export default function FrontHeader() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { dispatch } = useCommonHooks();

    const viewPort = useSelector((state) => state.public.viewPort);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        dispatch(toggleTheme({ theme: isDarkMode ? 'light' : 'dark' }));
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                setIsDarkMode(true);
                dispatch(toggleTheme({ theme: 'dark' }));
            } else {
                setIsDarkMode(false);
                dispatch(toggleTheme({ theme: 'light' }));
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    if (viewPort === 'desktop') {
        return (
            <WebFrontHeader
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />
        );
    } else {
        return (
            <WebFrontHeader
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />
        );
    }
}
