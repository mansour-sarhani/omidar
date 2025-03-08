import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Client from '@/models/Client';
import Visa from '@/models/Visa';

//ADMIN GET ALL VISAS => "/api/admin/visa"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    function visaDetails(visa) {
        return {
            _id: visa._id,
            visaType: visa.visaType,
            invLetterType: visa.invLetterType,
            status: visa.status,
            status: visa.status,
            createdAt: visa.createdAt,
            updatedAt: visa.updated,
            contractNo: visa.contractId.contractNo,
            clientName:
                visa.contractId.client.firstName +
                ' ' +
                visa.contractId.client.lastName,
        };
    }

    try {
        const { searchParams } = new URL(req.url);
        const visaId = searchParams.get('visaId');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        if (visaId) {
            const visa = await Visa.findById(visaId).populate({
                path: 'contractId',
                populate: {
                    path: 'client',
                    model: 'Client',
                },
            });

            if (!visa) {
                return NextResponse.json(
                    { success: false, message: 'ویزا پیدا نشد.' },
                    { status: 404 }
                );
            }

            const client = await Client.findById(visa.contractId.client);

            const result = {
                _id: visa._id,
                visaType: visa.visaType,
                invLetterType: visa.invLetterType,
                status: visa.status,
                status: visa.status,
                createdAt: visa.createdAt,
                updatedAt: visa.updated,
                contractNo: visa.contractId.contractNo,
                clientName:
                    visa.contractId.client.firstName +
                    ' ' +
                    visa.contractId.client.lastName,
            };

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            const visas = await Visa.find({}).populate({
                path: 'contractId',
                populate: {
                    path: 'client',
                    model: 'Client',
                },
            });

            visas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (status === 'approved') {
                const approvedvisas = visas.filter(
                    (item) => item.status === 'approved'
                );
                const total = approvedvisas.length;
                const paginatedvisas = approvedvisas.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedvisas.map(visaDetails),
                });
            } else if (status === 'rejected') {
                const rejectedvisas = visas.filter(
                    (item) => item.status === 'rejected'
                );
                const total = rejectedvisas.length;
                const paginatedvisas = rejectedvisas.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedvisas.map(visaDetails),
                });
            } else if (status === 'pending') {
                const pendingvisas = visas.filter(
                    (item) => item.status === 'pending'
                );
                const total = pendingvisas.length;
                const paginatedvisas = pendingvisas.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedvisas.map(visaDetails),
                });
            } else if (status === 'all') {
                const allvisas = visas.filter((visa) => !visa.deleted);
                const total = allvisas.length;
                const paginatedvisas = allvisas.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedvisas.map(visaDetails),
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
