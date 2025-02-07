import useSocket from '@/hooks/useSocket';
import React, { useEffect } from 'react';

const NotificationComponent = () => {
    useSocket('http://localhost:7007');

    useEffect(() => {
        const socket = io('http://localhost:7007');

        socket.on('notification', (notification) => {
            console.log('New notification:', notification);
        });

        return () => {
            socket.off('notification');
        };
    }, []);

    return <div>Notification Component</div>;
};

export default NotificationComponent;
