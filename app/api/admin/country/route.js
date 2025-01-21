import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Country from '@/models/Country';
import { authMiddleware } from '@/utils/authMiddleware';

export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    function countryDetails(country) {
        return {
            _id: country._id,
            Id: country.Id,
            nameFarsi: country.nameFarsi,
            nameEnglish: country.nameEnglish,
            flag: country.flag,
            status: country.status,
            createdAt: country.createdAt,
            updatedAt: country.updated,
        };
    }

    try {
        //ADMIN GET ALL COUNTRIES => "/api/admin/country"
        const countries = await Country.find({});

        const filteredCountries = countries
            .filter((country) => !country.deleted)
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
