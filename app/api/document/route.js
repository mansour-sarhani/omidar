import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Contract from '@/models/Contract';
import Document from '@/models/Document';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Client from '@/models/Client';

//CREATE DOCUMENT => "/api/document"
export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();
        const documentNo = formData.get('documentNo');
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const isCheckList = formData.get('isCheckList');
        const savedSampleUrl = formData.get('savedSampleUrl');
        const type = formData.get('type');
        const format = formData.get('format');
        const description = formData.get('description');
        const uploadBy = formData.get('uploadBy');
        const contractId = formData.get('contractId');
        const uploadByModel = 'User';

        const documentExists = await Document.findOne({ documentNo });

        if (documentExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'فایل با این شماره وجود دارد.',
                },
                { status: 400 }
            );
        }

        const documentData = {
            documentNo,
            nameFarsi,
            nameEnglish,
            isCheckList,
            type,
            format,
            description,
            uploadBy,
            uploadByModel,
            contractId,
            status: isCheckList ? 'pending' : 'active',
            sample: {
                url: '',
                path: '/assets/storage/documents/',
            },
        };

        if (savedSampleUrl !== '') {
            documentData.sample.url = savedSampleUrl;
        }

        const uploadedFile = formData.get('file');

        if (
            uploadedFile &&
            (uploadedFile.type === 'image/jpeg' ||
                uploadedFile.type === 'image/png' ||
                uploadedFile.type === 'image/webp' ||
                uploadedFile.type === 'application/pdf' ||
                uploadedFile.type === 'image/svg+xml' ||
                uploadedFile.type === 'application/zip' ||
                uploadedFile.type === 'application/x-zip-compressed' ||
                uploadedFile.type === 'multipart/x-zip' ||
                uploadedFile.type === 'application/x-rar-compressed')
        ) {
            const uniqueName = uuidv4() + path.extname(uploadedFile.name);
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

            const buffer = Buffer.from(await uploadedFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            documentData.file = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
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

            documentData.sample = {
                path: '/assets/storage/documents/',
                url: uniqueName,
            };
        }

        const newDocument = new Document(documentData);
        await newDocument.save();

        if (contractId) {
            const savedDocument = await Document.findOne({
                documentNo,
            });
            const contract = await Contract.findOne({ _id: contractId });

            contract.documents.push(savedDocument._id);
            contract.markModified('documents');
            contract.save();

            var uploader = null;
            if (uploadByModel === 'User') {
                uploader = await User.findOne({ _id: uploadBy });
            } else {
                uploader = await Client.findOne({ _id: uploadBy });
            }

            const uploaderName = uploader.firstName + ' ' + uploader.lastName;

            const activityRecord = {
                action: 'upload',
                performedBy: uploadBy,
                performedByModel: uploadByModel,
                details: `فایل جدید با شماره ${documentNo} توسط ${uploaderName} به قرارداد اضافه شد.`,
                contractId: contractId,
                timestamp: new Date(),
            };

            const newActivity = new Activity(activityRecord);
            await newActivity.save();
        }

        return NextResponse.json({
            success: true,
            newDocument,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE DOCUMENT => "/api/document?documentId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const documentId = searchParams.get('documentId');

        const document = await Document.findOne({ _id: documentId });

        if (!document) {
            return NextResponse.json(
                { success: false, message: 'فایل پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const type = formData.get('type');
        const format = formData.get('format');
        const description = formData.get('description');
        const status = formData.get('status');
        const userId = formData.get('userId');
        const comment = formData.get('comment');

        if (nameFarsi !== null) {
            document.nameFarsi = nameFarsi;
            document.markModified('nameFarsi');
        }

        if (nameEnglish !== null) {
            document.nameEnglish = nameEnglish;
            document.markModified('nameEnglish');
        }

        if (type !== null) {
            document.type = type;
            document.markModified('type');
        }

        if (format !== null) {
            document.format = format;
            document.markModified('format');
        }

        if (description !== null) {
            document.description = description;
            document.markModified('description');
        }

        if (status !== null) {
            document.status = status;
            document.markModified('status');
        }

        if (comment !== null) {
            const newComment = {
                userId,
                body: comment,
                date: new Date(),
            };
            document.comments.push(newComment);
            document.markModified('comments');
        }

        await document.save();

        const user = await User.findOne({ _id: userId });
        const userName = user.firstName + ' ' + user.lastName;

        const activityRecord = {
            action: 'update',
            performedBy: userId,
            performedByModel: 'User',
            details: `فایل با شماره ${document.documentNo} توسط ${userName} به روزرسانی شد.`,
            contractId: document.contractId,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        return NextResponse.json({ success: true, document });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//DELETE DOCUMENT => "/api/document?documentId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const documentId = searchParams.get('documentId');

        const document = await Document.findById(documentId);

        if (!document) {
            return NextResponse.json(
                { success: false, message: 'قالب فایل وجود ندارد.' },
                { status: 400 }
            );
        }

        document.deleted = true;
        document.status = 'deleted';
        document.markModified('deleted');
        document.markModified('status');

        await document.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
