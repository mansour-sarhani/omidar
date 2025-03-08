import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Contract from '@/models/Contract';

// ADMIN GET DASHBOARD DATA FOR CONTRACTS => "/api/admin/dashboard/contract"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const contracts = await Contract.find({});

        const numberOfContracts = contracts.length;
        const activecontracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'active'
        );
        const inactivecontracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'inactive'
        );
        const processingContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'processing'
        );
        const canceledContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'canceled'
        );
        const completedContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'done'
        );

        const data = {
            numberOfContracts,
            activecontracts: activecontracts.length,
            inactivecontracts: inactivecontracts.length,
            processingContracts: processingContracts.length,
            canceledContracts: canceledContracts.length,
            completedContracts: completedContracts.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
