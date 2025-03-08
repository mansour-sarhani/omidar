import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Visa from '@/models/Visa';

// ADMIN GET DASHBOARD DATA FOR VISA => "/api/admin/dashboard/visa"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const visas = await Visa.find({});

        const numberOfvisas = visas.length;
        const approvedVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'approved'
        );
        const rejectedVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'rejected'
        );
        const pendingVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'pending'
        );

        const data = {
            numberOfvisas,
            approvedVisas: approvedVisas.length,
            rejectedVisas: rejectedVisas.length,
            pendingVisas: pendingVisas.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
