import { Schema, model, models } from 'mongoose';

const visaSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
            required: true,
        },
        visaType: {
            type: String,
            enum: ['student', 'tourist', 'work', 'other'],
            required: true,
        },
        invLetterType: {
            type: String,
            enum: [
                'JW201',
                'JW202',
                'RussiaLetter',
                'RomaniaLetter',
                'personal',
                'tourist',
                'commercial',
            ],
        },
        userInvLetterFile: {
            path: {
                type: String,
                default: '/assets/storage/visa/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        clientInvLetterFile: {
            path: {
                type: String,
                default: '/assets/storage/visa/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        userVisaFile: {
            path: {
                type: String,
                default: '/assets/storage/visa/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        clientVisaFile: {
            path: {
                type: String,
                default: '/assets/storage/visa/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        issueDate: {
            type: Date,
            default: null,
        },
        expiryDate: {
            type: Date,
            default: null,
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

const Visa = models.Visa || model('Visa', visaSchema);

export default Visa;
