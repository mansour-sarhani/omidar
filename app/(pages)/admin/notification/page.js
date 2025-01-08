import UserNotificationsPage from '@/templates/admin/UserNotificationsPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | اعلان ها',
};

export default function UserNotifications() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserNotificationsPage />
        </Suspense>
    );
}
