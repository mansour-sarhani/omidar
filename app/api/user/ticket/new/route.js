import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import { notify } from '@/utils/notify';
import Ticket from '@/models/Ticket';
import Counter from '@/models/Counter';
import User from '@/models/User';
import Client from '@/models/Client';
import Message from '@/models/Message';

//USER CREATE NEW TICKET => "/api/user/ticket/new"
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

        const user = await User.findOne({ token });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const title = formData.get('title');
        const clientId = formData.get('clientId');
        const priority = formData.get('priority');
        const body = formData.get('body');
        const hasAttachment = formData.get('hasAttachment');

        const client = await Client.findById(clientId);
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const ticketData = {
            title,
            priority,
            createdBy: {
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id,
                avatar: user.avatar,
            },
            createdByModel: 'User',
            clientId: client._id,
            status: 'waitingOnClient',
            messages: [],
        };

        const newMessageData = {
            author: {
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id,
                avatar: user.avatar,
            },
            authorModel: 'User',
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

        const userName = user.firstName + ' ' + user.lastName;
        const message = `تیکت جدید با شماره ${newTicket.ticketNo} توسط ${userName} ایجاد شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [client._id],
            receiverModel: 'Client',
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
