import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Client from '@/models/Client';

// ADMIN GET DASHBOARD DATA FOR CLIENTS => "/api/admin/dashboard/client"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const clients = await Client.find({});

        const numberOfClients = clients.length;
        const activeClients = clients.filter(
            (client) => !client.deleted && client.status === 'active'
        );
        const inactiveClients = clients.filter(
            (client) => !client.deleted && client.status === 'inactive'
        );
        const bannedClients = clients.filter(
            (client) => !client.deleted && client.status === 'banned'
        );

        const data = {
            numberOfClients,
            activeClients: activeClients.length,
            inactiveClients: inactiveClients.length,
            bannedClients: bannedClients.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
