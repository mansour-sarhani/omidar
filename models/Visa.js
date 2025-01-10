import { Schema, model, models } from 'mongoose';

const visaSchema = new Schema(
    {
        Id: {
            type: Number,
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
            enum: ['pending', 'approved', 'rejected', 'uploaded', 'deleted'],
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
