import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Document from '@/models/Document';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Client from '@/models/Client';
import Notification from '@/models/Notification';
import { io } from 'socket.io-client';

//CLIENT UPLOAD DOCUMENT TO CONTRACT => "/api/client/document?contractId=123456789"
export async function POST(req, res) {
    await dbConnect();

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 401 }
            );
        }

        const validToken = verifyToken(token, secretKey);
        if (!validToken) {
            return NextResponse.json(
                { success: false, message: 'توکن معتبر نیست.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const formData = await req.formData();
        const documentId = formData.get('documentId');

        const client = await Client.findOne({ token: token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const contract = await Contract.findById(contractId).populate('users');
        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const document = await Document.findById(documentId);

        if (!document) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'چک فایل وجود ندارد.',
                },
                { status: 400 }
            );
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

            document.file = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
            document.markModified('file');
        }

        await document.save();

        const clientName = client.firstName + ' ' + client.lastName;

        const activityRecord = {
            action: 'upload',
            performedBy: client._id,
            performedByModel: 'Client',
            details: `فایل جدید برای چک لیست با عنوان ${document.nameFarsi} توسط ${clientName} بارگذاری شد.`,
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
            body: `فایل جدید برای چک لیست با عنوان ${document.nameFarsi} توسط ${clientName} بارگذاری شد.`,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users.map((user) => user._id),
            receiverModel: 'User',
        };

        const notification = new Notification(newNotification);
        await notification.save();

        for (const user of contract.users) {
            user.notifications.push(notification._id);
            user.markModified('notifications');
            await user.save();
        }

        const socket = io('http://localhost:7007');
        const message = `فایل جدید برای چک لیست با عنوان  توسط  بارگذاری شد.`;
        socket.emit('notification', message);

        return NextResponse.json({
            success: true,
            data: document,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//REMOVE UPDATED DOCUMENT FROM CHECKLIST => "/api/client/document?contractId=123456789"
export async function PUT(req) {
    await dbConnect();

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 401 }
            );
        }

        const validToken = verifyToken(token, secretKey);
        if (!validToken) {
            return NextResponse.json(
                { success: false, message: 'توکن معتبر نیست.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const formData = await req.formData();
        const documentId = formData.get('documentId');

        const client = await Client.findOne({ token: token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const contract = await Contract.findById(contractId);
        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const document = await Document.findById(documentId);

        if (!document) {
            return NextResponse.json(
                { success: false, message: 'فایل پیدا نشد.' },
                { status: 404 }
            );
        }

        document.file.url = '';
        document.markModified('file');

        await document.save();

        const clientName = client.firstName + ' ' + client.lastName;

        const activityRecord = {
            action: 'delete',
            performedBy: client._id,
            performedByModel: 'Client',
            details: `فایل آپلود شده برای چک لیست با عنوان ${document.nameFarsi} توسط ${clientName} حذف شد.`,
            contractId: contractId,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        contract.activities.push(newActivity._id);
        contract.markModified('activities');
        contract.save();

        return NextResponse.json({ success: true, data: document });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
