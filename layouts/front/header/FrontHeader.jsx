import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import useCommonHooks from '@/hooks/useCommonHooks';
import WebFrontHeader from '@/layouts/front/header/_webFrontHeader';
import MobileFrontHeader from '@/layouts/front/header/_mobileFrontHeader';
import Cookies from 'js-cookie';
import checkUserEntity from '@/functions/checkUserEntity';

export default function FrontHeader() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [type, setType] = useState(null);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const token = Cookies.get('om_token');

    useEffect(() => {
        if (token) {
            async function verify() {
                await checkUserEntity(dispatch, enqueueSnackbar, setType);
            }
            verify();
        }
    }, [dispatch, enqueueSnackbar, token]);

    useEffect(() => {
        if (type === 'user') {
            router.push('/admin/dashboard');
        }
        if (type === 'client') {
            router.push('/panel/dashboard');
        }
        if (type === false || type === undefined) {
            Cookies.remove('om_token');
            return;
        }
    }, [router, type]);

    const viewPort = useSelector((state) => state.settings.viewPort);

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
            <MobileFrontHeader
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />
        );
    }
}
