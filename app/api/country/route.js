import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Counter from '@/models/Counter';
import Country from '@/models/Country';

//ADD NEW COUNTRY => "/api/country"
export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();

        const countryData = {
            nameFarsi: formData.get('nameFarsi'),
            nameEnglish: formData.get('nameEnglish'),
            flag: formData.get('flag'),
        };

        const countryFlag = formData.get('flag');

        if (
            countryFlag &&
            (countryFlag.type === 'image/jpeg' ||
                countryFlag.type === 'image/png' ||
                countryFlag.type === 'image/webp' ||
                countryFlag.type === 'application/pdf' ||
                countryFlag.type === 'image/svg+xml')
        ) {
            const uniqueName = uuidv4() + path.extname(countryFlag.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/countries/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/countries',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await countryFlag.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            countryData.flag = {
                path: '/assets/storage/countries/',
                url: uniqueName,
            };
        }

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'countryId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        countryData.Id = counter.seq;

        const newCountry = new Country(countryData);
        await newCountry.save();

        return NextResponse.json({
            success: true,
            country: newCountry,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    await dbConnect();

    function countryDetails(country) {
        return {
            _id: country._id,
            createdAt: country.createdAt,
            updatedAt: country.updated,
            Id: country.Id,
            nameFarsi: country.nameFarsi,
            nameEnglish: country.nameEnglish,
            flag: country.flag,
            country: country.country,
            status: country.status,
            deleted: country.deleted,
        };
    }

    try {
        //GET ALL COUNTRIES => "/api/country"
        const countries = await Country.find();

        const filteredCountries = countries
            .filter(
                (country) => !country.deleted && country.status === 'active'
            )
            .map(countryDetails);

        return NextResponse.json(
            { success: true, data: filteredCountries },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//UPDATE COUNTRY => "/api/country?countryId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const countryId = searchParams.get('countryId');

        const country = await Country.findById(countryId);

        if (!country) {
            return NextResponse.json(
                { success: false, message: 'کشور پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const nameFarsi = formData.get('nameFarsi');
        const nameEnglish = formData.get('nameEnglish');
        const status = formData.get('status');

        if (nameFarsi !== null) {
            country.nameFarsi = nameFarsi;
            country.markModified('nameFarsi');
        }
        if (nameEnglish !== null) {
            country.nameEnglish = nameEnglish;
            country.markModified('nameEnglish');
        }
        if (status !== null) {
            country.status = status;
            country.markModified('status');
        }

        const countryFlag = formData.get('flag');

        if (
            countryFlag &&
            (countryFlag.type === 'image/jpeg' ||
                countryFlag.type === 'image/png' ||
                countryFlag.type === 'image/webp' ||
                countryFlag.type === 'application/pdf' ||
                countryFlag.type === 'image/svg+xml')
        ) {
            const uniqueName = uuidv4() + path.extname(countryFlag.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/countries/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/countries',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await countryFlag.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (country.flag.url) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/assets/storage/countries/',
                    country.flag.url
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            country.flag.url = uniqueName;
            country.markModified('flag');
        }

        await country.save();

        return NextResponse.json({ success: true, country });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//DELETE COUNTRY => "/api/country?countryId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const countryId = searchParams.get('countryId');

        const country = await Country.findById(countryId);

        if (!country) {
            return NextResponse.json(
                { success: false, message: 'کشور وجود ندارد.' },
                { status: 400 }
            );
        }

        country.deleted = true;
        country.status = 'deleted';
        country.markModified('deleted');
        country.markModified('status');

        await country.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
