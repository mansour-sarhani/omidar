import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Country from '@/models/Country';

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
