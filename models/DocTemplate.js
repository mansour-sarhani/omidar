import { Schema, model, models } from 'mongoose';

const docTemplateSchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        refNo: {
            type: Number,
            index: true,
        },
        nameFarsi: {
            type: String,
        },
        nameEnglish: {
            type: String,
        },
        type: {
            type: String,
            enum: ['image', 'sound', 'video', 'document'],
            required: true,
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
            required: true,
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
