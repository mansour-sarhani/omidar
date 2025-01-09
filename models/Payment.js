import { Schema, model, models } from 'mongoose';

const paymentSchema = new Schema(
    {
        Id: {
            type: Number,
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
        type: {
            type: String,
            enum: [
                'appilicationFee',
                'visaFee',
                'contractFee',
                'translationFee',
                'languageCourseFee',
                'tuitionFee',
                'otherFee',
                'returned',
            ],
            required: true,
        },
        finalFee: {
            type: Number,
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'IRR'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ['direct', 'deposit'],
            required: true,
        },
        paidAmount: {
            type: Number,
        },
        paidRial: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Payment = models.Payment || model('Payment', paymentSchema);

export default Payment;
