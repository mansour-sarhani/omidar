import ClientManagementPage from '@/templates/admin/ClientManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | مدیریت متقاضیان',
};

export default function ClientManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientManagementPage />
        </Suspense>
    );
}
