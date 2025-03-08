import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Document from '@/models/Document';

// ADMIN GET DASHBOARD DATA FOR DOCUMENTS => "/api/admin/dashboard/document"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const documents = await Document.find({});

        const numberOfdocuments = documents.length;
        const approvedDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'approved'
        );
        const rejectedDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'rejected'
        );
        const pendingDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'pending'
        );
        const underReviewDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'underReview'
        );

        const data = {
            numberOfdocuments,
            approvedDocuments: approvedDocuments.length,
            rejectedDocuments: rejectedDocuments.length,
            pendingDocuments: pendingDocuments.length,
            underReviewDocuments: underReviewDocuments.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
