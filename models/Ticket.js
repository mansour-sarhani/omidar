import { Schema, model, models } from 'mongoose';

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
            enum: ['active', 'waitingOnClient', 'waitingOnUser', 'closed'],
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
            type: Schema.Types.ObjectId,
            refPath: 'createdByModel',
            required: true,
        },
        createdByModel: {
            type: String,
            required: true,
            enum: ['User', 'Client'],
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
    },
    { timestamps: true }
);

const Ticket = models.Ticket || model('Ticket', ticketSchema);

export default Ticket;
