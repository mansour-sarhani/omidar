import VisaManagementPage from '@/templates/admin/VisaManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | ویزا ها',
};

export default function VisaManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <VisaManagementPage />
        </Suspense>
    );
}
