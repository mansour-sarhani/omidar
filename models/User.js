import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
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
        nationalId: {
            type: Number,
            required: true,
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
        role: {
            type: String,
            enum: ['consultant', 'executive', 'chief_executive', 'admin'],
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
        notifications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Notification',
            },
        ],
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

const User = models.User || model('User', userSchema);

export default User;
