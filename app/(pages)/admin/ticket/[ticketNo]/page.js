import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const UserViewTicketPage = dynamic(
    () => import('@/templates/admin/UserViewTicketPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | جزییات تیکت',
};

export default function UserViewTicket({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserViewTicketPage ticketNo={params.ticketNo} />
        </Suspense>
    );
}
