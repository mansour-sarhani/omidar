import { Schema, model, models } from 'mongoose';

const paymentSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        title: {
            type: String,
            required: true,
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
        paidAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'IRT'],
            required: true,
        },
        dateOfPayment: {
            type: Date,
        },
        paymentMethod: {
            type: String,
            enum: ['direct', 'deposit'],
            required: true,
        },
        receipt: {
            path: {
                type: String,
                default: '/assets/storage/payments/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'deleted'],
            default: 'pending',
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Payment = models.Payment || model('Payment', paymentSchema);

export default Payment;
