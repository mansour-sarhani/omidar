import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import useCommonHooks from '@/hooks/useCommonHooks';
import { useSocket } from '@/providers/SocketProvider';
import userLogout from '@/functions/user/userLogout';
import WebAdminHeader from '@/layouts/admin/header/_webAdminHeader';

export default function AdminHeader({ user }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const viewPort = useSelector((state) => state.public.viewPort);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const socket = useSocket();

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

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log('Connected to socket server:', socket.id);
            socket.emit('joinRoom', user._id);
        }

        function onDisconnect() {
            console.log('socket is disconnected.');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('notification', (data) => {
            if (data.receiver.includes(user._id)) {
                enqueueSnackbar(data.message, { variant: 'info' });
            }
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [enqueueSnackbar, socket, user]);

    if (viewPort === 'desktop') {
        return (
            <WebAdminHeader
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                socket={socket}
            />
        );
    } else {
        return (
            <WebAdminHeader
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                socket={socket}
            />
        );
    }
}
