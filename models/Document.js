import { Schema, model, models } from 'mongoose';

const documentSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        documentNo: {
            type: Number,
            required: true,
        },
        nameFarsi: {
            type: String,
            required: true,
        },
        nameEnglish: {
            type: String,
        },
        isCheckList: {
            type: Boolean,
        },
        type: {
            type: String,
            enum: ['image', 'sound', 'video', 'document'],
        },
        format: {
            type: String,
            enum: ['JPG', 'PNG', 'JPEG', 'MP3', 'MP4', 'PDF', 'ZIP'],
        },
        description: {
            type: String,
        },
        uploadBy: {
            type: Schema.Types.ObjectId,
            refPath: 'uploadByModel',
        },
        uploadByModel: {
            type: String,
            enum: ['User', 'Client'],
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
        },
        file: {
            path: {
                type: String,
                default: '/assets/storage/documents/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        sample: {
            path: {
                type: String,
                default: '/assets/storage/documents/',
            },
            url: {
                type: String,
                default: '',
            },
        },
        comments: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                userName: {
                    type: String,
                },
                body: {
                    type: String,
                },
                date: {
                    type: Date,
                },
            },
        ],
        status: {
            type: String,
            enum: ['approved', 'rejected', 'pending', 'underReview', 'deleted'],
            default: 'underReview',
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Document = models.Document || model('Document', documentSchema);

export default Document;
