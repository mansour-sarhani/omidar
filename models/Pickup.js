import { Schema, model, models } from 'mongoose';
import { string } from 'yup';

const pickupSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        dateOfArival: {
            type: Date,
            required: true,
        },
        timeOfArival: {
            type: String,
        },
        numberOfPassengers: {
            type: Number,
        },
        originLocation: {
            type: String,
        },
        pickupLocation: {
            type: String,
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country',
        },
        ticket: {
            path: {
                type: String,
                default: '/assets/storage/pickups/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        status: {
            type: String,
            enum: [
                'processing',
                'left',
                'arrived',
                'pickedUp',
                'done',
                'deleted',
            ],
            default: 'ongoing',
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Pickup = models.Pickup || model('Pickup', pickupSchema);

export default Pickup;
