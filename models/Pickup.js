import { Schema, model, models } from 'mongoose';

const pickupSchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        trackingCode: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        passportNo: {
            type: String,
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country',
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending',
            required: true,
        },
        pickupCode: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Pickup = models.Pickup || model('Pickup', pickupSchema);

export default Pickup;
