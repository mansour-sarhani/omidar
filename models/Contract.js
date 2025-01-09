import { Schema, model, models } from 'mongoose';

const contractSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        contractNo: {
            type: Number,
            unique: true,
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        countries: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Country',
            },
        ],
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        admissions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Admission',
            },
        ],
        offers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Offer',
            },
        ],
        documents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Document',
            },
        ],
        payments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Payment',
            },
        ],
        pickups: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Pickup',
            },
        ],
        visas: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Visa',
            },
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
        activities: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Activity',
            },
        ],
        visaExpiryDate: {
            type: Date,
            default: null,
        },
        arrivalDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'processing', 'canceled', 'done'],
            default: 'active',
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Contract = models.Contract || model('Contract', contractSchema);

export default Contract;
