import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

//GET CURRENT CLIENT BY TOKEN => "/api/client"
export async function GET() {
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
        const client = await Client.findOne({ token: token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const clientData = {
            _id: client._id,
            Id: client.Id,
            token: client.token,
            firstName: client.firstName,
            lastName: client.lastName,
            fatherName: client.fatherName,
            motherName: client.motherName,
            nationalId: client.nationalId,
            sex: client.sex,
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

        return NextResponse.json({ success: true, data: clientData });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//CLIENT UPDATE PROFILE => "/api/client"
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

        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const nationalId = formData.get('nationalId');
        const fatherName = formData.get('fatherName');
        const motherName = formData.get('motherName');
        const sex = formData.get('sex');
        const dateOfBirth = formData.get('dateOfBirth');
        const address = formData.get('address');
        const zipCode = formData.get('zipCode');
        const password = formData.get('password');
        const email = formData.get('email');
        const mobile = formData.get('mobile');

        const client = await Client.findOne({ token: token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        if (firstName !== null) {
            client.firstName = firstName;
            client.markModified('firstName');
        }
        if (lastName) {
            client.lastName = lastName;
            client.markModified('lastName');
        }
        if (fatherName) {
            client.fatherName = fatherName;
            client.markModified('fatherName');
        }
        if (motherName) {
            client.motherName = motherName;
            client.markModified('motherName');
        }
        if (sex) {
            client.sex = sex;
            client.markModified('sex');
        }
        if (dateOfBirth) {
            client.dateOfBirth = dateOfBirth;
            client.markModified('dateOfBirth');
        }
        if (address) {
            client.address = address;
            client.markModified('address');
        }
        if (zipCode) {
            client.zipCode = zipCode;
            client.markModified('zipCode');
        }
        if (nationalId) {
            client.nationalId = nationalId;
            client.markModified('nationalId');
        }
        if (password) {
            client.password = password;
            client.markModified('password');
        }
        if (email) {
            client.email = email;
            client.markModified('email');
        }
        if (mobile) {
            client.mobile = mobile;
            client.markModified('mobile');
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
                'public/assets/storage/clients/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/clients',
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
                    'public/assets/storage/clients/',
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
