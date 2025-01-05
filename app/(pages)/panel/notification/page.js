import ClientNotificationsPage from '@/templates/client/ClientNotificationsPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پیام ها',
};

export default function ClientNotifications() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientNotificationsPage />
        </Suspense>
    );
}
