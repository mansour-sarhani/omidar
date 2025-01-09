import Counter from '@/models/Counter';
import Activity from '@/models/Activity';
import Contract from '@/models/Contract';

export const addActivity = async (props) => {
    const { action, performedBy, performedByModel, details, contractId } =
        props;

    const activityData = {
        action,
        performedBy,
        performedByModel,
        details,
        contractId,
    };

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'activityId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    activityData.Id = counter.seq;

    const newActivity = new Activity(activityData);
    await newActivity.save();

    const contract = await Contract.findById(contractId);

    contract.activities.push(newActivity._id);
    contract.markModified('activities');
    contract.save();

    return newActivity;
};
