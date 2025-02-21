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
            return new NextResponse(readStream);
        }

        // const readStream = fs.createReadStream(imagePath);
        // const contentType = urlValue.endsWith('.svg')
        //     ? 'image/svg+xml'
        //     : 'application/octet-stream';
        // return new NextResponse(readStream, {
        //     headers: { 'Content-Type': contentType },
        // });
    }
}
