import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            refPath: 'createdByModel',
            required: true,
        },
        createdByModel: {
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
        attachments: [
            {
                path: {
                    type: String,
                    default: '/assets/storage/attachments/',
                },
                url: {
                    type: String,
                    default: '',
                },
            },
        ],
    },
    { timestamps: true }
);

const Message = models.Message || model('Message', messageSchema);

export default Message;
