import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import DocTemplate from '@/models/DocTemplate';

export async function GET() {
    await dbConnect();

    function docTemplateDetails(docType) {
        return {
            _id: docType._id,
            Id: docType.Id,
            refNo: docType.refNo,
            nameFarsi: docType.nameFarsi,
            nameEnglish: docType.nameEnglish,
            type: docType.type,
            format: docType.format,
            description: docType.description,
            sample: docType.sample,
            status: docType.status,
            createdAt: docType.createdAt,
            updatedAt: docType.updated,
            deleted: docType.deleted,
        };
    }

    try {
        //ADMIN GET ALL DOCUMENT TEMPLATES => "/api/admin/template"
        const docTemplates = await DocTemplate.find();

        const filteredDocTemplates = docTemplates
            .filter((docTemplate) => !docTemplate.deleted)
            .map(docTemplateDetails);

        return NextResponse.json(
            { success: true, data: filteredDocTemplates },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
