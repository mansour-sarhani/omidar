import { Schema, model, models } from 'mongoose';

const offerSchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        university: {
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
            required: true,
        },
        applicationFee: {
            type: Number,
        },
        description: {
            type: String,
        },
        clientComment: {
            type: String,
        },
        interview: {
            type: Boolean,
        },
        interviewDate: {
            type: Date,
        },
        test: {
            type: Boolean,
        },
        testDate: {
            type: Date,
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'deleted'],
            default: 'pending',
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Offer = models.Offer || model('Offer', offerSchema);

export default Offer;
