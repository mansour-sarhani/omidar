import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Document from '@/models/Document';
import Client from '@/models/Client';
import User from '@/models/User';
import Contract from '@/models/Contract';
import Visa from '@/models/Visa';
import Ticket from '@/models/Ticket';

// ADMIN GET DASHBOARD STATS => "/api/admin/dashboard/stats"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const clients = await Client.find({});

        const numberOfClients = clients.filter(
            (client) => !client.deleted
        ).length;
        const activeClients = clients.filter(
            (client) => !client.deleted && client.status === 'active'
        );
        const inactiveClients = clients.filter(
            (client) => !client.deleted && client.status === 'inactive'
        );
        const bannedClients = clients.filter(
            (client) => !client.deleted && client.status === 'banned'
        );

        const users = await User.find({});

        const numberOfUsers = users.filter((user) => !user.deleted).length;
        const activeUsers = users.filter(
            (user) => !user.deleted && user.status === 'active'
        );
        const inactiveUsers = users.filter(
            (user) => !user.deleted && user.status === 'inactive'
        );
        const bannedUsers = users.filter(
            (user) => !user.deleted && user.status === 'banned'
        );

        const contracts = await Contract.find({});

        const numberOfContracts = contracts.filter(
            (contract) => !contract.deleted
        ).length;
        const activecontracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'active'
        );
        const inactivecontracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'inactive'
        );
        const processingContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'processing'
        );
        const canceledContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'canceled'
        );
        const completedContracts = contracts.filter(
            (contract) => !contract.deleted && contract.status === 'done'
        );

        const documents = await Document.find({});

        const numberOfdocuments = documents.filter(
            (document) => !document.deleted
        ).length;
        const approvedDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'approved'
        );
        const rejectedDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'rejected'
        );
        const pendingDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'pending'
        );
        const underReviewDocuments = documents.filter(
            (document) => !document.deleted && document.status === 'underReview'
        );

        const visas = await Visa.find({});

        const numberOfvisas = visas.filter((visa) => !visa.deleted).length;
        const approvedVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'approved'
        );
        const rejectedVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'rejected'
        );
        const pendingVisas = visas.filter(
            (visa) => !visa.deleted && visa.status === 'pending'
        );

        const tickets = await Ticket.find({});

        const numberOftickets = tickets.filter(
            (ticket) => !ticket.deleted
        ).length;
        const waitingOnClientTickets = tickets.filter(
            (ticket) => !ticket.deleted && ticket.status === 'waitingOnClient'
        );
        const waitingOnUserTickets = tickets.filter(
            (ticket) => !ticket.deleted && ticket.status === 'waitingOnUser'
        );
        const closedTickets = tickets.filter(
            (ticket) => !ticket.deleted && ticket.status === 'closed'
        );

        const data = {
            user: {
                numberOfUsers,
                activeUsers: activeUsers.length,
                inactiveUsers: inactiveUsers.length,
                bannedUsers: bannedUsers.length,
            },
            client: {
                numberOfClients,
                activeClients: activeClients.length,
                inactiveClients: inactiveClients.length,
                bannedClients: bannedClients.length,
            },
            contract: {
                numberOfContracts,
                activecontracts: activecontracts.length,
                inactivecontracts: inactivecontracts.length,
                processingContracts: processingContracts.length,
                canceledContracts: canceledContracts.length,
                completedContracts: completedContracts.length,
            },
            document: {
                numberOfdocuments,
                approvedDocuments: approvedDocuments.length,
                rejectedDocuments: rejectedDocuments.length,
                pendingDocuments: pendingDocuments.length,
                underReviewDocuments: underReviewDocuments.length,
            },
            visa: {
                numberOfvisas,
                approvedVisas: approvedVisas.length,
                rejectedVisas: rejectedVisas.length,
                pendingVisas: pendingVisas.length,
            },
            ticket: {
                numberOftickets,
                waitingOnClientTickets: waitingOnClientTickets.length,
                waitingOnUserTickets: waitingOnUserTickets.length,
                closedTickets: closedTickets.length,
            },
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
