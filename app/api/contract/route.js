import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';
import FA from '@/utils/localizationFa';
import Counter from '@/models/Counter';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Client from '@/models/Client';
import Activity from '@/models/Activity';
import Notification from '@/models/Notification';
import Country from '@/models/Country';
import Document from '@/models/Document';
import Message from '@/models/Message';
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
        const issueDate = formData.get('issueDate');
        const createdBy = formData.get('createdBy');

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

        const client = await Client.findById(clientId);
        if (!client) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'متقاضی وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const user = await User.findById(createdBy);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'کاربر وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const contractData = {
            contractNo,
            createdBy,
            lastUpdatedBy: createdBy,
            client: clientId,
            lastUpdatedByModel: 'User',
            countries: [],
            issueDate,
            status: 'processing',
        };

        contractData.countries.push(countryId);

        const contractCounter = await Counter.findByIdAndUpdate(
            { _id: 'contractId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        contractData.Id = contractCounter.seq;

        const newContract = new Contract(contractData);
        await newContract.save();

        client.contracts.push(newContract._id);
        client.markModified('contracts');
        await client.save();

        const userName = user.firstName + ' ' + user.lastName;
        const message = `قرارداد با شماره قرارداد ${newContract.contractNo} توسط ${userName} ایجاد شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [client._id],
            receiverModel: 'Client',
        });

        await addActivity({
            action: 'create',
            performedBy: user._id,
            performedByModel: 'User',
            details: message,
            contractId: newContract._id,
        });

        return NextResponse.json({
            success: true,
            data: newContract,
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
            contractNo: contract.contractNo,
            client: contract.client,
            createdBy: contract.createdBy,
            countries: contract.countries,
            users: contract.users,
            offers: contract.offers,
            documents: contract.documents,
            payments: contract.payments,
            pickups: contract.pickups,
            visas: contract.visas,
            messages: contract.messages,
            activities: contract.activities,
            issueDate: contract.issueDate,
            status: contract.status,
            createdAt: contract.createdAt,
            updatedAt: contract.updated,
        };
    }

    try {
        //GET CONTRACT BY CONTRACTID => "/api/contract?contractId=66bf44d3d02d846c4368ced0"
        if (contractId && !type) {
            const contract = await Contract.findById(contractId)
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('activities')
                .populate('messages');

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
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('activities')
                .populate('messages');

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
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('activities')
                .populate('messages');

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
            const contract = await Contract.findById(contractId)
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate({
                    path: 'activities',
                    populate: {
                        path: 'performedBy',
                    },
                })
                .populate('messages');

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
            const contracts = await Contract.find({})
                .populate('client')
                .populate('users')
                .populate('countries')
                .populate('offers')
                .populate('documents')
                .populate('payments')
                .populate('pickups')
                .populate('visas')
                .populate('activities')
                .populate('messages');

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
        const formData = await req.formData();
        const userId = formData.get('userId');
        const contractNo = formData.get('contractNo');
        const issueDate = formData.get('issueDate');
        const clientId = formData.get('clientId');
        const countryId = formData.get('countryId');
        const status = formData.get('status');

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const user = await User.findById(userId);
        const client = await Client.findById(contract.client);
        const userName = user.firstName + ' ' + user.lastName;

        if (status !== null) {
            const statusMessage = `وضعیت قرارداد با شماره ${contract.contractNo} توسط ${userName} به ${FA.status[status]} تغییر کرد.`;

            await notify({
                subject: 'اطلاعیه',
                message: statusMessage,
                type: 'info',
                senderModel: 'system',
                receiver: [client._id],
                receiverModel: 'Client',
            });

            await notify({
                subject: 'اطلاعیه',
                message: statusMessage,
                type: 'info',
                senderModel: 'system',
                receiver: contract.users,
                receiverModel: 'User',
            });

            await addActivity({
                action: 'update',
                performedBy: user._id,
                performedByModel: 'User',
                details: statusMessage,
                contractId: contractId,
            });

            contract.status = status;
            contract.markModified('status');
            await contract.save();

            return NextResponse.json({ success: true, data: contract });
        }

        if (contractNo && contractNo !== contract.contractNo) {
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

            contract.contractNo = contractNo;
            contract.markModified('contractNo');
        }
        if (issueDate !== null) {
            contract.issueDate = issueDate;
            contract.markModified('issueDate');
        }
        if (clientId !== contract.client.toString()) {
            const oldClient = await Client.findById(contract.client);
            oldClient.contracts = oldClient.contracts.filter(
                (c) => c.toString() !== contractId
            );
            oldClient.markModified('contracts');
            await oldClient.save();

            const newClient = await Client.findById(clientId);
            newClient.contracts.push(contractId);
            newClient.markModified('contracts');
            await newClient.save();

            contract.client = clientId;
            contract.markModified('client');
        }
        if (countryId !== null) {
            contract.countries[0] = countryId;
            contract.markModified('countries');
        }

        await contract.save();

        const message = `قرارداد شماره ${contract.contractNo} توسط ${userName} به روزرسانی شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users,
            receiverModel: 'User',
        });

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [contract.client],
            receiverModel: 'Client',
        });

        await addActivity({
            action: 'update',
            performedBy: user._id,
            performedByModel: 'User',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({ success: true, data: contract });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
