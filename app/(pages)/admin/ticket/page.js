import UserTicketsPage from '@/templates/admin/UserTicketsPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | تیکت های پشتیبانی',
};

export default function UserTickets() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserTicketsPage />
        </Suspense>
    );
}
