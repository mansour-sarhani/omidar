import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Client from '@/models/Client';
import Notification from '@/models/Notification';
import { authMiddleware } from '@/utils/authMiddleware';
import Counter from '@/models/Counter';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';
import Payment from '@/models/Payment';

//ADD PAYMENT TO CONTRACT => "/api/contract/payment?contractId=66bf44d3d02d846c4368ced0"
export async function POST(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');
        const formData = await req.formData();
        const userId = formData.get('userId');
        const title = formData.get('title');
        const type = formData.get('type');
        const paidAmount = formData.get('paidAmount');
        const currency = formData.get('currency');
        const dateOfPayment = formData.get('dateOfPayment');
        const paymentMethod = formData.get('paymentMethod');

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'قرارداد با وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const paymentData = {
            title,
            type,
            paidAmount,
            dateOfPayment,
            currency,
            type,
            paymentMethod,
            contractId,
            client: contract.client,
        };

        const uploadedFile = formData.get('receipt');

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
                'public/assets/storage/payments/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/payments',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await uploadedFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            paymentData.receipt = {
                path: '/assets/storage/payments/',
                url: uniqueName,
            };
        }

        const paymentCounter = await Counter.findByIdAndUpdate(
            { _id: 'paymentId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        paymentData.Id = paymentCounter.seq;

        const newPayment = new Payment(paymentData);
        await newPayment.save();

        contract.payments.push(newPayment._id);
        contract.markModified('payments');

        contract.save();

        const user = await User.findById(userId);

        const userName = user.firstName + ' ' + user.lastName;
        const message = `سند پرداخت با عنوان ${title} توسط ${userName} به قرارداد شماره ${contract.contractNo} اضافه شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [contract.client],
            receiverModel: 'Client',
        });

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users,
            receiverModel: 'User',
        });

        await addActivity({
            action: 'create',
            performedBy: user._id,
            performedByModel: 'User',
            details: message,
            contractId: contract._id,
        });

        return NextResponse.json({
            success: true,
            newPayment,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE OR REMOVE PAYMENT FROM CONTRACT => "/api/payment?contractId=66bf44d3d02d846c4368ced0&action=update"
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
        const formData = await req.formData();
        const paymentId = formData.get('paymentId');
        const userId = formData.get('userId');

        const contract = await Contract.findById(contractId);
        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return NextResponse.json(
                { success: false, message: 'سند پرداخت وجود ندارد.' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;

        if (action === 'remove') {
            payment.deleted = true;
            payment.status = 'deleted';
            payment.markModified('deleted');
            payment.markModified('status');
            await payment.save();

            contract.payments = contract.payments.filter(
                (payment) => payment._id.toString() !== paymentId
            );
            contract.markModified('payments');
            await contract.save();

            const message = `سند پرداخت با عنوان ${payment.title} توسط ${userName} از قرارداد شماره ${contract.contractNo} حذف شد.`;

            await addActivity({
                action: 'delete',
                performedBy: user._id,
                performedByModel: 'User',
                details: message,
                contractId: contract._id,
            });

            return NextResponse.json({ success: true, data: payment });
        } else if (action === 'update') {
            const title = formData.get('title');
            const type = formData.get('type');
            const paidAmount = formData.get('paidAmount');
            const currency = formData.get('currency');
            const dateOfPayment = formData.get('dateOfPayment');
            const paymentMethod = formData.get('paymentMethod');
            const status = formData.get('status');

            if (title !== null) {
                payment.title = title;
                payment.markModified('title');
            }

            if (type !== null) {
                payment.type = type;
                payment.markModified('type');
            }

            if (paidAmount !== null) {
                payment.paidAmount = paidAmount;
                payment.markModified('paidAmount');
            }

            if (dateOfPayment !== null) {
                payment.dateOfPayment = dateOfPayment;
                payment.markModified('dateOfPayment');
            }

            if (paymentMethod !== null) {
                payment.paymentMethod = paymentMethod;
                payment.markModified('paymentMethod');
            }

            if (currency !== null) {
                payment.currency = currency;
                payment.markModified('currency');
            }

            if (status !== null) {
                payment.status = status;
                payment.markModified('status');
            }

            const receiptFile = formData.get('receipt');

            if (
                receiptFile &&
                (receiptFile.type === 'image/jpeg' ||
                    receiptFile.type === 'image/png' ||
                    receiptFile.type === 'image/webp' ||
                    receiptFile.type === 'application/pdf' ||
                    receiptFile.type === 'image/svg+xml' ||
                    receiptFile.type === 'application/zip' ||
                    receiptFile.type === 'application/x-zip-compressed' ||
                    receiptFile.type === 'multipart/x-zip' ||
                    receiptFile.type === 'application/x-rar-compressed')
            ) {
                const uniqueName = uuidv4() + path.extname(receiptFile.name);
                const savePath = path.join(
                    process.cwd(),
                    'public/assets/storage/payments/',
                    uniqueName
                );

                const directories = [
                    'public',
                    'public/assets',
                    'public/assets/storage',
                    'public/assets/storage/payments',
                ];

                directories.forEach((dir) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                const buffer = Buffer.from(await receiptFile.arrayBuffer());
                fs.writeFileSync(savePath, buffer);

                if (payment.receipt.url) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        'public/assets/storage/payments/',
                        payment.receipt.url
                    );
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                payment.receipt.url = uniqueName;
                payment.markModified('receipt');
            }

            await payment.save();

            const message = `سند پرداخت با عنوان ${payment.title} توسط ${userName} در قرارداد شماره ${contract.contractNo} به روزسانی شد.`;

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: [contract.client],
                receiverModel: 'Client',
            });

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: contract.users,
                receiverModel: 'User',
            });

            await addActivity({
                action: 'update',
                performedBy: user._id,
                performedByModel: 'User',
                details: message,
                contractId: contract._id,
            });

            return NextResponse.json({ success: true, data: payment });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
