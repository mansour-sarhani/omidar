import { Schema, model, models } from 'mongoose';

const visaSchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        code: {
            type: String,
            required: true,
        },
        artifactType: {
            type: String,
            enum: [
                'POT-WP',
                'biometricLetter',
                'confirmationSubmit',
                'passportRequest',
                'rejectLetter',
                'poeLetter',
            ],
            required: true,
        },
        fileUrl: {
            type: String,
        },
        artifactUrl: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'uploaded'],
            default: 'pending',
            required: true,
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
            required: true,
        },
    },
    { timestamps: true }
);

const Visa = models.Visa || model('Visa', visaSchema);

export default Visa;
