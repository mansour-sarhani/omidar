import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import { v4 as uuidv4 } from 'uuid';
import { notify } from '@/utils/notify';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import Counter from '@/models/Counter';
import Message from '@/models/Message';

//USER REPLY TO TICKET => "/api/user/ticket?ticketId=127317318187"
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

        const user = await User.findOne({ token });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }

        const { searchParams } = new URL(req.url);
        const ticketId = searchParams.get('ticketId');

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return NextResponse.json(
                { success: false, message: 'تیکت پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const body = formData.get('body');
        const hasAttachment = formData.get('hasAttachment');
        const status = formData.get('status');

        if (body) {
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
            ticket.messages.push(newMessage);
            ticket.markModified('messages');

            ticket.status = 'waitingOnClient';
            ticket.markModified('status');

            await ticket.save();

            const userName = user.firstName + ' ' + user.lastName;
            const message = `پاسخ جدید برای تیکت با شماره ${ticket.ticketNo} توسط ${userName} ارسال شد.`;

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: [ticket.clientId],
                receiverModel: 'Client',
            });

            return NextResponse.json({
                success: true,
                data: ticket,
            });
        } else if (status) {
            ticket.status = status;
            ticket.markModified('status');

            await ticket.save();

            const userName = user.firstName + ' ' + user.lastName;

            var message = '';
            if (status === 'closed') {
                message = `تیکت با شماره ${ticket.ticketNo} توسط ${userName} بسته شد.`;
            } else if (status === 'waitingOnClient') {
                message = `وضعیت تیکت با شماره ${ticket.ticketNo} توسط ${userName} تغییر کرد.`;
            }

            await notify({
                subject: 'اطلاعیه',
                message: message,
                type: 'info',
                senderModel: 'system',
                receiver: [ticket.clientId],
                receiverModel: 'Client',
            });

            return NextResponse.json({
                success: true,
                data: ticket,
            });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//USER GET ALL TICKETS => "/api/user/ticket"
export async function GET(req) {
    await dbConnect();

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
    const ticketNo = searchParams.get('ticketNo');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    function ticketDetails(ticket) {
        return {
            _id: ticket._id,
            Id: ticket.Id,
            ticketNo: ticket.ticketNo,
            title: ticket.title,
            status: ticket.status,
            priority: ticket.priority,
            createdBy: ticket.createdBy,
            createdByModel: ticket.createdByModel,
            assignedTo: ticket.assignedTo,
            contractId: ticket.contractId,
            messages: ticket.messages,
            status: ticket.status,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updated,
        };
    }

    try {
        if (ticketNo) {
            const ticket = await Ticket.findOne({ ticketNo }).populate(
                'contractId'
            );

            if (!ticket) {
                return NextResponse.json(
                    { success: false, message: 'تیکت پیدا نشد.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: ticket,
            });
        } else {
            const tickets = await Ticket.find({});

            tickets.sort((a, b) => {
                if (a.isRead === b.isRead) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return a.isRead ? 1 : -1;
            });

            if (status === 'waitingOnClient') {
                const clientPendingTickets = tickets.filter(
                    (item) => item.status === 'waitingOnClient'
                );
                const total = clientPendingTickets.length;
                const paginatedTickets = clientPendingTickets.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedTickets.map(ticketDetails),
                });
            } else if (status === 'waitingOnUser') {
                const userPendingTickets = tickets.filter(
                    (item) => item.status === 'waitingOnUser'
                );
                const total = userPendingTickets.length;
                const paginatedTickets = userPendingTickets.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedTickets.map(ticketDetails),
                });
            } else if (status === 'all') {
                const allTickets = tickets;
                const total = allTickets.length;
                const paginatedTickets = allTickets.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedTickets.map(ticketDetails),
                });
            }
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
