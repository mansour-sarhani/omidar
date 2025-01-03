import { Schema, model, models } from 'mongoose';

const notificationSchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        subject: {
            type: String,
        },
        body: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
        type: {
            type: String,
            enum: ['info', 'warning', 'alert', 'success'],
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: [
            {
                type: Schema.Types.ObjectId,
                refPath: 'receiverModel',
                required: true,
            },
        ],
        receiverModel: {
            type: String,
            required: true,
            enum: ['User', 'Client'],
        },
    },
    { timestamps: true }
);

const Notification =
    models.Notification || model('Notification', notificationSchema);

export default Notification;
