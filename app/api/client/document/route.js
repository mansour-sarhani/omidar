import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Document from '@/models/Document';
import Client from '@/models/Client';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';

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

        document.status = 'underReview';
        document.markModified('status');
        await document.save();

        const clientName = client.firstName + ' ' + client.lastName;
        const message = `فایل جدید برای چک لیست با عنوان ${document.nameFarsi} توسط ${clientName} بارگذاری شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users,
            receiverModel: 'User',
        });

        await addActivity({
            action: 'upload',
            performedBy: client._id,
            performedByModel: 'Client',
            details: message,
            contractId: contractId,
        });

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

        document.status = 'pending';
        document.markModified('status');

        await document.save();

        const clientName = client.firstName + ' ' + client.lastName;
        const message = `فایل آپلود شده برای چک لیست با عنوان ${document.nameFarsi} توسط ${clientName} حذف شد.`;

        await addActivity({
            action: 'delete',
            performedBy: client._id,
            performedByModel: 'Client',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({ success: true, data: document });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
