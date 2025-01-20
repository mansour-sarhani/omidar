import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Contract from '@/models/Contract';
import Offer from '@/models/Offer';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { authMiddleware } from '@/utils/authMiddleware';
import Counter from '@/models/Counter';
import Client from '@/models/Client';
import Notification from '@/models/Notification';

//ADD OFFER TO CONTRACT => "/api/contract/offer?contractId=66bf44d3d02d846c4368ced0"
export async function POST(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'قرارداد با این شناسه وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const title = formData.get('title');
        const studyLanguage = formData.get('studyLanguage');
        const fieldOfStudy = formData.get('fieldOfStudy');
        const degree = formData.get('degree');
        const intake = formData.get('intake');
        const university = formData.get('university');
        const userId = formData.get('userId');
        const clientId = formData.get('clientId');
        const applicationFee = formData.get('applicationFee');
        const currency = formData.get('currency');
        const description = formData.get('description');
        const interview = formData.get('interview');
        const interviewDate = formData.get('interviewDate');
        const test = formData.get('test');
        const testDate = formData.get('testDate');
        const languageReq = formData.get('languageReq');
        const languageReqDate = formData.get('languageReqDate');
        const deadline = formData.get('deadline');

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;

        const client = await Client.findById(contract.client);

        const offerData = {
            title,
            studyLanguage,
            fieldOfStudy,
            degree,
            intake,
            university,
            user: userId,
            client: clientId,
            applicationFee,
            currency,
            description,
            interview,
            interviewDate,
            test,
            testDate,
            languageReq,
            languageReqDate,
            deadline,
            contractId,
        };

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'offerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        offerData.Id = counter.seq;

        const newOffer = new Offer(offerData);
        await newOffer.save();

        contract.offers.push(newOffer._id);
        contract.markModified('offers');

        contract.lastUpdatedBy = userId;
        contract.markModified('lastUpdatedBy');

        contract.lastUpdatedByModel = 'User';
        contract.markModified('lastUpdatedByModel');

        const activityRecord = {
            action: 'update',
            performedBy: userId,
            performedByModel: 'User',
            details: `آفر جدید با عنوان ${offerData.title} توسط ${userName} به قرارداد اضافه شد.`,
            contractId: contractId,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        contract.activities.push(newActivity._id);
        contract.markModified('activities');
        contract.save();

        const newNotification = {
            subject: 'اطلاعیه',
            body: `آفر جدید با عنوان ${offerData.title} توسط ${userName} به قرارداد اضافه شد.`,
            type: 'info',
            sender: userId,
            receiver: [contract.client],
            receiverModel: 'Client',
        };

        const notification = new Notification(newNotification);
        await notification.save();

        client.notifications.push(notification._id);
        client.markModified('notifications');
        await client.save();

        return NextResponse.json({
            success: true,
            data: newOffer,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE OR REMOVE OFFER FROM CONTRACT => "/api/offer?contractId=66bf44d3d02d846c4368ced0&action=update"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const offerId = formData.get('offerId');
        const userId = formData.get('userId');

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;

        const client = await Client.findById(contract.client);

        const offer = await Offer.findById(offerId);

        if (!offer) {
            return NextResponse.json(
                { success: false, message: 'آفر وجود ندارد.' },
                { status: 400 }
            );
        }

        if (action === 'remove') {
            offer.deleted = true;
            offer.status = 'deleted';
            offer.markModified('deleted');
            offer.markModified('status');

            await offer.save();

            contract.offers = contract.offers.filter(
                (offer) => offer._id.toString() !== offerId
            );

            contract.markModified('offers');

            contract.lastUpdatedBy = userId;
            contract.markModified('lastUpdatedBy');

            contract.lastUpdatedByModel = 'User';
            contract.markModified('lastUpdatedByModel');

            const activityRecord = {
                action: 'upload',
                performedBy: userId,
                performedByModel: 'User',
                details: `آفر با عنوان ${offer.title} توسط ${userName} از قرارداد حذف شد.`,
                contractId: contractId,
                timestamp: new Date(),
            };

            const newActivity = new Activity(activityRecord);
            await newActivity.save();

            contract.activities.push(newActivity._id);
            contract.markModified('activities');

            await contract.save();

            return NextResponse.json({ success: true, data: offer });
        } else if (action === 'update') {
            const title = formData.get('title');
            const studyLanguage = formData.get('studyLanguage');
            const fieldOfStudy = formData.get('fieldOfStudy');
            const degree = formData.get('degree');
            const intake = formData.get('intake');
            const university = formData.get('university');
            const userId = formData.get('userId');
            const applicationFee = formData.get('applicationFee');
            const currency = formData.get('currency');
            const description = formData.get('description');
            const interview = formData.get('interview');
            const interviewDate = formData.get('interviewDate');
            const test = formData.get('test');
            const testDate = formData.get('testDate');
            const languageReq = formData.get('languageReq');
            const languageReqDate = formData.get('languageReqDate');
            const deadline = formData.get('deadline');
            const status = formData.get('status');

            if (title !== null) {
                offer.title = title;
                offer.markModified('title');
            }

            if (studyLanguage !== null) {
                offer.studyLanguage = studyLanguage;
                offer.markModified('studyLanguage');
            }

            if (fieldOfStudy !== null) {
                offer.fieldOfStudy = fieldOfStudy;
                offer.markModified('fieldOfStudy');
            }

            if (degree !== null) {
                offer.degree = degree;
                offer.markModified('degree');
            }

            if (intake !== null) {
                offer.intake = intake;
                offer.markModified('intake');
            }

            if (university !== null) {
                offer.university = university;
                offer.markModified('university');
            }

            if (applicationFee !== null) {
                offer.applicationFee = applicationFee;
                offer.markModified('applicationFee');
            }

            if (currency !== null) {
                offer.currency = currency;
                offer.markModified('currency');
            }

            if (description !== null) {
                offer.description = description;
                offer.markModified('description');
            }

            if (interview !== null) {
                offer.interview = interview;
                offer.markModified('interview');
            }

            if (interviewDate !== null) {
                offer.interviewDate = interviewDate;
                offer.markModified('interviewDate');
            }

            if (test !== null) {
                offer.test = test;
                offer.markModified('test');
            }

            if (testDate !== null) {
                offer.testDate = testDate;
                offer.markModified('testDate');
            }

            if (languageReq !== null) {
                offer.languageReq = languageReq;
                offer.markModified('languageReq');
            }

            if (languageReqDate !== null) {
                offer.languageReqDate = languageReqDate;
                offer.markModified('languageReqDate');
            }

            if (deadline !== null) {
                offer.deadline = deadline;
                offer.markModified('deadline');
            }

            if (status !== null) {
                offer.status = status;
                offer.markModified('status');
            }

            await offer.save();

            const activityRecord = {
                action: 'update',
                performedBy: userId,
                performedByModel: 'User',
                details: `آفر با عنوان ${offer.title} توسط ${userName} به روزرسانی شد.`,
                contractId: offer.contractId,
                timestamp: new Date(),
            };

            const newActivity = new Activity(activityRecord);
            await newActivity.save();

            const newNotification = {
                subject: 'اطلاعیه',
                body: `آفر با عنوان ${offer.title} توسط ${userName} به روزرسانی شد.`,
                type: 'info',
                sender: userId,
                receiver: [contract.client],
                receiverModel: 'Client',
            };

            const notification = new Notification(newNotification);
            await notification.save();

            client.notifications.push(notification._id);
            client.markModified('notifications');
            await client.save();

            return NextResponse.json({ success: true, data: offer });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
