'use client';

import React, { createContext, useContext, useEffect, useState, useRef, memo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = memo(function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    const dev = process.env.NODE_ENV !== 'production';

    useEffect(() => {
        // Prevent multiple socket connections
        if (socketRef.current) {
            return;
        }

        const socketUrl = dev ? 'http://localhost:7007' : process.env.NEXT_PUBLIC_LIVE_URL;
        
        // Only create socket if URL is available
        if (!socketUrl) {
            console.warn('Socket URL not configured');
            return;
        }

        const socketInstance = io(socketUrl, {
            // Performance optimizations
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 20000,
            forceNew: false,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            maxReconnectionAttempts: 5,
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        // Connection event handlers
        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [dev]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
});

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};
