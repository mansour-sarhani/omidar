import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import clientLogout from '@/functions/client/clientLogout';
import useCommonHooks from '@/hooks/useCommonHooks';
import WebPanelHeader from '@/layouts/panel/header/_webPanelHeader';

export default function PanelHeader({ client }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const viewPort = useSelector((state) => state.public.viewPort);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const handleLogout = async () => {
        await clientLogout(enqueueSnackbar, router);
    };

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
            <WebPanelHeader
                client={client}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />
        );
    } else {
        return (
            <WebPanelHeader
                client={client}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />
        );
    }
}
