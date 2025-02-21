import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Client from '@/models/Client';
import { notify } from '@/utils/notify';
import Ticket from '@/models/Ticket';
import Counter from '@/models/Counter';
import Message from '@/models/Message';
import User from '@/models/User';

//CLIENT CREATE NEW TICKET => "/api/client/ticket/new"
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

        const client = await Client.findOne({ token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const title = formData.get('title');
        const priority = formData.get('priority');
        const contractId = formData.get('contractId');
        const body = formData.get('body');
        const hasAttachment = formData.get('hasAttachment');

        const contract = await Contract.findById(contractId);
        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const ticketData = {
            title,
            priority,
            createdBy: {
                firstName: client.firstName,
                lastName: client.lastName,
                _id: client._id,
                avatar: client.avatar,
            },
            createdByModel: 'Client',
            contractId,
            clientId: client._id,
            status: 'waitingOnUser',
            messages: [],
        };

        const newMessageData = {
            author: {
                firstName: client.firstName,
                lastName: client.lastName,
                _id: client._id,
                avatar: client.avatar,
            },
            authorModel: 'Client',
            body,
            hasAttachment,
            attachment: {
                path: '/assets/storage/attachments/',
                url: '',
            },
        };

        const messageCounter = await Counter.findByIdAndUpdate(
            { _id: 'messageId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        newMessageData.Id = messageCounter.seq;

        const uploadedFile = formData.get('attachment');

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
                'public/assets/storage/attachments/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/attachments',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await uploadedFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            newMessageData.attachment = {
                path: '/assets/storage/attachments/',
                url: uniqueName,
            };
        }

        const newMessage = new Message(newMessageData);

        await newMessage.save();

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'ticketId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        ticketData.Id = counter.seq;
        ticketData.ticketNo = counter.seq + 100;

        ticketData.messages.push(newMessage);

        const newTicket = new Ticket(ticketData);

        await newTicket.save();

        client.tickets.push(newTicket._id);
        client.markModified('tickets');
        await client.save();

        const clientName = client.firstName + ' ' + client.lastName;
        const message = `تیکت جدید با شماره ${newTicket.ticketNo} توسط ${clientName} ایجاد شد.`;

        const users = await User.find({});
        const filteredUsers = users.filter(
            (user) => !user.deleted && user.status === 'active'
        );

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: filteredUsers,
            receiverModel: 'User',
        });

        return NextResponse.json({
            success: true,
            data: newTicket,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
