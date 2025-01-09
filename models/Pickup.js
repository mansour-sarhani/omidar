import { Schema, model, models } from 'mongoose';

const pickupSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        trackingCode: {
            type: String,
            required: true,
        },
        pickupCode: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
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
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled', 'deleted'],
            default: 'pending',
            required: true,
        },
    },
    { timestamps: true }
);

const Pickup = models.Pickup || model('Pickup', pickupSchema);

export default Pickup;
