import { io } from 'socket.io-client';

export const notify = (message, receiver) => {
    const socketData = {
        message,
        receiver,
    };

    const socket = io('http://localhost:7007');
    socket.emit('notification', socketData);
};
