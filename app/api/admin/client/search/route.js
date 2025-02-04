import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/Client';

export async function GET(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const mobile = searchParams.get('mobile');
    const email = searchParams.get('email');

    try {
        const query = {};

        if (firstName) {
            query.firstName = { $regex: firstName, $options: 'i' };
        }
        if (lastName) {
            query.lastName = { $regex: lastName, $options: 'i' };
        }
        if (mobile) {
            query.mobile = { $regex: mobile, $options: 'i' };
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        const results = await Client.find(query);

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

        return NextResponse.json({
            success: true,
            data: results.map(clientDetails),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
