import ClientDashboardPage from '@/templates/client/ClientDashboardPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پیشخوان کاربری متقاضی',
};

export default function ClientDashboard() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientDashboardPage />
        </Suspense>
    );
}
