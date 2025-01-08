import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Document from '@/models/Document';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Client from '@/models/Client';
import Notification from '@/models/Notification';
import { authMiddleware } from '@/utils/authMiddleware';
import FA from '@/utils/localizationFa';

//ADD DOCUMENT TO CONTRACT => "/api/contract/document?contractId=66bf44d3d02d846c4368ced0"
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
        const documentNo = formData.get('documentNo');
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const isCheckList = formData.get('isCheckList');
        const savedSampleUrl = formData.get('savedSampleUrl');
        const type = formData.get('type');
        const format = formData.get('format');
        const description = formData.get('description');
        const uploadBy = formData.get('uploadBy');
        const status = formData.get('status');
        const uploadByModel = 'User';

        const documentExists = await Document.findOne({ documentNo });

        if (documentExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'فایل با این شماره وجود دارد.',
                },
                { status: 400 }
            );
        }

        const documentData = {
            documentNo,
            nameFarsi,
            nameEnglish,
            isCheckList,
            type,
            format,
            description,
            uploadBy,
            uploadByModel,
            contractId,
            status,
            sample: {
                url: '',
                path: '/assets/storage/documents/',
            },
        };

        if (savedSampleUrl !== '') {
            documentData.sample.url = savedSampleUrl;
        }

        const uploadedFile = formData.get('file');

        if (
            uploadedFile &&
            (uploadedFile.type === 'image/jpeg' ||
                uploadedFile.type === 'image/png' ||
                uploadedFile.type === 'image/webp' ||
                uploadedFile.type === 'application/pdf' ||
                uploadedFile.type === 'image/svg+xml' ||
                uploadedFile.type === 'application/zip' ||
                uploadedFile.type === 'application/x-zip-compressed' ||
                uploadedFile.type === 'multipart/x-zip' ||
                uploadedFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(uploadedFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/documents/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/documents',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await uploadedFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            documentData.file = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
        }

        const sampleFile = formData.get('sample');

        if (
            sampleFile &&
            (sampleFile.type === 'image/jpeg' ||
                sampleFile.type === 'image/png' ||
                sampleFile.type === 'image/webp' ||
                sampleFile.type === 'application/pdf' ||
                sampleFile.type === 'image/svg+xml' ||
                sampleFile.type === 'application/zip' ||
                uploadedFile.type === 'application/x-zip-compressed' ||
                uploadedFile.type === 'multipart/x-zip' ||
                sampleFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(sampleFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/documents/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/documents',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await sampleFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            documentData.sample = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
        }

        const newDocument = new Document(documentData);
        await newDocument.save();

        contract.documents.push(newDocument._id);
        contract.markModified('documents');

        contract.lastUpdatedBy = uploadBy;
        contract.markModified('lastUpdatedBy');

        contract.lastUpdatedByModel = 'User';
        contract.markModified('lastUpdatedByModel');

        contract.save();

        const uploader = await User.findById(uploadBy);

        const uploaderName = uploader.firstName + ' ' + uploader.lastName;

        const activityRecord = {
            action: 'upload',
            performedBy: uploadBy,
            performedByModel: uploadByModel,
            details: `چک لیست فایل جدید با شماره ${documentNo} توسط ${uploaderName} به قرارداد اضافه شد.`,
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
            body: `چک لیست مدرک جدید با شماره${documentNo} توسط ${uploaderName} به قرارداد اضافه شد.`,
            type: 'info',
            sender: uploadBy,
            receiver: [contract.client],
            receiverModel: 'Client',
        };

        const notification = new Notification(newNotification);
        await notification.save();

        const client = await Client.findById(contract.client);
        client.notifications.push(notification._id);
        client.markModified('notifications');
        await client.save();

        return NextResponse.json({
            success: true,
            newDocument,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE OR REMOVE DOCUMENT FROM CONTRACT => "/api/document?contractId=66bf44d3d02d846c4368ced0&action=update"
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
        const documentId = formData.get('documentId');
        const userId = formData.get('userId');

        const user = await User.findOne({ _id: userId });
        const userName = user.firstName + ' ' + user.lastName;

        const document = await Document.findById(documentId);

        const client = await Client.findById(contract.client);

        if (!document) {
            return NextResponse.json(
                { success: false, message: 'قالب فایل وجود ندارد.' },
                { status: 400 }
            );
        }

        if (action === 'remove') {
            document.deleted = true;
            document.status = 'deleted';
            document.markModified('deleted');
            document.markModified('status');

            await document.save();

            contract.documents = contract.documents.filter(
                (document) => document._id.toString() !== documentId
            );
            contract.markModified('documents');

            contract.lastUpdatedBy = userId;
            contract.markModified('lastUpdatedBy');

            contract.lastUpdatedByModel = 'User';
            contract.markModified('lastUpdatedByModel');

            const activityRecord = {
                action: 'upload',
                performedBy: userId,
                performedByModel: 'User',
                details: `چک لیست فایل با شماره ${document.documentNo} توسط ${userName} از قرارداد حذف شد.`,
                contractId: contractId,
                timestamp: new Date(),
            };

            const newActivity = new Activity(activityRecord);
            await newActivity.save();

            contract.activities.push(newActivity._id);
            contract.markModified('activities');
            contract.save();

            return NextResponse.json({ success: true, data: document });
        } else if (action === 'comment') {
            const comment = formData.get('comment');
            if (comment !== null) {
                const newComment = {
                    userId,
                    userName,
                    body: comment,
                    date: new Date(),
                };

                document.comments.push(newComment);
                document.markModified('comments');
                document.save();

                const activityRecord = {
                    action: 'message',
                    performedBy: userId,
                    performedByModel: 'User',
                    details: `پیام جدید توسط ${userName} به چک لیست فایل با شماره ${document.documentNo} اضافه شد.`,
                    contractId: document.contractId,
                    timestamp: new Date(),
                };

                const newActivity = new Activity(activityRecord);
                await newActivity.save();

                contract.activities.push(newActivity._id);
                contract.markModified('activities');
                contract.save();

                const newNotification = {
                    subject: 'اطلاعیه',
                    body: `پیام جدید توسط ${userName} به چک لیست فایل با شماره ${document.documentNo} اضافه شد.`,
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

                return NextResponse.json({ success: true, data: document });
            }
        } else if (action === 'update') {
            const documentNo = formData.get('documentNo');
            const nameFarsi = formData.get('nameFarsi');
            const nameEnglish = formData.get('nameEnglish');
            const type = formData.get('type');
            const format = formData.get('format');
            const description = formData.get('description');
            const isCheckList = formData.get('isCheckList');
            const status = formData.get('status');

            if (documentNo !== null) {
                document.documentNo = documentNo;
                document.markModified('documentNo');
            }

            if (nameFarsi !== null) {
                document.nameFarsi = nameFarsi;
                document.markModified('nameFarsi');
            }

            if (nameEnglish !== null) {
                document.nameEnglish = nameEnglish;
                document.markModified('nameEnglish');
            }

            if (type !== null) {
                document.type = type;
                document.markModified('type');
            }

            if (description !== null) {
                document.description = description;
                document.markModified('description');
            }

            if (format !== null) {
                document.format = format;
                document.markModified('format');
            }

            if (isCheckList !== null) {
                document.isCheckList = isCheckList;
                document.markModified('isCheckList');
            }

            if (status !== null) {
                document.status = status;
                document.markModified('status');
            }

            const sampleFile = formData.get('sample');

            if (
                sampleFile &&
                (sampleFile.type === 'image/jpeg' ||
                    sampleFile.type === 'image/png' ||
                    sampleFile.type === 'image/webp' ||
                    sampleFile.type === 'application/pdf' ||
                    sampleFile.type === 'image/svg+xml' ||
                    sampleFile.type === 'application/zip' ||
                    sampleFile.type === 'application/x-zip-compressed' ||
                    sampleFile.type === 'multipart/x-zip' ||
                    sampleFile.type === 'application/x-rar-compressed')
            ) {
                const uniqueName = uuidv4() + path.extname(sampleFile.name);
                const savePath = path.join(
                    process.cwd(),
                    'public/assets/storage/documents/',
                    uniqueName
                );

                const directories = [
                    'public',
                    'public/assets',
                    'public/assets/storage',
                    'public/assets/storage/documents',
                ];

                directories.forEach((dir) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                const buffer = Buffer.from(await sampleFile.arrayBuffer());
                fs.writeFileSync(savePath, buffer);

                if (document.sample.url) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        'public/assets/storage/documents/',
                        document.sample.url
                    );
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                document.sample.url = uniqueName;
                document.markModified('sample');
            }

            const docFile = formData.get('file');

            if (
                docFile &&
                (docFile.type === 'image/jpeg' ||
                    docFile.type === 'image/png' ||
                    docFile.type === 'image/webp' ||
                    docFile.type === 'application/pdf' ||
                    docFile.type === 'image/svg+xml' ||
                    docFile.type === 'application/zip' ||
                    docFile.type === 'application/x-zip-compressed' ||
                    docFile.type === 'multipart/x-zip' ||
                    docFile.type === 'application/x-rar-compressed')
            ) {
                const uniqueName = uuidv4() + path.extname(docFile.name);
                const savePath = path.join(
                    process.cwd(),
                    'public/assets/storage/documents/',
                    uniqueName
                );

                const directories = [
                    'public',
                    'public/assets',
                    'public/assets/storage',
                    'public/assets/storage/documents',
                ];

                directories.forEach((dir) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                const buffer = Buffer.from(await docFile.arrayBuffer());
                fs.writeFileSync(savePath, buffer);

                if (document.file.url) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        'public/assets/storage/documents/',
                        document.file.url
                    );
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                document.file.url = uniqueName;
                document.markModified('file');
            }

            await document.save();

            if (status !== null) {
                const activityRecord = {
                    action: 'update',
                    performedBy: userId,
                    performedByModel: 'User',
                    details: `وضعیت چک لیست فایل ${document.documentNo} توسط ${userName} به ${FA.status[status]} تغییر یافت.`,
                    contractId: document.contractId,
                    timestamp: new Date(),
                };

                const newActivity = new Activity(activityRecord);
                await newActivity.save();

                contract.activities.push(newActivity._id);
                contract.markModified('activities');
                contract.save();

                const newNotification = {
                    subject: 'اطلاعیه',
                    body: `وضعیت چک لیست فایل ${document.documentNo} توسط ${userName} به ${FA.status[status]} تغییر یافت.`,
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
            }
            return NextResponse.json({ success: true, data: document });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
