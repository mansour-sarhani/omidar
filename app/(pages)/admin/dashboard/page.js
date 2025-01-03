import UserDashboardPage from '@/templates/admin/UserDashboardPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پیشخوان مدیریت',
};

export default function UserDashboard() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserDashboardPage />
        </Suspense>
    );
}
