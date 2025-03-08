import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Document from '@/models/Document';
import Client from '@/models/Client';

//ADMIN GET ALL DOCUMENTS => "/api/admin/document"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    function documentDetails(document) {
        return {
            _id: document._id,
            documentNo: document.documentNo,
            nameFarsi: document.nameFarsi,
            file: document.file,
            comments: document.comments,
            status: document.status,
            createdAt: document.createdAt,
            updatedAt: document.updated,
            contractNo: document.contractId.contractNo,
            clientName:
                document.contractId.client.firstName +
                ' ' +
                document.contractId.client.lastName,
        };
    }

    try {
        const { searchParams } = new URL(req.url);
        const documentId = searchParams.get('documentId');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        if (documentId) {
            const document = await Document.findById(documentId).populate({
                path: 'contractId',
                populate: {
                    path: 'client',
                    model: 'Client',
                },
            });

            if (!document) {
                return NextResponse.json(
                    { success: false, message: 'فایل پیدا نشد.' },
                    { status: 404 }
                );
            }

            const client = await Client.findById(document.contractId.client);

            const result = {
                _id: document._id,
                documentNo: document.documentNo,
                nameFarsi: document.nameFarsi,
                file: document.file,
                comments: document.comments,
                status: document.status,
                createdAt: document.createdAt,
                updatedAt: document.updated,
                contractNo: document.contractId.contractNo,
                clientName: client.firstName + ' ' + client.lastName,
            };

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            const documents = await Document.find({}).populate({
                path: 'contractId',
                populate: {
                    path: 'client',
                    model: 'Client',
                },
            });

            documents.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            if (status === 'approved') {
                const approvedDocuments = documents.filter(
                    (item) => item.status === 'approved'
                );
                const total = approvedDocuments.length;
                const paginatedDocuments = approvedDocuments.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedDocuments.map(documentDetails),
                });
            } else if (status === 'rejected') {
                const rejectedDocuments = documents.filter(
                    (item) => item.status === 'rejected'
                );
                const total = rejectedDocuments.length;
                const paginatedDocuments = rejectedDocuments.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedDocuments.map(documentDetails),
                });
            } else if (status === 'pending') {
                const pendingDocuments = documents.filter(
                    (item) => item.status === 'pending'
                );
                const total = pendingDocuments.length;
                const paginatedDocuments = pendingDocuments.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedDocuments.map(documentDetails),
                });
            } else if (status === 'underReview') {
                const underReviewDocuments = documents.filter(
                    (item) => item.status === 'underReview'
                );
                const total = underReviewDocuments.length;
                const paginatedDocuments = underReviewDocuments.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedDocuments.map(documentDetails),
                });
            } else if (status === 'all') {
                const allDocuments = documents.filter(
                    (document) => !document.deleted
                );
                const total = allDocuments.length;
                const paginatedDocuments = allDocuments.slice(
                    (page - 1) * limit,
                    page * limit
                );

                return NextResponse.json({
                    success: true,
                    total: total,
                    data: paginatedDocuments.map(documentDetails),
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
