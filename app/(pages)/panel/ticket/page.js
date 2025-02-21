import ClientTicketsPage from '@/templates/client/ClientTicketsPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | تیکت های پشتیبانی',
};

export default function ClientTickets() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientTicketsPage />
        </Suspense>
    );
}
