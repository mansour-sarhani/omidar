import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import DocTemplate from '@/models/DocTemplate';
import Counter from '@/models/Counter';

//ADD DOCUMENT TEMPLATE => "/api/document/template"
export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();
        const refNo = formData.get('refNo');
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const type = formData.get('type');
        const format = formData.get('format');
        const description = formData.get('description');
        const uploadBy = formData.get('uploadBy');

        const templateExists = await DocTemplate.findOne({ refNo });

        if (templateExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'نمونه قالب فایل با این شماره وجود دارد.',
                },
                { status: 400 }
            );
        }

        const docTemplateData = {
            refNo,
            nameFarsi,
            nameEnglish,
            type,
            format,
            description,
            uploadBy,
        };

        const sampleFile = formData.get('sample');

        if (
            sampleFile &&
            (sampleFile.type === 'image/jpeg' ||
                sampleFile.type === 'image/png' ||
                sampleFile.type === 'image/webp' ||
                sampleFile.type === 'application/pdf' ||
                sampleFile.type === 'image/svg+xml' ||
                sampleFile.type === 'application/zip' ||
                sampleFile.type === 'application/x-zip-compressed' ||
                sampleFile.type === 'multipart/x-zip' ||
                sampleFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(sampleFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/documents/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/documents',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await sampleFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            docTemplateData.sample = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
        }

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'docTemplateId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        docTemplateData.Id = counter.seq;

        const newDocTemplate = new DocTemplate(docTemplateData);
        await newDocTemplate.save();

        return NextResponse.json({
            success: true,
            data: newDocTemplate,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//GET ALL ACTIVE DOCUMENT TEMPLATE => "/api/document/template"
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
        const docTemplates = await DocTemplate.find({});

        const filteredDocTemplates = docTemplates
            .filter(
                (docTemplate) =>
                    !docTemplate.deleted && docTemplate.status === 'active'
            )
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

//UPDATE DOCUMENT TEMPLATE => "/api/document/template?docTemplateId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const docTemplateId = searchParams.get('docTemplateId');

        const docTemplate = await DocTemplate.findOne({ _id: docTemplateId });

        if (!docTemplate) {
            return NextResponse.json(
                { success: false, message: 'نمونه قالب فایل پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const refNo = formData.get('refNo');
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const type = formData.get('type');
        const format = formData.get('format');
        const description = formData.get('description');
        const status = formData.get('status');

        if (refNo !== null) {
            console.log('refNo:', refNo);
            docTemplate.refNo = refNo;
            docTemplate.markModified('refNo');
        }

        if (nameFarsi !== null) {
            docTemplate.nameFarsi = nameFarsi;
            docTemplate.markModified('nameFarsi');
        }

        if (nameEnglish !== null) {
            docTemplate.nameEnglish = nameEnglish;
            docTemplate.markModified('nameEnglish');
        }

        if (type !== null) {
            docTemplate.type = type;
            docTemplate.markModified('type');
        }

        if (format !== null) {
            docTemplate.format = format;
            docTemplate.markModified('format');
        }

        if (description !== null) {
            docTemplate.description = description;
            docTemplate.markModified('description');
        }

        if (status !== null) {
            docTemplate.status = status;
            docTemplate.markModified('status');
        }

        const sampleFile = formData.get('sample');

        if (
            sampleFile &&
            (sampleFile.type === 'image/jpeg' ||
                sampleFile.type === 'image/png' ||
                sampleFile.type === 'image/webp' ||
                sampleFile.type === 'application/pdf' ||
                sampleFile.type === 'image/svg+xml' ||
                sampleFile.type === 'application/zip' ||
                sampleFile.type === 'application/x-zip-compressed' ||
                sampleFile.type === 'multipart/x-zip' ||
                sampleFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(sampleFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/documents/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/documents',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await sampleFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (docTemplate.sample.url) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/assets/storage/documents/',
                    docTemplate.sample.url
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            docTemplate.sample.url = uniqueName;
            docTemplate.markModified('sample');
        }

        await docTemplate.save();

        return NextResponse.json({ success: true, docTemplate });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//DELETE DOCUMENT TEMPLATE => "/api/document/template?docTemplateId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const docTemplateId = searchParams.get('docTemplateId');

        const docTemplate = await DocTemplate.findById(docTemplateId);

        if (!docTemplate) {
            return NextResponse.json(
                { success: false, message: 'نمونه قالب وجود ندارد.' },
                { status: 400 }
            );
        }

        docTemplate.deleted = true;
        docTemplate.status = 'deleted';
        docTemplate.markModified('deleted');
        docTemplate.markModified('status');

        await docTemplate.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
