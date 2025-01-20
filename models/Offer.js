import { Schema, model, models } from 'mongoose';

const offerSchema = new Schema(
    {
        Id: {
            type: Number,
        },
        title: {
            type: String,
            required: true,
        },
        studyLanguage: {
            type: String,
        },
        fieldOfStudy: {
            type: String,
        },
        degree: {
            type: String,
        },
        intake: {
            type: String,
        },
        university: {
            type: String,
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
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'IRT'],
        },
        description: {
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
        languageReq: {
            type: Boolean,
        },
        languageReqDate: {
            type: Date,
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['active', 'deleted'],
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
