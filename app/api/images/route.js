import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const pathValue = searchParams.get('path');
    const urlValue = searchParams.get('url');
    const imagePath = path.join(process.cwd(), 'public', pathValue, urlValue);

    const placeholderPath = path.join(
        process.cwd(),
        'public',
        'assets/images/misc/placeholder.png'
    );

    if (!urlValue || !fs.existsSync(imagePath)) {
        const readStream = fs.createReadStream(placeholderPath);
        return new NextResponse(readStream, {
            headers: { 'Content-Type': 'image/png' },
        });
    } else {
        const readStream = fs.createReadStream(imagePath);
        if (urlValue.endsWith('.svg')) {
            return new NextResponse(readStream, {
                headers: { 'Content-Type': 'image/svg+xml' },
            });
        } else {
            // return new NextResponse(readStream);
            const readStream = fs.createReadStream(imagePath);
            const contentType = urlValue.endsWith('.svg')
                ? 'image/svg+xml'
                : urlValue.endsWith('.png')
                ? 'image/png'
                : urlValue.endsWith('.jpg') || urlValue.endsWith('.jpeg')
                ? 'image/jpeg'
                : 'application/octet-stream';

            // const contentType = getContentType(urlValue);

            return new NextResponse(readStream, {
                headers: { 'Content-Type': contentType },
            });
        }
    }
}

function getContentType(url) {
    const extension = path.extname(url).toLowerCase();
    switch (extension) {
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.pdf':
            return 'application/pdf';
        case '.zip':
            return 'application/zip';
        case '.rar':
            return 'application/vnd.rar';
        case '.xls':
            return 'application/vnd.ms-excel';
        case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        default:
            return 'application/octet-stream';
    }
}
