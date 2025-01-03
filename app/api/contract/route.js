import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '@/utils/authMiddleware';
import Counter from '@/models/Counter';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Client from '@/models/Client';
import Country from '@/models/Country';
import Admission from '@/models/Admission';
import Document from '@/models/Document';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import Offer from '@/models/Offer';
import Payment from '@/models/Payment';
import Pickup from '@/models/Pickup';
import Visa from '@/models/Visa';

//CREATE CONTRACT => "/api/contract"
export async function POST(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const formData = await req.formData();
        const countryId = formData.get('countryId');
        const contractNo = formData.get('contractNo');
        const clientId = formData.get('clientId');

        const contractExists = await Contract.findOne({ contractNo });

        if (contractExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'قرارداد با این شماره قرارداد وجود دارد.',
                },
                { status: 400 }
            );
        }

        const contractData = {
            contractNo,
            createdBy: formData.get('createdBy'),
            lastUpdatedBy: formData.get('createdBy'),
            client: clientId,
            lastUpdatedByModel: 'User',
            countries: [],
        };

        contractData.countries.push(countryId);

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'contractId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        contractData.Id = counter.seq;

        const newContract = new Contract(contractData);
        await newContract.save();

        const savedContract = await Contract({ contractNo });

        const client = await Client.findOne({ _id: clientId });
        client.contract = savedContract._id;
        await client.save();

        const user = await User.findOne({ _id: contractData.createdBy });
        const userName = user.firstName + ' ' + user.lastName;

        const activityRecord = {
            action: 'create',
            performedBy: contractData.createdBy,
            performedByModel: 'User',
            details: `قرارداد با شماره قرارداد ${newContract.contractNo} توسط ${userName} ایجاد شد.`,
            contractId: newContract._id,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        return NextResponse.json({
            success: true,
            contract: newContract,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('contractId');
    const clientId = searchParams.get('clientId');
    const contractNo = searchParams.get('contractNo');
    const type = searchParams.get('type');

    function contractDetails(contract) {
        return {
            _id: contract._id,
            Id: contract.Id,
            client: contract.client,
            contractNo: contract.contractNo,
            status: contract.status,
            contractFile: contract.contractFile,
            visaExpiryDate: contract.visaExpiryDate,
            arrivalDate: contract.arrivalDate,
            countries: contract.countries,
            users: contract.users,
            admissions: contract.admissions,
            offers: contract.offers,
            documents: contract.documents,
            payments: contract.payments,
            pickups: contract.pickups,
            visas: contract.visas,
            messages: contract.messages,
            activities: contract.activities,
            createdBy: contract.createdBy,
            lastUpdatedBy: contract.lastUpdatedBy,
            lastUpdatedByModel: contract.lastUpdatedByModel,
            createdAt: contract.createdAt,
            updatedAt: contract.updated,
            deleted: contract.deleted,
        };
    }

    try {
        //GET CONTRACT BY CONTRACTID => "/api/contract?contractId=66bf44d3d02d846c4368ced0"
        if (contractId && !type) {
            console.log('1');
            const contract = await Contract.findOne({ _id: contractId })
                .populate('client')
                .populate('users')
                .populate('countries');

            if (!contract) {
                return NextResponse.json(
                    { success: false, message: 'قرارداد پیدا نشد.' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: contractDetails(contract) },
                { status: 200 }
            );
        } else if (contractNo) {
            //GET CONTRACT BY CONTRACT NO => "/api/contract?contractNo=66bf44d3d02d846c4368ced0"
            const contract = await Contract.findOne({ contractNo })
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('admissions')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('messages')
                .populate('activities');

            if (!contract) {
                return NextResponse.json(
                    { success: false, message: 'قرارداد پیدا نشد.' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: contractDetails(contract) },
                { status: 200 }
            );
        } else if (clientId) {
            //GET CONTRACTS BY CLIENTID => "/api/contract?clientId=66bf44d3d02d846c4368ced0"
            const contracts = await Contract.find({ clientId })
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('admissions')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('messages')
                .populate('activities');

            if (!contracts) {
                return NextResponse.json(
                    { success: false, message: 'قرارداد پیدا نشد.' },
                    { status: 404 }
                );
            }

            const filteredContracts = contracts
                .filter((contract) => !contract.deleted)
                .map(contractDetails);

            return NextResponse.json(
                { success: true, data: filteredContracts },
                { status: 200 }
            );
        } else if (contractId && type) {
            //GET CONTRACT DATA BY TYPE => "/api/contract?type=users&contractNo=12345"
            const contract = await Contract.findOne({ _id: contractId })
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('admissions')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('messages')
                .populate('activities');

            if (!contract) {
                return NextResponse.json(
                    { success: false, message: 'قرارداد پیدا نشد.' },
                    { status: 404 }
                );
            }

            var returnedData = [];

            switch (type) {
                case 'users':
                    returnedData = contract.users;
                    break;

                case 'countries':
                    returnedData = contract.countries;
                    break;

                case 'admissions':
                    returnedData = contract.admissions;
                    break;

                case 'offers':
                    returnedData = contract.offers;
                    break;

                case 'documents':
                    returnedData = contract.documents;
                    break;

                case 'payments':
                    returnedData = contract.payments;
                    break;

                case 'pickups':
                    returnedData = contract.pickups;
                    break;

                case 'visas':
                    returnedData = contract.visas;
                    break;

                case 'messages':
                    returnedData = contract.messages;
                    break;

                case 'activities':
                    returnedData = contract.activities;
                    break;

                default:
                    break;
            }

            const filteredData = returnedData.filter((item) => !item.deleted);

            return NextResponse.json(
                { success: true, data: filteredData },
                { status: 200 }
            );
        } else {
            // GET ALL CONTRACTS => "/api/contract"
            const contracts = await Contract.find()
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('admissions')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('messages')
                .populate('activities');

            const filteredContracts = contracts
                .filter((contract) => !contract.deleted)
                .map(contractDetails);

            return NextResponse.json(
                { success: true, data: filteredContracts },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//UPDATE CONTRACT => "/api/contract?contractId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findOne({ _id: contractId });

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const lastUpdatedBy = formData.get('lastUpdatedBy');
        const visaExpiryDate = formData.get('visaExpiryDate');
        const arrivalDate = formData.get('arrivalDate');
        const status = formData.get('status');

        if (visaExpiryDate !== null) {
            contract.visaExpiryDate = visaExpiryDate;
            contract.markModified('visaExpiryDate');
        }
        if (arrivalDate !== null) {
            contract.arrivalDate = arrivalDate;
            contract.markModified('arrivalDate');
        }
        if (status !== null) {
            contract.status = status;
            contract.markModified('status');
        }

        const contractFile = formData.get('contractFile');

        if (
            contractFile &&
            (contractFile.type === 'image/jpeg' ||
                contractFile.type === 'image/png' ||
                contractFile.type === 'image/webp' ||
                contractFile.type === 'application/pdf' ||
                contractFile.type === 'image/svg+xml')
        ) {
            const uniqueName = uuidv4() + path.extname(contractFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/contracts/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/contracts',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await contractFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (contract.contractFile.url) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/assets/storage/contracts/',
                    contract.contractFile.url
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            contract.contractFile.url = uniqueName;
            contract.markModified('contractFile');
        }

        contract.lastUpdatedBy = lastUpdatedBy;
        contract.markModified('lastUpdatedBy');

        contract.lastUpdatedByModel = 'User';
        contract.markModified('lastUpdatedByModel');

        await contract.save();

        const user = await User.findOne({ _id: lastUpdatedBy });

        const userName = user.firstName + ' ' + user.lastName;

        const activityRecord = {
            action: 'update',
            performedBy: lastUpdatedBy,
            performedByModel: 'User',
            details: `قرارداد توسط ${userName} به روزرسانی شد.`,
            contractId: contract._id,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        contract.history.push(newHistory._id);
        await contract.save();

        return NextResponse.json({ success: true, contract });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
