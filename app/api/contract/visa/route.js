import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Contract from '@/models/Contract';
import User from '@/models/User';
import { authMiddleware } from '@/utils/authMiddleware';
import Counter from '@/models/Counter';
import Client from '@/models/Client';
import Visa from '@/models/Visa';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

//ADD VISA TO CONTRACT => "/api/contract/visa?contractId=66bf44d3d02d846c4368ced0"
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
        const visaType = formData.get('visaType');
        const invLetterType = formData.get('invLetterType');
        const issueDate = formData.get('issueDate');
        const expiryDate = formData.get('expiryDate');
        const userId = formData.get('userId');

        const visaData = {
            visaType,
            invLetterType,
            issueDate,
            expiryDate,
            contractId,
        };

        const userInvLetterFile = formData.get('userInvLetterFile');

        if (
            userInvLetterFile &&
            (userInvLetterFile.type === 'image/jpeg' ||
                userInvLetterFile.type === 'image/png' ||
                userInvLetterFile.type === 'image/webp' ||
                userInvLetterFile.type === 'application/pdf' ||
                userInvLetterFile.type === 'image/svg+xml' ||
                userInvLetterFile.type === 'application/zip' ||
                userInvLetterFile.type === 'application/x-zip-compressed' ||
                userInvLetterFile.type === 'multipart/x-zip' ||
                userInvLetterFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(userInvLetterFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/visa/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/visa',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await userInvLetterFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            visaData.userInvLetterFile = {
                path: '/assets/storage/visa/',
                url: uniqueName,
            };
        }

        const userVisaFile = formData.get('userVisaFile');

        if (
            userVisaFile &&
            (userVisaFile.type === 'image/jpeg' ||
                userVisaFile.type === 'image/png' ||
                userVisaFile.type === 'image/webp' ||
                userVisaFile.type === 'application/pdf' ||
                userVisaFile.type === 'image/svg+xml' ||
                userVisaFile.type === 'application/zip' ||
                userVisaFile.type === 'application/x-zip-compressed' ||
                userVisaFile.type === 'multipart/x-zip' ||
                userVisaFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(userVisaFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/visa/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/visa',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await userVisaFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            visaData.userVisaFile = {
                path: '/assets/storage/visa/',
                url: uniqueName,
            };
        }

        const visaCounter = await Counter.findByIdAndUpdate(
            { _id: 'visaId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        visaData.Id = visaCounter.seq;

        const newVisa = new Visa(visaData);
        await newVisa.save();

        contract.visas.push(newVisa._id);
        contract.markModified('visas');

        await contract.save();

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;
        const message = `ویزای جدید توسط ${userName} به قرارداد شماره ${contract.contractNo} اضافه شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users,
            receiverModel: 'User',
        });

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [contract.client],
            receiverModel: 'Client',
        });

        await addActivity({
            action: 'update',
            performedBy: userId,
            performedByModel: 'User',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({
            success: true,
            data: newVisa,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE OR REMOVE VISA FROM CONTRACT => "/api/contract/visa?contractId=66bf44d3d02d846c4368ced0&action=update"
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
        const visaId = formData.get('visaId');
        const userId = formData.get('userId');

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;

        const visa = await Visa.findById(visaId);

        if (!visa) {
            return NextResponse.json(
                { success: false, message: 'ویزا وجود ندارد.' },
                { status: 400 }
            );
        }

        if (action === 'remove') {
            visa.deleted = true;
            visa.status = 'deleted';
            visa.markModified('deleted');
            visa.markModified('status');

            await visa.save();

            contract.visas = contract.visas.filter(
                (visa) => visa._id.toString() !== visaId
            );

            contract.markModified('visas');

            await contract.save();

            const message = `ویزا توسط ${userName} از قرارداد شماره ${contract.contractNo} حذف شد.`;

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: contract.users,
                receiverModel: 'User',
            });

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: [contract.client],
                receiverModel: 'Client',
            });

            await addActivity({
                action: 'update',
                performedBy: userId,
                performedByModel: 'User',
                details: message,
                contractId: contractId,
            });

            return NextResponse.json({
                success: true,
                data: visa,
            });
        } else if (action === 'update') {
            const visaType = formData.get('visaType');
            const invLetterType = formData.get('invLetterType');
            const issueDate = formData.get('issueDate');
            const expiryDate = formData.get('expiryDate');
            const status = formData.get('status');

            if (visaType !== null) {
                visa.visaType = visaType;
                visa.markModified('visaType');
            }

            if (invLetterType !== null) {
                visa.invLetterType = invLetterType;
                visa.markModified('invLetterType');
            }

            if (issueDate !== null) {
                visa.issueDate = issueDate;
                visa.markModified('issueDate');
            }

            if (expiryDate !== null) {
                visa.expiryDate = expiryDate;
                visa.markModified('expiryDate');
            }

            if (status !== null) {
                visa.status = status;
                visa.markModified('status');
            }

            const userInvLetterFile = formData.get('userInvLetterFile');

            if (
                userInvLetterFile &&
                (userInvLetterFile.type === 'image/jpeg' ||
                    userInvLetterFile.type === 'image/png' ||
                    userInvLetterFile.type === 'image/webp' ||
                    userInvLetterFile.type === 'application/pdf' ||
                    userInvLetterFile.type === 'image/svg+xml' ||
                    userInvLetterFile.type === 'application/zip' ||
                    userInvLetterFile.type === 'application/x-zip-compressed' ||
                    userInvLetterFile.type === 'multipart/x-zip' ||
                    userInvLetterFile.type === 'application/x-rar-compressed')
            ) {
                const uniqueName =
                    uuidv4() + path.extname(userInvLetterFile.name);
                const savePath = path.join(
                    process.cwd(),
                    'public/assets/storage/visa/',
                    uniqueName
                );

                const directories = [
                    'public',
                    'public/assets',
                    'public/assets/storage',
                    'public/assets/storage/visa',
                ];

                directories.forEach((dir) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                const buffer = Buffer.from(
                    await userInvLetterFile.arrayBuffer()
                );
                fs.writeFileSync(savePath, buffer);

                if (visa.userInvLetterFile.url) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        'public/assets/storage/visa/',
                        visa.userInvLetterFile.url
                    );
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                visa.userInvLetterFile.url = uniqueName;
                visa.markModified('userInvLetterFile');
            }

            const userVisaFile = formData.get('userVisaFile');

            if (
                userVisaFile &&
                (userVisaFile.type === 'image/jpeg' ||
                    userVisaFile.type === 'image/png' ||
                    userVisaFile.type === 'image/webp' ||
                    userVisaFile.type === 'application/pdf' ||
                    userVisaFile.type === 'image/svg+xml' ||
                    userVisaFile.type === 'application/zip' ||
                    userVisaFile.type === 'application/x-zip-compressed' ||
                    userVisaFile.type === 'multipart/x-zip' ||
                    userVisaFile.type === 'application/x-rar-compressed')
            ) {
                const uniqueName = uuidv4() + path.extname(userVisaFile.name);
                const savePath = path.join(
                    process.cwd(),
                    'public/assets/storage/visa/',
                    uniqueName
                );

                const directories = [
                    'public',
                    'public/assets',
                    'public/assets/storage',
                    'public/assets/storage/visa',
                ];

                directories.forEach((dir) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                const buffer = Buffer.from(await userVisaFile.arrayBuffer());
                fs.writeFileSync(savePath, buffer);

                if (visa.userVisaFile.url) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        'public/assets/storage/visa/',
                        visa.userVisaFile.url
                    );
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                visa.userVisaFile.url = uniqueName;
                visa.markModified('userVisaFile');
            }

            await visa.save();

            const message = `ویزا توسط ${userName} در قرارداد شماره ${contract.contractNo} به روزرسانی شد.`;

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: contract.users,
                receiverModel: 'User',
            });

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: [contract.client],
                receiverModel: 'Client',
            });

            await addActivity({
                action: 'update',
                performedBy: userId,
                performedByModel: 'User',
                details: message,
                contractId: contractId,
            });

            return NextResponse.json({ success: true, data: visa });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
