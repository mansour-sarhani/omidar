import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const docTemplateSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        refNo: {
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
            ref: 'User',
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
        status: {
            type: String,
            enum: ['active', 'inactive', 'deleted'],
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

const DocTemplate =
    models.DocTemplate || model('DocTemplate', docTemplateSchema);

export default DocTemplate;
