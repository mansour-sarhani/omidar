import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;
import { messageSchema } from './Message';

const ticketSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        ticketNo: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['waitingOnClient', 'waitingOnUser', 'closed'],
            default: 'active',
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
            required: true,
        },
        createdBy: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            _id: {
                type: Schema.Types.ObjectId,
                refPath: 'createdByModel',
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
        createdByModel: {
            type: String,
            required: true,
            enum: ['User', 'Client'],
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

const Ticket = models.Ticket || model('Ticket', ticketSchema);

export default Ticket;
