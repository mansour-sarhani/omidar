import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Client from '@/models/Client';
import Counter from '@/models/Counter';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Country from '@/models/Country';
import Admission from '@/models/Admission';
import Document from '@/models/Document';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import Offer from '@/models/Offer';
import Payment from '@/models/Payment';
import Pickup from '@/models/Pickup';
import Visa from '@/models/Visa';

//GET CONTRACTS OF CURRENT CLIENT => "/api/client/contract"
export async function GET(req) {
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

        const client = await Client.findOne({ token: token }).populate({
            path: 'contracts',
            populate: [
                { path: 'client' },
                { path: 'users' },
                { path: 'countries' },
                { path: 'offers' },
                { path: 'documents' },
                { path: 'admissions' },
                { path: 'payments' },
                { path: 'pickups' },
                { path: 'visas' },
                { path: 'activities' },
                { path: 'messages' },
            ],
        });

        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: client.contracts });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
