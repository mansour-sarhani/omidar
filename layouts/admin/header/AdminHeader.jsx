import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import { useRouter } from 'next/navigation';
import userLogout from '@/functions/user/userLogout';
import WebAdminHeader from './_webAdminHeader';

export default function AdminHeader({ user }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const viewPort = useSelector((state) => state.public.viewPort);

    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogout = async () => {
        await userLogout(enqueueSnackbar, router);
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
            <WebAdminHeader
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />
        );
    } else {
        return (
            <WebAdminHeader
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />
        );
    }
}
