import ClientNewTicketPage from '@/templates/client/ClientNewTicketPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | تیکت جدید',
};

export default function ClientNewTicket() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientNewTicketPage />
        </Suspense>
    );
}
