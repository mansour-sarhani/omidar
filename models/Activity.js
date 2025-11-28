import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const activitySchema = new Schema(
    {
        Id: {
            type: Number,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'create',
                'update',
                'delete',
                'download',
                'upload',
                'approve',
                'reject',
                'message',
                'close',
            ],
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            refPath: 'performedByModel',
            required: true,
        },
        performedByModel: {
            type: String,
            required: true,
            enum: ['User', 'Client'],
        },
        details: {
            type: String,
        },
        contractId: {
            type: Schema.Types.ObjectId,
            ref: 'Contract',
        },
    },
    { timestamps: true }
);

const Activity = models.Activity || model('Activity', activitySchema);

export default Activity;
