import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

export const messageSchema = new Schema(
    {
        author: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            _id: {
                type: Schema.Types.ObjectId,
                refPath: 'authorModel',
                required: true,
            },
            avatar: {
                path: {
                    type: String,
                    default: '/assets/storage/users/',
                },
                url: {
                    type: String,
                    default: '',
                },
            },
        },
        authorModel: {
            type: String,
            required: true,
            enum: ['User', 'Client'],
        },
        body: {
            type: String,
            required: true,
        },
        hasAttachment: {
            type: Boolean,
            default: false,
        },
        attachment: {
            path: {
                type: String,
                default: '/assets/storage/attachments/',
            },
            url: {
                type: String,
                default: '',
            },
        },
    },
    { timestamps: true }
);

const Message = models.Message || model('Message', messageSchema);

export default Message;
