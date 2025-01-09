import { Schema, model, models } from 'mongoose';

const admissionSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        title: {
            type: String,
        },
        type: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
        },
        admissionFile: {
            path: {
                type: String,
                default: '/assets/storage/contracts/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'deleted'],
            default: 'pending',
            required: true,
        },
    },
    { timestamps: true }
);

const Admission = models.Admission || model('Admission', admissionSchema);

export default Admission;
