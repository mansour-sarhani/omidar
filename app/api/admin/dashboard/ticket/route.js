import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Ticket from '@/models/Ticket';

// ADMIN GET DASHBOARD DATA FOR TICKETS => "/api/admin/dashboard/ticket"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const tickets = await Ticket.find({});

        const numberOftickets = tickets.length;
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
            numberOftickets,
            waitingOnClientTickets: waitingOnClientTickets.length,
            waitingOnUserTickets: waitingOnUserTickets.length,
            closedTickets: closedTickets.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
