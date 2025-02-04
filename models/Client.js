import { Schema, model, models } from 'mongoose';

const clientSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
        },
        motherName: {
            type: String,
        },
        nationalId: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: null,
        },
        zipCode: {
            type: String,
            default: null,
        },
        contracts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Contract',
            },
        ],
        tickets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ticket',
            },
        ],
        notifications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Notification',
            },
        ],
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
        status: {
            type: String,
            enum: ['active', 'inactive', 'banned', 'deleted'],
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

const Client = models.Client || model('Client', clientSchema);

export default Client;
