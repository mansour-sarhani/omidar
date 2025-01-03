import { Schema, model, models } from 'mongoose';

const countrySchema = new Schema(
    {
        Id: {
            type: Number,
            index: true,
        },
        nameFarsi: {
            type: String,
            required: true,
        },
        nameEnglish: {
            type: String,
            required: true,
        },
        flag: {
            path: {
                type: String,
                default: '/assets/storage/countries/',
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

const Country = models.Country || model('Country', countrySchema);

export default Country;
