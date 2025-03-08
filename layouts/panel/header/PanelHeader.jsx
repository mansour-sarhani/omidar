import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/settingsSlice';
import { useSocket } from '@/providers/SocketProvider';
import clientLogout from '@/functions/client/clientLogout';
import useCommonHooks from '@/hooks/useCommonHooks';
import WebPanelHeader from '@/layouts/panel/header/_webPanelHeader';
import MobilePanelHeader from './_mobilePanelHeader';

export default function PanelHeader({ client }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const viewPort = useSelector((state) => state.public.viewPort);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const socket = useSocket();

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

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log('Connected to socket server:', socket.id);
            socket.emit('joinRoom', client._id);
        }

        function onDisconnect() {
            console.log('socket is disconnected.');
        }

        socket.on('connect', onConnect);

        socket.on('disconnect', onDisconnect);

        socket.on('notification', (data) => {
            if (data.receiver.includes(client._id)) {
                enqueueSnackbar(data.message, { variant: 'info' });
            }
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [client, enqueueSnackbar, socket]);

    if (viewPort === 'desktop') {
        return (
            <WebPanelHeader
                client={client}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                socket={socket}
            />
        );
    } else {
        return (
            <MobilePanelHeader
                client={client}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                socket={socket}
            />
        );
    }
}
