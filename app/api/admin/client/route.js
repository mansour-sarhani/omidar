import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/Client';
import Counter from '@/models/Counter';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateRefreshToken, generateToken } from '@/utils/jwt';
import { hashPassword } from '@/utils/hashPassword';
import { authMiddleware } from '@/utils/authMiddleware';

//REGISTER CLIENT => "/api/admin/client"
export async function POST(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const formData = await req.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const mobile = formData.get('mobile');
        const email = formData.get('email');
        const nationalId = formData.get('nationalId');

        const existingClient = await Client.findOne({ nationalId });
        if (existingClient) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'این کد ملی قبلا ثبت شده است.',
                },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(nationalId);

        const client = new Client({
            firstName,
            lastName,
            nationalId,
            username: nationalId,
            password: hashedPassword,
            mobile,
            email,
        });

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'clientId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        client.Id = counter.seq;

        const token = generateToken('client');
        const refreshToken = generateRefreshToken('client');
        client.token = token;
        client.refreshToken = refreshToken;

        await client.save();

        return NextResponse.json({ success: true, data: client });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    function clientDetails(client) {
        return {
            _id: client._id,
            Id: client.Id,
            token: client.token,
            username: client.username,
            firstName: client.firstName,
            lastName: client.lastName,
            fatherName: client.fatherName,
            motherName: client.motherName,
            nationalId: client.nationalId,
            gender: client.gender,
            dateOfBirth: client.dateOfBirth,
            email: client.email,
            mobile: client.mobile,
            address: client.address,
            zipCode: client.zipCode,
            contracts: client.contracts,
            tickets: client.tickets,
            notifications: client.notifications,
            avatar: client.avatar,
            status: client.status,
            createdAt: client.createdAt,
            updatedAt: client.updated,
        };
    }

    try {
        if (clientId) {
            //GET CLIENT BY ID => "/api/admin/client?clientId=66b5be627f158e50829334bb"
            const client = await Client.findById(clientId);

            if (!client) {
                return NextResponse.json(
                    { success: false, error: 'متقاضی پیدا نشد.' },
                    { status: 404 }
                );
            }

            const clientData = clientDetails(client);

            return NextResponse.json(
                { success: true, data: clientData },
                { status: 200 }
            );
        } else {
            //GET ALL CLINETS => "/api/admin/client"
            const clients = await Client.find({});

            const filteredClients = clients.map(clientDetails);

            return NextResponse.json(
                { success: true, data: filteredClients },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//UPDATE CLIENT => "/api/admin/client?clientId=66b5be627f158e50829334bb"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get('clientId');

        const formData = await req.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const nationalId = formData.get('nationalId');
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const mobile = formData.get('mobile');
        const fatherName = formData.get('fatherName');
        const motherName = formData.get('motherName');
        const gender = formData.get('gender');
        const dateOfBirth = formData.get('dateOfBirth');
        const address = formData.get('address');
        const zipCode = formData.get('zipCode');
        const status = formData.get('status');

        const client = await Client.findById(clientId);
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'این کاربر وجود ندارد.' },
                { status: 400 }
            );
        }

        if (firstName !== null) {
            client.firstName = firstName;
            client.markModified('firstName');
        }
        if (lastName !== null) {
            client.lastName = lastName;
            client.markModified('lastName');
        }
        if (nationalId !== null) {
            client.nationalId = nationalId;
            client.markModified('nationalId');
        }
        if (fatherName !== null || fatherName === '') {
            client.fatherName = fatherName;
            client.markModified('fatherName');
        }
        if (motherName !== null || motherName === '') {
            client.motherName = motherName;
            client.markModified('motherName');
        }
        if (gender !== null || gender === '') {
            client.gender = gender;
            client.markModified('gender');
        }
        if (dateOfBirth !== null || dateOfBirth === '') {
            client.dateOfBirth = dateOfBirth;
            client.markModified('dateOfBirth');
        }
        if (address !== null || address === '') {
            client.address = address;
            client.markModified('address');
        }
        if (zipCode !== null || zipCode === '') {
            client.zipCode = zipCode;
            client.markModified('zipCode');
        }
        if (username !== null) {
            client.username = username;
            client.markModified('username');
        }
        if (password !== null) {
            const hashedPassword = await hashPassword(password);

            client.password = hashedPassword;
            client.markModified('password');
        }
        if (email !== null) {
            client.email = email;
            client.markModified('email');
        }
        if (mobile !== null) {
            client.mobile = mobile;
            client.markModified('mobile');
        }
        if (status !== null) {
            client.status = status;
            client.markModified('status');
        }

        const avatarFile = formData.get('avatar');

        if (
            avatarFile &&
            (avatarFile.type === 'image/jpeg' ||
                avatarFile.type === 'image/png' ||
                avatarFile.type === 'image/webp' ||
                avatarFile.type === 'image/svg+xml')
        ) {
            const uniqueName = uuidv4() + path.extname(avatarFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/users/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/users',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (client.avatar.url) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/assets/storage/users/',
                    client.avatar.url
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            client.avatar.url = uniqueName;
            client.markModified('avatar');
        }

        await client.save();

        return NextResponse.json({ success: true, data: client });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
