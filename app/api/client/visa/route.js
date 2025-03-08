import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Visa from '@/models/Visa';
import Client from '@/models/Client';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';

//CLIENT UPLOAD VISA FILE TO CONTRACT => "/api/client/visa?contractId=123456789"
export async function POST(req) {
    await dbConnect();

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 403 }
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
        const visaId = formData.get('visaId');
        const type = formData.get('type');

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

        const visa = await Visa.findById(visaId);
        if (!visa) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ویزا وجود ندارد.',
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
                'public/assets/storage/visas/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/visas',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await uploadedFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (type === 'visa') {
                visa.clientVisaFile = {
                    path: '/assets/storage/visas/',
                    url: uniqueName,
                };
                visa.markModified('clientVisaFile');
            } else if (type === 'invLetter') {
                visa.clientInvLetterFile = {
                    path: '/assets/storage/visas/',
                    url: uniqueName,
                };
                visa.markModified('clientInvLetterFile');
            }
        }

        await visa.save();

        const clientName = client.firstName + ' ' + client.lastName;
        const message = `فایل جدید برای ویزا در قرارداد با شماره ${contract.contractNo} توسط ${clientName} بارگذاری شد.`;

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
            data: visa,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//REMOVE UPLOADED VISA FILE FROM CONTRACT => "/api/client/visa?contractId=123456789"
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
                { status: 403 }
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
        const visaId = formData.get('visaId');
        const type = formData.get('type');

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

        const visa = await Visa.findById(visaId);

        if (!visa) {
            return NextResponse.json(
                { success: false, message: 'ویزا پیدا نشد.' },
                { status: 404 }
            );
        }

        if (type === 'visa') {
            visa.clientVisaFile.url = '';
            visa.markModified('clientVisaFile');
        } else if (type === 'invLetter') {
            visa.clientInvLetterFile.url = '';
            visa.markModified('clientInvLetterFile');
        }

        await visa.save();

        const clientName = client.firstName + ' ' + client.lastName;
        const message = `فایل آپلود شده برای ویزا در قرارداد با شماره ${contract.contractNo} توسط ${clientName} حذف شد.`;

        await addActivity({
            action: 'delete',
            performedBy: client._id,
            performedByModel: 'Client',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({ success: true, data: visa });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
