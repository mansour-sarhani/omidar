import DocumentManagementPage from '@/templates/admin/DocumentManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | مدارک و فایل ها',
};

export default function DocumentManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <DocumentManagementPage />
        </Suspense>
    );
}
