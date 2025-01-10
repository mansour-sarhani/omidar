import Client from '@/models/Client';
import User from '@/models/User';
import Counter from '@/models/Counter';
import Notification from '@/models/Notification';
import { io } from 'socket.io-client';

export const notify = async (props) => {
    const { subject, message, type, senderModel, receiver, receiverModel } =
        props;

    const notificationData = {
        subject: subject,
        body: message,
        type: type,
        senderModel: senderModel,
        receiver: receiver,
        receiverModel: receiverModel,
    };

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'notificationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    notificationData.Id = counter.seq;

    const newNotification = new Notification(notificationData);
    await newNotification.save();

    for (const receiverId of receiver) {
        if (receiverModel === 'Client') {
            const client = await Client.findById(receiverId);
            if (client) {
                client.notifications.push(newNotification._id);
                client.markModified('notifications');
                await client.save();
            }
        } else if (receiverModel === 'User') {
            const user = await User.findById(receiverId);
            if (user) {
                user.notifications.push(newNotification._id);
                user.markModified('notifications');
                await user.save();
            }
        }
    }

    const socketData = {
        message,
        receiver,
    };

    const socket = io('http://localhost:7007');
    socket.emit('notification', socketData);
};
